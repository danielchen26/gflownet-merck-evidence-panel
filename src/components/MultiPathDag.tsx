import type { Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { useElementWidth, wrapText } from './hooks';
import './MultiPathDag.css';

const GAP = 24;
/** Panel title + badge band above the graph, with a single-line title. */
const HEAD_H = 66;
/** Node area; fixed so the graph geometry is language-independent. */
const GRAPH_H = 118;
/** Slack below the last annotation line. */
const FOOT_PAD = 22;
const LINE_H = 15;
const TITLE_LINE = 14;
const NODE_R = 12;
const TERMINAL_R = 15;
const WIDE_AT = 640;
/** Horizontal padding between the panel frame and its text. */
const INSET = 20;

/* Font metrics mirrored from MultiPathDag.css, needed because SVG cannot wrap. */
const TITLE_FONT = 11;
const TITLE_TRACK = 0.13;
const LINE_FONT = 10.5;
const LINE_TRACK = 0.01;

interface Pt {
  x: number;
  y: number;
}

interface Node extends Pt {
  id: string;
  r: number;
  label?: string;
  terminal?: boolean;
}

/** Trims an edge so its arrowhead stops at the node outline instead of the centre. */
function trimEdge(a: Node, b: Node) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * (a.r + 2),
    y1: a.y + uy * (a.r + 2),
    x2: b.x - ux * (b.r + 7),
    y2: b.y - uy * (b.r + 7),
  };
}

interface PanelBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface NodeSpec {
  id: string;
  nx: number;
  ny: number;
  label?: string;
  terminal?: boolean;
}

/** Normalised node layout → absolute px inside the panel's graph area. */
function place(box: PanelBox, headH: number, spec: readonly NodeSpec[]): Node[] {
  const left = box.x + INSET;
  const top = box.y + headH;
  const w = box.w - INSET * 2;
  return spec.map((node) => ({
    id: node.id,
    label: node.label,
    terminal: node.terminal,
    r: node.terminal ? TERMINAL_R : NODE_R,
    x: left + node.nx * w,
    y: top + node.ny * GRAPH_H,
  }));
}

const SINGLE_SPEC: readonly NodeSpec[] = [
  { id: 's0', nx: 0.02, ny: 0.5, label: 's₀' },
  { id: 't1', nx: 0.32, ny: 0.5 },
  { id: 't2', nx: 0.63, ny: 0.5 },
  { id: 'x', nx: 0.95, ny: 0.5, label: 'x', terminal: true },
];

const SINGLE_EDGES: ReadonlyArray<[string, string]> = [
  ['s0', 't1'],
  ['t1', 't2'],
  ['t2', 'x'],
];

const MULTI_SPEC: readonly NodeSpec[] = [
  { id: 's0', nx: 0.02, ny: 0.5, label: 's₀' },
  { id: 'a', nx: 0.34, ny: 0.06 },
  { id: 'b', nx: 0.34, ny: 0.5 },
  { id: 'c', nx: 0.34, ny: 0.94 },
  { id: 'd', nx: 0.66, ny: 0.24 },
  { id: 'e', nx: 0.66, ny: 0.76 },
  { id: 'x', nx: 0.95, ny: 0.5, label: 'x', terminal: true },
];

const MULTI_EDGES: ReadonlyArray<[string, string]> = [
  ['s0', 'a'],
  ['s0', 'b'],
  ['s0', 'c'],
  ['a', 'd'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'e'],
  ['d', 'x'],
  ['e', 'x'],
];

interface PanelSpec {
  id: string;
  spec: readonly NodeSpec[];
  edges: ReadonlyArray<[string, string]>;
  tone: 'theory' | 'empirical';
  title: LText;
  badge: string;
  lines: readonly LText[];
}

const PANELS: readonly PanelSpec[] = [
  {
    id: 'single',
    spec: SINGLE_SPEC,
    edges: SINGLE_EDGES,
    tone: 'empirical',
    title: { en: 'Single path · SMILES sequence', zh: '单路径 · SMILES 序列' },
    badge: 'PMO 14.196 · 1/25',
    lines: [
      {
        en: 'A molecule x has exactly one construction trajectory: n(x) = 1',
        zh: '一个分子 x 只有一条构造轨迹：n(x) = 1',
      },
      {
        en: 'P_B(τ|x) = 1 → the correction term is empty, TB degenerates into PCL',
        zh: 'P_B(τ|x) = 1 → 修正项为空，TB 退化成 PCL',
      },
    ],
  },
  {
    id: 'multi',
    spec: MULTI_SPEC,
    edges: MULTI_EDGES,
    tone: 'theory',
    title: { en: 'Multi-path · fragment · reaction MDP', zh: '多路径 · fragment · reaction MDP' },
    badge: 'PMO 9.131 · 16/25',
    lines: [
      {
        en: 'The same x has n(x) construction trajectories (4 drawn)',
        zh: '同一个 x 有 n(x) 条构造轨迹（图示 4 条）',
      },
      {
        en: 'Naive RL / tree-shaped value: π(x) ∝ n(x)·R(x)',
        zh: '朴素 RL / 树形 value：π(x) ∝ n(x)·R(x)',
      },
    ],
  },
];

