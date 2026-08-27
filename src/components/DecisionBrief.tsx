import type { Provenance, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './DecisionBrief.css';

/* ══ what this block is ══════════════════════════════════════════════════
 * The decision entry point, placed above the first section: not evidence, an
 * action table. It answers the four questions a chemistry lead actually has —
 * what do I approve, what do I refuse, where does the money go, and when do I
 * know I was wrong. Everything below is stated in checkable units only:
 * oracle calls, compounds synthesized and assayed, weeks, commits, R².
 * No dollar figure appears anywhere, by construction: GPU-hour cost,
 * per-compound price, software quotes and salaries have no firsthand source. */

/* ══ sources cited on this page ══════════════════════════════════════════ */

const SOURCE: Record<'merck' | 'circles' | 'renz' | 'equivalence', Source> = {
  merck: {
    title:
      'Generative AI to Design Small Molecule Therapeutics: Lessons from a Stanford/Merck collaboration',
    venue:
      'Swanson (Stanford CS), Zou (Stanford BDS), Chiriac, Cheng (Discovery Chemistry, Merck & Co., South San Francisco), 2026-04-27',
    url: 'https://swansonkyle.com/blog/synthemol-merck',
    firsthand: true,
  },
  circles: {
    title:
      'How Much Space Has Been Explored? Measuring the Chemical Space Covered by Databases and Machine-Generated Molecules',
    venue: 'Xie, Xu, Ma & Mei — ICLR 2023',
    url: 'https://openreview.net/forum?id=Yo06F8kfMa1',
    firsthand: false,
  },
  renz: {
    title:
      'Diverse Hits in De Novo Molecule Design: Diversity-Based Comparison of Goal-Directed Generators',
    venue: 'Renz, Luukkonen & Klambauer — JCIM 64(15):5756 (2024)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11323242/',
    firsthand: true,
  },
  equivalence: {
    title: 'Discrete Probabilistic Inference as Control in Multi-path Environments',
    venue: 'Deleu, Nouri, Malkin, Precup, Y. Bengio — UAI 2024, PMLR 244:997–1021',
    url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
    firsthand: false,
  },
};

/* ══ head ════════════════════════════════════════════════════════════════ */

const STAMP: LText = {
  en: 'decision entry point · action table, not evidence',
  zh: '决策入口 · 行动表，不是证据展示',
};

const TITLE: LText = {
  en: 'What to approve, what to refuse, and when you will know',
  zh: '批什么，拒什么，何时知道结果',
};

const STANDFIRST: LText = {
  en: 'Written for the chemistry lead who has to sign something this quarter. Every magnitude below is in a unit that can be checked; the kill criteria are meant to be signed before the run, not chosen after the numbers arrive.',
  zh: '写给这个季度必须签字的计算化学主管。下面每个量级都用可核实的单位；kill criteria 的用法是跑之前签字，不是等数字出来再挑。',
};

/* ══ (1) the 60-second version ═══════════════════════════════════════════ */

const SIXTY_LABEL: LText = { en: 'The 60-second version', zh: '60 秒版' };

const SIXTY_SUB: LText = { en: 'one sentence for the VP', zh: '给 VP 的一句话' };

const SIXTY_BODY: LText = {
  en: 'Do not open a GFlowNet program. Approve one loss-level, budget-matched controlled experiment — weeks, existing headcount. Put the real money into the oracle: Program 1 synthesized and assayed 111 compounds and returned 4 hits at IC₅₀ < 10 μM (3.6%), because the potency predictor scores R² 0.66 ± 0.03 — and swapping the sampler does not move that 0.66.',
  zh: '不要为 GFlowNet 立项。批一个 loss 级、预算匹配的对照实验 —— 数周，用现有人手。真正的钱投在 oracle 上：Program 1 合成测活 111 个化合物，只拿到 4 个 IC₅₀ < 10 μM 的 hit（3.6%），原因是 potency predictor 只有 R² 0.66 ± 0.03 —— 而换 sampler 动不了这个 0.66。',
};

/* ══ (2) the three-column action table ═══════════════════════════════════
 * One card recipe, one grid track, matched point counts: the refusal card must
 * not be able to read as a footnote to the approval card. */

interface ActionCard {
  id: string;
  accent: 'assay' | 'verdict' | 'flow';
  verdict: LText;
  tag: LText;
  provenance: Provenance;
  what: LText;
  points: readonly LText[];
}

const ACTIONS: readonly ActionCard[] = [
  {
    id: 'approve',
    accent: 'assay',
    verdict: { en: 'Approve', zh: '批准' },
    tag: { en: 'weeks · existing headcount', zh: '数周 · 现有人手' },
    provenance: 'claimed',
    what: {
      en: 'One budget-matched three-way control: GA / RL / GFlowNet, same action space, same reward.',
      zh: '一个等预算的三方对照：GA / RL / GFlowNet，同一动作空间、同一 reward。',
    },
    points: [
      {
        en: 'One oracle-call budget for all three arms, logged per arm. Every published comparison that flips a conclusion flips on budget: Saturn reaches its result in 1,000 oracle calls against RGFN at 400,000, and SynGA needs 16,000 where the GFlowNet family spends 64,000.',
        zh: '三个 arm 共用一个 oracle 调用预算，逐 arm 记账。已发表比较里凡是翻转结论的都翻在预算上：Saturn 用 1,000 次调用对 RGFN 的 400,000 次；SynGA 用 16,000 次，而 GFlowNet 家族花 64,000 次。',
      },
      {
        en: 'A loss-level diff, not a new stack: add a KL regularizer and a multi-path reward correction term. The published equivalences are what make this the cheap edit — TB is Path Consistency Learning, and modified DB is a Soft Q-Learning variant.',
        zh: '改动停在 loss 层，不是新技术栈：加一个 KL 正则项 + 一个多路径 reward correction 项。正是已发表的等价性让这成为最便宜的改法 —— TB 等价于 Path Consistency Learning，modified DB 是 Soft Q-Learning 的一个变体。',
      },
      {
        en: 'Feed the GFlowNet arm the data we already have. Off-policy validity is the one guarantee the three strongest results actually monetize: Genetic GFN consumes a GA, S3-GFN consumes a contrastive buffer plus genetic exploration, A-GFN consumes semi-offline batches.',
        zh: '把我们已有的数据喂给 GFlowNet arm。off-policy 有效性是三个最强结果真正变现的那一条：Genetic GFN 吃 GA，S3-GFN 吃对比 buffer + genetic exploration，A-GFN 吃半离线批。',
      },
      {
        en: 'Read log Z for free on the way: set R ≡ 1 and train, as SynFlowNet did, to measure how big our own state space actually is.',
        zh: '顺路免费读一次 log Z：像 SynFlowNet 那样令 R ≡ 1 训练，量一下我们自己的状态空间到底有多大。',
      },
    ],
  },
  {
    id: 'refuse',
    accent: 'verdict',
    verdict: { en: 'Refuse', zh: '拒绝' },
    tag: { en: 'measured · supply-chain probe', zh: '实测 · 供应链体检' },
    provenance: 'measured',
    what: {
      en: 'A framework-level bet: a new platform plus a dedicated team. The supply chain does not carry it.',
      zh: '框架级立项：新平台 + 专职团队。供应链托不住。',
    },
    points: [
      {
        en: 'The reference implementation recursionpharma/gflownet took 2 commits across all of 2026.',
        zh: '参考实现 recursionpharma/gflownet 在 2026 全年只有 2 个 commit。',
      },
      {
        en: 'Its trunk carries no reaction environment, no docking, no ADMET and no PMO harness — the four things a real program needs on day one.',
        zh: '它的主干没有 reaction 环境、没有 docking、没有 ADMET、没有 PMO harness —— 真实项目第一天就要的四样。',
      },
      {
        en: 'Those capabilities do exist, scattered across 7 forks that never merged back; torchgfn carries 52 open issues and scopes itself to fast prototyping; all three plausible Julia General registry package names return 404.',
        zh: '这些能力确实存在，但散在 7 个从未合回主干的 fork 里；torchgfn 有 52 个 open issue，且自限于 fast prototyping；Julia General registry 里三个可能的包名全部返回 404。',
      },
      {
        en: 'The strongest variant is already commercialized, and its public release states outright that it does not reproduce the paper. We would be staffing a team to rebuild someone else\u2019s unreleased branch.',
        zh: '最强的那个变体已经商业化，其公开版本明说复现不出论文。我们等于配一个团队去重建别人未公开的分支。',
      },
    ],
  },
  {
    id: 'money',
    accent: 'flow',
    verdict: { en: 'Where the money goes', zh: '真正的钱' },
    tag: { en: 'oracle layer · proposal', zh: 'oracle 层 · 提议' },
    provenance: 'claimed',
    what: {
      en: 'The oracle layer, not the sampler: scoring accuracy, structure-grounded scoring, and the reward specification.',
      zh: 'oracle 层，不是 sampler：打分精度、有结构依据的打分、以及 reward 规格。',
    },
    points: [
      {
        en: 'Predictor accuracy first: the potency predictor sits at R² 0.66 ± 0.03 and the docking predictor at R² 0.76 ± 0.01. Every sampler downstream inherits both numbers unchanged.',
        zh: '首先是打分模型精度：potency predictor 是 R² 0.66 ± 0.03，docking predictor 是 R² 0.76 ± 0.01。下游任何 sampler 都原封不动继承这两个数。',
      },
      {
        en: 'Deploy Boltz-2 as a structure-grounded scorer inside the loop, and measure what it buys against the current predictors on our own held-out potency data.',
        zh: '把 Boltz-2 作为有结构依据的打分器部署进循环里，并在我们自己的 held-out potency 数据上量它相对现有 predictor 买到了什么。',
      },
      {
        en: 'Rewrite the MPO specification. In Program 1, 12,796 molecules were generated and 0 satisfied both thresholds at the same time; the six-parameter MPO with dynamic weights collapsed onto a single species and the team abandoned joint optimization. That is a reward-design failure, and no sampler fixes it.',
        zh: '重做 MPO 规格。Program 1 生成了 12,796 个分子，同时满足双阈值的有 0 个；六参数 MPO 的动态权重坍缩到单一物种，团队放弃了联合优化。这是 reward 设计的失效，换任何 sampler 都修不了。',
      },
      {
        en: 'Keep the honest bar in view: the same project\u2019s historical library already holds 95 single-digit nM compounds. That is what a new hit has to be compared against, not against a random-generation baseline.',
        zh: '把诚实的标尺摆在眼前：同一项目的历史库里已经有 95 个单位数 nM 化合物。新 hit 要对标的是它，不是一个随机生成的基线。',
      },
    ],
  },
];

/* ══ (3) pre-registered kill criteria ════════════════════════════════════ */

const KILL_LABEL: LText = { en: 'Kill criteria, pre-registered', zh: '预注册的 kill criteria' };

const KILL_STAMP: LText = { en: 'sign it before the run', zh: '先写死，再跑' };

const KILL_LEDE: LText = {
  en: 'The first four lines get signed before the first run starts. If they are chosen after the numbers arrive, the experiment measures nothing. The last line is not a criterion — it states the prior the four are being tested against.',
  zh: '前四条在第一次跑之前签字。如果等数字出来再定，这个实验什么也没测。最后一条不是判据 —— 它写的是这四条要检验的那个先验。',
};

interface KillRule {
  id: string;
  head: LText;
  body: LText;
  provenance: Provenance;
}

const KILL_RULES: readonly KillRule[] = [
  {
    id: 'gate',
    head: { en: 'Primary gate', zh: '主闸门' },
    body: {
      en: 'GFlowNet enters the production roadmap only if, at matched budget, it wins on potency AND on #Circles at the same time. Not IntDiv: IntDiv satisfies Dissimilarity but violates Monotonicity and Subadditivity, and #Circles is the only metric that satisfies all three axioms.',
      zh: 'GFlowNet 只有在相同预算下同时赢下 potency 与 #Circles 时，才进生产路线图。不看 IntDiv：IntDiv 只满足 Dissimilarity，违反 Monotonicity 与 Subadditivity；#Circles 是唯一同时满足三条公理的度量。',
    },
    provenance: 'claimed',
  },
  {
    id: 'control',
    head: { en: 'Control arm', zh: '对照组' },
    body: {
      en: 'The control arm must be KL-regularized RL, not vanilla REINVENT. RTB is Trust-PCL, and KL-regularized RL methods achieve comparable performance — so beating an unregularized baseline proves nothing about the flow objective.',
      zh: '对照组必须是 KL 正则的 RL，不是 vanilla REINVENT。RTB 等价于 Trust-PCL，且 KL 正则的 RL 方法能达到相当的表现 —— 赢过一个没有正则的 baseline，对 flow 目标什么也不能证明。',
    },
    provenance: 'claimed',
  },
  {
    id: 'trigger-objective',
    head: { en: 'Alternate trigger · objective', zh: '备选触发条件 · 目标函数' },
    body: {
      en: 'Reopen the question if a flow objective reproduces a measured increment over imitation-style distillation on a real oracle rather than on a proxy.',
      zh: '如果 flow 目标在真实 oracle（而不是 proxy）上复现出相对模仿蒸馏的增量，这个问题重开。',
    },
    provenance: 'claimed',
  },
  {
    id: 'trigger-wetlab',
    head: { en: 'Alternate trigger · wet lab', zh: '备选触发条件 · 湿实验' },
    body: {
      en: 'Reopen the question when the first molecule designed by a GFlowNet is synthesized and assayed. Today that count is 0.',
      zh: '当出现第一个由 GFlowNet 设计、并被合成测活的分子时，这个问题重开。今天这个数是 0。',
    },
    provenance: 'claimed',
  },
  {
    id: 'prior',
    head: { en: 'The prior being tested', zh: '要检验的先验' },
    body: {
      en: 'The one experiment that already matched budgets, gave every method a diversity filter and scored with #Circles (D=0.7) put GFlowNet at 0 and 0 diverse hits on DRD2 and JNK3, against 21 and 15 for random virtual screening and 81 and 176 for AugMemory. The control experiment above is expected to fail; that is why it is cheap.',
      zh: '唯一已经做到预算匹配、全员装 diversity filter、并用 #Circles (D=0.7) 计分的实验里，GFlowNet 在 DRD2 与 JNK3 上是 0 和 0，而随机虚拟筛选是 21 和 15，AugMemory 是 81 和 176。上面这个对照实验的预期结果是失败；这正是它便宜的理由。',
    },
    provenance: 'refuted',
  },
];

const KILL_BOUNDARY: LText = {
  en: 'Boundary: the axiom paper never tested GFlowNet. Its axioms constrain the metric we report, not the sampler we judge.',
  zh: '边界：那篇公理文章并未测试 GFlowNet。它的公理约束的是我们报告的度量，不是我们评判的 sampler。',
};

/* ══ (4) reversibility, and three questions for the team ═════════════════ */

const REV_LABEL: LText = { en: 'Reversibility', zh: '可逆性' };

interface RevLine {
  id: string;
  head: LText;
  body: LText;
  provenance: Provenance;
}

const REV_LINES: readonly RevLine[] = [
  {
    id: 'loss',
    head: { en: 'Loss-level: reversible', zh: 'loss 级：可逆' },
    body: {
      en: 'A loss-level change does not trigger requalification of a commercial product. AIDDISON is an externally sold, ISO 27001 certified product, so replacing its RL core would mean requalifying a product we sell; adding a KL regularizer and a multi-path reward correction is an edit to the objective and triggers none of that.',
      zh: 'loss 级改动不触发商业产品的重新资格认证。AIDDISON 是对外销售的 ISO 27001 认证产品，换掉它的 RL 内核意味着重新资格认证一个我们在卖的产品；而加一个 KL 正则项 + 多路径 reward correction 只是改目标函数，什么都不触发。',
    },
    provenance: 'claimed',
  },
  {
    id: 'framework',
    head: { en: 'Framework-level: not reversible', zh: '框架级：不可逆' },
    body: {
      en: 'A framework-level bet is not reversible: platform, headcount and interfaces all get built around one objective, and the exit cost is paid in quarters rather than in weeks.',
      zh: '框架级押注不可逆：平台、人手、接口都会围着一个目标搭起来，退出成本是按季度而不是按周付的。',
    },
    provenance: 'claimed',
  },
];

const QUESTIONS_LABEL: LText = { en: 'Three questions for the team', zh: '要问团队的三个问题' };

const QUESTIONS: readonly LText[] = [
  {
    en: 'What is the R² of our potency predictor on novel scaffolds — not on known series? R² 0.66 ± 0.03 is the pooled number, and the entire decision hangs on the novel-scaffold slice of it.',
    zh: '我们的 potency predictor 在新颖骨架上的 R² 是多少 —— 不是在已知系列上？0.66 ± 0.03 是全集数字，而整个决策挂在它里面新颖骨架那一段上。',
  },
  {
    en: 'Who set the MPO weights last round, and did any single objective collapse the search? In Program 1 the six-parameter MPO with dynamic weights collapsed onto a single species, and joint optimization was abandoned.',
    zh: '上一轮 MPO 的权重是谁定的，出现过单目标坍缩吗？Program 1 里六参数 MPO 的动态权重坍缩到了单一物种，联合优化被放弃。',
  },
  {
    en: 'Given the synthesis budget of 111 compounds, would you spend it generating more molecules or on scoring accuracy? Program 1 spent it on 111 compounds and got 4 hits under 10 μM, against 95 single-digit nM compounds already sitting in the library.',
    zh: '给你 111 个化合物的合成预算，你会花在多生成分子上，还是花在提高打分精度上？Program 1 把它花在 111 个化合物上，拿到 4 个 <10 μM 的 hit，而库里已经躺着 95 个单位数 nM 的化合物。',
  },
];

/* ══ mandatory limitation notice ═════════════════════════════════════════ */

const LIMITS_HEAD: LText = { en: 'What this table cannot price', zh: '本表不能定价的部分' };

const LIMITS_BODY: LText = {
  en: 'This brief carries no dollar figures. GPU-hour cost, per-compound price, software quotes and engineer salaries have no firsthand source, so all four are absent rather than estimated. Every magnitude above is in a checkable unit: oracle calls, compounds synthesized and assayed, weeks, commits, R². Converting any of it into money needs procurement and headcount data this panel does not have.',
  zh: '本表不含任何美元金额。GPU 小时成本、化合物单价、软件报价、工程师薪资四项均无一手来源，因此是缺席，而不是估算。上面每一个量级都用可核实的单位：oracle 调用数、合成测活的化合物数、周数、commit 数、R²。把其中任何一项折成钱，都需要本面板没有的采购与人力数据。',
};

/* ══ render ══════════════════════════════════════════════════════════════ */

export function DecisionBrief({ className }: { className?: string }) {
  const { lang } = useLang();

  return (
    <section
      className={className ? `dbrief ${className}` : 'dbrief'}
      aria-labelledby="dbrief-title"
    >
      <header className="dbrief__head">
        <span className="dbrief__stamp">{t(STAMP, lang)}</span>
        <h2 className="dbrief__title u-display" id="dbrief-title">
          {t(TITLE, lang)}
        </h2>
        <p className="dbrief__standfirst u-measure">{t(STANDFIRST, lang)}</p>
      </header>

      {/* ── (1) the 60-second version ───────────────────────────────── */}
      <section className="dbrief__sixty" aria-labelledby="dbrief-sixty">
        <h3 className="dbrief__sixtyHead" id="dbrief-sixty">
          <span className="dbrief__sixtyLabel u-display">{t(SIXTY_LABEL, lang)}</span>
          <span className="dbrief__sixtySub">{t(SIXTY_SUB, lang)}</span>
        </h3>
        <p className="dbrief__sixtyBody">{t(SIXTY_BODY, lang)}</p>
        <p className="dbrief__sixtyGrade">
          <ProvenanceDot provenance="measured" size="sm" detail={SIXTY_LABEL} />
        </p>
        <SourceCite className="dbrief__cite" source={SOURCE.merck} />
      </section>

      {/* ── (2) the three-column action table ───────────────────────── */}
      <div className="dbrief__grid">
        {ACTIONS.map((card) => (
          <article className="dbrief__card" data-accent={card.accent} key={card.id}>
            <header className="dbrief__cardHead">
              <h3 className="dbrief__verdict u-display">{t(card.verdict, lang)}</h3>
              <span className="dbrief__cardTag">
                <ProvenanceDot provenance={card.provenance} size="sm" decorative />
                <span>{t(card.tag, lang)}</span>
              </span>
            </header>
            <p className="dbrief__cardWhat">{t(card.what, lang)}</p>
            <ul className="dbrief__points">
              {card.points.map((point) => {
                const text = t(point, lang);
                return <li key={text}>{text}</li>;
              })}
            </ul>
          </article>
        ))}
      </div>

      {/* ── (3) pre-registered kill criteria ────────────────────────── */}
      <section className="dbrief__kill" aria-labelledby="dbrief-kill">
        <header className="dbrief__killHead">
          <span className="dbrief__killStamp">{t(KILL_STAMP, lang)}</span>
          <h3 className="dbrief__killTitle u-display" id="dbrief-kill">
            {t(KILL_LABEL, lang)}
          </h3>
          <p className="dbrief__killLede">{t(KILL_LEDE, lang)}</p>
        </header>

        <ol className="dbrief__rules">
          {KILL_RULES.map((rule) => (
            <li className="dbrief__rule" data-provenance={rule.provenance} key={rule.id}>
              <span className="dbrief__ruleHead">
                <ProvenanceDot provenance={rule.provenance} size="sm" detail={rule.head} />
                <span>{t(rule.head, lang)}</span>
              </span>
              <span className="dbrief__ruleBody">{t(rule.body, lang)}</span>
            </li>
          ))}
        </ol>

        <p className="dbrief__killBoundary">{t(KILL_BOUNDARY, lang)}</p>
        <SourceCite className="dbrief__cite" source={SOURCE.circles} />
        <SourceCite className="dbrief__cite" source={SOURCE.renz} />
      </section>

      {/* ── (4) reversibility and the three questions ───────────────── */}
      <div className="dbrief__pair">
        <section className="dbrief__panel" aria-labelledby="dbrief-rev">
          <h3 className="dbrief__panelTitle u-display" id="dbrief-rev">
            {t(REV_LABEL, lang)}
          </h3>
          <dl className="dbrief__rev">
            {REV_LINES.map((line) => (
              <div className="dbrief__revItem" data-provenance={line.provenance} key={line.id}>
                <dt className="dbrief__revHead">{t(line.head, lang)}</dt>
                <dd className="dbrief__revBody">{t(line.body, lang)}</dd>
              </div>
            ))}
          </dl>
          <SourceCite className="dbrief__cite" source={SOURCE.equivalence} />
        </section>

        <section className="dbrief__panel" aria-labelledby="dbrief-ask">
          <h3 className="dbrief__panelTitle u-display" id="dbrief-ask">
            {t(QUESTIONS_LABEL, lang)}
          </h3>
          <ol className="dbrief__asks">
            {QUESTIONS.map((question) => {
              const text = t(question, lang);
              return (
                <li className="dbrief__ask" key={text}>
                  {text}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <aside className="dbrief__limits" aria-labelledby="dbrief-limits">
        <h3 className="dbrief__limitsHead" id="dbrief-limits">
          {t(LIMITS_HEAD, lang)}
        </h3>
        <p className="dbrief__limitsBody">{t(LIMITS_BODY, lang)}</p>
      </aside>
    </section>
  );
}
