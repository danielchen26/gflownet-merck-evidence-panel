import type { Provenance, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './PromiseAudit.css';

/* ══ the audit ═══════════════════════════════════════════════════════════
 * The question this section answers is "what does GFlowNet actually bring,
 * how would you check it, and is it promising" — and the only honest form of
 * that answer is itemised. A single promising / not-promising verdict would
 * have to be wrong about most of the six capabilities, because their evidence
 * grades span three levels.
 *
 * Four rules keep it honest:
 *
 *   1. Every capability carries the same triple: what it CLAIMS to bring,
 *      what is already KNOWN and at what grade, and which EXPERIMENT would
 *      move it from claimed to known. An item missing the third leg is an
 *      opinion and does not belong here.
 *   2. Two axes run independently and are never merged. The GRADE rates how
 *      firmly this audit can settle the item. The provenance DOT keeps the
 *      page-wide meaning of the evidence itself: a proof is `claimed`, a
 *      benchmark number is `measured`. Item 1 is graded `established` on a
 *      proof, so its grade is amber and its dot is blue. That is not an
 *      inconsistency, it is the finding.
 *   3. No proposed experiment may borrow the colour of a measurement. Every
 *      probe leg and every entry in "what would change my mind" is `claimed`.
 *   4. The first-hand run is reported with its skip, not without it. A green
 *      exit code that skipped the chemistry is the whole point of that block.
 * ═══════════════════════════════════════════════════════════════════════ */

const SOURCE = {
  bengio2021: {
    title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation',
    venue: 'E. Bengio, Jain, Korablyov, Precup & Y. Bengio · NeurIPS 2021 · arXiv 2106.04399',
    url: 'https://arxiv.org/abs/2106.04399',
    firsthand: false,
  },
  foundations: {
    title: 'GFlowNet Foundations',
    venue: 'Bengio, Lahlou, Deleu, Hu, Tiwari & Bengio · JMLR 24(210) · arXiv 2111.09266',
    url: 'https://arxiv.org/abs/2111.09266',
    firsthand: false,
  },
  geneticGfn2024: {
    title: 'Genetic-guided GFlowNets for Sample Efficient Molecular Optimization',
    venue: 'Kim et al. · NeurIPS 2024 · arXiv 2402.05961',
    url: 'https://arxiv.org/abs/2402.05961',
    firsthand: true,
  },
  deleu2024: {
    title: 'Discrete Probabilistic Inference as Control in Multi-path Environments',
    venue: 'Deleu, Nouri, Malkin, Precup & Y. Bengio · UAI 2024 · PMLR 244:997-1021',
    url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
    firsthand: false,
  },
  rtbTrustPcl2025: {
    title: 'Relative Trajectory Balance is equivalent to Trust-PCL',
    venue: 'Deleu, Nouri, Y. Bengio & Precup · 2025-09 · arXiv 2509.01632',
    url: 'https://arxiv.org/abs/2509.01632',
    firsthand: false,
  },
  synflownet2025: {
    title: 'SynFlowNet: Design of Diverse and Novel Molecules with Synthesis Constraints',
    venue: 'ICLR 2025 · arXiv 2405.01155',
    url: 'https://arxiv.org/abs/2405.01155',
    firsthand: false,
  },
  pmo2022: {
    title: 'Sample Efficiency Matters: A Benchmark for Practical Molecular Optimization',
    venue: 'Gao, Fu, Sun & Coley · NeurIPS 2022',
    url: 'https://arxiv.org/pdf/2206.12411v2',
    firsthand: true,
  },
  renz2024: {
    title: 'Diverse Hits in De Novo Molecule Design: Diversity-Based Comparison of Goal-Directed Generators',
    venue: 'Renz, Luukkonen & Klambauer · JCIM 64(15):5756 (2024)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11323242/',
    firsthand: true,
  },
  xie2023: {
    title: 'How Much Space Has Been Explored? Measuring the Chemical Space Covered by Databases and Machine-Generated Molecules',
    venue: 'Xie, Xu, Ma & Mei · ICLR 2023',
    url: 'https://openreview.net/forum?id=Yo06F8kfMa1',
    firsthand: false,
  },
  saturn: {
    title: 'Saturn: Sample-efficient Generative Molecular Design using Memory Manipulation',
    venue: 'Guo & Schwaller · 2024 · arXiv 2405.17066',
    url: 'https://arxiv.org/abs/2405.17066',
    firsthand: false,
  },
  synga2026: {
    title: 'A Genetic Algorithm for Navigating Synthesizable Molecular Spaces (SynGA / SynGBO)',
    venue: 'Lo, Coley & Matusik · ICLR 2026',
    url: 'https://proceedings.iclr.cc/paper_files/paper/2026/file/3f61ff6252d38ea099cea2246cec7fa6-Paper-Conference.pdf',
    firsthand: true,
  },
  gflownetJlRun: {
    title: 'danielchen26/Gflownet — full test/runtests.jl executed on Julia 1.11.6',
    venue:
      'first-hand run, 2026-08-30 · 1897 pass / 28 broken / 1925 total · 55m54s · exit 0 · RDKit assertions skipped',
    url: 'https://github.com/danielchen26/Gflownet',
    firsthand: true,
  },
} satisfies Record<string, Source>;

/* ══ the four grades ═════════════════════════════════════════════════════ */

/** How firmly this audit can settle an item — a different axis from `Provenance`,
 *  which grades the evidence itself. Colour: established / demonstrated amber,
 *  untested blue, refuted deep red. */
type Grade = 'established' | 'demonstrated' | 'untested' | 'refuted';

/** The token is the same in both languages on purpose: it is the label the rest
 *  of this memo is indexed by, so only the gloss is translated. */
const GRADE_GLOSS: Record<Grade, LText> = {
  established: { en: 'proof, or several measured runs agreeing', zh: '有证明，或多组实测互相一致' },
  demonstrated: { en: 'one measured run', zh: '单组实测' },
  untested: { en: 'theory exists, no measurement exists', zh: '有理论，无实测' },
  refuted: { en: 'measured to fail', zh: '被实测否证' },
};

const GRADE_ORDER: readonly Grade[] = ['established', 'demonstrated', 'untested', 'refuted'];

const LEGEND_TITLE: LText = { en: 'Grades used below', zh: '下面使用的评级' };

const LEDE_KICKER: LText = { en: 'Item by item', zh: '逐项审计' };

const AUDIT_TITLE: LText = {
  en: 'What it brings, how you would check it, whether it is promising',
  zh: '它带来什么、怎么去验证、是不是真 promising',
};

const LEDE: readonly LText[] = [
  {
    en: 'A single verdict on GFlowNet would be the least useful thing this page could produce. It is not one bet: six separable capabilities sit inside it, and their evidence grades span three levels. So each one is put through the same three questions — what it claims to bring, what is already known and at what grade, and which experiment would move it from claimed to known.',
    zh: '给 GFlowNet 一个笼统结论，是本页能产出的最没用的东西。它不是一个赌注：里面装着六项可分离的能力，而它们的证据等级相差三级。所以每一项都过同样的三个问题 —— 它声称带来什么、已知证据是什么（分级）、什么实验能把它从声称变成已知。',
  },
  {
    en: 'Two axes run independently here and are never merged. The grade rates how firmly this audit can settle the item. The dot keeps the meaning it has everywhere else on this page: a proof is a theory claim, a benchmark number is measured evidence. Item 1 is graded established on a proof, which is exactly why its grade is amber and its dot is blue — and why its open question is whether the proof binds on a real molecular MDP at all.',
    zh: '这里有两条互相独立、绝不合并的轴。等级评的是本次审计能把该项定到多牢。圆点保持它在本页别处的含义：证明属于理论主张，基准数字属于实测证据。第 1 项凭一个证明拿到 established，这正是它的等级是琥珀色而圆点是蓝色的原因 —— 也正是它的开放问题所在：那个证明在真实分子 MDP 上究竟成不成立。',
  },
];

/* ══ the six capabilities ════════════════════════════════════════════════ */

interface Capability {
  id: string;
  ordinal: string;
  title: LText;
  grade: Grade;
  /** What the capability is advertised to bring. Always a `claimed` leg. */
  claim: LText;
  /** What is on record. Graded by `evidenceProvenance`, never by `grade`. */
  evidence: LText;
  evidenceProvenance: Provenance;
  /** The experiment that would convert claimed into known. Always `claimed`. */
  probe: LText;
  /** Item 6 only: the question is closed, so the probe leg is not a proposal. */
  probeSettled?: boolean;
  /** Where the grade stops applying — the sentence that stops it overreaching. */
  boundary?: LText;
  sources: readonly Source[];
}

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'distribution',
    ordinal: '1',
    title: { en: 'Distributional guarantee on a DAG', zh: 'DAG 上的分布性保证' },
    grade: 'established',
    claim: {
      en: 'Sample x in proportion to R(x) over a DAG, without the n(x) counting bias that a naive tree-shaped or autoregressive value carries.',
      zh: '在 DAG 上按与 R(x) 成正比采样，不带朴素树形或自回归 value 所携带的 n(x) 计数偏差。',
    },
    evidence: {
      en: 'A proof, not a benchmark. Bengio 2021 Prop. 1c/2: a naive tree-shaped or autoregressive value gives π(x) ∝ n(x)·R(x), the bias grows exponentially with trajectory length, and it systematically favours larger molecules. The flow construction is what cancels that term. No measurement is needed to accept this leg, and none is on offer.',
      zh: '这是一个证明，不是一个基准。Bengio 2021 Prop. 1c/2：朴素的树形或自回归 value 给出 π(x) ∝ n(x)·R(x)，偏差随轨迹长度指数增长，并系统性偏好更大的分子。flow 构造正是消掉这一项的东西。接受这一条不需要任何实测 —— 也没有实测可给。',
    },
    evidenceProvenance: 'claimed',
    probe: {
      en: 'The theorem needs no verification. What needs verification is its precondition on a real molecular MDP: the guarantee is stated over a pointed DAG, so measure the backward reachability rate before quoting it. That is the exact measurement item 3 fails.',
      zh: '定理本身不需要验证。需要验证的是它在真实分子 MDP 上的前提：保证是在 pointed DAG 上陈述的，所以在引用它之前先测反向可达率。而这恰好是第 3 项失败的那个测量。',
    },
    boundary: {
      en: 'Graded established on the proof, not on any molecular result. An established guarantee whose precondition has never been measured buys nothing in a lab.',
      zh: '它的 established 来自证明，而不是任何分子结果。前提从未被测量的保证，在实验室里什么也买不到。',
    },
    sources: [SOURCE.bengio2021, SOURCE.foundations],
  },
  {
    id: 'offpolicy',
    ordinal: '2',
    title: { en: 'Off-policy validity', zh: 'off-policy 有效性' },
    grade: 'established',
    claim: {
      en: 'Any behaviour policy whose support covers the space trains the objective without bias, so an arbitrary external search operator can be bolted on and its samples consumed directly.',
      zh: '任意覆盖足够 support 的行为策略都能无偏地训练这个目标，于是任意外部搜索算子都能接上来，样本直接吃掉。',
    },
    evidence: {
      en: 'The one claim that is actually cashed. Bengio 2021 Prop. 3 supplies the licence, and the three strongest published results all spend it: Genetic GFN consumes a GA, S3-GFN consumes a contrastive buffer plus genetic exploration, A-GFN consumes semi-offline batches. The ablation ledger — same codebase, same protocol — says where the score lives: Genetic GFN 16.213, remove the genetic search 15.738, revert to native ε-greedy 15.626, swap STONED in for GraphGA 15.439, against Mol GA 15.686 and REINVENT 15.185. What is established, then, is that it can absorb an outside operator without bias. Not that it explores well by itself.',
      zh: '唯一真正变现的一条。Bengio 2021 Prop. 3 给出许可，而已发表的三个最强结果都在花它：Genetic GFN 吃一个 GA，S3-GFN 吃对比 buffer 加 genetic exploration，A-GFN 吃半离线批。同一 codebase、同一协议的消融账本说明分数住在哪里：Genetic GFN 16.213，去掉 genetic search 15.738，换回 GFN 原生 ε-greedy 15.626，用 STONED 代替 GraphGA 15.439，对照 Mol GA 15.686 与 REINVENT 15.185。所以被确立的是：它能无偏地吸收一个外部算子。而不是它自己探索得好。',
    },
    evidenceProvenance: 'measured',
    probe: {
      en: 'Attach the identical GA to a GFlowNet and to a KL-regularized RL baseline, one budget and one protocol, then compare the increments. If the increment survives only on the flow objective it belongs to the flow objective; if it appears on both, it belongs to the GA and the flow objective is carrying it rather than producing it.',
      zh: '把同一个 GA 分别接到 GFlowNet 与一个 KL 正则 RL 基线上，同预算同协议，再比增量。如果增量只在 flow 目标上存活，它属于 flow 目标；如果两边都出现，它属于那个 GA，flow 目标只是载着它，而不是产生它。',
    },
    boundary: {
      en: 'This is the load-bearing item of the whole audit: it is the only capability that both holds up and has already been converted into a published number.',
      zh: '这是整份审计里承重的一项：它是唯一既站得住、又已经被兑换成已发表数字的能力。',
    },
    sources: [SOURCE.bengio2021, SOURCE.geneticGfn2024, SOURCE.rtbTrustPcl2025],
  },
  {
    id: 'multipath',
    ordinal: '3',
    title: {
      en: 'Multi-path credit assignment, its only theoretical differentiator',
      zh: '多路径 credit 归因 —— 它唯一的理论差异化',
    },
    grade: 'refuted',
    claim: {
      en: 'In a multi-path environment, where many action orders reach the same molecule, the flow objective assigns credit correctly and a single-path objective cannot. This is the only place the theory claims something no RL objective already has.',
      zh: '在多路径环境里 —— 许多动作顺序到达同一个分子 —— flow 目标能正确归因 credit，而单路径目标做不到。这是理论上唯一声称拿出了 RL 目标没有的东西的地方。',
    },
    evidence: {
      en: 'Measured backwards, twice. Exactly where the multi-path correction is needed — fragment and reaction MDPs — PMO comes out at 9.918/9.918; the single-path SMILES setting, where the correction term is empty and TB degenerates into PCL, comes out at 16.213, with REINVENT at 14.196 in the same table. And the precondition itself fails under measurement: with a uniform P_B only 11.0±3.7% of backward trajectories return to s₀, and a TB-trained free P_B reaches 1.0±0.8% on held-out molecules — against MaxLikelihood 99.3±0.5% and REINFORCE 100.0±0.0%. The differentiator scores worst precisely where it is supposed to differentiate.',
      zh: '被反向测掉了两次。恰恰在需要多路径修正的地方 —— fragment 与 reaction MDP —— PMO 只有 9.918/9.918；而修正项为空、TB 退化成 PCL 的单路径 SMILES 设定是 16.213，同一张表里 REINVENT 是 14.196。且前提本身一测就崩：均匀 P_B 下只有 11.0±3.7% 的反向轨迹回到 s₀，TB 训练出的 free P_B 在 held-out 分子上是 1.0±0.8% —— 对照 MaxLikelihood 99.3±0.5% 与 REINFORCE 100.0±0.0%。这个差异化恰好在它本该差异化的地方分数最低。',
    },
    evidenceProvenance: 'refuted',
    probe: {
      en: 'Run the backward reachability rate first, ahead of any score comparison. It is a property of the environment DAG and the backward policy, so it is measurable before a single training step is taken and costs no oracle calls. With the guarantee broken there is no differentiator left to discuss: the correction term is being applied to a graph the sampler cannot walk backwards.',
      zh: '先跑反向可达率，排在任何分数对比之前。它是环境 DAG 与反向策略的性质，所以训练一步都还没跑就能测，而且不花 oracle 调用。保证不成立时，剩下的差异化无从谈起：修正项被加在一张 sampler 走不回去的图上。',
    },
    boundary: {
      en: 'Refuted applies to the differentiation claim, not to the correction algebra, which is derived correctly. The algebra is right; the graph it assumes is not there.',
      zh: 'refuted 评的是差异化主张，不是那套修正代数 —— 代数推得没错。代数是对的，它假设的那张图不在。',
    },
    sources: [SOURCE.deleu2024, SOURCE.synflownet2025, SOURCE.pmo2022],
  },
  {
    id: 'logz',
    ordinal: '4',
    title: {
      en: 'log Z: the partition function, measurable for free',
      zh: 'log Z —— 配分函数免费可测',
    },
    grade: 'demonstrated',
    claim: {
      en: 'The objective estimates a normalising constant as a by-product, so the model reports how much reward mass its own state space holds — a quantity no argmax-seeking method produces at all.',
      zh: '这个目标在副产品里估出一个归一化常数，于是模型自己报出它的状态空间里装了多少 reward 质量 —— 这是任何追 argmax 的方法根本不产出的量。',
    },
    evidence: {
      en: 'One measured use, and a sound one: SynFlowNet trains with R ≡ 1 and reads log Z off the result to size its own state space. That is a real measurement of a real quantity, obtained without an extra oracle call. It is also, as far as this audit found, the only place the free estimate has been spent on anything at all.',
      zh: '有一次实测使用，而且用得成立：SynFlowNet 令 R ≡ 1 训练，再从结果里读出 log Z 来量自己的状态空间。这是对一个真实量的真实测量，而且没多花一次 oracle 调用。而据本次审计所见，这也是那个免费估计量唯一被花在什么东西上的地方。',
    },
    evidenceProvenance: 'measured',
    probe: {
      en: 'Report log Z beside every headline score, on every run, at zero extra oracle cost. Both outcomes are worth having. If log Z tracks performance, the field gains a diagnostic no competing method can produce. If it does not track performance, then a quantity the objective is provably estimating turns out to be uninformative about the output of that same objective — and that discrepancy is itself the publishable finding.',
      zh: '在每一个头条成绩旁边报 log Z，每一次训练都报，不多花一次 oracle。两种结果都值得要：如果 log Z 与表现同步，这个领域就得到一个竞争方法都产不出的诊断量；如果不同步，那么一个目标可证明正在估计的量，对目标自己的产出竟然不提供信息 —— 那个矛盾本身就是值得发表的发现。',
    },
    boundary: {
      en: 'Demonstrated means one run, by one group, for one purpose. It is not yet evidence that the estimate is useful — only that it is obtainable.',
      zh: 'demonstrated 的意思是：一次运行、一个课题组、一个用途。它还不构成「这个估计有用」的证据，只构成「这个估计拿得到」。',
    },
    sources: [SOURCE.synflownet2025, SOURCE.foundations],
  },
  {
    id: 'entropy',
    ordinal: '5',
    title: {
      en: 'Entropy, mutual information, Pareto sampling',
      zh: '熵 / 互信息 / Pareto 采样',
    },
    grade: 'untested',
    claim: {
      en: 'Because a trained flow is a distribution rather than a maximiser, entropies, conditional mutual information and Pareto-front sampling over several objectives are all readable off it. That is batch experimental design, not candidate ranking.',
      zh: '因为训练好的 flow 是一个分布而不是一个最大化器，所以熵、条件互信息、以及多目标上的 Pareto 前沿采样都能从它身上读出来。那是批量实验设计，不是候选排序。',
    },
    evidence: {
      en: 'None. The constructions are written into GFlowNet Foundations as framework capabilities, and the molecular literature has essentially not used them: this audit found no molecular paper that spends the mutual-information or Pareto machinery on an actual design decision. The theoretically strongest face of the framework has never been examined — which is a different situation from having been examined and found wanting.',
      zh: '没有。这些构造作为框架能力写在 GFlowNet Foundations 里，而分子文献基本没用过它们：本次审计没有找到任何一篇把互信息或 Pareto 机制花在一个真实设计决策上的分子论文。这个框架理论上最强的一面从未被检验 —— 这和被检验过并且不行，是两种完全不同的处境。',
    },
    evidenceProvenance: 'claimed',
    probe: {
      en: 'Take one real MPO task, use the trained flow for batch experimental design — pick the batch of maximum joint information instead of the top-k by predicted score — and compare hit rate per assay plate against plain top-k under a matched budget. This is the cheapest unexamined claim on the list: no new theory, no new oracle, only machinery that is already published.',
      zh: '拿一个真实 MPO 任务，用训练好的 flow 做批量实验设计 —— 选联合信息量最大的批次，而不是按预测分数取 top-k —— 再在匹配预算下比较每块测试板的命中率与普通 top-k。这是清单上最便宜的未检验主张：不需要新理论，不需要新 oracle，只需要已经发表的那套机制。',
    },
    boundary: {
      en: 'Untested is not a soft refuted. It is the one grade on this list that a single well-run experiment can change in either direction.',
      zh: 'untested 不是温和版的 refuted。它是这张清单上唯一一个：一次跑好的实验就能把它推向任意一个方向。',
    },
    sources: [SOURCE.foundations, SOURCE.bengio2021],
  },
  {
    id: 'fixed-budget',
    ordinal: '6',
    title: { en: 'Molecule quality under a fixed budget', zh: '固定预算下的分子质量' },
    grade: 'refuted',
    claim: {
      en: 'Given the same number of oracle calls, it returns better and more diverse molecules than the incumbent methods. This is the claim the slides lead with.',
      zh: '在同样的 oracle 调用数下，它返回比现有方法更好、更多样的分子。这是 slide 上打头的那个主张。',
    },
    evidence: {
      en: 'Refuted on four independent protocols. PMO under a fixed budget: 9.131, rank 16/25, against REINVENT 14.196 at 1/25, GFlowNet-AL 8.406 at 22/25, and a random draw from ZINC-250k at 8.635, rank 19/25. Budget-matched with a diversity filter applied to every entrant and scored by #Circles(D=0.7): 0/0 diverse hits on DRD2/JNK3, against 21/15 for random virtual screening and 81/176 for AugMemory. Saturn reaches QED 0.70 vs 0.23, SA 2.11 vs 2.83 and AiZynthFinder 0.91 vs 0.65 on 1,000 oracle calls against RGFN 400,000 — a ratio of 1/400. SynGA/SynGBO matches the GFN family on mean Vina, −10.80/−11.11 against −10.88 down to −9.20, on 16,000 calls against 64,000.',
      zh: '在四套互相独立的协议上被否证。固定预算下的 PMO：9.131，排 16/25，对照 REINVENT 14.196 排 1/25、GFlowNet-AL 8.406 排 22/25、从 ZINC-250k 随机抽取 8.635 排 19/25。预算匹配、每个参赛者都加多样性过滤、并用 #Circles(D=0.7) 计分：DRD2/JNK3 上的多样命中是 0/0，对照随机虚拟筛选 21/15、AugMemory 81/176。Saturn 用 1,000 次 oracle 调用打 RGFN 的 400,000 —— 1/400 的比例 —— QED 0.70 对 0.23、SA 2.11 对 2.83、AiZynthFinder 0.91 对 0.65。SynGA/SynGBO 用 16,000 次调用打平 GFN 家族的 64,000，平均 Vina −10.80/−11.11 对 −10.88 至 −9.20。',
    },
    evidenceProvenance: 'refuted',
    probe: {
      en: 'Nothing. This is the one item on the list that needs no further experiment: four protocols, four independent groups, one direction. What it needs is for the claim to stop being made — every slide that still leads with fixed-budget molecule quality is spending credibility that items 4 and 5 need in order to get funded.',
      zh: '不需要。这是清单上唯一不需要更多实验的一项：四套协议、四个独立课题组、同一个方向。它需要的是这个主张停止被提出 —— 每一张还拿固定预算分子质量当卖点的 slide，都在花掉第 4、5 项拿预算所需要的可信度。',
    },
    probeSettled: true,
    boundary: {
      en: 'The #Circles axiomatisation is cited for the metric, not for the verdict: IntDiv satisfies Dissimilarity but violates Monotonicity and Subadditivity, and #Circles is the only measure satisfying all three — that paper does not test GFlowNet at all. The 0/0 comes from the budget-matched comparison, which does.',
      zh: '#Circles 的公理化是为指标引用的，不是为判决引用的：IntDiv 满足 Dissimilarity，却违反 Monotonicity 与 Subadditivity，而 #Circles 是唯一同时满足三条的度量 —— 那篇论文根本没有测试 GFlowNet。0/0 出自那份预算匹配的对比，它测了。',
    },
    sources: [SOURCE.pmo2022, SOURCE.renz2024, SOURCE.xie2023, SOURCE.saturn, SOURCE.synga2026],
  },
];

