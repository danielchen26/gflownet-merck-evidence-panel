import type { CSSProperties } from 'react';
import type { Provenance, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { textWidth, useElementWidth, wrapText } from './hooks';
import { SourceCite } from './SourceCite';
import './IntegrationStack.css';

/* ══ the argument, as data ═══════════════════════════════════════════════
 * Placement, not verdict: the stack has four layers, GFlowNet is one of them,
 * and every layer carries the measured numbers that constrain it. Nothing here
 * is softened — the numbers that sink the framework-level bet (9.131 vs
 * 14.196, ≤72% templates, R² 0.66) are the same numbers, re-read as the
 * boundary of the layer they belong to.
 *
 * `accent` reuses Provenance so the CSS keeps the panel-wide colour contract:
 * claimed → --flow (theory), measured → --assay (measurement),
 * refuted → --verdict (measured to fail). */

interface Badge {
  /** Already formatted. Numbers, units and method names are never translated. */
  value: string;
  note: LText;
  provenance: Provenance;
}

interface Plug {
  /** Proper nouns stay plain strings; generic slots are bilingual. */
  label: LText | string;
  note?: LText;
}

interface LayerSpec {
  id: string;
  accent: Provenance;
  /** L3 only: the layer GFlowNet actually occupies, drawn with a --flow frame. */
  primary?: boolean;
  name: LText;
  duty: LText;
  /** Short claim pinned to the band's top edge. */
  role: LText;
  badges: readonly Badge[];
  plugs: readonly Plug[];
}

/** Top of the drawing to the bottom: the oracle is the base, because it is the
 *  constraint everything above it is optimising against. */
const LAYERS: readonly LayerSpec[] = [
  {
    id: 'L4',
    accent: 'measured',
    name: { en: 'Search operator', zh: '搜索算子' },
    duty: {
      en: 'How the sampler moves through the domain. Off-policy soundness absorbs genetic search, local search, MCMC and offline expert data without bias.',
      zh: '采样器如何在搜索域里移动。off-policy 有效性让遗传搜索、局部搜索、MCMC 与离线专家数据都能被无偏吸收。',
    },
    role: { en: 'its unique lever', zh: '它独有的杠杆' },
    badges: [
      {
        value: '16.213',
        note: {
          en: 'Genetic GFN, PMO sum over 23 oracles — the best GFlowNet number on record, and it comes from this layer',
          zh: 'Genetic GFN 在 PMO 23 个 oracle 上的总分 —— GFlowNet 已知最好的成绩，来自这一层',
        },
        provenance: 'measured',
      },
      {
        value: '15.738 / 15.626 / 15.439',
        note: {
          en: 'ablations: drop the genetic search / revert to native ε-greedy / swap GraphGA for STONED',
          zh: '消融：去掉 genetic search / 换回 GFN 原生 ε-greedy / 用 STONED 代替 GraphGA',
        },
        provenance: 'measured',
      },
    ],
    plugs: [
      { label: 'GraphGA' },
      { label: { en: 'local search', zh: '局部搜索' } },
      { label: 'MCMC' },
      { label: { en: 'offline expert data', zh: '离线专家数据' } },
    ],
  },
  {
    id: 'L3',
    accent: 'claimed',
    primary: true,
    name: { en: 'Sampler objective', zh: '采样目标函数' },
    duty: {
      en: 'The loss that decides how reward mass spreads over modes. Proven to be KL-regularised RL, so it enters as a loss, never as a platform.',
      zh: '决定 reward 质量如何铺在各个模式上的 loss。已被证明属于 KL 正则 RL 族，所以它以 loss 的形式进入，而不是换平台。',
    },
    role: { en: 'GFlowNet plugs in here', zh: 'GFlowNet 插在这里' },
    badges: [
      {
        value: '≡ MaxEnt RL',
        note: {
          en: 'up to a reward correction (Tiapkin, AISTATS 2024); TB ≡ Path Consistency Learning, Modified DB ≡ a Soft Q-Learning variant (Deleu, UAI 2024); RTB ≡ Trust-PCL (Deleu 2025)',
          zh: 'up to a reward correction（Tiapkin, AISTATS 2024）；TB ≡ Path Consistency Learning、Modified DB ≡ Soft Q-Learning 变体（Deleu, UAI 2024）；RTB ≡ Trust-PCL（Deleu 2025）',
        },
        provenance: 'claimed',
      },
      {
        value: '9.131 vs 14.196',
        note: {
          en: 'the boundary of this layer: vanilla GFlowNet against REINVENT at a fixed oracle budget. A pretrained prior plus KL-to-prior is mandatory, not optional.',
          zh: '这一层的边界：固定 oracle 预算下 vanilla GFN 对 REINVENT。预训练 prior 加 KL-to-prior 是必需项，不是可选项。',
        },
        provenance: 'refuted',
      },
    ],
    plugs: [
      { label: 'GFlowNet (TB / RTB)' },
      { label: 'REINVENT' },
      { label: 'Augmented Memory' },
      { label: { en: 'KL-regularised RL', zh: 'KL 正则 RL' } },
    ],
  },
  {
    id: 'L2',
    accent: 'measured',
    name: { en: 'Action space / search domain', zh: '动作空间 / 搜索域' },
    duty: {
      en: 'Fixes which molecules are reachable at all, and does so independently of the objective: the same GFlowNet, given a different MDP, moves synthesisability by 62 points.',
      zh: '决定哪些分子根本可达，而且与目标函数无关：同一个 GFlowNet 换一个 MDP，可合成性就差 62 个点。',
    },
    role: { en: "GFlowNet's durable contribution", zh: 'GFlowNet 的真正馈赠' },
    badges: [
      {
        value: '0% → 62%',
        note: {
          en: 'same GFlowNet, new MDP: success rate under independent AiZynthFinder',
          zh: '同一个 GFlowNet 换 MDP：独立 AiZynthFinder 成功率',
        },
        provenance: 'measured',
      },
      {
        value: '≤72%',
        note: {
          en: "reaction templates under external check — RxnFlow 60.25–71.25 / SynFlowNet 52.75–57 / RGFN 46.75–50.25, while S3-GFN's SMILES soft constraint reaches 96.67–100%",
          zh: 'reaction template 在外部检验下 ≤72% —— RxnFlow 60.25–71.25 / SynFlowNet 52.75–57 / RGFN 46.75–50.25，而 S3-GFN 的 SMILES 软约束达 96.67–100%',
        },
        provenance: 'measured',
      },
    ],
    plugs: [
      {
        label: 'SYNTHIA',
        note: {
          en: 'Merck KGaA: >115,000 rules, >12 million purchasable starting materials',
          zh: 'Merck KGaA：>115,000 条规则、>1,200 万可购起始物',
        },
      },
      { label: 'Enamine REAL' },
      { label: { en: 'reaction templates', zh: 'reaction template 库' } },
    ],
  },
  {
    id: 'L1',
    accent: 'refuted',
    name: { en: 'Oracle', zh: 'Oracle（打分预言机）' },
    duty: {
      en: 'Defines what "good" means. Every layer above it only optimises whatever this layer says, so this layer\'s error is the ceiling on the whole stack.',
      zh: '定义什么算“好”。上面每一层都只是在优化这一层说的话，所以这一层的误差就是整个栈的上限。',
    },
    role: { en: 'the binding constraint', zh: '绑定约束' },
    badges: [
      {
        value: 'R² 0.66 / 0.76',
        note: {
          en: "Merck's own predictor / docking correlation — these are the scores the search is actually maximising",
          zh: 'Merck 自己的 predictor / docking 相关性 —— 搜索真正在最大化的就是这些分数',
        },
        provenance: 'measured',
      },
      {
        value: '4 / 111 · 3.6%',
        note: {
          en: 'compounds synthesised and assayed → µM hits. This rate is set by the oracle, not by the sampler.',
          zh: '111 个化合物合成测活 → 4 个 μM hit。决定这个比率的是 oracle，不是采样器。',
        },
        provenance: 'measured',
      },
    ],
    plugs: [
      {
        label: 'Boltz-2',
        note: {
          en: 'near-FEP accuracy, >1000× faster, code and weights MIT',
          zh: '近 FEP 精度、>1000× 更快、代码与权重 MIT',
        },
      },
      {
        label: 'BoltzMol-1',
        note: {
          en: '6/10 targets hit at 28–96 compounds per target',
          zh: '在 28–96 化合物/靶点下命中 6/10 靶点',
        },
      },
      { label: { en: 'in-house ADMET', zh: '内部 ADMET' } },
      { label: 'FEP' },
    ],
  },
];

const TITLE: LText = {
  en: 'Where GFlowNet sits in the stack',
  zh: 'GFlowNet 在栈里的位置',
};

const CAPTION: LText = {
  en: 'Four layers, read from the base up. Each layer names what can be plugged into it and the measured numbers that bound it. GFlowNet is one layer — L3 — and it arrives as a loss term.',
  zh: '四层，自下而上读。每层写清能插进来的东西，以及约束它的实测数字。GFlowNet 是其中一层 —— L3 —— 而且以 loss 项的形式到来。',
};

const PLUG_HEAD: LText = { en: 'what plugs in here', zh: '这一层能插什么' };

const FLOOR_NOTE: LText = {
  en: 'The oracle is drawn as the floor because every layer above it runs inside a fixed oracle budget: it cannot be out-searched, only replaced.',
  zh: 'Oracle 画成地基，是因为上面每一层都在固定 oracle 预算内运行：它没法被搜索绕过，只能被替换。',
};

const SR_TITLE: LText = {
  en: 'Integration stack, text version',
  zh: '集成栈（文字版）',
};

const CONSEQUENCE_TITLE: LText = {
  en: 'Integration consequence',
  zh: '集成推论',
};

const CONSEQUENCE_BODY: readonly LText[] = [
  {
    en: 'Because a GFlowNet is a KL-regularised RL objective up to a reward correction, the properties Merck actually wants are reachable without a platform migration. Two things are needed: (a) a multi-path reward correction, and (b) one KL-regularised term. Both are loss-level changes.',
    zh: '既然 GFlowNet 就是差一个 reward correction 的 KL 正则 RL 目标，那么 Merck 真正想要的性质不需要平台迁移就能拿到。需要的只有两样：(a) 多路径 reward correction，(b) 一个 KL 正则项。两者都是 loss 级改动。',
  },
  {
    en: 'A loss-level change drops into the RL loop that REINVENT4 and AIDDISON already run. It does not re-qualify a commercial product, and it does not ask anyone to adopt a framework.',
    zh: 'loss 级改动可以直接进 REINVENT4 与 AIDDISON 已经在跑的 RL 循环，不触发商业产品的重新资格认证，也不要求任何人采用一个新框架。',
  },
];

/** Prefixes are the reduction each paper proves; method names stay verbatim. */
const CONSEQUENCE_CITES: readonly { prefix: string; source: Source }[] = [
  {
    prefix: 'GFlowNets ≡ MaxEnt RL',
    source: {
      title: 'Generative Flow Networks as Entropy-Regularized RL',
      venue: 'Tiapkin, Morozov, Naumov, Vetrov — AISTATS 2024 (Oral)',
      url: 'https://arxiv.org/abs/2310.12934',
      firsthand: false,
    },
  },
  {
    prefix: 'TB ≡ PCL · Modified DB ≡ Soft Q-Learning',
    source: {
      title: 'Discrete Probabilistic Inference as Control in Multi-path Environments',
      venue: 'Deleu, Nouri, Malkin, Precup, Y. Bengio — UAI 2024, PMLR 244:997–1021',
      url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
      firsthand: true,
    },
  },
  {
    prefix: 'RTB ≡ Trust-PCL',
    source: {
      title: 'Relative Trajectory Balance ≡ Trust-PCL (off-policy KL 正则 RL)',
      venue: 'Deleu, Nouri, Y. Bengio, Precup, 2025-09',
      url: 'https://arxiv.org/abs/2509.01632',
      firsthand: true,
    },
  },
];

/* ══ geometry ════════════════════════════════════════════════════════════
 * Hand-rolled SVG with a 1:1 px viewBox: no scaling, so 11px Chinese stays
 * 11px instead of being squeezed by a fitted viewBox. Every text run is
 * wrapped in JS against `textWidth`, which over-reports latin advance, so a
 * wrapped line can never be wider than the budget it was wrapped to.
 * Below WIDE_AT the same data renders as stacked cards, where the browser
 * wraps and overflow is structurally impossible. */

/** Below this the two text columns are too narrow to read side by side: the
 *  English notes would wrap to six lines and the diagram would be taller than
 *  it is wide, so the cards win instead. */
const WIDE_AT = 720;
const TOP_PAD = 12;
const INSET = 16;
const ACCENT_W = 3;
/** Layer-number gutter, wide enough for "L4" at NUM_FONT. */
const NUM_W = 40;
const COL_GAP = 18;
/** > PILL_H so a band's role pill never paints over the band above it. */
const BAND_GAP = 24;
/** Band top to first text row: leaves the role pill room to straddle the edge. */
const BAND_PAD_TOP = 30;
const BAND_PAD_BOTTOM = 18;
const FLOOR_H = 12;

/* Font metrics mirrored from IntegrationStack.css. Line advances are whole px
 * so every baseline lands on a device pixel at the 1:1 viewBox. The `slack`
 * arguments are `textWidth`'s tracking knob doing double duty: Archivo and the
 * tracked mono labels advance wider than the shared 0.64em latin charge, and
 * the slack buys that difference back. */
const NUM_FONT = 17;
const NAME_FONT = 15;
const NAME_LINE = 19;
const NAME_SLACK = 0.08;
const DUTY_FONT = 12.5;
const DUTY_LINE = 18;
const DUTY_SLACK = 0.02;
const PILL_FONT = 10.5;
const PILL_SLACK = 0.12;
const PILL_H = 20;
const PILL_PAD = 11;
const VALUE_FONT = 13.5;
const VALUE_SLACK = 0.04;
const CHIP_H = 21;
const CHIP_PAD = 9;
const BNOTE_FONT = 11;
const BNOTE_LINE = 15;
const BNOTE_SLACK = 0.02;
const BADGE_GAP = 11;
const PLUG_HEAD_FONT = 10;
const PLUG_HEAD_SLACK = 0.2;
const PLUG_FONT = 11;
const PLUG_LINE = 15;
const PLUG_SLACK = 0.02;
const PLUG_ITEM_GAP = 7;
/** Baseline offset inside a text row of the given font size. */
const BASELINE = 0.82;

interface BadgeBox {
  badge: Badge;
  chipY: number;
  chipW: number;
  valueBaseline: number;
  noteX: number;
  noteBaseline: number;
  noteLines: string[];
}

interface PlugBox {
  key: string;
  lines: string[];
  baseline: number;
}

interface Band {
  layer: LayerSpec;
  index: number;
  y: number;
  h: number;
  numBaseline: number;
  pillText: string;
  pillW: number;
  nameLines: string[];
  nameBaseline: number;
  dutyLines: string[];
  dutyBaseline: number;
  badges: BadgeBox[];
  plugHeadBaseline: number;
  plugs: PlugBox[];
}

export function IntegrationStack({ className }: { className?: string }) {
  const { lang } = useLang();
  const [hostRef, width] = useElementWidth<HTMLDivElement>(880);
  const wide = width >= WIDE_AT;

  const plugW = Math.min(248, Math.max(168, Math.round(width * 0.27)));
  const plugX = width - INSET - plugW;
  const plugTextX = plugX + 10;
  const plugMax = plugW - 10;
  const coreX = INSET + ACCENT_W + NUM_W;
  const coreMax = Math.max(200, plugX - COL_GAP - coreX);
  // Shared by all four bands: the heading is the same string in every band, so
  // it is wrapped once against the same budget as the items below it.
  const plugHeadLines = wrapText(t(PLUG_HEAD, lang), plugMax, PLUG_HEAD_FONT, 3, PLUG_HEAD_SLACK);

  const bands: Band[] = [];
  let cursor = TOP_PAD;

  for (const [index, layer] of LAYERS.entries()) {
    const contentTop = cursor + BAND_PAD_TOP;

    const pillText = t(layer.role, lang);
    // `wrapText` truncates at maxLines, and truncation here would delete
    // evidence, so every cap sits above the worst line count measured across
    // 660–1520px in both languages: they exist as a bound, never as a limit.
    const nameLines = wrapText(t(layer.name, lang), coreMax, NAME_FONT, 3, NAME_SLACK);
    const dutyLines = wrapText(t(layer.duty, lang), coreMax, DUTY_FONT, 8, DUTY_SLACK);

    let core = contentTop;
    const nameBaseline = core + Math.round(NAME_FONT * BASELINE);
    core += nameLines.length * NAME_LINE + 5;
    const dutyBaseline = core + Math.round(DUTY_FONT * BASELINE);
    core += dutyLines.length * DUTY_LINE + BADGE_GAP;

    const badges: BadgeBox[] = [];
    for (const badge of layer.badges) {
      const chipW = Math.round(textWidth(badge.value, VALUE_FONT, VALUE_SLACK)) + CHIP_PAD * 2;
      // Sit the note beside the chip only when the leftover column is still
      // wide enough to read; otherwise drop it to a full-width row underneath.
      const beside = coreMax - chipW - 12 >= 200;
      const noteMax = beside ? coreMax - chipW - 12 : coreMax;
      const noteLines = wrapText(t(badge.note, lang), noteMax, BNOTE_FONT, 10, BNOTE_SLACK);
      const noteTop = beside ? core + 1 : core + CHIP_H + 5;
      badges.push({
        badge,
        chipY: core,
        chipW,
        valueBaseline: core + Math.round(CHIP_H / 2 + VALUE_FONT * 0.36),
        noteX: beside ? coreX + chipW + 12 : coreX,
        noteBaseline: noteTop + Math.round(BNOTE_FONT * BASELINE),
        noteLines,
      });
      core =
        (beside
          ? Math.max(core + CHIP_H, noteTop + noteLines.length * BNOTE_LINE)
          : noteTop + noteLines.length * BNOTE_LINE) + BADGE_GAP;
    }

    let plugY = contentTop;
    const plugHeadBaseline = plugY + Math.round(PLUG_HEAD_FONT * BASELINE);
    plugY += plugHeadLines.length * PLUG_LINE + 6;

    const plugs: PlugBox[] = [];
    for (const plug of layer.plugs) {
      const label = t(plug.label, lang);
      const text = plug.note ? `${label} · ${t(plug.note, lang)}` : label;
      const lines = wrapText(text, plugMax, PLUG_FONT, 8, PLUG_SLACK);
      plugs.push({
        key: label,
        lines,
        baseline: plugY + Math.round(PLUG_FONT * BASELINE),
      });
      plugY += lines.length * PLUG_LINE + PLUG_ITEM_GAP;
    }

    const h = Math.max(core - BADGE_GAP, plugY - PLUG_ITEM_GAP) - cursor + BAND_PAD_BOTTOM;

    bands.push({
      layer,
      index,
      y: cursor,
      h,
      numBaseline: contentTop + Math.round(NUM_FONT * BASELINE),
      pillText,
      pillW: Math.round(textWidth(pillText, PILL_FONT, PILL_SLACK)) + PILL_PAD * 2,
      nameLines,
      nameBaseline,
      dutyLines,
      dutyBaseline,
      badges,
      plugHeadBaseline,
      plugs,
    });

    cursor += h + BAND_GAP;
  }

  const height = cursor - BAND_GAP + FLOOR_H;
  const floorY = height - FLOOR_H + 4;

  return (
    <figure className={className ? `istack ${className}` : 'istack'}>
      <h3 className="istack__title">{t(TITLE, lang)}</h3>
      <p className="istack__caption">{t(CAPTION, lang)}</p>

      <div className="istack__host" ref={hostRef}>
        {wide ? (
          <svg
            className="istack__svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={t(TITLE, lang)}
          >
            {bands.map((band) => (
              <g
                key={band.layer.id}
                className="istack__band"
                data-accent={band.layer.accent}
                data-primary={band.layer.primary ? 'true' : undefined}
                style={{ '--i': band.index } as CSSProperties}
              >
                <rect
                  className="istack__plate"
                  x={INSET}
                  y={band.y}
                  width={Math.max(0, width - INSET * 2)}
                  height={band.h}
                  rx={2}
                />
                <rect
                  className="istack__edge"
                  x={INSET}
                  y={band.y}
                  width={ACCENT_W}
                  height={band.h}
                />

                <text className="istack__num" x={INSET + ACCENT_W + 11} y={band.numBaseline}>
                  {band.layer.id}
                </text>

                <rect
                  className="istack__pillBox"
                  x={coreX}
                  y={band.y - PILL_H / 2}
                  width={band.pillW}
                  height={PILL_H}
                  rx={PILL_H / 2}
                />
                <text
                  className="istack__pill"
                  x={coreX + PILL_PAD}
                  y={band.y + Math.round(PILL_FONT * 0.36)}
                >
                  {band.pillText}
                </text>

                <text className="istack__name" x={coreX} y={band.nameBaseline}>
                  {band.nameLines.map((line, i) => (
                    <tspan key={`${i}-${line}`} x={coreX} dy={i === 0 ? 0 : NAME_LINE}>
                      {line}
                    </tspan>
                  ))}
                </text>

                <text className="istack__duty" x={coreX} y={band.dutyBaseline}>
                  {band.dutyLines.map((line, i) => (
                    <tspan key={`${i}-${line}`} x={coreX} dy={i === 0 ? 0 : DUTY_LINE}>
                      {line}
                    </tspan>
                  ))}
                </text>

                {band.badges.map((box) => (
                  <g
                    key={box.badge.value}
                    className="istack__badge"
                    data-provenance={box.badge.provenance}
                  >
                    <rect
                      className="istack__chip"
                      x={coreX}
                      y={box.chipY}
                      width={box.chipW}
                      height={CHIP_H}
                      rx={2}
                    />
                    <text
                      className="istack__value"
                      x={coreX + CHIP_PAD}
                      y={box.valueBaseline}
                    >
                      {box.badge.value}
                    </text>
                    <text className="istack__bnote" x={box.noteX} y={box.noteBaseline}>
                      {box.noteLines.map((line, i) => (
                        <tspan key={`${i}-${line}`} x={box.noteX} dy={i === 0 ? 0 : BNOTE_LINE}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                ))}

                <line
                  className="istack__split"
                  x1={plugX - COL_GAP / 2}
                  y1={band.y + 10}
                  x2={plugX - COL_GAP / 2}
                  y2={band.y + band.h - 10}
                />

                <text className="istack__plugHead" x={plugTextX} y={band.plugHeadBaseline}>
                  {plugHeadLines.map((line, i) => (
                    <tspan key={`${i}-${line}`} x={plugTextX} dy={i === 0 ? 0 : PLUG_LINE}>
                      {line}
                    </tspan>
                  ))}
                </text>

                {band.plugs.map((plug) => (
                  <text
                    key={plug.key}
                    className="istack__plug"
                    x={plugTextX}
                    y={plug.baseline}
                  >
                    {plug.lines.map((line, i) => (
                      <tspan key={`${i}-${line}`} x={plugTextX} dy={i === 0 ? 0 : PLUG_LINE}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                ))}
              </g>
            ))}

            <line
              className="istack__floor"
              x1={INSET}
              y1={floorY}
              x2={Math.max(INSET, width - INSET)}
              y2={floorY}
            />
          </svg>
        ) : (
          <ol className="istack__cards">
            {LAYERS.map((layer) => (
              <li
                className="istack__card"
                key={layer.id}
                data-accent={layer.accent}
                data-primary={layer.primary ? 'true' : undefined}
              >
                <p className="istack__cardHead">
                  <span className="istack__cardNum">{layer.id}</span>
                  <span className="istack__cardRole">{t(layer.role, lang)}</span>
                </p>
                <h4 className="istack__cardName">{t(layer.name, lang)}</h4>
                <p className="istack__cardDuty">{t(layer.duty, lang)}</p>
                <ul className="istack__cardBadges">
                  {layer.badges.map((badge) => (
                    <li key={badge.value} data-provenance={badge.provenance}>
                      <span className="istack__cardValue">{badge.value}</span>
                      <span className="istack__cardBnote">{t(badge.note, lang)}</span>
                    </li>
                  ))}
                </ul>
                <p className="istack__cardPlugHead">{t(PLUG_HEAD, lang)}</p>
                <ul className="istack__cardPlugs">
                  {layer.plugs.map((plug) => {
                    const label = t(plug.label, lang);
                    return (
                      <li key={label}>
                        {plug.note ? `${label} · ${t(plug.note, lang)}` : label}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="istack__floorNote">{t(FLOOR_NOTE, lang)}</p>

      {wide ? (
        <ol className="istack__sr" aria-label={t(SR_TITLE, lang)}>
          {LAYERS.map((layer) => {
            const badges = layer.badges
              .map((badge) => `${badge.value} — ${t(badge.note, lang)}`)
              .join(lang === 'zh' ? '；' : '; ');
            const plugs = layer.plugs
              .map((plug) => {
                const label = t(plug.label, lang);
                return plug.note ? `${label} · ${t(plug.note, lang)}` : label;
              })
              .join(lang === 'zh' ? '、' : ', ');
            return (
              <li key={layer.id}>
                {lang === 'zh'
                  ? `${layer.id} ${t(layer.name, lang)}（${t(layer.role, lang)}）：${t(layer.duty, lang)} 实测：${badges}。${t(PLUG_HEAD, lang)}：${plugs}。`
                  : `${layer.id} ${t(layer.name, lang)} (${t(layer.role, lang)}): ${t(layer.duty, lang)} Measured: ${badges}. ${t(PLUG_HEAD, lang)}: ${plugs}.`}
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="istack__consequence">
        <h4 className="istack__consequenceTitle">{t(CONSEQUENCE_TITLE, lang)}</h4>
        {CONSEQUENCE_BODY.map((para) => (
          <p className="istack__consequenceBody" key={para.en}>
            {t(para, lang)}
          </p>
        ))}
        {CONSEQUENCE_CITES.map((cite) => (
          <SourceCite
            className="istack__cite"
            key={cite.source.url}
            prefix={cite.prefix}
            source={cite.source}
          />
        ))}
      </div>
    </figure>
  );
}