const ARIA: LText = {
  en: 'Trajectory-count comparison: single-path SMILES versus multi-path fragment / reaction MDP',
  zh: '单路径 SMILES 与多路径 fragment/reaction MDP 的轨迹计数对比',
};

const FORMULAS: readonly { tone: 'theory' | 'naive'; term: LText; formula: string; gloss: LText }[] = [
  {
    tone: 'theory',
    term: { en: 'flow objective, global optimum', zh: 'flow 目标全局最优' },
    formula: 'p(x) ∝ R(x)',
    gloss: {
      en: '— holds on the DAG of construction actions; this is a distributional guarantee, not an optimisation guarantee, and not a sample-efficiency guarantee',
      zh: '—— 在构造动作的 DAG 上成立；这是一个分布性保证，不是优化保证，也不是样本效率保证',
    },
  },
  {
    tone: 'naive',
    term: { en: 'naive tree-shaped / autoregressive value', zh: '朴素树形 / 自回归 value' },
    formula: 'π(x) ∝ n(x)·R(x)',
    gloss: {
      en: '— n(x) = the number of action sequences that build the same molecular graph; the bias grows exponentially with trajectory length and systematically favours large molecules',
      zh: '—— n(x) = 构造同一分子图的动作序列数；偏差随轨迹长度指数增长，系统性偏好大分子',
    },
  },
];

const DEFAULT_FOOTNOTE: LText = {
  en:
    'The representation that needs the DAG correction (right: fragment / reaction MDP, multi-path) is exactly the one that scores 9.131 (16/25) in the original PMO table; ' +
    'the SMILES setting that wins (left, single path) has an empty correction term, P_B(τ|x)=1, and TB degenerates exactly into PCL — in that same PMO table REINVENT scores 14.196 (1/25). ' +
    '→ The setting where GFlowNet has a unique theoretical advantage is exactly the setting where it loses empirically.',
  zh:
    '需要 DAG 修正的那个表示（右侧 fragment / reaction MDP，多路径）正是 PMO 原表上拿 9.131（16/25）的那个；' +
    '赢的 SMILES（左侧，单路径）修正项为空、P_B(τ|x)=1、TB 恰好退化成 PCL —— 同一张 PMO 表里 REINVENT 拿 14.196（1/25）。' +
    '→ GFlowNet 有独特理论优势的设定，正是经验上输的那个设定。',
};

/** A citation plus the bilingual note that says which part of it is being cited. */
interface CitedSource {
  source: Source;
  locator?: LText | string;
}

const DEFAULT_SOURCES: readonly CitedSource[] = [
  {
    source: {
      title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation',
      venue: 'E. Bengio et al., NeurIPS 2021',
      url: 'https://arxiv.org/abs/2106.04399',
      firsthand: true,
    },
    locator: 'Prop. 1c / 2 / 3',
  },
  {
    source: {
      title: 'Discrete Probabilistic Inference as Control in Multi-path Environments',
      venue: 'Deleu, Nouri, Malkin, Precup, Y. Bengio — UAI 2024, PMLR 244:997–1021',
      url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
      firsthand: true,
    },
    locator: 'TB ≡ PCL',
  },
  {
    source: {
      title: 'Sample Efficiency Matters',
      venue: 'Gao, Fu, Sun, Coley — NeurIPS 2022',
      url: 'https://arxiv.org/pdf/2206.12411v2',
      firsthand: true,
    },
    locator: {
      en: 'original PMO table: GFlowNet 9.131 / REINVENT 14.196',
      zh: 'PMO 原表：GFlowNet 9.131 / REINVENT 14.196',
    },
  },
];

export interface MultiPathDagProps {
  footnote?: LText | string;
  sources?: Source[];
  className?: string;
}

