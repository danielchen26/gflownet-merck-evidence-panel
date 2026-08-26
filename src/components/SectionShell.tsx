import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Section } from '../data/types';
import { t, useLang } from '../i18n/i18n';
import { usePrefersReducedMotion } from './hooks';
import './SectionShell.css';

export interface SectionShellProps {
  section: Section;
  /** Tables, data cards, or scenes belonging to this section. */
  children?: ReactNode;
  /** Override the "current section" state; omit to let the shell decide. */
  active?: boolean;
  onActivate?: (id: string) => void;
  className?: string;
}

export function SectionShell({ section, children, active, onActivate, className }: SectionShellProps) {
  const { lang } = useLang();
  const hostRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [selfCurrent, setSelfCurrent] = useState(false);
  const isCurrent = active ?? selfCurrent;

  // One-shot scroll reveal.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setRevealed(true);
          observer.disconnect();
          return;
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  // Current-section tracking: the budget marker turns --assay while this
  // section owns the middle band of the viewport.
  useEffect(() => {
    if (active !== undefined) return;
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setSelfCurrent(entry.isIntersecting);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (isCurrent) onActivate?.(section.id);
  }, [isCurrent, onActivate, section.id]);

  return (
    <section
      ref={hostRef}
      id={section.id}
      data-section-id={section.id}
      className={className ? `shell ${className}` : 'shell'}
      data-revealed={revealed ? 'true' : 'false'}
      data-current={isCurrent ? 'true' : undefined}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="shell__marker">
        <span className="shell__markerValue">{t(section.budgetMarker, lang)}</span>
        <span className="shell__markerRule" aria-hidden="true" />
      </div>

      <div className="shell__body">
        <p className="shell__kicker">{t(section.kicker, lang)}</p>
        <h2 className="shell__title" id={`${section.id}-title`}>
          {t(section.title, lang)}
        </h2>
        <p className="shell__standfirst">{t(section.standfirst, lang)}</p>

        <div className="shell__prose">
          {section.body.map((paragraph) => {
            const text = t(paragraph, lang);
            return <p key={text}>{text}</p>;
          })}
        </div>

        {children ? <div className="shell__slots">{children}</div> : null}
      </div>
    </section>
  );
}
