import type { CSSProperties } from 'react';
import type { FunnelStage, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { useElementWidth, wrapText } from './hooks';
import { SourceCite } from './SourceCite';
import './AttritionFunnel.css';

const MIN_BAR = 22;
const BAR_H = 14;
const ZERO_SIDE = 16;
const WIDE_AT = 560;
const LABEL_FONT = 13;
const LABEL_LINE = 16;
/** `letter-spacing` of .funnel__label / .funnel__note, in em. */
const LABEL_TRACK = 0.005;
const NOTE_FONT = 10.5;
const NOTE_LINE = 14;
const NOTE_TRACK = 0.01;

/** Fallback name for the whole chart when the caller passes no title. */
const DEFAULT_ARIA: LText = { en: 'attrition funnel', zh: '衰减漏斗' };

/** The sr-only mirror is the only accessible path into the hand-rolled SVG. */
const SR_TITLE: LText = { en: 'Funnel stages, text version', zh: '漏斗各阶段（文字版）' };

/** Spelled out because the zero stage is drawn as a dashed box, not as text. */
const ZERO: LText = { en: 'zero', zh: '零' };

export interface AttritionFunnelProps {
  stages: FunnelStage[];
  title?: LText | string;
  caption?: LText | string;
  source?: Source;
  className?: string;
}

interface Row {
  stage: FunnelStage;
  index: number;
  label: string;
  display: string;
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
  const { lang } = useLang();
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
    const label = t(stage.label, lang);
    // English runs wider than its Chinese source, so the wrap budget buys a
    // fourth line rather than truncation.
    const labelLines = wrapText(label, labelMax, LABEL_FONT, 4, LABEL_TRACK);
    const noteLines = stage.note
      ? wrapText(t(stage.note, lang), noteMax, NOTE_FONT, 3, NOTE_TRACK)
      : [];
    const labelH = labelLines.length * LABEL_LINE;
    const noteH = noteLines.length * NOTE_LINE;
    const scaled = stage.value > 0 && span > 0 ? (Math.log10(stage.value) - lo) / span : 1;

    const top = cursor;
    const contentTop = top + 10;
    const barY = wide ? contentTop : contentTop + labelH + 4;
    const bodyH = wide
      ? Math.max(labelH, BAR_H + (noteH > 0 ? noteH + 4 : 0))
      : labelH + 4 + BAR_H + (noteH > 0 ? noteH + 4 : 0);
    const height = 10 + bodyH + 12;

    rows.push({
      stage,
      display: t(stage.display, lang),
      index,
      label,
      top,
      height,
      barY,
      barLen:
        stage.value > 0
          ? Math.round(MIN_BAR + Math.min(1, Math.max(0, scaled)) * (barMax - MIN_BAR))
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
      {title ? <h3 className="funnel__title">{t(title, lang)}</h3> : null}
      {caption ? <p className="funnel__caption">{t(caption, lang)}</p> : null}

      <div className="funnel__host" ref={hostRef}>
        <svg
          className="funnel__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={t(title ?? DEFAULT_ARIA, lang)}
        >
          {rows.map((row) => {
            const zero = row.stage.value === 0;
            return (
              <g
                key={row.label}
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
                    <tspan
                      key={`${lineIndex}-${line}`}
                      x={row.labelX}
                      dy={lineIndex === 0 ? 0 : LABEL_LINE}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>

                <text className="funnel__value" x={width} y={row.valueBaseline} textAnchor="end">
                  {row.display}
                </text>

                {row.noteLines.length > 0 ? (
                  <text className="funnel__note" x={barX} y={row.noteBaseline}>
                    {row.noteLines.map((line, lineIndex) => (
                      <tspan key={`${lineIndex}-${line}`} x={barX} dy={lineIndex === 0 ? 0 : NOTE_LINE}>
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

      <ul className="funnel__sr" aria-label={t(SR_TITLE, lang)}>
        {rows.map((row) => {
          const note = row.stage.note ? t(row.stage.note, lang) : '';
          const zero = row.stage.value === 0 ? t(ZERO, lang) : '';
          return (
            <li key={row.label}>
              {lang === 'zh'
                ? `${row.label}：${row.display}${zero ? `（${zero}）` : ''}${note ? `（${note}）` : ''}`
                : `${row.label}: ${row.display}${zero ? ` (${zero})` : ''}${note ? ` (${note})` : ''}`}
            </li>
          );
        })}
      </ul>

      {source ? <SourceCite source={source} /> : null}
    </figure>
  );
}
