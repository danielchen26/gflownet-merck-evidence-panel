import type { Provenance, Source } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import { SourceCite } from './SourceCite';
import './PlatformStack.css';

/* ══ the forward question ════════════════════════════════════════════════
 * Every other section asks whether GFlowNet is good. This one assumes the
 * reader is building the strongest molecular generation platform available in
 * 2026 and asks what each of the four layers should be, why, and which single
 * square GFlowNet occupies. Three rules hold it honest:
 *
 *   1. A pick is always `claimed`. Nothing in this shape has been built, so no
 *      selection may borrow the colour of measurement — only the evidence it
 *      is argued from is `measured`.
 *   2. Every layer must name its interface. Without a boundary the layers
 *      cannot be swapped, and "organic integration" is a diagram rather than
 *      a property.
 *   3. Every layer must name its own ceiling, including the layer the pick
 *      favours. A recommendation without a ceiling is advocacy.
 * ═══════════════════════════════════════════════════════════════════════ */

/** URLs, venues and titles are carried verbatim from the source dictionary in
 *  data/evidence.ts; `firsthand` follows that dictionary, never widened. */
const SOURCE = {
  merckBlog: {
    title:
      'Generative AI to Design Small Molecule Therapeutics: Lessons from a Stanford/Merck collaboration',
    venue: 'Swanson, Zou, Chiriac, Cheng — Discovery Chemistry, Merck & Co. · 2026-04-27',
    url: 'https://swansonkyle.com/blog/synthemol-merck',
    firsthand: true,
  },
  boltz2: {
    title: 'Boltz-2: Towards Accurate and Efficient Binding Affinity Prediction',
    venue: 'MIT / Recursion, 2025-06 · code and weights both MIT',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12262699/',
    firsthand: true,
  },
  boltzmol1: {
    title: 'BoltzMol-1 Technical Report',
    venue: 'Boltz.bio, 2026',
    url: 'https://boltz.bio/boltzmol1-technical-report.pdf',
    firsthand: false,
  },
  synflownet: {
    title: 'SynFlowNet: Design of Diverse and Novel Molecules with Synthesis Constraints',
    venue: 'ICLR 2025 · arXiv 2405.01155',
    url: 'https://arxiv.org/abs/2405.01155',
    firsthand: false,
  },
  s3gfn: {
    title: 'Synthesizable Molecular Generation via Soft-constrained GFlowNets (S3-GFN)',
    venue: 'Kim, …, Y. Bengio, Hernandez-Garcia, 2026-02',
    url: 'https://arxiv.org/abs/2602.04119',
    firsthand: true,
  },
  aiddison: {
    title: 'AIDDISON™: A Software-as-a-Service Platform for AI-Driven Small Molecule Drug Discovery',
    venue: 'Merck KGaA, 2023-12 · SYNTHIA rule and starting-material counts',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10777390/',
    firsthand: true,
  },
  tiapkin: {
    title: 'Generative Flow Networks as Entropy-Regularized RL',
    venue: 'Tiapkin, Morozov, Naumov, Vetrov — AISTATS 2024 (Oral)',
    url: 'https://arxiv.org/abs/2310.12934',
    firsthand: false,
  },
  deleu2024: {
    title: 'Discrete Probabilistic Inference as Control in Multi-path Environments',
    venue: 'Deleu, Nouri, Malkin, Precup, Y. Bengio — UAI 2024, PMLR 244:997–1021',
    url: 'https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf',
    firsthand: false,
  },
  rtb: {
    title: 'Relative Trajectory Balance ≡ Trust-PCL (off-policy KL-regularised RL)',
    venue: 'Deleu, Nouri, Y. Bengio, Precup, 2025-09',
    url: 'https://arxiv.org/abs/2509.01632',
    firsthand: false,
  },
  pmo: {
    title: 'Sample Efficiency Matters: A Benchmark for Practical Molecular Optimization',
    venue: 'Gao, Fu, Sun, Coley — NeurIPS 2022',
    url: 'https://arxiv.org/pdf/2206.12411v2',
    firsthand: true,
  },
  geneticGfn: {
    title: 'Genetic-guided GFlowNets for Sample Efficient Molecular Optimization',
    venue: 'Kim et al. — NeurIPS 2024 · ablation ledger, same codebase and protocol',
    url: 'https://arxiv.org/abs/2402.05961',
    firsthand: true,
  },
  bengio2021: {
    title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation',
    venue: 'E. Bengio et al., NeurIPS 2021 · Proposition 3 (off-policy validity)',
    url: 'https://arxiv.org/abs/2106.04399',
    firsthand: false,
  },
  synga: {
    title: 'A Genetic Algorithm for Navigating Synthesizable Molecular Spaces (SynGA / SynGBO)',
    venue: 'Lo, Coley, Matusik — ICLR 2026 · 16,000 against 64,000 oracle calls',
    url: 'https://proceedings.iclr.cc/paper_files/paper/2026/file/3f61ff6252d38ea099cea2246cec7fa6-Paper-Conference.pdf',
    firsthand: true,
  },
  saturn: {
    title: 'Saturn: Sample-efficient Generative Molecular Design using Memory Manipulation',
    venue: 'Guo & Schwaller, 2024 · 1,000 oracle calls against RGFN at 400,000',
    url: 'https://arxiv.org/abs/2405.17066',
    firsthand: false,
  },
  recursionRepo: {
    title: 'recursionpharma/gflownet (MIT, default branch trunk)',
    venue: 'repository state read through the GitHub API, 2026-08-27',
    url: 'https://github.com/recursionpharma/gflownet',
    firsthand: true,
  },
  torchgfn: {
    title: 'GFNOrg/torchgfn — 52 open issues, self-described as being for fast prototyping',
    venue: 'repository state and README read through the GitHub API, 2026-08-27',
    url: 'https://github.com/GFNOrg/torchgfn',
    firsthand: true,
  },
  juliaRegistry: {
    title: 'JuliaRegistries/General',
    venue:
      'path probe of GFlowNet / GFlowNets / GenerativeFlowNetworks — all three 404, re-checked 2026-08-30',
    url: 'https://github.com/JuliaRegistries/General',
    firsthand: true,
  },
} satisfies Record<string, Source>;

