import type { Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, UI, useLang } from '../i18n/i18n';
import './SourceCite.css';

/** Provenance grade of the citation itself, not of the datum. */
const GRADE: Record<'firsthand' | 'secondhand', LText> = {
  firsthand: { en: 'firsthand · verified myself', zh: '一手 · 本人核对' },
  secondhand: { en: 'secondhand', zh: '转引' },
};

export interface SourceCiteProps {
  source: Source;
  /** Prefix, e.g. UI.source ("Source") or a narrower label. */
  prefix?: LText | string;
  className?: string;
}

export function SourceCite({ source, prefix = UI.source, className }: SourceCiteProps) {
  const { lang } = useLang();

  return (
    <p className={className ? `srccite ${className}` : 'srccite'}>
      <span className="srccite__prefix">{t(prefix, lang)}</span>
      <a className="srccite__link" href={source.url} target="_blank" rel="noreferrer noopener">
        {source.title}
      </a>
      <span className="srccite__venue">{source.venue}</span>
      <span className="srccite__grade" data-firsthand={source.firsthand}>
        {t(GRADE[source.firsthand ? 'firsthand' : 'secondhand'], lang)}
      </span>
    </p>
  );
}