/* ══ what would change my mind ═══════════════════════════════════════════ */

const MIND_TITLE: LText = { en: 'What would change my mind', zh: '什么会让我改主意' };

const MIND_LEDE: LText = {
  en: 'Four observable events. Any one of them lands and the grades above have to be re-cut. None of the four has been observed as of this memo. They are written as events rather than as arguments so that nobody has to take this audit on trust.',
  zh: '四个可观测事件。其中任何一个落地，上面的评级就必须重划。截至本备忘录，四个都未被观测到。它们写成事件而不是论证，这样谁也不必对这份审计报以信任。',
};

interface MindTrigger {
  id: string;
  letter: string;
  head: LText;
  body: LText;
}

const MIND_TRIGGERS: readonly MindTrigger[] = [
  {
    id: 'both-axes',
    letter: 'a',
    head: { en: 'both axes won at once, budget-matched', zh: '预算匹配下同时赢两条轴' },
    body: {
      en: 'A budget-matched comparison, scored by #Circles rather than IntDiv, in which a GFlowNet wins potency and diversity at the same time. Winning one while the other collapses is the result already on record.',
      zh: '一次预算匹配、用 #Circles 而不是 IntDiv 计分的对比，其中 GFlowNet 同时赢下 potency 与多样性。赢一条而另一条崩掉，是已经在案的结果。',
    },
  },
  {
    id: 'reachability',
    letter: 'b',
    head: { en: 'backward reachability repaired above 95%', zh: '反向可达率被修到 95% 以上' },
    body: {
      en: 'Backward reachability on a real reaction MDP repaired above 95% with no drop in score. Repairing it by shrinking the action space until the graph is nearly a tree does not count: that removes the multi-path setting the correction exists for.',
      zh: '真实 reaction MDP 上的反向可达率被修到 95% 以上，且分数不降。靠缩小动作空间把图压成近似一棵树来修，不算：那等于把修正项赖以存在的多路径设定拿掉了。',
    },
  },
  {
    id: 'first-assay',
    letter: 'c',
    head: { en: 'the first molecule synthesized and assayed', zh: '第一个被合成并测活的分子' },
    body: {
      en: 'One molecule designed by any GFlowNet method, synthesized, and assayed. The count today is 0, and it is 0 across every method in this audit, so the first one is a genuine event rather than an increment.',
      zh: '任何 GFlowNet 方法设计、被合成、并被测活的分子，一个就够。今天的计数是 0，而且在本次审计涵盖的每一个方法上都是 0，所以第一个是一个真正的事件，而不是一个增量。',
    },
  },
  {
    id: 'real-oracle',
    letter: 'd',
    head: { en: 'the increment reproduced on a real oracle', zh: '在真实 oracle 上复现出增量' },
    body: {
      en: 'The flow objective reproducing its increment over KL-regularized RL on a real oracle rather than a proxy. Since RTB has been shown equivalent to Trust-PCL and KL-regularized RL methods are reported to achieve comparable performance, a proxy-only increment is consistent with there being no increment at all.',
      zh: 'flow 目标在真实 oracle 而不是 proxy 上复现出它相对 KL 正则 RL 的增量。既然 RTB 已被证明等价于 Trust-PCL，而 KL 正则 RL 方法被报告为表现相当，那么只在 proxy 上存在的增量，与根本没有增量是相容的。',
    },
  },
];

