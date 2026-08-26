import { useEffect, useRef, useState } from 'react';

/**
 * Measures an element's content-box width in CSS px so hand-rolled SVG can use a
 * 1:1 viewBox (text keeps its intended px size instead of being scaled down on
 * narrow screens).
 */
export function useElementWidth<T extends HTMLElement>(fallback = 720) {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const next = Math.round(el.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };
    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Live `prefers-reduced-motion: reduce` state for JS-driven motion decisions. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/* ── SVG text metrics ──────────────────────────────────────────────────
 * SVG <text> cannot wrap, so both hand-rolled charts wrap in JS against an
 * advance-width estimate. Shared here because the English strings are ~1.5×
 * wider than their Chinese source and both charts have to stay inside the
 * same viewBox in either language. */

/** Glyphs that advance a full em: CJK, fullwidth forms, CJK punctuation. */
const FULL_WIDTH = /[\u2e80-\u9fff\uff01-\uff60\u3000-\u303f]/;

/**
 * Upper bound on the advance width of an SVG <text> run, in px.
 * Full-width glyphs advance exactly 1em. Latin is charged 0.64em: JetBrains
 * Mono advances 0.6em and Source Serif 4 averages ~0.5em, so 0.64em absorbs
 * both. `trackEm` adds the element's `letter-spacing` back in, which matters
 * for the uppercase mono labels tracked out to 0.13em. The estimate never
 * under-reports, and that is what keeps a wrapped line inside the viewBox.
 */
export function textWidth(text: string, fontPx: number, trackEm = 0): number {
  let width = 0;
  for (const ch of text) {
    width += (FULL_WIDTH.test(ch) ? fontPx : fontPx * 0.64) + fontPx * trackEm;
  }
  return width;
}

/**
 * Splits text into atomic break units: one segment per full-width glyph (CJK
 * prose has no spaces to break on), one per latin word, one per space.
 */
function breakUnits(text: string): string[] {
  const units: string[] = [];
  let word = '';
  for (const ch of text) {
    if (ch === ' ' || FULL_WIDTH.test(ch)) {
      if (word !== '') {
        units.push(word);
        word = '';
      }
      units.push(ch);
      continue;
    }
    word += ch;
  }
  if (word !== '') units.push(word);
  return units;
}

/** Greedy wrap to `maxPx`, breaking latin on spaces and CJK per glyph. */
export function wrapText(
  text: string,
  maxPx: number,
  fontPx: number,
  maxLines: number,
  trackEm = 0,
): string[] {
  if (maxPx <= fontPx) return [text];
  const lines: string[] = [];
  let line = '';
  for (const unit of breakUnits(text)) {
    if (line === '' && unit === ' ') continue;
    const next = line + unit;
    if (line !== '' && textWidth(next, fontPx, trackEm) > maxPx) {
      lines.push(line);
      if (lines.length === maxLines) return lines;
      line = unit === ' ' ? '' : unit;
      continue;
    }
    line = next;
  }
  if (line !== '') lines.push(line);
  return lines.length > 0 ? lines : [text];
}