/* ══ ① the thesis ════════════════════════════════════════════════════════ */

const KICKER: LText = { en: 'The selection problem', zh: '选型问题' };

const THESIS_TITLE: LText = {
  en: 'The strongest platform is four separate picks held together by four stable interfaces',
  zh: '最强的平台是四个分开的选型，被四个稳定接口缝在一起',
};

const THESIS: readonly LText[] = [
  {
    en: 'Nothing here asks whether GFlowNet is good. This section takes the other question: assume the goal is to assemble the strongest molecular generation platform available in 2026 — what should each of the four layers be, why, which single square does GFlowNet occupy, and what is the interface between one layer and the next? A platform is not the winner of a method contest. It is four choices made separately, connected by boundaries narrow enough to survive being reconnected.',
    zh: '这里不问 GFlowNet 好不好。本节接的是另一个问题：假定目标是搭出 2026 能搭出的最强分子生成平台 —— 四层各自应该选什么、为什么、GFlowNet 占的是哪一格、层与层之间的接口又是什么？平台不是方法竞赛的冠军，而是四个分开做出的选择，被窄到能反复重连的边界连起来。',
  },
  {
    en: 'The reason the field cannot answer that today is that almost every published comparison moves two layers at once. Hold the sampler fixed and change only the MDP: independent AiZynthFinder success moves from 0% to 62%. Hold the MDP fixed and change only the sampler: a GA matches the whole GFlowNet family on 16,000 oracle calls against 64,000, and an RL method wins outright on 1/400 of the budget. Both effects are large and both are real, and a paper that moves both at once can attribute neither.',
    zh: '领域今天答不出这个问题，原因是几乎每篇已发表的对比都同时动两层。固定 sampler、只换 MDP：独立 AiZynthFinder 成功率从 0% 走到 62%。固定 MDP、只换 sampler：一个 GA 用 16,000 次 oracle 调用打平整个 GFlowNet 家族的 64,000 次，一个 RL 方法用 1/400 的预算全面胜出。两个效应都很大、都真实，而同时动两层的论文对哪一个都无法归因。',
  },
];

interface Chip {
  /** Already formatted; numbers, units and method names are never translated. */
  value: string;
  note: LText;
  source: Source;
}

const THESIS_CHIPS: readonly Chip[] = [
  {
    value: '0% → 62%',
    note: {
      en: 'sampler fixed, MDP swapped: success rate under an independent AiZynthFinder check',
      zh: '固定 sampler、换 MDP：独立 AiZynthFinder 检查下的成功率',
    },
    source: SOURCE.synflownet,
  },
  {
    value: '16,000 vs 64,000',
    note: {
      en: 'MDP fixed, sampler swapped: SynGA and SynGBO reach mean Vina −10.80 and −11.11 on 16,000 oracle calls, against −10.88 to −9.20 for the GFlowNet family on 64,000',
      zh: '固定 MDP、换 sampler：SynGA 与 SynGBO 用 16,000 次 oracle 调用拿到平均 Vina −10.80 与 −11.11，而 GFlowNet 家族用 64,000 次是 −10.88…−9.20',
    },
    source: SOURCE.synga,
  },
  {
    value: '1,000 vs 400,000',
    note: {
      en: 'same axis, sharper: Saturn against RGFN at 1/400 of the budget — QED 0.70 vs 0.23, SA 2.11 vs 2.83, AiZynthFinder 0.91 vs 0.65',
      zh: '同一个轴，更锋利：Saturn 对 RGFN，预算是 1/400 —— QED 0.70 vs 0.23、SA 2.11 vs 2.83、AiZynthFinder 0.91 vs 0.65',
    },
    source: SOURCE.saturn,
  },
];

/* ══ ② the four picks ════════════════════════════════════════════════════ */

const PICKS_TITLE: LText = {
  en: 'Four layers, four picks, four interfaces',
  zh: '四层、四个选型、四个接口',
};

const PICKS_LEDE: LText = {
  en: 'Read from the base up: the oracle first, because every layer above it only optimises whatever it says. Each card carries the same five fields, and the interface field is the load-bearing one — a pick without a boundary cannot be swapped, and a stack that cannot be swapped is not a platform.',
  zh: '自下而上读：先看 oracle，因为上面每一层都只是在优化它说的话。每张卡片有同样的五个字段，而接口字段是承重的那一个 —— 没有边界的选型换不掉，而换不掉的栈不叫平台。',
};