/* ══ the first-hand run ══════════════════════════════════════════════════ */

const CASE_KICKER: LText = { en: 'First-hand run · 2026-08-30', zh: '一手实测 · 2026-08-30' };

const CASE_TITLE: LText = { en: 'A wrong loss still goes down', zh: '写错了 loss，照样下降' };

const CASE_STANDFIRST: LText = {
  en: 'The worry behind item 3 — that the objective cannot tell you when its own reward has been wired backwards — stopped being a worry on 2026-08-30. It is now a measurement.',
  zh: '第 3 项背后的那个担忧 —— 目标无法告诉你它自己的 reward 被反接了 —— 在 2026-08-30 不再是担忧。它现在是一个测量。',
};

interface RunFact {
  id: string;
  label: LText;
  value: LText | string;
  /** The one row that voids the green exit code. */
  alarm?: boolean;
}

const RUN_LEDGER: readonly RunFact[] = [
  { id: 'suite', label: { en: 'test suite', zh: '测试套件' }, value: '1897 pass / 28 broken / 1925 total' },
  { id: 'wall', label: { en: 'wall clock', zh: '墙上时间' }, value: '55m54s' },
  { id: 'exit', label: { en: 'exit code', zh: '退出码' }, value: '0' },
  { id: 'fail', label: { en: 'failures / errors', zh: 'failure / error' }, value: '0 / 0' },
  {
    id: 'rdkit',
    label: { en: 'RDKit assertions', zh: 'RDKit 断言' },
    value: { en: 'skipped · GFLOWNET_TEST_RDKIT unset', zh: '跳过 · GFLOWNET_TEST_RDKIT 未设' },
    alarm: true,
  },
  {
    id: 'docking',
    label: { en: 'docking test, RDKit on', zh: '打开 RDKit 后的 docking 测试' },
    value: 'test_docking.jl · 10 / 18 assertions fail',
    alarm: true,
  },
];

