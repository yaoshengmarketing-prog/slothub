export type SearchItem = {
  slug: string;
  title: string;
  secondaryTitle?: string;
  description: string;
  kind: '遊戲' | '廠商' | '教學';
  url: string;
  aliases?: string[];
  providerName?: string;
  seriesName?: string;
  installment?: number;
  searchText?: string[];
};
export function normalizeSearch(value: unknown): string;
export function rankSearch<T extends SearchItem>(items: T[], rawQuery: string, limit?: number): T[];
