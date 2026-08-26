import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { Provenance, Section } from '../data/types';
import type { Lang, LText } from '../i18n/i18n';
import { t, UI, useLang } from '../i18n/i18n';
import { ProvenanceDot, PROVENANCE_LABEL } from './ProvenanceDot';
import { usePrefersReducedMotion } from './hooks';
import './Rail.css';

const LEGEND: readonly Provenance[] = ['claimed', 'measured', 'refuted'];

/** Each language is named in its own script, so these labels are not translated. */
const LANG_LABEL: Record<Lang, string> = { en: 'EN', zh: '中文' };
const LANGS: readonly Lang[] = ['en', 'zh'];

const NAV: LText = {
  en: 'Evidence ledger · section navigation',
  zh: '证据账 · 章节导航',
};

export interface RailProps {
  sections: Section[];
  className?: string;
}

export function Rail({ sections, className }: RailProps) {
  const { lang, setLang } = useLang();
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  // Section list is read through a ref so a fresh array literal from the parent
  // never tears down the observer; the id signature is the real dependency.
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const idSignature = sections.map((section) => section.id).join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements: HTMLElement[] = [];
    for (const section of sectionsRef.current) {
      const el = document.getElementById(section.id);
      if (el) elements.push(el);
    }
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sectionsRef.current.find((section) => visible.has(section.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [idSignature]);

  const onJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setActiveId(id);
  };

  return (
    <nav className={className ? `rail ${className}` : 'rail'} aria-label={t(NAV, lang)}>
      {/* First in the DOM so it is the top item on desktop and the leftmost,
          scroll-pinned item in the <960px top bar. */}
      <div className="rail__lang" role="group" aria-label={t(UI.langLabel, lang)}>
        {LANGS.map((code) => (
          <button
            key={code}
            type="button"
            className="rail__langBtn"
            lang={code === 'zh' ? 'zh-CN' : 'en'}
            data-active={lang === code ? 'true' : undefined}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {LANG_LABEL[code]}
          </button>
        ))}
      </div>

      <div className="rail__legend">
        <p className="rail__legendTitle">{t(UI.legendTitle, lang)}</p>
        <ul className="rail__legendList">
          {LEGEND.map((provenance) => (
            <li key={provenance} className="rail__legendItem" data-provenance={provenance}>
              <ProvenanceDot provenance={provenance} size="sm" decorative />
              <span>{t(PROVENANCE_LABEL[provenance], lang)}</span>
            </li>
          ))}
        </ul>
      </div>

      <ol className="rail__list">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="rail__item">
              <a
                className="rail__link"
                href={`#${section.id}`}
                data-active={active ? 'true' : undefined}
                aria-current={active ? 'true' : undefined}
                onClick={(event) => onJump(event, section.id)}
              >
                <span className="rail__marker">{t(section.budgetMarker, lang)}</span>
                <span className="rail__title">{t(section.title, lang)}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
