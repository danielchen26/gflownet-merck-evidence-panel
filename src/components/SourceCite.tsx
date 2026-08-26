import type { Source } from '../data/types';
import './SourceCite.css';

export interface SourceCiteProps {
  source: Source;
  /** Prefix, e.g. "来源" / "数值来源". */
  prefix?: string;
  className?: string;
}

export function SourceCite({ source, prefix = '来源', className }: SourceCiteProps) {
  return (
    <p className={className ? `srccite ${className}` : 'srccite'}>
      <span className="srccite__prefix">{prefix}</span>
      <a className="srccite__link" href={source.url} target="_blank" rel="noreferrer noopener">
        {source.title}
      </a>
      <span className="srccite__venue">{source.venue}</span>
      <span className="srccite__grade" data-firsthand={source.firsthand}>
        {source.firsthand ? '一手 · 本人核对' : '转引'}
      </span>
    </p>
  );
}
