import type { Provenance } from '../data/types';
import './ProvenanceDot.css';

/** Structural colour convention: 蓝 = 理论主张, 琥珀 = 实测证据, 深红 = 被否证. */
export const PROVENANCE_LABEL: Record<Provenance, string> = {
  claimed: '理论主张（claimed）',
  measured: '实测证据（measured）',
  refuted: '被否证（refuted）',
};

export interface ProvenanceDotProps {
  provenance: Provenance;
  /** Extra tooltip line, e.g. the benchmark or budget this datum came from. */
  detail?: string;
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
  const label = PROVENANCE_LABEL[provenance];
  const tip = detail ? `${label} · ${detail}` : label;

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
