import type { Source } from '../data/types';
import { useElementWidth } from './hooks';
import './MultiPathDag.css';

const GAP = 24;
const PANEL_H = 236;
const NODE_R = 12;
const TERMINAL_R = 15;
const WIDE_AT = 640;

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
function place(box: PanelBox, spec: readonly NodeSpec[]): Node[] {
  const left = box.x + 20;
  const top = box.y + 66;
  const w = box.w - 40;
  const h = box.h - 66 - 52;
  return spec.map((node) => ({
    id: node.id,
    label: node.label,
    terminal: node.terminal,
    r: node.terminal ? TERMINAL_R : NODE_R,
    x: left + node.nx * w,
    y: top + node.ny * h,
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

const DEFAULT_FOOTNOTE =
  '需要 DAG 修正的那个表示（右侧 fragment / reaction MDP，多路径）正是 PMO 原表上拿 9.131（16/25）的那个；' +
  '赢的 SMILES（左侧，单路径）修正项为空、P_B(τ|x)=1、TB 恰好退化成 PCL —— 同一张 PMO 表里 REINVENT 拿 14.196（1/25）。' +
  '→ GFlowNet 有独特理论优势的设定，正是经验上输的那个设定。';

const DEFAULT_SOURCES: Source[] = [
  {
    title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation（Prop. 1c / 2 / 3）',
    venue: 'E. Bengio et al., NeurIPS 2021',
    url: 'https://arxiv.org/abs/2106.04399',
    firsthand: true,
  },
  {
    title: 'Discrete Probabilistic Inference as Control in Multi-path Environments（TB ≡ PCL）',
    venue: 'Deleu, Nouri, Malkin, Precup, Y. Bengio — UAI 2024, PMLR 244:997–1021',
    url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
    firsthand: true,
  },
  {
    title: 'Sample Efficiency Matters（PMO 原表：GFlowNet 9.131 / REINVENT 14.196）',
    venue: 'Gao, Fu, Sun, Coley — NeurIPS 2022',
    url: 'https://arxiv.org/pdf/2206.12411v2',
    firsthand: true,
  },
];

export interface MultiPathDagProps {
  footnote?: string;
  sources?: Source[];
  className?: string;
}

export function MultiPathDag({ footnote, sources, className }: MultiPathDagProps) {
  const [hostRef, width] = useElementWidth<HTMLDivElement>(880);
  const wide = width >= WIDE_AT;

  const panelW = wide ? Math.floor((width - GAP) / 2) : width;
  const single: PanelBox = { x: 0, y: 0, w: panelW, h: PANEL_H };
  const multi: PanelBox = wide
    ? { x: panelW + GAP, y: 0, w: panelW, h: PANEL_H }
    : { x: 0, y: PANEL_H + GAP, w: panelW, h: PANEL_H };
  const height = wide ? PANEL_H : PANEL_H * 2 + GAP;

  const singleNodes = place(single, SINGLE_SPEC);
  const multiNodes = place(multi, MULTI_SPEC);

  const panels = [
    {
      box: single,
      nodes: singleNodes,
      edges: SINGLE_EDGES,
      tone: 'empirical' as const,
      title: '单路径 · SMILES 序列',
      badge: 'PMO 14.196 · 1/25',
      lines: ['一个分子 x 只有一条构造轨迹：n(x) = 1', 'P_B(τ|x) = 1 → 修正项为空，TB 退化成 PCL'],
    },
    {
      box: multi,
      nodes: multiNodes,
      edges: MULTI_EDGES,
      tone: 'theory' as const,
      title: '多路径 · fragment · reaction MDP',
      badge: 'PMO 9.131 · 16/25',
      lines: [
        '同一个 x 有 n(x) 条构造轨迹（图示 4 条）',
        '朴素 RL / 树形 value：π(x) ∝ n(x)·R(x)',
      ],
    },
  ];

  return (
    <figure className={className ? `mpdag ${className}` : 'mpdag'}>
      <div className="mpdag__host" ref={hostRef}>
        <svg
          className="mpdag__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="单路径 SMILES 与多路径 fragment/reaction MDP 的轨迹计数对比"
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

            return (
              <g key={panel.title} className="mpdag__panel" data-tone={panel.tone}>
                <rect
                  className="mpdag__frame"
                  x={panel.box.x + 0.5}
                  y={panel.box.y + 0.5}
                  width={panel.box.w - 1}
                  height={panel.box.h - 1}
                  rx={3}
                />

                <text className="mpdag__panelTitle" x={panel.box.x + 20} y={panel.box.y + 25}>
                  {panel.title}
                </text>
                <text
                  className="mpdag__badge"
                  x={panel.box.x + 20}
                  y={panel.box.y + 45}
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

                {panel.lines.map((line, index) => (
                  <text
                    key={line}
                    className="mpdag__panelLine"
                    x={panel.box.x + 20}
                    y={panel.box.y + panel.box.h - 26 + index * 15}
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
        <div className="mpdag__formulaRow" data-tone="theory">
          <dt>flow 目标全局最优</dt>
          <dd>
            p(x) ∝ R(x)
            <span>—— 在构造动作的 DAG 上成立；这是一个分布性保证，不是优化保证，也不是样本效率保证</span>
          </dd>
        </div>
        <div className="mpdag__formulaRow" data-tone="naive">
          <dt>朴素树形 / 自回归 value</dt>
          <dd>
            π(x) ∝ n(x)·R(x)
            <span>—— n(x) = 构造同一分子图的动作序列数；偏差随轨迹长度指数增长，系统性偏好大分子</span>
          </dd>
        </div>
      </dl>

      <figcaption className="mpdag__footnote">{footnote ?? DEFAULT_FOOTNOTE}</figcaption>

      <ul className="mpdag__sources">
        {(sources ?? DEFAULT_SOURCES).map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer noopener">
              {source.title}
            </a>
            <span>{source.venue}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
