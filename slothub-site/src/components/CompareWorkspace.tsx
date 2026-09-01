import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameCatalogItem as Game } from '../lib/game-catalog';
import { featureLabels, volatilityLabels, winMechanismLabels } from '../lib/taxonomy';
import {
  COMPARE_MISSING, COMPARE_NORMALIZED_MISSING, COMPARE_ORIGINAL_MISSING,
  bonusBuyLabel, compareGridLabel, compareWinCountLabel, formatCompareDate,
} from '../lib/compare-presentation.mjs';
import {
  COMPARE_STORAGE_KEY, compareStateUrl, normalizeCompareSlugs, readCompareQuery,
  readStoredCompare, writeCanonicalHistory,
} from '../lib/core-flow-state.mjs';

const CORE_FEATURES = [
  'free-spins', 'wild', 'scatter', 'multiplier', 'hold-and-spin', 'cascading',
  'respins', 'cash-collection', 'jackpot',
];

function initialSelection(valid: string[]) {
  const query = readCompareQuery(location.search, valid);
  return query.hasGames ? query.slugs : readStoredCompare(localStorage.getItem(COMPARE_STORAGE_KEY), valid);
}

function mechanismLabel(game: Game) {
  if (!game.winMechanism) return COMPARE_MISSING;
  return winMechanismLabels[game.winMechanism] ?? game.winMechanism;
}

function coreFeatures(game: Game) {
  const present = new Set(game.features ?? []);
  return CORE_FEATURES.filter((feature) => present.has(feature)).slice(0, 6);
}

function CompareArtwork({ game }: { game: Game }) {
  if (game.image) {
    return <div className="compare-image"><img src={game.image.src} alt={game.image.alt} /></div>;
  }
  return <div className="compare-image compare-image-placeholder" role="img" aria-label={`${game.name} 尚無圖片`}>SH</div>;
}

function CompareIdentity({ game }: { game: Game }) {
  return <div className="compare-identity">
    <a href={game.url}>{game.name}</a>
    {game.displayNameZhHant && <small>{game.originalName}</small>}
    {(game.seriesNameZhHant || game.installment) && <span className="compare-series">
      {game.seriesNameZhHant && <span>{game.seriesNameZhHant}</span>}
      {game.installment && <span className="compare-installment">第 {game.installment} 代</span>}
    </span>}
  </div>;
}

function RtpValue({ game }: { game: Game }) {
  const variants = game.rtpVariants ?? [];
  return <div className="compare-value-stack">
    {game.rtp !== undefined
      ? <><small className="compare-primary-label">主要顯示值</small><span>{game.rtp}%</span></>
      : <span>{COMPARE_MISSING}</span>}
    {variants.length > 0 && <details className="compare-details">
      <summary>查看 {variants.length} 個已核實版本</summary>
      <ul>{variants.map((value) => <li key={value}>{value}%</li>)}</ul>
    </details>}
  </div>;
}

function VolatilityValue({ game, normalized = false }: { game: Game; normalized?: boolean }) {
  if (!normalized) return game.volatilityOriginal ?? COMPARE_ORIGINAL_MISSING;
  if (game.volatilityNormalized) return volatilityLabels[game.volatilityNormalized] ?? game.volatilityNormalized;
  return game.volatilityOriginal ? COMPARE_NORMALIZED_MISSING : COMPARE_MISSING;
}

function MaxWinValue({ game, original = false }: { game: Game; original?: boolean }) {
  if (original) {
    if (game.maxWinLabelOriginal) return game.maxWinLabelOriginal;
    return game.maxWinMultiplier !== undefined
      ? <span className="compare-caution">未取得原廠標籤；比較時需保留基準限制</span>
      : COMPARE_MISSING;
  }
  return game.maxWinMultiplier !== undefined
    ? `${game.maxWinMultiplier.toLocaleString('en-US')}×`
    : COMPARE_MISSING;
}

