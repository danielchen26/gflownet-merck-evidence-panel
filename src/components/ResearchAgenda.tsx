import type { Provenance, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './ResearchAgenda.css';

/* ══ the constructive half ═══════════════════════════════════════════════
 * Every other section on this page reads evidence backwards, from a claim to
 * the measurement that constrains it. This one reads forwards: given the
 * measured failure, what would fix it, and what result would prove the fix
 * wrong. Three rules hold the section honest:
 *
 *   1. No item without a measured failure to hang on. An item with only a
 *      proposal is a wish list entry, and it does not belong here.
 *   2. `failure` is always `measured` or `refuted`; `proposal` and `probe`
 *      are always `claimed`. None of the seven has been carried out, so
 *      nothing here may borrow the colour of measurement.
 *   3. Named priorities (A and C) earn it by needing no new theory — not by
 *      being the most interesting.
 * ═══════════════════════════════════════════════════════════════════════ */

const SOURCE = {
  circles: {
    title: 'How Much Space Has Been Explored? Measuring the Chemical Space Covered by Databases and Machine-Generated Molecules',
    venue: 'Xie, Xu, Ma & Mei · ICLR 2023',
    url: 'https://openreview.net/forum?id=Yo06F8kfMa1',
    firsthand: true,
  },
  renz: {
    title: 'Diverse Hits in De Novo Molecule Design: Diversity-Based Comparison of Goal-Directed Generators',
    venue: 'Renz, Luukkonen & Klambauer · JCIM 64(15):5756 (2024)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11323242/',
    firsthand: true,
  },
  synflownet: {
    title: 'SynFlowNet: Design of Diverse and Novel Molecules with Synthesis Constraints',
    venue: 'ICLR 2025 · arXiv 2405.01155',
    url: 'https://arxiv.org/abs/2405.01155',
    firsthand: true,
  },
  tb: {
    title: 'Trajectory Balance: Improved Credit Assignment in GFlowNets',
    venue: 'Malkin et al. · arXiv 2201.13259',
    url: 'https://arxiv.org/abs/2201.13259',
    firsthand: true,
  },
  subtb: {
    title: 'Learning GFlowNets from Partial Episodes for Improved Convergence and Stability',
    venue: 'Madan et al. · arXiv 2209.12782',
    url: 'https://arxiv.org/abs/2209.12782',
    firsthand: true,
  },
  foundations: {
    title: 'GFlowNet Foundations',
    venue: 'Bengio, Lahlou, Deleu, Hu, Tiwari & Bengio · JMLR 24(210) · arXiv 2111.09266',
    url: 'https://arxiv.org/abs/2111.09266',
    firsthand: true,
  },
  bengio2021: {
    title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation',
    venue: 'Bengio, Bengio, Hu, Malkin & Bengio · NeurIPS 2021 · arXiv 2106.04399',
    url: 'https://arxiv.org/abs/2106.04399',
    firsthand: true,
  },
} satisfies Record<string, Source>;

/* ══ the reframe that has to come first ══════════════════════════════════ */

const KICKER: LText = { en: 'Before the list', zh: '在清单之前' };

const REFRAME_TITLE: LText = {
  en: 'It has been racing in the wrong class',
  zh: '它一直在错误的赛道上比赛',
};

const REFRAME: readonly LText[] = [
  {
    en: 'What a GFlowNet optimises is p(x) ∝ R(x). That is a sampling objective, so its natural comparison group is MCMC and amortised posterior inference — not argmax-seeking RL. Almost every published head-to-head puts it against the argmax class, and on that track the verdict elsewhere on this page stands unchanged.',
    zh: 'GFlowNet 优化的是 p(x) ∝ R(x)。这是一个采样目标，所以它天然的对照组是 MCMC 与摊销后验推断 —— 不是追 argmax 的 RL。已发表的正面对比几乎全部把它放进 argmax 这一类，而在那条赛道上，本页别处的判决一字不改。',
  },
  {
    en: 'On the sampling track the question changes shape. After training, one forward pass draws a sample from a distribution proportional to the reward: no chain, no burn-in, no autocorrelation to argue about. GFlowNet Foundations states that position in its own words — amortise MCMC with a single training run. Putting it in the right class repairs none of the numbers above. It repairs the question.',
    zh: '换到采样赛道，问题的形状就变了。训练完成后，单次前向就从一个与 reward 成正比的分布里取出样本：没有链、没有 burn-in、也没有 autocorrelation 可争。GFlowNet Foundations 用自己的话给出了这个定位 —— 用一次训练把 MCMC 摊销掉。放进对的赛道修不好上面任何一个数字，它修的是问题本身。',
  },
];

/* ══ the four advantages that survive scrutiny ═══════════════════════════ */

const STANDS_TITLE: LText = { en: 'What actually survives', zh: '真正站得住的' };

const STANDS_LEDE: LText = {
  en: 'Four claims hold up under the measurements on this page. Three of the four strongest published GFlowNet results cash exactly one of them.',
  zh: '在本页的实测面前有四条主张站得住。而已发表的最强 GFlowNet 结果里，有三个变现的恰好是同一条。',
};

interface Stand {
  id: string;
  head: LText;
  body: LText;
  cashed?: boolean;
}

const STANDS: readonly Stand[] = [
  {
    id: 'distribution',
    head: { en: 'Distributional guarantee on a DAG', zh: 'DAG 上的分布性保证' },
    body: {
      en: 'A naive tree-shaped or autoregressive value gives π(x) ∝ n(x)·R(x): the bias grows exponentially with trajectory length and systematically favours larger molecules. The flow construction is what removes that term.',
      zh: '朴素的树形或自回归 value 给出 π(x) ∝ n(x)·R(x)：偏差随轨迹长度指数增长，并系统性偏好更大的分子。flow 构造正是消掉这一项的东西。',
    },
  },
  {
    id: 'offpolicy',
    head: { en: 'Off-policy validity', zh: 'off-policy 有效性' },
    body: {
      en: 'Any behaviour policy with sufficient support trains it without bias. This is the one that pays: Genetic GFN consumes a GA, S3-GFN consumes a contrastive buffer plus genetic exploration, A-GFN consumes semi-offline batches. Three strongest results, one guarantee.',
      zh: '任意覆盖足够 support 的行为策略都能无偏地训练它。这条才是真付钱的：Genetic GFN 吃 GA，S3-GFN 吃对比 buffer + genetic exploration，A-GFN 吃半离线批。三个最强结果，同一条保证。',
    },
    cashed: true,
  },
  {
    id: 'logz',
    head: { en: 'log Z comes out free', zh: 'log Z 免费出来' },
    body: {
      en: 'The partition function is a trained parameter, not an extra estimator. SynFlowNet set R ≡ 1 and read log Z to measure the size of its own state space.',
      zh: '配分函数是一个被训练的参数，不是额外的估计器。SynFlowNet 令 R ≡ 1 训练，读出 log Z 来量自己状态空间的大小。',
    },
  },
  {
    id: 'entropy',
    head: { en: 'Entropy, mutual information, Pareto sampling', zh: '熵、互信息、Pareto 采样' },
    body: {
      en: 'All three are in GFlowNet Foundations as capabilities of the framework. In the molecular literature essentially nobody uses them, which means the theoretical surface has never been tested where it is strongest.',
      zh: '三者都写在 GFlowNet Foundations 里，是这个框架的能力。而分子文献里基本没人用，也就是说它理论上最强的那一面从未被检验过。',
    },
  },
];

/* ══ the seven items ═════════════════════════════════════════════════════ */

interface AgendaItem {
  id: string;
  /** A–G. Ordering is the reading order, not a ranking. */
  letter: string;
  title: LText;
  /** Measured or refuted — the thing that is actually broken. */
  failure: LText;
  failureProvenance: Provenance;
  /** Always claimed: none of these has been carried out. */
  proposal: LText;
  /** The experiment that could return the wrong answer. */
  probe: LText;
  /** Explicit limit of the evidence, or of the proposal itself. */
  boundary?: LText;
  source: Source;
  /** A and C: no new theory needed, nobody has done them. */
  priority?: boolean;
  /** B: the only item on the list that would produce new theory. */
  theory?: boolean;
}

const ITEMS: readonly AgendaItem[] = [
  {
    id: 'ruler',
    letter: 'A',
    title: { en: 'Fix the ruler before the method', zh: '先修尺子，再修方法' },
    failure: {
      en: 'The diversity claim rests on IntDiv, and IntDiv satisfies Dissimilarity while violating Monotonicity and Subadditivity. Swap in #Circles, the only metric that satisfies all three axioms, and GFlowNet returns 0 diverse hits on DRD2 and 0 on JNK3 where random virtual screening returns 21 and 15.',
      zh: '多样性主张建立在 IntDiv 上，而 IntDiv 满足 Dissimilarity，却违反 Monotonicity 与 Subadditivity。换成 #Circles —— 唯一同时满足三条公理的度量 —— GFlowNet 在 DRD2 与 JNK3 上的 diverse hits 是 0 和 0，而随机虚拟筛选是 21 和 15。',
    },
    failureProvenance: 'refuted',
    proposal: {
      en: 'Re-score the field, not one method. Every diversity number in the molecular GFlowNet literature was computed with a metric now known to be non-monotone, which means the ranking it produced carries no guarantee of surviving the correction.',
      zh: '重打整个领域的分，不是某一个方法的分。分子 GFlowNet 文献里每一个多样性数字都是用一个现已知非单调的度量算出来的，也就是说它产生的排序没有任何理由在修正后还成立。',
    },
    probe: {
      en: 'Re-run the canonical results at matched oracle budget, reporting #Circles alongside IntDiv, and publish both columns even where they disagree.',
      zh: '在预算匹配下重跑经典结果，把 #Circles 与 IntDiv 并排报出来，即使两列结论相左也照样发表。',
    },
    boundary: {
      en: 'The expected outcome is unflattering, and that is the argument for doing it rather than against it. Note the limit of the axiom paper itself: Xie et al. never tested GFlowNet — the axioms are about the metric, and the GFlowNet numbers come from Renz et al.',
      zh: '预期结果不好看，而这正是该做的理由，不是不该做的理由。也要注明公理那篇自己的边界：Xie et al. 从未测试 GFlowNet —— 公理讲的是度量，GFlowNet 的数字来自 Renz et al.',
    },
    source: SOURCE.circles,
    priority: true,
  },
  {
    id: 'beta',
    letter: 'B',
    title: { en: 'Give β a principle instead of a sweep', zh: '让 β 有原则，而不是靠扫参' },
    failure: {
      en: 'Raising β from 1 to 50 moves the PMO sum from 11.083 to 16.213 while Tanimoto diversity falls from 0.812 to 0.432. The framework offers no principle for choosing between those two endpoints, so the headline number is a hyperparameter choice made after seeing the leaderboard.',
      zh: 'β 从 1 提到 50，PMO 总分从 11.083 走到 16.213，而 Tanimoto diversity 从 0.812 掉到 0.432。框架没有给出在这两个端点之间取舍的任何原则，于是那个头条数字是看过排行榜之后做的超参选择。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'State it as a decision problem. Given the actual downstream pipeline — take top-k, cluster, synthesize N compounds, run an assay with false-positive rate α — which β maximises the expected number of experimentally confirmed hits? Diversity stops being a virtue to be traded away and becomes a term in an objective.',
      zh: '把它表述成一个决策问题。给定真实的下游流程 —— 取 top-k、聚类、合成 N 个化合物、跑一个假阳性率为 α 的 assay —— 哪个 β 最大化「被实验确认的 hit 期望数」？这样多样性就不再是一个用来交易的美德，而成为目标函数里的一项。',
    },
    probe: {
      en: 'Solve for β* on a synthetic oracle with controllable false-positive rate, then test whether β* moves monotonically with oracle fidelity. The Saturn authors already give the qualitative conjecture: low diversity is harmless under a high-fidelity oracle and harmful under a low-fidelity one. A monotone β* would confirm it; a non-monotone β* would be the more interesting result.',
      zh: '在一个假阳性率可控的合成 oracle 上求出 β*，然后检验 β* 是否随 oracle 保真度单调变化。Saturn 作者已经给了定性猜想：高保真 oracle 下低多样性无害，低保真下多样性有益。β* 单调会证实它；β* 非单调则是更有意思的结果。',
    },
    boundary: {
      en: 'This is the only item on the list that would produce new theory, and it has no precedent in the literature — it is an open problem, not a known result waiting to be written up.',
      zh: '这是清单上唯一能产出新理论的一条，而它在文献里没有先例 —— 它是一个开放问题，不是一个等着被写下来的已知结果。',
    },
    source: SOURCE.foundations,
    theory: true,
  },
  {
    id: 'dag',
    letter: 'C',
    title: { en: 'Make pointed-DAG legality a first-class citizen', zh: 'pointed-DAG 合法性做成一等公民' },
    failure: {
      en: 'Under a uniform backward policy only 11.0 ± 3.7% of backward trajectories reach s₀. A TB-trained free P_B reaches it 1.0 ± 0.8% of the time on held-out states. MaxLikelihood gets 99.3 ± 0.5% and REINFORCE 100.0 ± 0.0% on the training set. The distributional guarantee is conditional on a legal pointed DAG, so a violation is a correctness bug, not a tuning issue.',
      zh: '在均匀反向策略下，只有 11.0 ± 3.7% 的反向轨迹能回到 s₀。TB 训练出的 free P_B 在 held-out 状态上是 1.0 ± 0.8%。训练集上 MaxLikelihood 是 99.3 ± 0.5%，REINFORCE 是 100.0 ± 0.0%。分布性保证以 pointed DAG 合法为前提，所以违反它是正确性 bug，不是调参问题。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'A diagnostic triple that runs before training: backward reachability rate, orphaned-parent count, and flow-conservation residual. Then a constructive guarantee — a normalised construction order that makes an illegal environment unrepresentable instead of merely detectable.',
      zh: '一套在训练之前跑的诊断三件套：反向可达率、孤立父节点数、flow 守恒残差。然后是构造性保证 —— 一个规范化的构造序，让非法环境根本无法被表示，而不只是能被检出。',
    },
    probe: {
      en: 'Run backward reachability over the already-published reaction MDPs, one by one. Every environment that fails is a published result whose central guarantee did not hold while it was being reported.',
      zh: '对已发表的 reaction MDP 逐个跑反向可达率。每一个未通过的环境，都是一个在被报告时其核心保证并不成立的已发表结果。',
    },
    boundary: {
      en: 'No library ships this check today — not the reference implementation, not torchgfn, not any fork. That is why the failure went unreported for as long as it did.',
      zh: '今天没有任何库自带这个检查 —— 参考实现没有，torchgfn 没有，任何 fork 都没有。这也是这个失效被漏报这么久的原因。',
    },
    source: SOURCE.synflownet,
    priority: true,
  },
  {
    id: 'credit',
    letter: 'D',
    title: { en: 'Fix long-trajectory credit assignment', zh: '真修长轨迹的信用分配' },
    failure: {
      en: 'FM → DB → TB → SubTB(λ) is a patch chain, and each link says so in its own words. The TB paper reports FM and DB as prone to inefficient credit propagation across long action sequences; the SubTB paper positions itself between the two ends of a bias-variance trade-off, with λ as the dial.',
      zh: 'FM → DB → TB → SubTB(λ) 是一条补丁链，而每一环都用自己的话承认了这一点。TB 论文说 FM 与 DB 在长动作序列上容易出现低效的信用传播；SubTB 论文把自己定位在一个 bias-variance 权衡的两端之间，λ 就是那个旋钮。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'Stop extending the chain and ask what the chain is compensating for. Credit assignment over a DAG with long trajectories is the actual open problem; a fifth objective with a second interpolation parameter is a symptom of not having solved it.',
      zh: '别再往链上接了，去问这条链在补偿什么。长轨迹 DAG 上的信用分配才是真正的开放问题；第五个目标函数配第二个插值参数，是没解决它的症状。',
    },
    probe: {
      en: 'Hold environment and reward fixed, sweep trajectory length, and measure gradient variance for each objective. A patch chain predicts that every link degrades along the same axis; a real fix predicts one of them does not.',
      zh: '固定环境与 reward，扫轨迹长度，量每个目标函数的梯度方差。补丁链的预测是每一环都沿同一个轴劣化；真正的修复的预测是其中一环不会。',
    },
    source: SOURCE.tb,
  },
  {
    id: 'explore',
    letter: 'E',
    title: { en: 'Make exploration native instead of rented', zh: '让探索原生化，而不是租来的' },
    failure: {
      en: 'Genetic GFN scores 16.213. Swap its genetic search back for GFlowNet-native ε-greedy and it drops to 15.626; remove the genetic search entirely and it reads 15.738; substitute STONED for GraphGA and it reads 15.439. The best GFlowNet number on record depends on a component that is not a GFlowNet.',
      zh: 'Genetic GFN 拿 16.213。把它的 genetic search 换回 GFlowNet 原生的 ε-greedy，掉到 15.626；把 genetic search 整个去掉，是 15.738；用 STONED 代替 GraphGA，是 15.439。已知最好的 GFlowNet 成绩依赖于一个并非 GFlowNet 的组件。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'Read the ablation as a research direction rather than an embarrassment. Off-policy validity is precisely what lets a GA be bolted on, so the honest question is what native exploration mechanism the flow objective can support that reaches the same place without renting one.',
      zh: '把这组 ablation 当研究方向读，而不是当尴尬。正是 off-policy 有效性让 GA 能被挂上去，所以诚实的问题是：flow 目标能支持什么原生探索机制，让它不用租就走到同一个地方。',
    },
    probe: {
      en: 'Report every GFlowNet paper with its search operator ablated out. Any result that collapses to within noise of its ablation is measuring the operator, not the objective.',
      zh: '让每篇 GFlowNet 论文都报出把搜索算子拿掉后的成绩。凡是掉到与其 ablation 噪声重叠的结果，测的都是算子，不是目标函数。',
    },
    source: SOURCE.tb,
  },
  {
    id: 'sparse',
    letter: 'F',
    title: { en: 'Publish the sparse-reward threshold, and separate the two variables', zh: '公布稀疏 reward 阈值，并把两个变量分开' },
    failure: {
      en: 'On the senolytic task, where the proxy training set holds fewer than 100 actives, fragment GFlowNet found no high-reward molecules at all. Meanwhile the two variables that matter are never varied one at a time: holding the sampler fixed and changing the MDP moved independent AiZynthFinder success from 0% to 62%, while holding the MDP fixed and changing the sampler let a GA match the GFlowNet family on 16,000 oracle calls against 64,000, and let RL win outright on 1/400 of the budget.',
      zh: '在 senolytic 任务上（proxy 训练集里 active 少于 100 个），fragment GFlowNet 完全没找到高 reward 分子。同时，真正要紧的两个变量从来没被单独变过：固定 sampler 只换 MDP，独立 AiZynthFinder 成功率从 0% 变到 62%；固定 MDP 只换 sampler，GA 用 16,000 次 oracle 调用打平用 64,000 次的 GFlowNet 家族，而 RL 用 1/400 的预算全面胜出。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'Two deliverables. Publish the active-count threshold below which the flow objective stops finding anything — a number the field currently does not have. And report action space and sampler as separate axes, because the largest measured effect on this page belongs to the action space, which is not the part anyone is arguing about.',
      zh: '两个交付物。公布那个 active 数阈值 —— 低于它 flow 目标就什么也找不到 —— 这个数字领域目前没有。以及把动作空间与 sampler 当两个独立的轴分别报告，因为本页最大的实测效应属于动作空间，而那恰好不是任何人在争的部分。',
    },
    probe: {
      en: 'One benchmark: the same reaction MDP, one oracle budget, four samplers — GA, MCTS, RL, GFlowNet. Whatever it returns, it is the first measurement that isolates the objective from the search space.',
      zh: '一个基准：同一 reaction MDP、同一 oracle 预算、四个 sampler —— GA、MCTS、RL、GFlowNet。无论它返回什么，它都是第一个把目标函数与搜索空间分离开的测量。',
    },
    source: SOURCE.renz,
  },
  {
    id: 'representation',
    letter: 'G',
    title: { en: 'Move the theory onto the representation that wins, and cash the measurables', zh: '把理论搬到真正赢的表示上，并兑现可测量量' },
    failure: {
      en: 'The theoretical advantage and the empirical performance sit on different representations. Multi-path settings — fragment and reaction — are where the DAG correction is load-bearing, and they score 9.918 and 9.918. Single-path SMILES, where the correction term is empty and TB degenerates to PCL, scores 16.213. In the same table REINVENT scores 14.196.',
      zh: '理论优势与经验表现坐在不同的表示上。多路径设定 —— fragment 与 reaction —— 才是 DAG 修正真正承重的地方，而它们的成绩是 9.918 和 9.918。单路径 SMILES 上修正项为空、TB 退化成 PCL，成绩是 16.213。同一张表里 REINVENT 是 14.196。',
    },
    failureProvenance: 'measured',
    proposal: {
      en: 'Two moves that go together. Carry the DAG correction onto the representation that actually performs, instead of reporting the correction on one representation and the score on another. And cash the quantities the framework hands over for free — log Z, entropy, mutual information — which no molecular paper currently reports.',
      zh: '两个必须一起做的动作。把 DAG 修正搬到真正有成绩的那个表示上，而不是在一个表示上报修正、在另一个表示上报分数。以及把框架免费给出的量兑现掉 —— log Z、熵、互信息 —— 目前没有任何分子论文报告它们。',
    },
    probe: {
      en: 'Report log Z next to every headline score. If the partition function tracks performance, the framework has a diagnostic nobody else has; if it does not, that is a finding about the objective worth publishing on its own.',
      zh: '在每个头条成绩旁边报出 log Z。如果配分函数与表现同步，这个框架就有了别人都没有的诊断量；如果不同步，那本身就是一个关于目标函数的、值得单独发表的发现。',
    },
    source: SOURCE.bengio2021,
  },
];

/* ══ closing priority call ═══════════════════════════════════════════════ */

const PRIORITY_TITLE: LText = { en: 'Start with A and C', zh: '从 A 与 C 开始' };

const PRIORITY_BODY: LText = {
  en: 'A and C share three properties that none of the other five have at once: neither needs new theory, neither has been done, and either one changes what the field believes about its own published record within weeks rather than years. A re-scores existing results with a metric that satisfies the axioms. C runs a reachability check over existing environments. Both are auditing work, both are cheap, and both are the kind of result that is uncomfortable enough that nobody has volunteered.',
  zh: 'A 与 C 共有三条性质，其余五条没有一条能同时具备：都不需要新理论、都还没人做、且任何一条都能在数周（而不是数年）内改变这个领域对自己已发表记录的认知。A 是用满足公理的度量重打已有结果的分。C 是对已有环境跑一遍可达性检查。两者都是审计工作，都便宜，也都是那种不舒服到没人主动去做的结果。',
};

const PRIORITY_BOUNDARY: LText = {
  en: 'All seven items are proposals. None has been carried out, here or elsewhere, and nothing in this section may be read as a measured outcome.',
  zh: '七条全部是提议。无论在这里还是别处，没有任何一条被实施过，本节任何内容都不得读作实测结果。',
};

/* ══ render ══════════════════════════════════════════════════════════════ */

export function ResearchAgenda({ className }: { className?: string }) {
  const { lang } = useLang();

  return (
    <div className={className ? `ragenda ${className}` : 'ragenda'}>
      {/* ── the reframe ─────────────────────────────────────────────── */}
      <section className="ragenda__reframe" aria-labelledby="ragenda-reframe">
        <span className="ragenda__kicker">{t(KICKER, lang)}</span>
        <h3 className="ragenda__reframeTitle u-display" id="ragenda-reframe">
          <ProvenanceDot provenance="claimed" size="sm" detail={REFRAME_TITLE} />
          {t(REFRAME_TITLE, lang)}
        </h3>
        {REFRAME.map((para) => {
          const text = t(para, lang);
          return (
            <p className="ragenda__reframeBody" key={text.slice(0, 24)}>
              {text}
            </p>
          );
        })}
        <SourceCite className="ragenda__cite" source={SOURCE.foundations} />
      </section>

      {/* ── what survives ──────────────────────────────────────────── */}
      <section className="ragenda__stands" aria-labelledby="ragenda-stands">
        <h3 className="ragenda__standsTitle u-display" id="ragenda-stands">
          {t(STANDS_TITLE, lang)}
        </h3>
        <p className="ragenda__standsLede">{t(STANDS_LEDE, lang)}</p>
        <ul className="ragenda__standsList">
          {STANDS.map((stand) => (
            <li className="ragenda__stand" data-cashed={stand.cashed ?? false} key={stand.id}>
              <h4 className="ragenda__standHead">{t(stand.head, lang)}</h4>
              <p className="ragenda__standBody">{t(stand.body, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── the seven items ────────────────────────────────────────── */}
      <ol className="ragenda__items">
        {ITEMS.map((item) => (
          <li className="ragenda__item" data-priority={item.priority ?? false} key={item.id}>
            <header className="ragenda__itemHead">
              <span className="ragenda__letter u-display" aria-hidden="true">
                {item.letter}
              </span>
              <h4 className="ragenda__itemTitle u-display">{t(item.title, lang)}</h4>
              {item.priority === true && (
                <span className="ragenda__flag" data-kind="priority">
                  {lang === 'en' ? 'no new theory needed' : '不需要新理论'}
                </span>
              )}
              {item.theory === true && (
                <span className="ragenda__flag" data-kind="theory">
                  {lang === 'en' ? 'would produce new theory' : '能产出新理论'}
                </span>
              )}
            </header>

            <div className="ragenda__triple">
              {/* Only the failure dot is a tab stop: it is the one that carries
                  information the adjacent label does not — item A's failure is
                  `refuted`, the other six are `measured`. The proposal and
                  probe dots are always `claimed`, and their labels already say
                  so in words, so they are decorative per ProvenanceDot's
                  contract rather than 14 extra focus stops. */}
              <div className="ragenda__leg" data-leg="failure">
                <span className="ragenda__legLabel">
                  <ProvenanceDot provenance={item.failureProvenance} size="sm" />
                  {lang === 'en' ? 'Measured failure' : '实测失效'}
                </span>
                <p className="ragenda__legBody">{t(item.failure, lang)}</p>
              </div>

              <div className="ragenda__leg" data-leg="proposal">
                <span className="ragenda__legLabel">
                  <ProvenanceDot provenance="claimed" size="sm" decorative />
                  {lang === 'en' ? 'Proposal' : '提议'}
                </span>
                <p className="ragenda__legBody">{t(item.proposal, lang)}</p>
              </div>

              <div className="ragenda__leg" data-leg="probe">
                <span className="ragenda__legLabel">
                  <ProvenanceDot provenance="claimed" size="sm" decorative />
                  {lang === 'en' ? 'Falsifiable experiment' : '可证伪实验'}
                </span>
                <p className="ragenda__legBody">{t(item.probe, lang)}</p>
              </div>
            </div>

            {item.boundary !== undefined && (
              <p className="ragenda__boundary">{t(item.boundary, lang)}</p>
            )}
            <SourceCite className="ragenda__cite" source={item.source} />
          </li>
        ))}
      </ol>

      {/* ── priority call ──────────────────────────────────────────── */}
      <section className="ragenda__priority" aria-labelledby="ragenda-priority">
        <h3 className="ragenda__priorityTitle u-display" id="ragenda-priority">
          {t(PRIORITY_TITLE, lang)}
        </h3>
        <p className="ragenda__priorityBody">{t(PRIORITY_BODY, lang)}</p>
        <p className="ragenda__priorityBoundary">{t(PRIORITY_BOUNDARY, lang)}</p>
      </section>
    </div>
  );
}
