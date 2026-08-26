import type { CSSProperties } from 'react';
import type { FunnelStage, Source } from '../data/types';
import { useElementWidth } from './hooks';
import { SourceCite } from './SourceCite';
import './AttritionFunnel.css';

const MIN_BAR = 22;
const BAR_H = 14;
const ZERO_SIDE = 16;
const WIDE_AT = 560;
const LABEL_FONT = 13;
const LABEL_LINE = 16;
const NOTE_FONT = 10.5;
const NOTE_LINE = 14;

const FULL_WIDTH = /[\u2e80-\u9fff\uff01-\uff60\u3000-\u303f]/;

/**
 * Advance-width estimate for SVG <text>, which cannot wrap on its own.
 * Full-width CJK glyphs advance ~1em; latin/mono glyphs are estimated high
 * (0.64em) so a wrapped line never spills past the viewBox on a wider font.
 */
function textWidth(text: string, fontPx: number): number {
  let width = 0;
  for (const ch of text) width += FULL_WIDTH.test(ch) ? fontPx : fontPx * 0.64;
  return width;
}

/** Greedy per-character wrap (CJK prose has no spaces to break on). */
function wrapText(text: string, maxPx: number, fontPx: number, maxLines: number): string[] {
  if (maxPx <= fontPx) return [text];
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    const next = line + ch;
    if (line !== '' && textWidth(next, fontPx) > maxPx) {
      lines.push(line);
      if (lines.length === maxLines) return lines;
      line = ch;
      continue;
    }
    line = next;
  }
  if (line !== '') lines.push(line);
  return lines.length > 0 ? lines : [text];
}

export interface AttritionFunnelProps {
  stages: FunnelStage[];
  title?: string;
  caption?: string;
  source?: Source;
  className?: string;
}

interface Row {
  stage: FunnelStage;
  index: number;
  barY: number;
  barLen: number;
  labelLines: string[];
  labelX: number;
  labelBaseline: number;
  noteLines: string[];
  noteBaseline: number;
  valueBaseline: number;
  top: number;
  height: number;
}