function StructureValue({ game }: { game: Game }) {
  const count = compareWinCountLabel(game.winMechanism, game.winCount);
  return <div className="compare-value-stack">
    <span>{count}</span>
    {game.paylines && <small>原文：{game.paylines}</small>}
  </div>;
}

function FeatureValue({ game }: { game: Game }) {
  const features = coreFeatures(game);
  return features.length
    ? <ul className="compare-feature-tags">{features.map((feature) => <li key={feature}>{featureLabels[feature] ?? feature}</li>)}</ul>
    : COMPARE_MISSING;
}

type CompareRow = {
  key: string;
  label: string;
  help?: string;
  render: (game: Game) => ReactNode;
};

type CompareSection = {
  key: string;
  title: string;
  rows: CompareRow[];
};

const sections: CompareSection[] = [
  {
    key: 'identity',
    title: '遊戲身份',
    rows: [
      { key: 'provider', label: 'Provider', render: (game) => game.providerName || COMPARE_MISSING },
      { key: 'series', label: 'Series', render: (game) => game.seriesNameZhHant ?? '未建立正式系列資料' },
      { key: 'release', label: 'Release date', render: (game) => formatCompareDate(game.releaseDate) },
    ],
  },
  {
    key: 'core-data',
    title: '核心數據',
    rows: [
      { key: 'rtp', label: 'RTP', help: '長期理論比例，不代表單次或短期結果。', render: (game) => <RtpValue game={game} /> },
      { key: 'volatility-original', label: '原廠波動度', help: '保留原廠文字或尺度，不直接跨 Provider 排名。', render: (game) => <VolatilityValue game={game} /> },
      { key: 'volatility-normalized', label: 'Slot Hub 統一波動度', help: '編輯統一顯示，不是產業共同精確尺度。', render: (game) => <VolatilityValue game={game} normalized /> },
      { key: 'max-win', label: '統一 Max Win', help: '最高上限不代表常見結果或出現頻率。', render: (game) => <MaxWinValue game={game} /> },
      { key: 'max-win-original', label: 'Max Win 原廠標籤／基準', help: '原始標籤與投注基準不同時，不可視為完全同質。', render: (game) => <MaxWinValue game={game} original /> },
    ],
  },
  {
    key: 'structure',
    title: '玩法結構',
    rows: [
      { key: 'mechanism', label: '主要賠付機制', help: '類別描述得獎方式，不代表數字高低或優劣。', render: mechanismLabel },
      { key: 'win-count', label: '賠線／Ways', help: '條、路與動態上限的語意不同，不能只比較數字。', render: (game) => <StructureValue game={game} /> },
      { key: 'grid', label: '盤面', help: '固定盤面才格式化；動態或描述型資料保留原文。', render: (game) => compareGridLabel(game.reels, game.rows) },
    ],
  },
  {
    key: 'trust',
    title: '功能與資料可信度',
    rows: [
      { key: 'bonus-buy', label: 'Bonus Buy', help: '缺值只代表尚未核實，不等於不支援。', render: (game) => bonusBuyLabel(game.bonusBuy) },
      { key: 'features', label: '核心 Features', help: '功能清單只協助辨識，不以數量判定遊戲優劣。', render: (game) => <FeatureValue game={game} /> },
      { key: 'sources', label: '完整資料與來源', render: (game) => <a className="compare-source-link" href={game.url}>查看完整資料與來源</a> },
      { key: 'verified', label: '這款資料最後核對日期', help: '代表整筆資料的核對時間，不等於每個欄位在該日由原廠重新發布。', render: (game) => formatCompareDate(game.lastVerifiedAt) },
    ],
  },
];