const CASE_BODY: readonly LText[] = [
  {
    en: 'The repository is danielchen26/Gflownet on Julia 1.11.6. The full test/runtests.jl was cloned and run end to end: 1897 pass, 28 broken, 1925 total, 55m54s, exit 0, zero failures and zero errors. On that evidence the implementation is healthy.',
    zh: '仓库是 danielchen26/Gflownet，Julia 1.11.6。整套 test/runtests.jl 被 clone 下来完整跑完：1897 pass、28 broken、1925 total，55m54s，exit 0，零 failure 零 error。就这份证据看，这个实现是健康的。',
  },
  {
    en: 'It is not, and the run itself says why: the RDKit assertions never executed, because GFLOWNET_TEST_RDKIT was not set to true. The green exit code covers everything except the chemistry. The repository records what happens when that switch is turned on — test/applications/molecular/test_docking.jl fails 10 of its 18 assertions and exposes an inverted exponent sign in sigmoid_normalize.',
    zh: '它不是，而这次运行本身就说出了原因：RDKit 断言从未执行，因为 GFLOWNET_TEST_RDKIT 没有被设为 true。那个绿色退出码覆盖了除化学以外的一切。仓库自己记录了把这个开关打开会发生什么 —— test/applications/molecular/test_docking.jl 的 18 条断言里有 10 条失败，暴露出 sigmoid_normalize 里指数符号写反了。',
  },
  {
    en: 'The consequence is not cosmetic. A −12 kcal/mol strong binder normalizes to 0.047, and a +5 kcal/mol non-binder normalizes to 0.996 — exactly inverted against the documented contract. And proxy_dock feeds that value straight into the reward vector being maximized. Every docking-conditioned training run in that configuration was rewarding non-binding, and the loss went down the whole way.',
    zh: '后果不是表面的。−12 kcal/mol 的强结合物被归一化成 0.047，+5 kcal/mol 的非结合物被归一化成 0.996 —— 与文档契约完全相反。而 proxy_dock 把这个值直接喂进正在被最大化的 reward 向量。在这个配置下，每一次 docking 条件下的训练都在奖励「不结合」，而 loss 一路在下降。',
  },
  {
    en: 'The same repository already ships backward_parent_states and is_valid_backward_transition, so the primitives for a structural check are present. Every validator built on them, validate_flow_conservation(model, state) among them, runs after training and depends on the model. There is no pre-training check that looks only at the environment DAG — which is precisely the missing check item 3 asks for.',
    zh: '同一个仓库里已经有 backward_parent_states 与 is_valid_backward_transition，所以做结构检查的原语是齐的。而建在它们之上的校验器 —— 包括 validate_flow_conservation(model, state) —— 全部是训练之后跑、并且依赖 model 的。没有任何训练前、只看环境 DAG 结构的检查 —— 而这恰好就是第 3 项要的那个缺失的检查。',
  },
];

