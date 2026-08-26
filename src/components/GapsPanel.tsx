import type { LText } from '../i18n/i18n';
import { t, UI, useLang } from '../i18n/i18n';
import './GapsPanel.css';

/** Fallback headline when the caller does not supply one. */
const DEFAULT_TITLE: LText = {
  en: 'Unverified / blank (do not cite as evidence)',
  zh: '未验证 / 空白（勿引用为证据）',
};

export interface GapsPanelProps {
  openGaps: readonly (LText | string)[];
  title?: LText | string;
  standfirst?: LText | string;
  className?: string;
}

export function GapsPanel({ openGaps, title, standfirst, className }: GapsPanelProps) {
  const { lang } = useLang();
  if (openGaps.length === 0) return null;

  return (
    <aside className={className ? `gaps ${className}` : 'gaps'} aria-labelledby="gaps-title">
      <header className="gaps__head">
        <span className="gaps__stamp">{t(UI.gapsStamp, lang)}</span>
        <h3 className="gaps__title" id="gaps-title">
          {t(title ?? DEFAULT_TITLE, lang)}
        </h3>
        {standfirst ? <p className="gaps__standfirst">{t(standfirst, lang)}</p> : null}
      </header>

      <ol className="gaps__list">
        {openGaps.map((gap, index) => {
          const text = t(gap, lang);
          return (
            <li className="gaps__item" key={text}>
              <span className="gaps__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="gaps__text">{text}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