export default function CompareWorkspace({ games }: { games: Game[] }) {
  const valid = useMemo(() => games.map((game) => game.slug), [games]);
  const [selected, setSelected] = useState<string[]>(() => initialSelection(valid));
  const syncStorage = (next: string[]) => {
    const clean = normalizeCompareSlugs(next, valid);
    setSelected(clean);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(clean));
    return clean;
  };
  const commit = (next: string[], mode: 'push' | 'replace') => {
    const clean = syncStorage(next);
    writeCanonicalHistory(window, compareStateUrl(clean), mode);
    dispatchEvent(new Event('slothub:compare'));
  };
  useEffect(() => {
    commit(selected, 'replace');
    const restore = () => {
      const query = readCompareQuery(location.search, valid);
      const clean = syncStorage(query.hasGames ? query.slugs : []);
      writeCanonicalHistory(window, compareStateUrl(clean), 'replace');
      dispatchEvent(new Event('slothub:compare'));
    };
    addEventListener('popstate', restore);
    return () => removeEventListener('popstate', restore);
  }, [valid.join('|')]);
  const picked = selected.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean) as Game[];

  return <div className="compare-workspace">
    <aside className="compare-reading-note" aria-label="比較資料閱讀提醒">
      <strong>先看資料定義，再看數字差異</strong>
      <p>RTP、波動度與 Max Win 回答不同問題；本表不計算贏家、勝率或推薦排名。</p>
    </aside>
    <div className="compare-picker"><label htmlFor="compare-select">加入比較（最多三款）</label><select id="compare-select" value="" onChange={(event) => event.target.value && commit([...selected, event.target.value], 'push')} disabled={selected.length >= 3}><option value="">選擇遊戲</option>{games.filter((game) => !selected.includes(game.slug)).map((game) => <option key={game.slug} value={game.slug}>{game.name}{game.displayNameZhHant ? ` / ${game.originalName}` : ''} — {game.providerName}</option>)}</select></div>
    {picked.length ? <>
      <div className="compare-scroll" tabIndex={0} aria-label="遊戲比較表，可上下及左右捲動" onScroll={(event) => {
        const head = event.currentTarget.querySelector('thead');
        const threshold = head ? head.offsetTop + head.offsetHeight : Number.POSITIVE_INFINITY;
        event.currentTarget.classList.toggle('is-scrolled', event.currentTarget.scrollTop >= threshold);
      }}>
        <div className="compare-sticky-bar" data-cols={picked.length} aria-hidden="true">
          <div className="compare-sticky-label">比較欄位</div>
          {picked.map((game) => <div className="compare-sticky-head" key={`sticky-${game.slug}`}><span>{game.name}</span></div>)}
        </div>
        <table className="compare-table" data-cols={picked.length}>
          <caption>最多三款遊戲的資料判讀比較</caption>
          <colgroup><col className="compare-field-column" />{picked.map((game) => <col className="compare-game-column" key={`col-${game.slug}`} />)}</colgroup>
          <thead><tr>
            <th className="compare-corner" scope="col">比較欄位</th>
            {picked.map((game) => <th className="compare-head" scope="col" key={game.slug}>
              <CompareArtwork game={game} />
              <CompareIdentity game={game} />
              <button aria-label={`從比較中移除 ${game.name}`} onClick={() => commit(selected.filter((slug) => slug !== game.slug), 'push')}>移除</button>
            </th>)}
          </tr></thead>
          {sections.map((section) => <tbody aria-labelledby={`compare-section-${section.key}`} key={section.key}>
            <tr className="compare-section-row"><th id={`compare-section-${section.key}`} colSpan={picked.length + 1} scope="rowgroup">{section.title}</th></tr>
            {section.rows.map((row) => <tr key={row.key}>
              <th className="compare-label" scope="row"><span>{row.label}</span>{row.help && <small>{row.help}</small>}</th>
              {picked.map((game) => <td className="compare-value" key={`${row.key}-${game.slug}`}>{row.render(game)}</td>)}
            </tr>)}
          </tbody>)}
        </table>
      </div>
      <button className="text-button compare-clear" onClick={() => commit([], 'push')}>清除全部</button>
    </> : <div className="empty-result"><strong>先選擇兩至三款遊戲</strong><p>比較表只呈現資料庫中已有的欄位，不會為了填滿表格補造資料。</p></div>}
  </div>;
}