export function MultiPathDag({ footnote, sources, className }: MultiPathDagProps) {
  const { lang } = useLang();
  const [hostRef, width] = useElementWidth<HTMLDivElement>(880);
  const wide = width >= WIDE_AT;

  const panelW = wide ? Math.floor((width - GAP) / 2) : width;
  const textMax = panelW - INSET * 2;

  // Wrap before laying out: English annotations take more lines than their
  // Chinese source, and both panels have to keep the same frame height, so the
  // head and foot bands are sized from the tallest text block of the pair.
  const blocks = PANELS.map((panel) => ({
    titleLines: wrapText(t(panel.title, lang), textMax, TITLE_FONT, 2, TITLE_TRACK),
    lineText: panel.lines.flatMap((line) =>
      wrapText(t(line, lang), textMax, LINE_FONT, 3, LINE_TRACK),
    ),
  }));
  const headH = HEAD_H + (Math.max(...blocks.map((b) => b.titleLines.length)) - 1) * TITLE_LINE;
  const footH = Math.max(...blocks.map((b) => b.lineText.length)) * LINE_H + FOOT_PAD;
  const panelH = headH + GRAPH_H + footH;

  const boxes: PanelBox[] = wide
    ? [
        { x: 0, y: 0, w: panelW, h: panelH },
        { x: panelW + GAP, y: 0, w: panelW, h: panelH },
      ]
    : [
        { x: 0, y: 0, w: panelW, h: panelH },
        { x: 0, y: panelH + GAP, w: panelW, h: panelH },
      ];
  const height = wide ? panelH : panelH * 2 + GAP;

  const panels = PANELS.map((panel, index) => {
    const box = boxes[index] ?? { x: 0, y: 0, w: panelW, h: panelH };
    const block = blocks[index];
    return {
      ...panel,
      box,
      nodes: place(box, headH, panel.spec),
      titleLines: block?.titleLines ?? [],
      lineText: block?.lineText ?? [],
    };
  });

  const cited: readonly CitedSource[] = sources
    ? sources.map((source) => ({ source }))
    : DEFAULT_SOURCES;

  return (
    <figure className={className ? `mpdag ${className}` : 'mpdag'}>
      <div className="mpdag__host" ref={hostRef}>
        <svg
          className="mpdag__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={t(ARIA, lang)}
        >
          <defs>
            <marker
              id="mpdag-arrow-theory"
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path className="mpdag__arrow mpdag__arrow--theory" d="M0,0 L6,3 L0,6 z" />
            </marker>
            <marker
              id="mpdag-arrow-empirical"
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path className="mpdag__arrow mpdag__arrow--empirical" d="M0,0 L6,3 L0,6 z" />
            </marker>
          </defs>

          {panels.map((panel) => {
            const byId: Record<string, Node> = {};
            for (const node of panel.nodes) byId[node.id] = node;
            const lastBaseline = panel.box.y + panel.box.h - 11;

            return (
              <g key={panel.id} className="mpdag__panel" data-tone={panel.tone}>
                <rect
                  className="mpdag__frame"
                  x={panel.box.x + 0.5}
                  y={panel.box.y + 0.5}
                  width={panel.box.w - 1}
                  height={panel.box.h - 1}
                  rx={3}
                />

                <text className="mpdag__panelTitle" x={panel.box.x + INSET} y={panel.box.y + 25}>
                  {panel.titleLines.map((line, index) => (
                    <tspan
                      key={`${index}-${line}`}
                      x={panel.box.x + INSET}
                      dy={index === 0 ? 0 : TITLE_LINE}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
                <text
                  className="mpdag__badge"
                  x={panel.box.x + INSET}
                  y={panel.box.y + headH - 21}
                >
                  {panel.badge}
                </text>

                {panel.edges.map(([from, to]) => {
                  const a = byId[from];
                  const b = byId[to];
                  if (!a || !b) return null;
                  const geom = trimEdge(a, b);
                  return (
                    <line
                      key={`${from}-${to}`}
                      className="mpdag__edge"
                      x1={geom.x1}
                      y1={geom.y1}
                      x2={geom.x2}
                      y2={geom.y2}
                      markerEnd={`url(#mpdag-arrow-${panel.tone})`}
                    />
                  );
                })}

                {panel.nodes.map((node) => (
                  <g key={node.id} className="mpdag__node" data-terminal={node.terminal ? 'true' : undefined}>
                    {node.terminal ? (
                      <circle className="mpdag__nodeRing" cx={node.x} cy={node.y} r={node.r + 4} />
                    ) : null}
                    <circle className="mpdag__nodeDisc" cx={node.x} cy={node.y} r={node.r} />
                    {node.label ? (
                      <text
                        className="mpdag__nodeLabel"
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    ) : null}
                  </g>
                ))}

                {panel.lineText.map((line, index) => (
                  <text
                    key={`${index}-${line}`}
                    className="mpdag__panelLine"
                    x={panel.box.x + INSET}
                    y={lastBaseline - (panel.lineText.length - 1 - index) * LINE_H}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <dl className="mpdag__formulas">
        {FORMULAS.map((row) => (
          <div className="mpdag__formulaRow" key={row.formula} data-tone={row.tone}>
            <dt>{t(row.term, lang)}</dt>
            <dd>
              {row.formula}
              <span>{t(row.gloss, lang)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figcaption className="mpdag__footnote">{t(footnote ?? DEFAULT_FOOTNOTE, lang)}</figcaption>

      <ul className="mpdag__sources">
        {cited.map(({ source, locator }) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer noopener">
              {source.title}
            </a>
            {locator ? <span className="mpdag__locator">{t(locator, lang)}</span> : null}
            <span>{source.venue}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