interface LayerPick {
  id: string;
  name: LText;
  duty: LText;
  /** Always claimed: this is the recommendation, not a result. */
  pick: LText;
  /** Always measured: the evidence the recommendation is argued from. */
  why: LText;
  /** Signatures are code, so they are never translated. */
  signature: readonly string[];
  /** Which direction the contract faces. */
  facing: LText;
  interfaceNote: LText;
  ceiling: LText;
  ceilingProvenance: Provenance;
  /** Plain strings only where every token is a number, a unit or a proper
   *  noun; a prefix carrying prose is bilingual like everything else. */
  cites: readonly { prefix: LText | string; source: Source }[];
  /** L3 only: the one square GFlowNet occupies. */
  gfn?: boolean;
}

const LAYERS: readonly LayerPick[] = [
  {
    id: 'L1',
    name: { en: 'Oracle', zh: 'Oracle（打分预言机）' },
    duty: {
      en: 'Defines what "good" means, and therefore caps the whole stack. Swapping the sampler cannot move it.',
      zh: '定义什么算“好”，因此为整个栈定上限。换 sampler 动不了它。',
    },
    pick: {
      en: 'Boltz-2 as the structure-derived scoring backbone, kept beside the in-house potency predictor rather than replacing it. Boltz-2 is MIT for both code and weights, comes close to FEP accuracy on the FEP+ benchmark, and runs more than 1000× faster — which is the only reason a structure-derived term is affordable inside a generative loop at all.',
      zh: '选 Boltz-2 作结构依据的打分主干，与内部 potency predictor 并存而不是取代它。Boltz-2 的代码与权重均为 MIT，在 FEP+ 基准上接近 FEP 精度，速度快 1000× 以上 —— 这是结构依据的打分项在生成循环里根本负担得起的唯一原因。',
    },
    why: {
      en: 'The Merck & Co. Program 1 run is the argument. The potency predictor reads R² 0.66 ± 0.03 and the docking predictor R² 0.76 ± 0.01. Of 12,796 generated molecules, 0 satisfied both thresholds at once. 111 were synthesised and assayed, returning 4 compounds under 10 μM IC₅₀ — 3.6% — against 95 single-digit nM compounds already sitting in the historical library. A six-parameter MPO with dynamic weights collapsed onto a single species and the team abandoned joint optimisation. Every one of those numbers is set here, not above.',
      zh: 'Merck & Co. Program 1 那次运行就是论据。potency predictor 是 R² 0.66 ± 0.03，docking predictor 是 R² 0.76 ± 0.01。12,796 个生成分子里，同时满足双阈值的有 0 个。111 个被合成测活，返回 4 个 IC₅₀ < 10 μM 的化合物 —— 3.6% —— 而历史库里本来就躺着 95 个单位数 nM 的化合物。六参数动态权重 MPO 坍缩到单一物种，团队放弃了联合优化。上面每一个数字都由这一层定，不由更上层定。',
    },
    signature: ['score(smiles) → Float64'],
    facing: { en: 'exposed upward', zh: '向上暴露' },
    interfaceNote: {
      en: 'One function, one return type, no knowledge of its caller. That is the entire contract, and it is why a scoring component can be replaced without touching anything above it. BoltzMol-1 shows how far this layer carries on its own: oracle plus catalogue purchase only, 28–96 compounds per target, functional actives or binders returned on 6 of 10 targets, with no generative sampler in the loop at all.',
      zh: '一个函数、一个返回类型、对调用方一无所知。这就是全部契约，也是打分组件能被替换而上面三层一动不动的原因。BoltzMol-1 展示了单靠这一层能走多远：只用 oracle 加目录采购、每靶点 28–96 个化合物，在 10 个靶点中 6 个返回功能性 active 或 binder，循环里根本没有生成式 sampler。',
    },
    ceiling: {
      en: 'R² 0.66 and 0.76 are the ceiling, and 12,796 → 0 → 111 → 4 is where the ceiling becomes visible. A better sampler searches a scoring function that is wrong by exactly that much, faster.',
      zh: 'R² 0.66 与 0.76 就是天花板，而 12,796 → 0 → 111 → 4 是天花板露出来的地方。更好的 sampler 只是更快地搜索一个错到这个程度的打分函数。',
    },
    ceilingProvenance: 'measured',
    cites: [
      { prefix: 'R² 0.66 / 0.76 · 12,796 → 0 → 111 → 4 · 95', source: SOURCE.merckBlog },
      { prefix: 'Boltz-2 · MIT · FEP+ · >1000×', source: SOURCE.boltz2 },
      { prefix: 'BoltzMol-1 · 6 / 10 · 28–96', source: SOURCE.boltzmol1 },
    ],
  },
  {
    id: 'L2',
    name: { en: 'Action space / search domain', zh: '动作空间 / 搜索域' },
    duty: {
      en: 'Fixes which molecules are reachable at all. A change here moves synthesisability independently of whatever objective is running above it.',
      zh: '决定哪些分子根本可达。在这一层改动，可合成性的变化与上面跑的是什么目标函数无关。',
    },
    pick: {
      en: 'A reaction MDP. For Merck KGaA the pick is not "build one" but "expose the one already owned": SYNTHIA carries more than 115,000 expert-encoded reaction rules against more than 12 million purchasable starting materials. That is exactly the pair of assets a reaction MDP needs, and exactly what every external group has to buy first.',
      zh: '选 reaction MDP。而对 Merck KGaA 而言，选型不是「造一个」，是「把已经拥有的那个暴露出来」：SYNTHIA 有 >115,000 条专家编码 reaction 规则 × >1,200 万可购起始物。这正好是 reaction MDP 需要的那一对资产，也正好是外部团队必须先买的东西。',
    },
    why: {
      en: 'This is the highest-return single change on the page, and it belongs to no objective. Holding the sampler fixed and moving fragment MDP → reaction MDP takes independent AiZynthFinder success from 0% to 62%. A GA or a plain RL method collects the same 62 points, which is precisely why the thing being picked is the MDP rather than whichever sampler happened to be attached to it in the paper that reported the number.',
      zh: '这是本页投入产出比最高的单点改动，而它不属于任何目标函数。固定 sampler、把 fragment MDP 换成 reaction MDP，独立 AiZynthFinder 成功率从 0% 走到 62%。GA 或普通 RL 同样能收走这 62 个点 —— 这正是为什么被选的是 MDP，而不是报出这个数字的论文里恰好挂着的那个 sampler。',
    },
    signature: [
      'state_to_features(state) → Vector',
      'is_terminal_state(state) → Bool',
      'reward(state) → Float64',
      'is_applicable(state, action) → Bool',
      'apply_action(state, action) → state',
      'find_parent_for_action(state, action) → state',
      'AbstractEnv',
    ],
    facing: { en: 'downward to the oracle, upward to the sampler', zh: '向下接 oracle，向上接 sampler' },
    interfaceNote: {
      en: 'Six generic functions plus one explicit interface declaration: seven slots, so a new search domain is a new implementation of them rather than a new codebase. The same contract is where a legality probe belongs. SynFlowNet measured only 11.0 ± 3.7% of backward trajectories reaching s₀ under a uniform backward policy, and 1.0 ± 0.8% for a TB-trained free backward policy on held-out states, against MaxLikelihood at 99.3 ± 0.5% and REINFORCE at 100.0 ± 0.0%. A broken pointed DAG is an environment-layer defect, so it has to be checkable at the environment-layer boundary — before training, from the DAG structure alone.',
      zh: '六个泛型函数加一个显式接口声明：七个槽位，于是一个新搜索域是它们的一个新实现，而不是一个新代码库。同一个契约也是合法性探针该待的地方。SynFlowNet 实测在均匀反向策略下只有 11.0 ± 3.7% 的反向轨迹能回到 s₀，TB 训练出的 free 反向策略在 held-out 状态上是 1.0 ± 0.8%，而 MaxLikelihood 是 99.3 ± 0.5%、REINFORCE 是 100.0 ± 0.0%。pointed DAG 破了是环境层的缺陷，所以它必须在环境层边界上可检 —— 在训练之前，只看 DAG 结构。',
    },
    ceiling: {
      en: 'Under an external AiZynthFinder check, reaction templates top out at ≤72% — RxnFlow 60.25–71.25%, SynFlowNet 52.75–57%, RGFN 46.75–50.25% — while the SMILES soft constraint in S3-GFN reaches 96.67–100%. So "a reaction MDP is always better" is itself an open question rather than a settled pick, and the honest form of the recommendation is: take the reaction MDP, and keep the soft-constraint route inside the benchmark.',
      zh: '在外部 AiZynthFinder 检验下，reaction template 只到 ≤72% —— RxnFlow 60.25–71.25%、SynFlowNet 52.75–57%、RGFN 46.75–50.25% —— 而 S3-GFN 的 SMILES 软约束到 96.67–100%。所以「reaction MDP 总是更好」本身也是一个待验证的问题，不是已定的选型；诚实的说法是：选 reaction MDP，同时把软约束这条路留在基准里。',
    },
    ceilingProvenance: 'measured',
    cites: [
      { prefix: '0% → 62% · 11.0 ± 3.7% · 1.0 ± 0.8%', source: SOURCE.synflownet },
      { prefix: 'SYNTHIA · >115,000 × >12,000,000', source: SOURCE.aiddison },
      { prefix: 'S3-GFN 96.67–100% · ≤72%', source: SOURCE.s3gfn },
    ],
  },
  {
    id: 'L3',
    gfn: true,
    name: { en: 'Sampler objective', zh: '采样目标函数' },
    duty: {
      en: 'The loss that decides how reward mass spreads over modes. This is the one square GFlowNet occupies, and it enters as a loss term rather than as a platform.',
      zh: '决定 reward 质量如何铺在各个模式上的 loss。这是 GFlowNet 占的那一格，而它以 loss 项的形式进入，不是以平台的形式。',
    },
    pick: {
      en: 'KL-regularised RL as the default, with the flow objectives as a pluggable option inside the same loss module. Three published equivalences say they are one family: GFlowNets and MaxEnt RL are "one and the same, up to a correction of the reward function"; TB is Path Consistency Learning and Modified DB is a Soft Q-Learning variant; RTB is Trust-PCL, whose own paper reports that "KL-regularized RL methods achieve comparable performance". One family means one slot. The recipe is (a) a multi-path reward correction — only when the MDP really is fragment or reaction — plus (b) a single KL-regularised term.',
      zh: '默认选 KL 正则 RL，把 flow 目标做成同一个 loss 模块里的可插拔选项。三组已发表的等价性说明它们是同一家族：GFlowNets 与 MaxEnt RL 是 "one and the same, up to a correction of the reward function"；TB 就是 Path Consistency Learning，Modified DB 是 Soft Q-Learning 的一个变体；RTB 就是 Trust-PCL，而那篇自己报告 "KL-regularized RL methods achieve comparable performance"。同一家族意味着同一个槽位。配方是：(a) 一个多路径 reward correction —— 仅当 MDP 真的是 fragment 或 reaction 时 —— 加 (b) 一个 KL 正则项。',
    },
    why: {
      en: 'Both ingredients are loss-level edits, and that is what makes them adoptable rather than merely correct: they drop into the RL loop that REINVENT4 and AIDDISON already run. AIDDISON matters here for a non-technical reason — it is an externally sold, ISO 27001-certified product, so replacing its RL core means re-qualifying a commercial product, while adding a KL term and a reward correction does not.',
      zh: '两个配料都是 loss 级改动，而这才让它们可被采纳，而不只是「正确」：它们直接落进 REINVENT4 与 AIDDISON 已经在跑的 RL 循环。AIDDISON 在这里重要的原因是非技术的 —— 它是对外销售的 ISO 27001 认证产品，换掉它的 RL 内核意味着重新资格认证一个商业产品，而加一个 KL 项与一个 reward correction 不会。',
    },
    signature: ['loss(trajectory, reward) → Float64', 'reward_correction(trajectory) → Float64'],
    facing: { en: 'one scalar out, one optional term beside it', zh: '出一个标量，旁边一个可选项' },
    interfaceNote: {
      en: 'Anything writable in that shape — TB, SubTB, DB, RTB, a REINVENT-style policy gradient, Augmented Memory — becomes a configuration value instead of a migration. The second signature is optional, and it is the honest place for the multi-path DAG correction: on single-path SMILES that term is empty by construction, which belongs in the interface rather than being discovered later in an ablation.',
      zh: '凡是能写成这个形状的东西 —— TB、SubTB、DB、RTB、REINVENT 式策略梯度、Augmented Memory —— 都变成一个配置值，而不是一次迁移。第二个签名是可选的，而它是放多路径 DAG 修正最诚实的位置：在单路径 SMILES 上这一项按构造为空，这件事该写在接口里，而不是过后在某个 ablation 里被发现。',
    },
    ceiling: {
      en: 'At a fixed oracle budget the flow objective on its own reads PMO 9.131 (16/25) against REINVENT at 14.196 (1/25); GFlowNet-AL reads 8.406 (22/25), and random screening of ZINC-250k reads 8.635 (19/25). A pretrained prior plus a KL-to-prior term is therefore not an optional refinement of this pick — it is the pick.',
      zh: '在固定 oracle 预算下，flow 目标单独跑出 PMO 9.131（16/25），而 REINVENT 是 14.196（1/25）；GFlowNet-AL 是 8.406（22/25），ZINC-250k 随机筛是 8.635（19/25）。所以「预训练 prior 加一个 KL-to-prior 项」不是这个选型的可选精修 —— 它就是这个选型。',
    },
    ceilingProvenance: 'refuted',
    cites: [
      { prefix: 'GFlowNets ≡ MaxEnt RL', source: SOURCE.tiapkin },
      { prefix: 'TB ≡ PCL · Modified DB ≡ Soft Q-Learning', source: SOURCE.deleu2024 },
      { prefix: 'RTB ≡ Trust-PCL', source: SOURCE.rtb },
      { prefix: 'PMO 9.131 / 14.196 / 8.635 / 8.406', source: SOURCE.pmo },
      { prefix: 'AIDDISON · ISO 27001 · REINVENT 2.0', source: SOURCE.aiddison },
    ],
  },
  {
    id: 'L4',
    name: { en: 'Search operator', zh: '搜索算子' },
    duty: {
      en: 'How the sampler moves through the domain. This is the layer that carries the objective\'s one genuinely unique lever.',
      zh: '采样器如何在搜索域里移动。这一层承载着这个目标函数唯一真正独有的杠杆。',
    },
    pick: {
      en: 'GraphGA as the default operator, with local search and offline expert batches occupying the same slot. Proposition 3 of Bengio 2021 is the licence: any behaviour policy with sufficient support trains the objective without bias, so this is the one place in the stack where borrowing wholesale from another method costs nothing in correctness.',
      zh: '默认选 GraphGA 作算子，局部搜索与离线专家批次占同一个槽位。Bengio 2021 的 Prop. 3 就是许可证：任意覆盖足够 support 的行为策略都能无偏地训练这个目标函数，所以这是整个栈里唯一一处「整块借用别的方法」在正确性上不付代价的地方。',
    },
    why: {
      en: 'The ablation ledger, run in one codebase under one protocol, prices the slot exactly. Genetic GFN reads 16.213; drop the genetic search and it reads 15.738; revert to GFlowNet-native ε-greedy and it reads 15.626; substitute STONED for GraphGA and it reads 15.439. Mol GA sits at 15.686 and REINVENT at 15.185. The spread inside this one slot is wider than the spread between the objective and its competitors.',
      zh: '同一个 codebase、同一个协议下的消融账本给这个槽位定了准价。Genetic GFN 是 16.213；去掉 genetic search 是 15.738；换回 GFlowNet 原生 ε-greedy 是 15.626；用 STONED 代替 GraphGA 是 15.439。Mol GA 在 15.686，REINVENT 在 15.185。这一个槽位内部的落差，比目标函数与其竞争者之间的落差还大。',
    },
    signature: ['propose(batch) → batch'],
    facing: { en: 'a behaviour-policy slot', zh: '一个行为策略插槽' },
    interfaceNote: {
      en: 'Batch in, batch out, no gradient crossing the boundary. A GA, a STONED mutation set, an MCMC kernel, a replay of last quarter\'s project compounds all satisfy it unchanged, and off-policy validity is what makes that substitution sound rather than merely convenient. Fixing this one signature is also what makes the missing four-sampler benchmark cheap: comparing four operators stops requiring four codebases.',
      zh: '进一个 batch，出一个 batch，没有梯度穿过边界。一个 GA、一组 STONED 突变、一个 MCMC 核、上一季度项目化合物的回放，都能原样满足它，而 off-policy 有效性让这种替换在理论上成立，不只是方便。把这一个签名钉住，也让那个缺失的四 sampler 基准变便宜：比四个算子不再需要四个代码库。',
    },
    ceiling: {
      en: 'The best GFlowNet number on record measures this slot rather than the objective above it: 16.213 with GraphGA against 15.626 on native exploration. Read as a ceiling, that says native exploration is the part of the objective nobody has fixed; read as a lever, it says the slot is where the platform gets its cheapest points.',
      zh: '已知最好的 GFlowNet 成绩量的是这个槽位，不是它上面的目标函数：带 GraphGA 是 16.213，用原生探索是 15.626。当天花板读，它说的是原生探索是这个目标函数里没人修好的那部分；当杠杆读，它说的是这个槽位是平台拿最便宜分数的地方。',
    },
    ceilingProvenance: 'measured',
    cites: [
      { prefix: 'Bengio 2021 · Prop. 3', source: SOURCE.bengio2021 },
      {
        prefix: '16.213 → 15.738 → 15.626 → 15.439 · Mol GA 15.686 · REINVENT 15.185',
        source: SOURCE.geneticGfn,
      },
    ],
  },
];

