export type Provenance = 'measured' | 'claimed' | 'refuted';

export interface Source { title: string; venue: string; url: string; firsthand: boolean }

export interface Datum {
  id: string;
  label: string;        // 这个数字是什么
  value: string;        // 已格式化，如 "9.131"
  unit?: string;        // 如 "AUC-top10 sum"
  context: string;      // 基准 / 任务 / 预算
  provenance: Provenance;
  source: Source;
  note?: string;
}

export interface TableRow { method: string; cells: string[]; provenance?: Provenance; emphasis?: boolean }

export interface EvidenceTable {
  id: string;
  caption: string;
  budgetNote?: string;  // 如 "23 oracle · 10k 调用 · 5 seed"
  columns: string[];
  rows: TableRow[];
  source: Source;
}

export interface FunnelStage { label: string; value: number; display: string; note?: string; provenance: Provenance }

export interface Section {
  id: string;
  budgetMarker: string; // 结构标记用 oracle 预算而非 01/02/03，例如 "10⁴ calls" / "10³ calls" / "0 synthesized" / "R²=0.66"
  kicker: string;
  title: string;
  standfirst: string;   // 一句话论点
  body: string[];       // 段落
  tableIds?: string[];
  datumIds?: string[];
}
