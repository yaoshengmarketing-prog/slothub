import { useMemo, useState } from 'react';
import type { GameCatalogItem } from '../lib/game-catalog';
import {
  buildGuidedExplorerResult,
  GUIDED_EXPLORER_FEATURES,
  GUIDED_EXPLORER_MECHANISMS,
} from '../lib/guided-explorer-pilot.mjs';
import { featureLabels, winMechanismLabels } from '../lib/taxonomy';
import { gamesIndexUrl } from '../lib/urls';

type Props = { games: GameCatalogItem[] };

export default function GuidedExplorerPilot({ games }: Props) {
  const [mechanism, setMechanism] = useState('');
  const [feature, setFeature] = useState('');
  const result = useMemo(
    () => buildGuidedExplorerResult(games, mechanism, feature),
    [games, mechanism, feature],
  );
  const explorerUrl = result.explorerState ? gamesIndexUrl(result.explorerState) : undefined;
  const canOpen = result.complete && Boolean(result.count) && explorerUrl;

  return <div className="guided-explorer-pilot" data-guided-explorer-pilot>
    <div className="guided-explorer-choices">
      <fieldset>
        <legend><b>1</b><span>選擇主要玩法<small>必選一項</small></span></legend>
        <div className="guided-choice-grid">
          {GUIDED_EXPLORER_MECHANISMS.map((value) => <label key={value}>
            <input type="radio" name="guided-mechanism" value={value} checked={mechanism === value} onChange={() => setMechanism(value)} />
            <span>{winMechanismLabels[value]}</span>
          </label>)}
        </div>
      </fieldset>

      <fieldset>
        <legend><b>2</b><span>加入一項功能<small>選填，最多一項</small></span></legend>
        <div className="guided-choice-grid guided-feature-choices">
          <label>
            <input type="radio" name="guided-feature" value="" checked={!feature} onChange={() => setFeature('')} />
            <span>不限功能</span>
          </label>
          {GUIDED_EXPLORER_FEATURES.map((value) => <label key={value}>
            <input type="radio" name="guided-feature" value={value} checked={feature === value} onChange={() => setFeature(value)} />
            <span>{featureLabels[value]}</span>
          </label>)}
        </div>
      </fieldset>
    </div>

    <aside className={`guided-explorer-receipt${result.complete ? '' : ' is-incomplete'}${result.count === 0 ? ' is-empty' : ''}`} aria-live="polite" aria-atomic="true">
      <p className="guided-receipt-label">EXPLORER 條件</p>
      {!result.complete ? <div className="guided-receipt-prompt">
        <strong>先選一種主要玩法</strong>
        <p>選擇後，這裡會顯示實際結果數與即將開啟的遊戲庫條件。</p>
      </div> : <>
        <dl>
          <div><dt>主要玩法</dt><dd>{winMechanismLabels[mechanism]}</dd></div>
          <div><dt>遊戲功能</dt><dd>{feature ? featureLabels[feature] : '不限功能'}</dd></div>
        </dl>
        <div className="guided-result-count"><strong>{result.count}</strong><span>款符合條件</span></div>
        <code>{explorerUrl}</code>
        {canOpen ? <a className="button primary guided-explorer-cta" href={explorerUrl}>在遊戲庫查看 {result.count} 款</a> : <p className="guided-zero-result">這組條件目前沒有已收錄結果，請更改一項條件。</p>}
      </>}
    </aside>
  </div>;
}