const FIELD_LABEL = {
  pick: { en: '2026 pick', zh: '2026 应该选什么' },
  why: { en: 'Why — measured', zh: '为什么 —— 实测' },
  iface: { en: 'Interface', zh: '接口' },
  ceiling: { en: 'Ceiling of this layer', zh: '这一层的天花板' },
} as const satisfies Record<string, LText>;

const GFN_FLAG: LText = { en: 'GFlowNet occupies this square', zh: 'GFlowNet 占的是这一格' };

/* ══ ③ what "organic" actually requires ══════════════════════════════════ */

const GLUE_TITLE: LText = {
  en: 'What "organic" actually requires',
  zh: '「有机结合」真正要求什么',
};

const GLUE: readonly LText[] = [
  {
    en: 'The shared interfaces have to be small enough to stay still. That is the whole condition, and it is a statement about size rather than about design taste: a boundary accretes an ecosystem only when a third party can implement it without reading the implementation behind it.',
    zh: '共享接口必须小到能保持不动。这就是全部条件，而它讲的是尺寸，不是设计品味：一个边界能长出生态，前提是第三方不用读它背后的实现就能实现它。',
  },
  {
    en: 'The contrast is on the record. REINVENT4 accumulates an ecosystem on one function signature — score(smiles) → float — so every scoring component ever written for it is a file rather than a fork. The differentiating GFlowNet contributions all live one layer down, in the environment, and the environment has no stable interface. The consequence: the reference implementation recorded 2 commits across all of 2026, with no reaction, docking, ADMET or PMO support on trunk; the capability is scattered across 7 forks; torchgfn carries 52 open issues while describing itself as being for fast prototyping; and all three plausible Julia package names return 404 in the General registry, re-checked 2026-08-30. None of that is a failure of the objective. It is what happens when the layer carrying the contribution has no boundary to hand upstream.',
    zh: '这个对照都在记录里。REINVENT4 靠一个函数签名 —— score(smiles) → float —— 积累出生态，于是为它写过的每一个打分组件都是一个文件，而不是一个 fork。GFlowNet 侧有差异化的贡献全在下面一层，在环境里，而环境没有稳定接口。后果是：参考实现在整个 2026 年只有 2 个 commit，主干上没有 reaction、docking、ADMET 或 PMO 支持；能力散在 7 个 fork 里；torchgfn 带着 52 个 open issue，同时自述是给 fast prototyping 用的；三个可能的 Julia 包名在 General registry 里全部返回 404，2026-08-30 复测仍是 404。这里没有一条是目标函数的失败。这是「承载贡献的那一层没有边界可以交上游」时会发生的事。',
  },
];