const CASE_CONCLUSION: LText = {
  en: 'This is not a defect of one Julia implementation. It is a measured instance of a class of check the whole field is missing, and it surfaced only because someone stepped past the skip.',
  zh: '这不是某一个 Julia 实现的缺陷。它是整个领域都缺的一类检查的实测例证 —— 而它之所以浮出水面，只是因为有人跳开了那个 skip。',
};

/* ══ the verdict, itemised ═══════════════════════════════════════════════ */

const CLOSE_TITLE: LText = { en: 'The verdict, itemised', zh: '判决，分项给出' };

const CLOSE_LEDE: LText = {
  en: 'Three verdicts, because there are three different questions and they have three different answers. One answer to "is it promising" would have to be wrong about two of them.',
  zh: '三个判决，因为这里是三个不同的问题，而它们有三个不同的答案。对「是不是 promising」只给一个答案，就必然在其中两个上是错的。',
};

interface Verdict {
  id: string;
  tone: 'kept' | 'refuted' | 'open';
  role: LText;
  head: LText;
  body: LText;
  items: string;
}

const VERDICTS: readonly Verdict[] = [
  {
    id: 'as-sampler',
    tone: 'kept',
    role: { en: 'As a theory of sampling', zh: '作为采样器理论' },
    head: { en: 'Promising, and already delivered', zh: 'promising，而且已经落实' },
    body: {
      en: 'Items 1 and 2 are established. The distributional guarantee is proved rather than argued, and off-policy validity is the licence that every strongest published result actually spends. Neither of the two is in dispute anywhere in this audit.',
      zh: '第 1、2 项是 established。分布性保证是被证明的而不是被论证的，而 off-policy 有效性正是每一个最强已发表结果真正在花的那张许可。这两条在本次审计的任何地方都没有争议。',
    },
    items: '1 · 2',
  },
  {
    id: 'as-generator',
    tone: 'refuted',
    role: {
      en: 'As a molecule generator under a fixed budget',
      zh: '作为固定预算下的分子生成器',
    },
    head: { en: 'Not promising, and measurably refuted', zh: '不 promising，而且已被实测否证' },
    body: {
      en: 'Item 6 is not an open question waiting on a better experiment. Four independent protocols answered it in one direction, and item 3 explains why: the one differentiator that could have carried this claim fails exactly in the multi-path setting it was built for.',
      zh: '第 6 项不是一个等着更好实验的开放问题。四套独立协议已经在同一个方向上回答了它，而第 3 项解释了原因：本可以扛起这个主张的那个唯一差异化，恰好在它为之而生的多路径设定里失效。',
    },
    items: '3 · 6',
  },
  {
    id: 'as-inference',
    tone: 'open',
    role: { en: 'As a measurable inference engine', zh: '作为可测量的推断引擎' },
    head: {
      en: 'Neither confirmed nor refuted, because nobody has tried',
      zh: '既没被证实也没被否证，因为根本没人试',
    },
    body: {
      en: 'Items 4 and 5 — log Z read off for free, and entropy, mutual information and Pareto sampling read off a distribution — carry one measured use and zero measured uses respectively. This is the only genuinely open question on the list. It is therefore also the only one worth a budget.',
      zh: '第 4、5 项 —— 免费读出的 log Z，以及从一个分布上读出的熵、互信息与 Pareto 采样 —— 分别只有一次实测使用和零次实测使用。这是清单上唯一真正开放的问题。因此它也是唯一值得给预算的问题。',
    },
    items: '4 · 5',
  },
];

