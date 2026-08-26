import { lazy, Suspense, useEffect } from 'react'
import { Rail } from './components/Rail'
import { SectionShell } from './components/SectionShell'
import { EvidenceTable } from './components/EvidenceTable'
import { AttritionFunnel } from './components/AttritionFunnel'
import { MultiPathDag } from './components/MultiPathDag'
import { GapsPanel } from './components/GapsPanel'
import { sections, openGaps } from './data/sections'
import { tables, merckFunnel, sources } from './data/evidence'
import { t, UI, useLang } from './i18n/i18n'
import type { EvidenceTable as EvidenceTableData, Section } from './data/types'
import type { LText } from './i18n/i18n'

/* three.js is ~900 kB of the bundle; both scenes load on demand. */
const RewardLandscape = lazy(() => import('./scenes/RewardLandscape'))
const SphereCoverage = lazy(() => import('./scenes/SphereCoverage'))

/* Static data, indexed once at module scope. */
const TABLE: Record<string, EvidenceTableData> = Object.fromEntries(
  tables.map((tbl) => [tbl.id, tbl]),
)
const SECTION: Record<string, Section> = Object.fromEntries(sections.map((s) => [s.id, s]))

const DOC_TITLE: LText = {
  en: 'GFlowNet for Merck small-molecule design? — An evidence panel',
  zh: 'GFlowNet 用于 Merck 小分子设计？— 证据面板',
}

/** Three measured contradictions. Set as a ledger, not as stat cards: the
 *  column that matters is the honest baseline sitting next to the claim. */
const LEDGER: {
  what: LText
  gfn: string
  gfnLabel: LText
  other: string
  otherLabel: LText
}[] = [
  {
    what: {
      en: 'PMO sum AUC-top10 · 23 oracles · 10k calls · 5 seeds',
      zh: 'PMO sum AUC-top10 · 23 oracle · 10k 调用 · 5 seed',
    },
    gfn: '9.131',
    gfnLabel: { en: 'GFlowNet (16/25)', zh: 'GFlowNet (16/25)' },
    other: '8.635 / 14.196',
    otherLabel: {
      en: 'random screening (19) / REINVENT (1)',
      zh: '随机筛选 (19) / REINVENT (1)',
    },
  },
  {
    what: {
      en: 'Diverse hits (#Circles, D=0.7) · 10k calls · diversity filter on every method',
      zh: 'Diverse hits (#Circles, D=0.7) · 10k 调用 · 全员装 diversity filter',
    },
    gfn: '0 / 0',
    gfnLabel: { en: 'GFlowNet · DRD2 / JNK3', zh: 'GFlowNet · DRD2 / JNK3' },
    other: '21 / 15',
    otherLabel: { en: 'random virtual screening', zh: '随机虚拟筛选' },
  },
  {
    what: {
      en: 'Molecules synthesised and assayed (published record to 2026-08)',
      zh: '被合成并测活的分子（截至 2026-08 公开文献）',
    },
    gfn: '0',
    gfnLabel: { en: 'every GFlowNet method', zh: '全部 GFlowNet 方法' },
    other: '79 → 13 → 1',
    otherLabel: {
      en: 'SyntheMol-RL · made / potent / efficacious in mice',
      zh: 'SyntheMol-RL · 合成 / potent / 小鼠有效',
    },
  },
]

