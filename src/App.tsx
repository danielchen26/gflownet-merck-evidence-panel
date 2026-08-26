import { lazy, Suspense } from 'react'
import { Rail } from './components/Rail'
import { SectionShell } from './components/SectionShell'
import { EvidenceTable } from './components/EvidenceTable'
import { AttritionFunnel } from './components/AttritionFunnel'
import { MultiPathDag } from './components/MultiPathDag'
import { GapsPanel } from './components/GapsPanel'
import { sections, openGaps } from './data/sections'
import { tables, merckFunnel, sources } from './data/evidence'
import type { EvidenceTable as EvidenceTableData, Section } from './data/types'

/* three.js is ~900 kB of the bundle; both scenes load on demand. */
const RewardLandscape = lazy(() => import('./scenes/RewardLandscape'))
const SphereCoverage = lazy(() => import('./scenes/SphereCoverage'))

/* Static data, indexed once at module scope. */
const TABLE: Record<string, EvidenceTableData> = Object.fromEntries(
  tables.map((t) => [t.id, t]),
)
const SECTION: Record<string, Section> = Object.fromEntries(
  sections.map((s) => [s.id, s]),
)

function SceneFallback({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div className="scene-fallback" style={{ aspectRatio: ratio }}>
      <span className="u-mono">{label}</span>
    </div>
  )
}

/** Three measured contradictions. Set as a ledger, not as stat cards: the
 *  column that matters is the honest baseline sitting next to the claim. */
const LEDGER = [
  {
    what: 'PMO sum AUC-top10 · 23 oracle · 10k 调用 · 5 seed',
    gfn: '9.131',
    gfnLabel: 'GFlowNet (16/25)',
    other: '8.635 / 14.196',
    otherLabel: '随机筛选 (19) / REINVENT (1)',
  },
  {
    what: 'Diverse hits (#Circles, D=0.7) · 10k 调用 · 全员装 diversity filter',
    gfn: '0 / 0',
    gfnLabel: 'GFlowNet · DRD2 / JNK3',
    other: '21 / 15',
    otherLabel: '随机虚拟筛选',
  },
  {
    what: '被合成并测活的分子（截至 2026-08 公开文献）',
    gfn: '0',
    gfnLabel: '全部 GFlowNet 方法',
    other: '79 → 13 → 1',
    otherLabel: 'SyntheMol-RL · 合成 / potent / 小鼠有效',
  },
] as const

