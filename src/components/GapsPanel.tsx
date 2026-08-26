import './GapsPanel.css';

export interface GapsPanelProps {
  openGaps: string[];
  title?: string;
  standfirst?: string;
  className?: string;
}

export function GapsPanel({ openGaps, title, standfirst, className }: GapsPanelProps) {
  if (openGaps.length === 0) return null;

  return (
    <aside className={className ? `gaps ${className}` : 'gaps'} aria-labelledby="gaps-title">
      <header className="gaps__head">
        <span className="gaps__stamp">开放缺口 · 勿引用为证据</span>
        <h3 className="gaps__title" id="gaps-title">
          {title ?? '未验证 / 空白（勿引用为证据）'}
        </h3>
        {standfirst ? <p className="gaps__standfirst">{standfirst}</p> : null}
      </header>

      <ol className="gaps__list">
        {openGaps.map((gap, index) => (
          <li className="gaps__item" key={gap}>
            <span className="gaps__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="gaps__text">{gap}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