/* ══ render ══════════════════════════════════════════════════════════════ */

const LEG_LABEL = {
  claim: { en: 'Claims to bring', zh: '声称带来什么' },
  evidence: { en: 'Known evidence', zh: '已知证据' },
  probe: { en: 'What would settle it', zh: '什么实验能定下来' },
  settled: { en: 'Already settled', zh: '已经定下来了' },
} as const satisfies Record<string, LText>;

/** Grade → the epistemic status of the *audit verdict*, used for the dot on the
 *  grade badge. Kept separate from each item's `evidenceProvenance`. */
const GRADE_PROVENANCE: Record<Grade, Provenance> = {
  established: 'measured',
  demonstrated: 'measured',
  untested: 'claimed',
  refuted: 'refuted',
};

export function PromiseAudit({ className }: { className?: string }) {
  const { lang } = useLang();

  const tally = GRADE_ORDER.map((grade) => ({
    grade,
    count: CAPABILITIES.filter((cap) => cap.grade === grade).length,
  }));

  return (
    <div className={className ? `paudit ${className}` : 'paudit'}>
      {/* ── how the audit is scored ─────────────────────────────────── */}
      <section className="paudit__lede" aria-labelledby="paudit-lede">
        <span className="paudit__kicker">{t(LEDE_KICKER, lang)}</span>
        <h3 className="paudit__ledeTitle u-display" id="paudit-lede">
          {t(AUDIT_TITLE, lang)}
        </h3>
        {LEDE.map((para) => {
          const text = t(para, lang);
          return (
            <p className="paudit__ledeBody" key={text.slice(0, 24)}>
              {text}
            </p>
          );
        })}

        <h4 className="paudit__legendTitle">{t(LEGEND_TITLE, lang)}</h4>
        <ul className="paudit__legend">
          {tally.map(({ grade, count }) => (
            <li className="paudit__legendItem" data-grade={grade} key={grade}>
              <span className="paudit__legendToken">
                <ProvenanceDot provenance={GRADE_PROVENANCE[grade]} size="sm" decorative />
                {grade}
              </span>
              <span className="paudit__legendGloss">{t(GRADE_GLOSS[grade], lang)}</span>
              <span className="paudit__legendCount">
                {lang === 'zh' ? `${count} 项` : `${count} of 6`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── the six capabilities ───────────────────────────────────── */}
      <ol className="paudit__items">
        {CAPABILITIES.map((cap) => (
          <li className="paudit__item" data-grade={cap.grade} key={cap.id}>
            <header className="paudit__itemHead">
              <span className="paudit__ordinal u-display" aria-hidden="true">
                {cap.ordinal}
              </span>
              <h4 className="paudit__itemTitle u-display">{t(cap.title, lang)}</h4>
              <span className="paudit__grade">
                <ProvenanceDot
                  provenance={GRADE_PROVENANCE[cap.grade]}
                  size="sm"
                  detail={GRADE_GLOSS[cap.grade]}
                />
                {cap.grade}
              </span>
            </header>

            {/* Only the evidence dot is a tab stop. The claim and probe legs are
                always `claimed` and their labels already say so in words, so
                they are decorative per ProvenanceDot's contract rather than
                twelve extra focus stops. */}
            <div className="paudit__triple">
              <div className="paudit__leg" data-leg="claim">
                <span className="paudit__legLabel">
                  <ProvenanceDot provenance="claimed" size="sm" decorative />
                  {t(LEG_LABEL.claim, lang)}
                </span>
                <p className="paudit__legBody">{t(cap.claim, lang)}</p>
              </div>

              <div className="paudit__leg" data-leg="evidence">
                <span className="paudit__legLabel">
                  <ProvenanceDot provenance={cap.evidenceProvenance} size="sm" detail={cap.title} />
                  {t(LEG_LABEL.evidence, lang)}
                </span>
                <p className="paudit__legBody">{t(cap.evidence, lang)}</p>
              </div>

              <div className="paudit__leg" data-leg="probe" data-settled={cap.probeSettled ?? false}>
                <span className="paudit__legLabel">
                  {cap.probeSettled === true ? null : (
                    <ProvenanceDot provenance="claimed" size="sm" decorative />
                  )}
                  {t(cap.probeSettled === true ? LEG_LABEL.settled : LEG_LABEL.probe, lang)}
                </span>
                <p className="paudit__legBody">{t(cap.probe, lang)}</p>
              </div>
            </div>

            {cap.boundary !== undefined && (
              <p className="paudit__boundary">{t(cap.boundary, lang)}</p>
            )}

            <div className="paudit__cites">
              {cap.sources.map((source) => (
                <SourceCite className="paudit__cite" source={source} key={source.url} />
              ))}
            </div>
          </li>
        ))}
      </ol>

      {/* ── what would change my mind ──────────────────────────────── */}
      <section className="paudit__mind" aria-labelledby="paudit-mind">
        <h3 className="paudit__mindTitle u-display" id="paudit-mind">
          <ProvenanceDot provenance="claimed" size="sm" detail={MIND_TITLE} />
          {t(MIND_TITLE, lang)}
        </h3>
        <p className="paudit__mindLede">{t(MIND_LEDE, lang)}</p>
        <ol className="paudit__mindList">
          {MIND_TRIGGERS.map((trigger) => (
            <li className="paudit__mindItem" key={trigger.id}>
              <span className="paudit__mindLetter" aria-hidden="true">
                {trigger.letter}
              </span>
              <div className="paudit__mindText">
                <h4 className="paudit__mindHead">{t(trigger.head, lang)}</h4>
                <p className="paudit__mindBody">{t(trigger.body, lang)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── the first-hand run ─────────────────────────────────────── */}
      <section className="paudit__case" aria-labelledby="paudit-case">
        <span className="paudit__kicker" data-tone="measured">
          {t(CASE_KICKER, lang)}
        </span>
        <h3 className="paudit__caseTitle u-display" id="paudit-case">
          <ProvenanceDot provenance="measured" size="sm" detail={CASE_KICKER} />
          {t(CASE_TITLE, lang)}
        </h3>
        <p className="paudit__caseStandfirst">{t(CASE_STANDFIRST, lang)}</p>

        <dl className="paudit__ledger">
          {RUN_LEDGER.map((fact) => (
            <div className="paudit__ledgerRow" data-alarm={fact.alarm ?? false} key={fact.id}>
              <dt className="paudit__ledgerLabel">{t(fact.label, lang)}</dt>
              <dd className="paudit__ledgerValue u-mono">{t(fact.value, lang)}</dd>
            </div>
          ))}
        </dl>

        {CASE_BODY.map((para) => {
          const text = t(para, lang);
          return (
            <p className="paudit__caseBody" key={text.slice(0, 24)}>
              {text}
            </p>
          );
        })}

        <p className="paudit__caseConclusion">{t(CASE_CONCLUSION, lang)}</p>
        <SourceCite className="paudit__cite" source={SOURCE.gflownetJlRun} />
      </section>

      {/* ── the verdict, itemised ──────────────────────────────────── */}
      <section className="paudit__close" aria-labelledby="paudit-close">
        <h3 className="paudit__closeTitle u-display" id="paudit-close">
          {t(CLOSE_TITLE, lang)}
        </h3>
        <p className="paudit__closeLede">{t(CLOSE_LEDE, lang)}</p>
        <ol className="paudit__verdicts">
          {VERDICTS.map((verdict) => (
            <li className="paudit__verdict" data-tone={verdict.tone} key={verdict.id}>
              <div className="paudit__verdictHead">
                <span className="paudit__verdictRole">{t(verdict.role, lang)}</span>
                <span className="paudit__verdictItems u-mono" aria-hidden="true">
                  {verdict.items}
                </span>
              </div>
              <p className="paudit__verdictCall">{t(verdict.head, lang)}</p>
              <p className="paudit__verdictBody">{t(verdict.body, lang)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