const GLUE_CITES: readonly { prefix: LText | string; source: Source }[] = [
  {
    prefix: {
      en: '2 commits across 2026 · trunk carries no reaction / docking / ADMET / PMO',
      zh: '2026 全年 2 个 commit · 主干无 reaction / docking / ADMET / PMO',
    },
    source: SOURCE.recursionRepo,
  },
  {
    prefix: { en: '52 open issues · "for fast prototyping"', zh: '52 个 open issue · “for fast prototyping”' },
    source: SOURCE.torchgfn,
  },
  {
    prefix: { en: 'three package names, three 404s', zh: '三个包名，三个 404' },
    source: SOURCE.juliaRegistry,
  },
];

/* ══ ④ acceptance conditions ═════════════════════════════════════════════ */

const ACCEPT_TITLE: LText = {
  en: 'Acceptance conditions for the platform',
  zh: '平台的验收条件',
};

const ACCEPT_LEDE: LText = {
  en: 'Three conditions. All three are falsifiable, none of them is satisfied by anything shipping today, and a stack that fails any one of them is a pipeline with good components rather than a platform.',
  zh: '三个条件。三条都可证伪，今天没有任何在跑的东西满足它们；任一条不满足的栈，都只是一条组件不错的流水线，不是平台。',
};

interface Condition {
  key: string;
  head: LText;
  body: LText;
}

