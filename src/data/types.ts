import type { LText } from '../i18n/i18n';

export type Provenance = 'measured' | 'claimed' | 'refuted';

/** 一手来源。title / venue / url 是原文标识，永不翻译。 */
export interface Source { title: string; venue: string; url: string; firsthand: boolean }

export interface Datum {
  id: string;
  label: LText;            // 这个数字是什么
  value: LText | string;    // 已格式化。纯数字（"9.131"）留 string；散文式取值（"等价"）成对
  unit?: LText;            // 如 "AUC-top10 sum"
  context: LText;          // 基准 / 任务 / 预算
  provenance: Provenance;
  source: Source;
  note?: LText;
}

/** `cells` 里纯数字 / 纯拉丁的格子留 string，带散文或中文标点的格子成对。 */
export interface TableRow { method: LText; cells: (LText | string)[]; provenance?: Provenance; emphasis?: boolean }

export interface EvidenceTable {
  id: string;
  caption: LText;
  budgetNote?: LText;      // 如 "23 oracle · 10k 调用 · 5 seed"
  columns: LText[];
  rows: TableRow[];
  source: Source;
}

export interface FunnelStage { label: LText; value: number; display: string; note?: LText; provenance: Provenance }

export interface Section {
  id: string;
  /** 结构标记，用 oracle 预算 / 关键量而非 01/02/03。"10⁴ calls" / "#Circles" / "R²=0.66"
   *  两语言相同，留 string；只有 "结论" / "下一步" 成对。 */
  budgetMarker: LText | string;
  kicker: LText;
  title: LText;
  standfirst: LText;       // 一句话论点
  body: LText[];           // 段落
  tableIds?: string[];
  datumIds?: string[];
}
