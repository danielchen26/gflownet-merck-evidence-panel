import { useId } from 'react';
import type { EvidenceTable as EvidenceTableData } from '../data/types';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './EvidenceTable.css';

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
  const captionId = useId();
  const forced = numericColumns ? new Set(numericColumns) : null;

  return (
    <figure className={className ? `etable ${className}` : 'etable'}>
      <figcaption className="etable__head" id={captionId}>
        <span className="etable__caption">{table.caption}</span>
        {table.budgetNote ? <span className="etable__budget">{table.budgetNote}</span> : null}
      </figcaption>

      <div className="etable__scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
        <table className="etable__table">
          <thead>
            <tr>
              <th scope="col" className="etable__th etable__th--method">
                {table.columns[0]}
              </th>
              {table.columns.slice(1).map((column, index) => (
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
            {table.rows.map((row) => (
              <tr
                key={row.method}
                className="etable__row"
                data-emphasis={row.emphasis ? 'true' : undefined}
                data-provenance={row.provenance}
              >
                <th scope="row" className="etable__method">
                  <span className="etable__methodInner">
                    {row.provenance ? (
                      <ProvenanceDot provenance={row.provenance} size="sm" />
                    ) : null}
                    <span>{row.method}</span>
                  </span>
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    // 同一行内列位置稳定，列序即身份
                    key={`${table.columns[index + 1] ?? index}`}
                    className="etable__td"
                    data-numeric={forced ? forced.has(index + 1) : isNumericCell(cell)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SourceCite source={table.source} />
    </figure>
  );
}