const CONDITIONS: readonly Condition[] = [
  {
    key: 'a',
    head: { en: 'Each layer replaceable without the other three', zh: '每层可换而不动其他三层' },
    body: {
      en: 'The test is a swap, not a diagram. Change the oracle and rerun with no edit above L1. Change the MDP and rerun with no edit to the loss. Anything that requires editing two layers to change one has no interface there, whatever the architecture picture says.',
      zh: '检验方式是真做一次替换，不是画一张图。换 oracle，L1 以上一行不改地重跑。换 MDP，loss 一行不改地重跑。凡是要改两层才能换一层的地方，那里就没有接口 —— 架构图怎么画都一样。',
    },
  },
  {
    key: 'b',
    head: {
      en: 'One reaction MDP, one budget, four samplers',
      zh: '同一 reaction MDP、同预算、四个 sampler',
    },
    body: {
      en: 'GA, MCTS, RL and GFlowNet reported side by side on the same reaction MDP at one oracle budget. This benchmark does not exist. Every comparison on this page varied something else at the same time, which is exactly why nobody can currently state what the objective contributes, and why this is the cheapest of the three conditions to satisfy.',
      zh: 'GA、MCTS、RL、GFlowNet 在同一个 reaction MDP、同一个 oracle 预算下并排报告。这个基准目前不存在。本页每一个对比都同时还变了别的东西，这正是为什么现在没人能说出目标函数到底贡献了什么，也正是为什么三条里这一条最便宜。',
    },
  },
  {
    key: 'c',
    head: { en: 'Every swap separately attributable', zh: '每次换层都能单独归因' },
    body: {
      en: 'One changed layer per reported delta, with the other three pinned and named in the report. A platform that cannot attribute its own improvements cannot be tuned, only reshuffled — and reshuffling is what produced a literature where the largest measured effect belongs to the layer nobody is arguing about.',
      zh: '每个被报告的 delta 只对应一个被改动的层，另外三层钉住并在报告里写明。一个无法归因自己改进的平台没法被调优，只能被重排 —— 而重排正是那种文献的成因：最大的实测效应属于没人在争的那一层。',
    },
  },
];