export function AttritionFunnel({ stages, title, caption, source, className }: AttritionFunnelProps) {
  const [hostRef, width] = useElementWidth<HTMLDivElement>(760);
  const wide = width >= WIDE_AT;

  const labelW = wide ? Math.min(280, Math.max(150, Math.round(width * 0.32))) : 0;
  const valueW = wide ? 112 : 88;
  const barX = wide ? labelW + 16 : 0;
  const barMax = Math.max(MIN_BAR + 8, width - barX - valueW);
  const labelMax = wide ? labelW - 18 : Math.max(120, width - valueW - 16);
  const noteMax = Math.max(140, width - barX - 14);

  // Log10 width mapping: the funnel spans 60,134 → 4, so linear widths would
  // collapse every late stage into a single pixel. The 0.35 dex of headroom
  // keeps the smallest positive stage visibly shorter than its predecessor.
  const positive = stages.filter((stage) => stage.value > 0).map((stage) => stage.value);
  const hi = Math.log10(positive.length > 0 ? Math.max(...positive) : 1);
  const lo = Math.log10(positive.length > 0 ? Math.min(...positive) : 1) - 0.35;
  const span = hi - lo;

  const rows: Row[] = [];
  let cursor = 0;
  stages.forEach((stage, index) => {
    const labelLines = wrapText(stage.label, labelMax, LABEL_FONT, 3);
    const noteLines = stage.note ? wrapText(stage.note, noteMax, NOTE_FONT, 3) : [];
    const labelH = labelLines.length * LABEL_LINE;
    const noteH = noteLines.length * NOTE_LINE;
    const t = stage.value > 0 && span > 0 ? (Math.log10(stage.value) - lo) / span : 1;

    const top = cursor;
    const contentTop = top + 10;
    const barY = wide ? contentTop : contentTop + labelH + 4;
    const bodyH = wide
      ? Math.max(labelH, BAR_H + (noteH > 0 ? noteH + 4 : 0))
      : labelH + 4 + BAR_H + (noteH > 0 ? noteH + 4 : 0);
    const height = 10 + bodyH + 12;

    rows.push({
      stage,
      index,
      top,
      height,
      barY,
      barLen:
        stage.value > 0
          ? Math.round(MIN_BAR + Math.min(1, Math.max(0, t)) * (barMax - MIN_BAR))
          : 0,
      labelLines,
      labelX: wide ? labelW : 0,
      labelBaseline: wide ? contentTop + 11 : contentTop + 12,
      noteLines,
      noteBaseline: barY + BAR_H + 15,
      valueBaseline: barY + 12,
    });
    cursor += height;
  });

  const height = cursor + 4;

  return (
    <figure className={className ? `funnel ${className}` : 'funnel'}>
      {title ? <h3 className="funnel__title">{title}</h3> : null}
      {caption ? <p className="funnel__caption">{caption}</p> : null}

      <div className="funnel__host" ref={hostRef}>
        <svg
          className="funnel__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title ?? '衰减漏斗'}
        >
          {rows.map((row) => {
            const zero = row.stage.value === 0;
            return (
              <g
                key={row.stage.label}
                className="funnel__row"
                data-provenance={row.stage.provenance}
                data-zero={zero ? 'true' : undefined}
                style={{ '--i': row.index } as CSSProperties}
              >
                {zero ? (
                  <rect
                    className="funnel__band"
                    x={0}
                    y={row.top + 2}
                    width={width}
                    height={row.height - 6}
                    rx={2}
                  />
                ) : null}

                <rect
                  className="funnel__spine"
                  x={barX}
                  y={row.top + 2}
                  width={1}
                  height={row.height - 6}
                />

                {zero ? (
                  <>
                    <rect
                      className="funnel__zero"
                      x={barX + 1}
                      y={row.barY - 1}
                      width={ZERO_SIDE}
                      height={ZERO_SIDE}
                      rx={1}
                    />
                    <line
                      className="funnel__zeroSlash"
                      x1={barX + 2}
                      y1={row.barY + ZERO_SIDE - 2}
                      x2={barX + ZERO_SIDE}
                      y2={row.barY}
                    />
                    <line
                      className="funnel__zeroLead"
                      x1={barX + ZERO_SIDE + 8}
                      y1={row.barY + ZERO_SIDE / 2 - 1}
                      x2={barX + barMax}
                      y2={row.barY + ZERO_SIDE / 2 - 1}
                    />
                  </>
                ) : (
                  <rect
                    className="funnel__bar"
                    x={barX}
                    y={row.barY}
                    width={row.barLen}
                    height={BAR_H}
                    rx={1}
                  />
                )}

                <text
                  className="funnel__label"
                  x={row.labelX}
                  y={row.labelBaseline}
                  textAnchor={wide ? 'end' : 'start'}
                >
                  {row.labelLines.map((line, lineIndex) => (
                    <tspan key={line} x={row.labelX} dy={lineIndex === 0 ? 0 : LABEL_LINE}>
                      {line}
                    </tspan>
                  ))}
                </text>

                <text className="funnel__value" x={width} y={row.valueBaseline} textAnchor="end">
                  {row.stage.display}
                </text>

                {row.noteLines.length > 0 ? (
                  <text className="funnel__note" x={barX} y={row.noteBaseline}>
                    {row.noteLines.map((line, lineIndex) => (
                      <tspan key={line} x={barX} dy={lineIndex === 0 ? 0 : NOTE_LINE}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <ul className="funnel__sr">
        {stages.map((stage) => (
          <li key={stage.label}>
            {stage.label}：{stage.display}
            {stage.note ? `（${stage.note}）` : ''}
          </li>
        ))}
      </ul>

      {source ? <SourceCite source={source} /> : null}
    </figure>
  );
}