const COPY = {
  standfirst: {
    en: 'It ranks 16/25 under a fixed oracle budget; its one differentiating claim goes to zero in the only fair comparison; and Merck\u2019s own programme data attributes the failure to a property predictor at R² = 0.66, not to the generator.',
    zh: '在固定 oracle 预算下它排 16/25；它唯一的差异化卖点在唯一一次公平对照中归零；而 Merck 自己的项目数据把失败归因于性质预测器 R² = 0.66，不是生成器。',
  },
  standfirstPunch: {
    en: 'The leverage is in the oracle, not the sampler.',
    zh: '杠杆在 oracle，不在 sampler。',
  },
  disclaimer: {
    en: 'Not affiliated with Merck & Co., Inc. / MSD or Merck KGaA, Darmstadt. Every benchmark and wet-lab number traces to a primary source (see the link under each table); the surfaces and point clouds in the 3D scenes are illustrative and labelled as such. Colour encodes epistemic status:',
    zh: '与 Merck & Co., Inc. / MSD 及 Merck KGaA, Darmstadt 均无隶属关系。所有基准与湿实验数字均可追溯到一手来源（见每张表下方链接）；3D 场景中的曲面与点云为示意，均标注「模拟 · illustration」。颜色编码认知状态：',
  },
  claimed: { en: 'blue = theoretical claim', zh: '蓝 = 理论主张' },
  measured: { en: 'amber = measured evidence', zh: '琥珀 = 实测证据' },
  refuted: { en: 'crimson = refuted', zh: '深红 = 被否证' },
  funnelTitle: {
    en: 'Merck Program 1 · from generated to assayed',
    zh: 'Merck Program 1 · 从生成到实测的漏斗',
  },
  funnelCaption: {
    en: 'The joint threshold (potency < 100 nM and docking < −50) had an empty feasible region, so the docking cut had to be relaxed to −40. Of 111 compounds synthesised and assayed, 4 came back as μM hits.',
    zh: '双阈值（potency < 100 nM 且 docking < −50）的可行域为空，只能把 docking 阈值放宽到 −40。111 个合成测活拿到 4 个 μM 级 hit。',
  },
  gapsStandfirst: {
    en: 'The items below could not be sourced first-hand, or were sourced but remain weak. They bound the confidence of the conclusions above, which is why they sit here rather than in a footnote.',
    zh: '以下项目未能取到一手来源，或取到但强度有限。它们会影响上述结论的置信度，因此列在这里而不是脚注里。',
  },
  footProvenance: {
    en: 'Source memo: 452 lines / 14 sections / a primary source on every claim. Evidence gathered by 11 parallel agents; the load-bearing numbers were re-checked against the original tables by the lead agent.',
    zh: '源备忘录：452 行 / 14 节 / 每条事实附一手来源。11 个并行 agent 取证，关键数字由主 agent 复核原表。',
  },
  footCorrections: {
    en: 'Two corrections to an earlier draft are carried in the text: JCTC 10.1021/acs.jctc.4c00576 is not the Schrödinger AB-FEP work (it is AstraZeneca + UCL, using ESMACS); and the β=30 Pareto improvement for Genetic GFN was downgraded because it rests on IntDiv, a metric refuted on axiomatic grounds.',
    zh: '两处对早期版本的更正已写入：JCTC 10.1021/acs.jctc.4c00576 并非 Schrödinger AB-FEP 工作（实为 AstraZeneca + UCL 的 ESMACS）；Genetic GFN 的 β=30 Pareto 改进因建立在被公理否证的 IntDiv 上而降级。',
  },
  footLegal: {
    en: 'This page presents a technical assessment. It is not investment or clinical advice. MIT License.',
    zh: '本页为技术评估的呈现，不构成投资或临床建议。MIT License.',
  },
  loadingLandscape: { en: 'loading reward landscape…', zh: '载入 reward landscape…' },
  loadingCoverage: { en: 'loading coverage scene…', zh: '载入 coverage 场景…' },
} as const satisfies Record<string, LText>

function SceneFallback({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div className="scene-fallback" style={{ aspectRatio: ratio }}>
      <span className="u-mono">{label}</span>
    </div>
  )
}

export default function App() {
  const { lang } = useLang()

  useEffect(() => {
    document.title = t(DOC_TITLE, lang)
  }, [lang])

  return (
    <div className="app">
      <Rail sections={sections} />

      <main className="app__main">
        <header className="hero">
          <div className="hero__eyebrow">
            <span className="u-kicker">{t(UI.eyebrowLeft, lang)}</span>
            <hr />
            <span className="u-kicker">{t(UI.eyebrowRight, lang)}</span>
          </div>

          <h1 className="u-display">
            {t(UI.heroTitleA, lang)} <em>{t(UI.heroTitleB, lang)}</em>
          </h1>

          <p className="hero__standfirst">
            {t(COPY.standfirst, lang)} <strong>{t(COPY.standfirstPunch, lang)}</strong>
          </p>

          <div className="ledger">
            {LEDGER.map((row) => (
              <div className="ledger__row" key={row.what.en}>
                <div className="ledger__what">{t(row.what, lang)}</div>
                <div className="ledger__gfn">
                  <span className="ledger__label">{t(row.gfnLabel, lang)}</span>
                  {row.gfn}
                </div>
                <div className="ledger__other">
                  <span className="ledger__label">{t(row.otherLabel, lang)}</span>
                  {row.other}
                </div>
              </div>
            ))}
          </div>

          <p className="hero__disclaimer">
            {t(COPY.disclaimer, lang)}
            <span className="p-claimed"> {t(COPY.claimed, lang)}</span>
            {' · '}
            <span className="p-measured">{t(COPY.measured, lang)}</span>
            {' · '}
            <span className="p-refuted">{t(COPY.refuted, lang)}</span>
          </p>
        </header>

        {SECTION['verdict'] && <SectionShell section={SECTION['verdict']} />}

        {SECTION['guarantee'] && (
          <SectionShell section={SECTION['guarantee']}>
            <Suspense
              fallback={
                <SceneFallback ratio="4 / 3" label={t(COPY.loadingLandscape, lang)} />
              }
            >
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
            <Suspense
              fallback={
                <SceneFallback ratio="21 / 9" label={t(COPY.loadingCoverage, lang)} />
              }
            >
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
              title={COPY.funnelTitle}
              caption={COPY.funnelCaption}
              source={sources['merckBlog']}
            />
          </SectionShell>
        )}

        {SECTION['pilot'] && <SectionShell section={SECTION['pilot']} />}

        <GapsPanel
          openGaps={openGaps}
          title={UI.gapsTitle}
          standfirst={COPY.gapsStandfirst}
        />

        <footer className="foot">
          <div>{t(COPY.footProvenance, lang)}</div>
          <div>{t(COPY.footCorrections, lang)}</div>
          <div>{t(COPY.footLegal, lang)}</div>
        </footer>
      </main>
    </div>
  )
}