/* ══ ⑤ boundary ══════════════════════════════════════════════════════════ */

const BOUNDARY_TITLE: LText = { en: 'Boundary of this section', zh: '本节的边界' };

const BOUNDARY: LText = {
  en: 'Every pick above is a proposal. No stack in this shape has been built or benchmarked, here or anywhere, and the four picks and four interfaces carry no measured result of their own. What is measured is the evidence each pick is argued from: the R² values and the 12,796 → 0 → 111 → 4 funnel at L1, the 0% → 62% gain and the ≤72% template ceiling at L2, 9.131 against 14.196 at L3, and the 16.213 → 15.439 ablation ledger at L4. The reasoning is measured. The selection is not.',
  zh: '上面每一个选型都是提议。没有任何一个这个形状的栈被搭起来或被基准过，这里没有，别处也没有，四个选型与四个接口本身没有任何实测结果。被实测的是每个选型据以论证的证据：L1 的 R² 与 12,796 → 0 → 111 → 4 漏斗，L2 的 0% → 62% 增益与 ≤72% 模板天花板，L3 的 9.131 对 14.196，L4 的 16.213 → 15.439 消融账本。理由是实测的，选型不是。',
};

/* ══ render ══════════════════════════════════════════════════════════════ */

export function PlatformStack({ className }: { className?: string }) {
  const { lang } = useLang();

  return (
    <div className={className ? `pstack ${className}` : 'pstack'}>
      {/* ── ① the thesis ─────────────────────────────────────────────── */}
      <section className="pstack__thesis" aria-labelledby="pstack-thesis">
        <span className="pstack__kicker">{t(KICKER, lang)}</span>
        <h3 className="pstack__thesisTitle u-display" id="pstack-thesis">
          <ProvenanceDot provenance="claimed" size="sm" detail={THESIS_TITLE} />
          {t(THESIS_TITLE, lang)}
        </h3>
        {THESIS.map((para) => {
          const text = t(para, lang);
          return (
            <p className="pstack__thesisBody" key={text.slice(0, 24)}>
              {text}
            </p>
          );
        })}
        <ul className="pstack__chips">
          {THESIS_CHIPS.map((chip) => (
            <li className="pstack__chip" key={chip.value}>
              <span className="pstack__chipValue u-mono">
                <ProvenanceDot provenance="measured" size="sm" decorative />
                {chip.value}
              </span>
              <span className="pstack__chipNote">{t(chip.note, lang)}</span>
              <SourceCite className="pstack__cite" source={chip.source} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── ② the four picks ─────────────────────────────────────────── */}
      <section className="pstack__picks" aria-labelledby="pstack-picks">
        <h3 className="pstack__sectionTitle u-display" id="pstack-picks">
          {t(PICKS_TITLE, lang)}
        </h3>
        <p className="pstack__lede">{t(PICKS_LEDE, lang)}</p>

        <ol className="pstack__layers">
          {LAYERS.map((layer) => (
            <li className="pstack__layer" data-gfn={layer.gfn ?? false} key={layer.id}>
              <header className="pstack__layerHead">
                <span className="pstack__layerId u-display" aria-hidden="true">
                  {layer.id}
                </span>
                <h4 className="pstack__layerName u-display">{t(layer.name, lang)}</h4>
                {layer.gfn === true && <span className="pstack__gfnFlag">{t(GFN_FLAG, lang)}</span>}
                <p className="pstack__layerDuty">{t(layer.duty, lang)}</p>
              </header>

              <div className="pstack__fields">
                {/* The pick is always a proposal, and the label says so in
                    words, so the dot is decorative rather than a tab stop. */}
                <div className="pstack__field" data-field="pick">
                  <span className="pstack__fieldLabel">
                    <ProvenanceDot provenance="claimed" size="sm" decorative />
                    {t(FIELD_LABEL.pick, lang)}
                  </span>
                  <p className="pstack__fieldBody">{t(layer.pick, lang)}</p>
                </div>

                <div className="pstack__field" data-field="why">
                  <span className="pstack__fieldLabel">
                    <ProvenanceDot provenance="measured" size="sm" decorative />
                    {t(FIELD_LABEL.why, lang)}
                  </span>
                  <p className="pstack__fieldBody">{t(layer.why, lang)}</p>
                </div>

                {/* The load-bearing field: without it the layers cannot be
                    swapped, so it gets the widest cell and the frame. */}
                <div className="pstack__field" data-field="iface">
                  <span className="pstack__fieldLabel">
                    <ProvenanceDot provenance="claimed" size="sm" decorative />
                    {t(FIELD_LABEL.iface, lang)}
                    <span className="pstack__facing">{t(layer.facing, lang)}</span>
                  </span>
                  <ul className="pstack__sigList">
                    {layer.signature.map((sig) => (
                      <li className="pstack__sig u-mono" key={sig}>
                        {sig}
                      </li>
                    ))}
                  </ul>
                  <p className="pstack__fieldBody">{t(layer.interfaceNote, lang)}</p>
                </div>

                {/* The only informative dot on the card: L3's ceiling is
                    `refuted`, the other three are `measured`. */}
                <div className="pstack__field" data-field="ceiling">
                  <span className="pstack__fieldLabel">
                    <ProvenanceDot provenance={layer.ceilingProvenance} size="sm" />
                    {t(FIELD_LABEL.ceiling, lang)}
                  </span>
                  <p className="pstack__fieldBody">{t(layer.ceiling, lang)}</p>
                </div>
              </div>

              <div className="pstack__cites">
                {layer.cites.map((cite) => (
                  <SourceCite
                    className="pstack__cite"
                    key={cite.source.url}
                    prefix={cite.prefix}
                    source={cite.source}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── ③ what "organic" requires ────────────────────────────────── */}
      <section className="pstack__glue" aria-labelledby="pstack-glue">
        <h3 className="pstack__sectionTitle u-display" id="pstack-glue">
          <ProvenanceDot provenance="claimed" size="sm" detail={GLUE_TITLE} />
          {t(GLUE_TITLE, lang)}
        </h3>
        {GLUE.map((para) => {
          const text = t(para, lang);
          return (
            <p className="pstack__glueBody" key={text.slice(0, 24)}>
              {text}
            </p>
          );
        })}
        <div className="pstack__cites">
          {GLUE_CITES.map((cite) => (
            <SourceCite
              className="pstack__cite"
              key={cite.source.url}
              prefix={cite.prefix}
              source={cite.source}
            />
          ))}
        </div>
      </section>

      {/* ── ④ acceptance conditions ──────────────────────────────────── */}
      <section className="pstack__accept" aria-labelledby="pstack-accept">
        <h3 className="pstack__sectionTitle u-display" id="pstack-accept">
          {t(ACCEPT_TITLE, lang)}
        </h3>
        <p className="pstack__lede">{t(ACCEPT_LEDE, lang)}</p>
        <ol className="pstack__conditions">
          {CONDITIONS.map((cond) => (
            <li className="pstack__condition" key={cond.key}>
              <span className="pstack__condKey u-mono" aria-hidden="true">
                {cond.key}
              </span>
              <div className="pstack__condText">
                <h4 className="pstack__condHead">
                  <ProvenanceDot provenance="claimed" size="sm" decorative />
                  {t(cond.head, lang)}
                </h4>
                <p className="pstack__condBody">{t(cond.body, lang)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── ⑤ boundary ───────────────────────────────────────────────── */}
      <section className="pstack__boundary" aria-labelledby="pstack-boundary">
        <h3 className="pstack__boundaryTitle" id="pstack-boundary">
          {t(BOUNDARY_TITLE, lang)}
        </h3>
        <p className="pstack__boundaryBody">{t(BOUNDARY, lang)}</p>
      </section>
    </div>
  );
}
