import type { EvidenceTable as EvidenceTableData } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './EvidenceTable.css';

/** Told to a screen reader on top of the caption: the region scrolls sideways. */
const SCROLL_HINT: LText = { en: 'scrollable table', zh: '可横向滚动的表格' };

/**
 * A cell is treated as numeric (mono + tabular-nums) when it carries digits and
 * is not prose: no CJK, no long latin words. Keeps "9.131", "16/25", "−11.11",
 * "0.326 / 0.280", "3.6%" aligned while leaving "SMILES RL" alone.
 */
function isNumericCell(text: string): boolean {
  const value = text.trim();
  if (!value || !/\d/.test(value)) return false;
  if (/[\u3000-\u9fff\uff00-\uffef]/.test(value)) return false;
  return !/[A-Za-z]{4,}/.test(value);
}

export interface EvidenceTableProps {
  table: EvidenceTableData;
  /** Force these column indices to render as numeric; overrides the heuristic. */
  numericColumns?: readonly number[];
  className?: string;
}

export function EvidenceTable({ table, numericColumns, className }: EvidenceTableProps) {
  const { lang } = useLang();
  const forced = numericColumns ? new Set(numericColumns) : null;
  const caption = t(table.caption, lang);
  const columns = table.columns.map((column) => t(column, lang));

  return (
    <figure className={className ? `etable ${className}` : 'etable'}>
      <figcaption className="etable__head">
        <span className="etable__caption">{caption}</span>
        {table.budgetNote ? (
          <span className="etable__budget">{t(table.budgetNote, lang)}</span>
        ) : null}
      </figcaption>

      <div
        className="etable__scroll"
        role="region"
        aria-label={`${caption} — ${t(SCROLL_HINT, lang)}`}
        tabIndex={0}
      >
        <table className="etable__table">
          <thead>
            <tr>
              <th scope="col" className="etable__th etable__th--method">
                {columns[0]}
              </th>
              {columns.slice(1).map((column, index) => (
                <th
                  scope="col"
                  key={column}
                  className="etable__th"
                  data-numeric={forced ? forced.has(index + 1) : undefined}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const method = t(row.method, lang);
              return (
                <tr
                  key={method}
                  className="etable__row"
                  data-emphasis={row.emphasis ? 'true' : undefined}
                  data-provenance={row.provenance}
                >
                  <th scope="row" className="etable__method">
                    <span className="etable__methodInner">
                      {row.provenance ? (
                        <ProvenanceDot provenance={row.provenance} size="sm" />
                      ) : null}
                      <span>{method}</span>
                    </span>
                  </th>
                  {row.cells.map((cell, index) => {
                    const text = t(cell, lang);
                    return (
                      <td
                        // Column position is stable within a row, so column order is identity.
                        key={`${columns[index + 1] ?? index}`}
                        className="etable__td"
                        data-numeric={forced ? forced.has(index + 1) : isNumericCell(text)}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SourceCite source={table.source} />
    </figure>
  );
}
