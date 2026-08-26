import type { Provenance } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import './ProvenanceDot.css';

/** Structural colour convention: blue = theory claim, amber = measured, deep red = refuted. */
export const PROVENANCE_LABEL: Record<Provenance, LText> = {
  claimed: { en: 'theory claim (claimed)', zh: '理论主张（claimed）' },
  measured: { en: 'measured evidence (measured)', zh: '实测证据（measured）' },
  refuted: { en: 'refuted (refuted)', zh: '被否证（refuted）' },
};

export interface ProvenanceDotProps {
  provenance: Provenance;
  /** Extra tooltip line, e.g. the benchmark or budget this datum came from. */
  detail?: LText | string;
  size?: 'sm' | 'md';
  /** The colour meaning is already spelled out next to the dot: no tooltip, no tab stop. */
  decorative?: boolean;
  className?: string;
}

export function ProvenanceDot({
  provenance,
  detail,
  size = 'md',
  decorative = false,
  className,
}: ProvenanceDotProps) {
  const { lang } = useLang();
  const label = t(PROVENANCE_LABEL[provenance], lang);
  const tip = detail ? `${label} · ${t(detail, lang)}` : label;

  if (decorative) {
    return (
      <span
        className={className ? `pdot ${className}` : 'pdot'}
        data-provenance={provenance}
        data-size={size}
        aria-hidden="true"
      >
        <span className="pdot__core" />
      </span>
    );
  }

  return (
    <span
      className={className ? `pdot ${className}` : 'pdot'}
      data-provenance={provenance}
      data-size={size}
      role="img"
      aria-label={tip}
      tabIndex={0}
    >
      <span className="pdot__core" aria-hidden="true" />
      <span className="pdot__tip" aria-hidden="true">
        {tip}
      </span>
    </span>
  );
}