export default function App() {
  return (
    <div className="app">
      <Rail sections={sections} />

      <main className="app__main">
        <header className="hero">
          <div className="hero__eyebrow">
            <span className="u-kicker">决策备忘录 · 2026-08-25</span>
            <hr />
            <span className="u-kicker">小分子生成设计</span>
          </div>

          <h1 className="u-display">
            GFlowNet 值得研究。<em>但它不是 Merck 该押的框架。</em>
          </h1>

          <p className="hero__standfirst">
            在固定 oracle 预算下它排 <strong>16/25</strong>；它唯一的差异化卖点在
            唯一一次公平对照中<strong>归零</strong>；而 Merck 自己的项目数据把失败
            归因于性质预测器 <strong>R² = 0.66</strong>，不是生成器。
            <strong>杠杆在 oracle，不在 sampler。</strong>
          </p>

          <div className="ledger">
            {LEDGER.map((row) => (
              <div className="ledger__row" key={row.what}>
                <div className="ledger__what">{row.what}</div>
                <div className="ledger__gfn">
                  <span className="ledger__label">{row.gfnLabel}</span>
                  {row.gfn}
                </div>
                <div className="ledger__other">
                  <span className="ledger__label">{row.otherLabel}</span>
                  {row.other}
                </div>
              </div>
            ))}
          </div>

          <p className="hero__disclaimer">
            与 Merck &amp; Co., Inc. / MSD 及 Merck KGaA, Darmstadt 均无隶属关系。
            所有基准与湿实验数字均可追溯到一手来源（见每张表下方链接）；3D 场景中
            的曲面与点云为示意，均标注「模拟 · illustration」。颜色编码认知状态：
            <span className="p-claimed"> 蓝 = 理论主张</span>、
            <span className="p-measured"> 琥珀 = 实测证据</span>、
            <span className="p-refuted"> 深红 = 被否证</span>。
          </p>
        </header>

        {SECTION['verdict'] && <SectionShell section={SECTION['verdict']} />}

        {SECTION['guarantee'] && (
          <SectionShell section={SECTION['guarantee']}>
            <Suspense fallback={<SceneFallback ratio="4 / 3" label="载入 reward landscape…" />}>
              <RewardLandscape />
            </Suspense>
          </SectionShell>
        )}

        {SECTION['fixed-budget'] && (
          <SectionShell section={SECTION['fixed-budget']}>
            {TABLE['pmo-original'] && <EvidenceTable table={TABLE['pmo-original']} />}
            {TABLE['gfn-variants'] && <EvidenceTable table={TABLE['gfn-variants']} />}
          </SectionShell>
        )}

        {SECTION['diversity-refuted'] && (
          <SectionShell section={SECTION['diversity-refuted']}>
            <Suspense fallback={<SceneFallback ratio="21 / 9" label="载入 coverage 场景…" />}>
              <SphereCoverage />
            </Suspense>
            {TABLE['renz-circles'] && <EvidenceTable table={TABLE['renz-circles']} />}
            {TABLE['beta-sweep'] && <EvidenceTable table={TABLE['beta-sweep']} />}
          </SectionShell>
        )}

        {SECTION['action-space'] && (
          <SectionShell section={SECTION['action-space']}>
            <MultiPathDag />
            {TABLE['synga-litpcba'] && <EvidenceTable table={TABLE['synga-litpcba']} />}
            {TABLE['saturn-vs-rgfn'] && <EvidenceTable table={TABLE['saturn-vs-rgfn']} />}
            {TABLE['s3gfn-retro'] && <EvidenceTable table={TABLE['s3gfn-retro']} />}
          </SectionShell>
        )}

        {SECTION['wetlab'] && (
          <SectionShell section={SECTION['wetlab']}>
            {TABLE['malt1'] && <EvidenceTable table={TABLE['malt1']} />}
          </SectionShell>
        )}

        {SECTION['merck-oracle'] && (
          <SectionShell section={SECTION['merck-oracle']}>
            <AttritionFunnel
              stages={merckFunnel}
              title="Merck Program 1 · 从生成到实测的漏斗"
              caption="双阈值（potency < 100 nM 且 docking < −50）的可行域为空，只能把 docking 阈值放宽到 −40。111 个合成测活拿到 4 个 μM 级 hit。"
              source={sources['merckBlog']}
            />
          </SectionShell>
        )}

        {SECTION['pilot'] && <SectionShell section={SECTION['pilot']} />}

        <GapsPanel
          openGaps={openGaps}
          title="未闭合的缺口"
          standfirst="以下项目未能取到一手来源，或取到但强度有限。它们会影响上述结论的置信度，因此列在这里而不是脚注里。"
        />

        <footer className="foot">
          <div>
            源备忘录：452 行 / 14 节 / 每条事实附一手来源。11 个并行 agent 取证，
            关键数字由主 agent 复核原表。
          </div>
          <div>
            两处对早期版本的更正已写入：JCTC 10.1021/acs.jctc.4c00576 并非
            Schrödinger AB-FEP 工作（实为 AstraZeneca + UCL 的 ESMACS）；
            Genetic GFN 的 β=30 Pareto 改进因建立在被公理否证的 IntDiv 上而降级。
          </div>
          <div>本页为技术评估的呈现，不构成投资或临床建议。MIT License.</div>
        </footer>
      </main>
    </div>
  )
}
