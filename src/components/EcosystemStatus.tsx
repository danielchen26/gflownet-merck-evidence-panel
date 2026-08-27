import type { Provenance } from '../data/types';
import type { LText } from '../i18n/i18n';
import { t, useLang } from '../i18n/i18n';
import { ProvenanceDot } from './ProvenanceDot';
import './EcosystemStatus.css';

/* ══ what this section is ════════════════════════════════════════════════
 * The placement argument's landing point: first measure how big the shared
 * infrastructure blank is, then present one documented attempt at filling it.
 *
 * Colour keeps the panel's epistemic contract, never sentiment:
 *   --assay   measured        repository metadata, file sizes, registry probes
 *   --verdict measured zero   an absence that was probed for and found empty
 *   --flow    claimed         a causal reading or a design claim, i.e. mine
 *
 * Everything here came from the GitHub API (tree, README, Project.toml, file
 * sizes) plus registry probes. Nothing was cloned, run, or benchmarked — see
 * BOUNDARY at the bottom of the file, which is rendered, not just a comment. */

/* ══ (1) the ecosystem, as probed on 2026-08-27 ══════════════════════════ */

interface RepoRow {
  /** Verbatim repository path or registry name: never translated. */
  repo: string;
  url: string;
  license: LText | string;
  activity: LText;
  lacks: LText;
  provenance: Provenance;
  /** Probed for and found empty — framed in --verdict, not merely unread. */
  zero?: boolean;
}

const REPOS: readonly RepoRow[] = [
  {
    repo: 'recursionpharma/gflownet',
    url: 'https://github.com/recursionpharma/gflownet',
    license: 'MIT',
    provenance: 'measured',
    activity: {
      en: 'default branch trunk · 295 stars · 54 forks · 24 open issues · 2 commits in all of 2026 (2026-05-21)',
      zh: '默认分支 trunk · 295 star · 54 fork · 24 open issue · 2026 全年 2 个 commit（2026-05-21）',
    },
    lacks: {
      en: 'trunk ships six tasks: seh_frag, seh_frag_moo, qm9, qm9_moo, make_rings, toy_seq. No reaction environment, no docking, no ADMET, no PMO harness.',
      zh: 'trunk 上只有六个任务：seh_frag、seh_frag_moo、qm9、qm9_moo、make_rings、toy_seq。无 reaction 环境、无 docking、无 ADMET、无 PMO harness。',
    },
  },
  {
    repo: 'GFNOrg/torchgfn',
    url: 'https://github.com/GFNOrg/torchgfn',
    license: { en: 'not read', zh: '未读取' },
    provenance: 'measured',
    activity: {
      en: '313 stars · 57 forks · 52 open issues; the README describes itself as "for fast prototyping" and "to accompany researchers in learning about GFlowNets"',
      zh: '313 star · 57 fork · 52 open issue；README 自述「for fast prototyping」、「to accompany researchers in learning about GFlowNets」',
    },
    lacks: {
      en: 'No molecular environment among the shipped gym environments; the scope the README claims for itself is prototyping and learning.',
      zh: 'shipped gym 环境中没有分子环境；README 给自己划定的范围是 prototyping 与 learning。',
    },
  },
  {
    repo: 'mirunacrt/synflownet',
    url: 'https://github.com/mirunacrt/synflownet',
    license: 'MIT',
    provenance: 'measured',
    activity: {
      en: '135 stars · 22 forks · last commit 2025-01-31',
      zh: '135 star · 22 fork · 最后提交 2025-01-31',
    },
    lacks: {
      en: 'Nothing has landed since 2025-01-31, and the reaction environment it adds is absent from recursionpharma/gflownet trunk.',
      zh: '2025-01-31 之后没有新提交；它加的 reaction 环境在 recursionpharma/gflownet trunk 上并不存在。',
    },
  },
  {
    repo: 'SeonghwanSeo/RxnFlow',
    url: 'https://github.com/SeonghwanSeo/RxnFlow',
    license: 'MIT',
    provenance: 'measured',
    activity: {
      en: '38 stars · 9 forks · last commit 2025-10-23',
      zh: '38 star · 9 fork · 最后提交 2025-10-23',
    },
    lacks: {
      en: 'src/gflownet/ is a vendored copy of recursionpharma/gflownet v0.2.0. The README states that the author\u2019s improved in-house architecture drives the commercial product HyperLab, and that the public "current version" cannot reproduce the paper results.',
      zh: 'src/gflownet/ 是 recursionpharma/gflownet v0.2.0 的 vendored 副本。README 声明作者改进版的 in-house 架构在驱动商业产品 HyperLab，且公开版「current version 不能复现论文结果」。',
    },
  },
  {
    repo: 'recursionpharma/synflownet-boltz',
    url: 'https://github.com/recursionpharma/synflownet-boltz',
    license: { en: 'not read', zh: '未读取' },
    provenance: 'measured',
    activity: {
      en: 'zero commits since the initial push on 2025-06-27',
      zh: '2025-06-27 首次推送之后零 commit',
    },
    lacks: {
      en: 'The repository grades itself through its own custom properties: environment=Non-Prod, business-criticality=Tier-4, repo-type=Informational.',
      zh: '仓库用自带的 custom properties 给自己定了级：environment=Non-Prod、business-criticality=Tier-4、repo-type=Informational。',
    },
  },
  {
    repo: 'Julia General registry',
    url: 'https://github.com/JuliaRegistries/General',
    license: { en: 'n/a', zh: '不适用' },
    provenance: 'measured',
    zero: true,
    activity: {
      en: 'probed 2026-08-27 — GFlowNet: 404, GFlowNets: 404, GenerativeFlowNetworks: 404',
      zh: '2026-08-27 探测 —— GFlowNet：404、GFlowNets：404、GenerativeFlowNetworks：404',
    },
    lacks: {
      en: 'There is no GFlowNet package in the Julia ecosystem at all. This row is a measured zero, not an unread field.',
      zh: 'Julia 生态里根本没有任何 GFlowNet 包。这一行是实测为零，而不是未读取。',
    },
  },
];

const PROBE_KICKER: LText = { en: '01 · measured', zh: '01 · 实测' };

const PROBE_TITLE: LText = {
  en: 'The ecosystem, as probed on 2026-08-27',
  zh: '生态现状：2026-08-27 实测',
};

const PROBE_LEDE: LText = {
  en: 'Six probes: five reference repositories and one registry query. Every figure in this table is repository metadata read through the GitHub API — no interpretation yet.',
  zh: '六次探测：五个参考仓库加一次注册表查询。表中每个数字都是通过 GitHub API 读到的仓库元数据 —— 这里还不做解释。',
};

const COL_REPO: LText = { en: 'Repository / registry', zh: '仓库 / 注册表' };
const COL_LICENSE: LText = { en: 'License', zh: '许可' };
const COL_ACTIVITY: LText = { en: 'Activity signal', zh: '活跃度信号' };
const COL_LACKS: LText = { en: 'What it lacks', zh: '它缺什么' };

const SCROLL_HINT: LText = { en: 'scrollable table', zh: '可横向滚动的表格' };

const ZERO_TAG: LText = { en: 'measured zero', zh: '实测为零' };

const PROBE_FOOT: LText = {
  en: '"not read" means exactly that: the field was never fetched. It is not a claim about the repository.',
  zh: '「未读取」就是字面意思：该字段根本没有被抓取，它不构成对那个仓库的任何主张。',
};

/* ══ (2) the diagnosis — inference, not measurement ══════════════════════ */

interface DiagnosisSide {
  /** Proper noun, kept verbatim in both languages. */
  head: string;
  tag: LText;
  points: readonly LText[];
  /** Verbatim fork names; rendered as mono chips. */
  chips?: readonly string[];
  chipNote?: LText;
  accent: 'flow' | 'verdict';
}

const DIAGNOSIS: readonly DiagnosisSide[] = [
  {
    head: 'MolecularAI/REINVENT4',
    accent: 'flow',
    tag: { en: 'accumulates', zh: '能累积' },
    points: [
      {
        en: 'Apache-2.0, with a namespace-package plugin mechanism: an in-house scoring component plugs in with zero changes to the core.',
        zh: 'Apache-2.0，采用 namespace package 插件机制：自有 scoring component 接入时核心零改动。',
      },
      {
        en: 'The shared interface is score(smiles) \u2192 float. One function signature.',
        zh: '共享接口是 score(smiles) \u2192 float。一个函数签名。',
      },
      {
        en: 'Because the seam is one signature, every contributor\u2019s work lands in the same place instead of beside it.',
        zh: '因为接缝只有一个签名，每个贡献者的工作都落在同一个位置，而不是落在它旁边。',
      },
    ],
  },
  {
    head: 'GFlowNet implementations',
    accent: 'verdict',
    tag: { en: 'forks', zh: '只会分叉' },
    points: [
      {
        en: 'The differentiating contribution lives in the environment layer: the action space, the parent enumeration, the masking.',
        zh: '差异化贡献活在环境层：动作空间、父节点枚举、mask。',
      },
      {
        en: 'That layer has no stable interface, so there is nothing to upstream into — a contribution can only be a fork.',
        zh: '而这一层没有稳定接口，于是没有任何可以上游的位置 —— 一个贡献只能成为一个 fork。',
      },
      {
        en: 'Capability therefore sits scattered across seven mutually incompatible forks:',
        zh: '于是能力散在七个互不兼容的 fork 里：',
      },
    ],
    chips: ['RGFN', 'SynFlowNet', 'RxnFlow', 'Genetic GFN', 'A-GFN', 'TacoGFN', 'S3-GFN'],
    chipNote: {
      en: 'The seven names are a measured list. The reason they stayed seven is the inference.',
      zh: '这七个名字是实测清单。它们为什么一直是七个，才是推论。',
    },
  },
];

const DIAG_KICKER: LText = { en: '02 · claimed · inference', zh: '02 · claimed · 推论' };

const DIAG_TITLE: LText = {
  en: 'Why REINVENT4 accumulates and GFlowNet forks',
  zh: '为什么 REINVENT4 能累积，而 GFlowNet 只会分叉',
};

const DIAG_LEDE: LText = {
  en: 'The repository metadata above is measured. The causal reading below is mine, and it is an inference — the licences, the plugin mechanism, and the fork names are facts; the "therefore" is not.',
  zh: '上表的仓库元数据是实测。下面的因果解释是我的推论 —— 许可、插件机制、fork 名字都是事实，但「所以」不是。',
};

/* ══ (3) one documented attempt: danielchen26/Gflownet ═══════════════════ */

interface MetaChip {
  /** Identifier, version, or DOI: never translated. */
  value: string;
  note?: LText;
}

const CASE_META: readonly MetaChip[] = [
  { value: 'Julia 1.11' },
  { value: 'MIT' },
  { value: 'Project.toml version 1.0.0' },
  { value: 'Project.toml authors: Tianchi Chen' },
  { value: 'Zenodo DOI 10.5281/zenodo.22117533' },
  { value: 'created 2025-05-17', note: { en: 'created', zh: '创建' } },
  { value: 'last push 2026-08-27', note: { en: 'last push', zh: '最后推送' } },
  { value: '94,661 KB' },
  { value: '152 .jl files', note: { en: 'source files', zh: '源文件' } },
  { value: 'Lux 1.6 + Zygote 0.6', note: { en: 'autodiff', zh: '自动微分' } },
  { value: 'PythonCall 0.9.31', note: { en: 'RDKit bridge', zh: 'RDKit 桥' } },
  { value: 'Oxygen', note: { en: 'HTTP server', zh: 'HTTP 服务' } },
];

interface InvFile {
  name: string;
  bytes?: string;
  note?: LText;
}

interface InvGroup {
  /** Directory path in the repository, verbatim. */
  dir: string;
  files: readonly InvFile[];
  note?: LText;
}

const INVENTORY: readonly InvGroup[] = [
  {
    dir: 'core/',
    files: [
      { name: 'balance.jl', bytes: '38,150 B', note: { en: 'TB / DB / FM / SubTB', zh: 'TB / DB / FM / SubTB' } },
      { name: 'interface.jl', bytes: '32,911 B' },
      { name: 'policies.jl', bytes: '30,471 B' },
      { name: 'flows.jl', bytes: '20,198 B' },
      { name: 'sampling.jl', bytes: '11,438 B' },
      { name: 'multi_start.jl', bytes: '10,969 B' },
    ],
  },
  {
    dir: 'applications/',
    files: [
      {
        name: 'molecular_generation.jl',
        bytes: '31,572 B',
        note: { en: 'BRICS, fragment-based', zh: 'BRICS，fragment-based' },
      },
      { name: 'grid_world.jl', bytes: '17,366 B' },
      {
        name: 'molecular_design.jl',
        bytes: '12,181 B',
        note: { en: 'atom-level; the README marks it legacy', zh: 'atom-level；README 标为 legacy' },
      },
      { name: 'causal_discovery.jl', bytes: '10,303 B' },
      { name: 'active_learning.jl', bytes: '7,976 B' },
    ],
  },
  {
    dir: 'extensions/',
    files: [
      { name: 'non_acyclic.jl', bytes: '6,622 B' },
      {
        name: 'information.jl',
        bytes: '4,357 B',
        note: { en: 'information-theoretic objectives', zh: '信息论目标' },
      },
      { name: 'continuous.jl', bytes: '3,724 B' },
    ],
  },
  {
    dir: 'examples/core_features/',
    files: [
      { name: 'learnable_partition_function', note: { en: 'log Z', zh: 'log Z' } },
      { name: 'sub_trajectory_balance' },
      { name: 'objective_comparison' },
      { name: 'flow_matching' },
      { name: 'direct_flow' },
      { name: 'multi_start' },
    ],
  },
  {
    dir: 'test/applications/molecular/',
    files: [
      { name: 'test_pmo.jl' },
      { name: 'test_docking.jl' },
      { name: 'test_oracles.jl' },
      { name: 'test_mogfn.jl' },
      { name: 'test_reaction_constraints.jl' },
      { name: 'test_fragment_joining.jl' },
      { name: 'test_fragment_library.jl' },
      { name: 'test_action_masking.jl' },
      { name: 'test_diversity.jl' },
      { name: 'test_reward_function.jl' },
      { name: 'test_state_features.jl' },
      { name: 'test_state_dim_consistency.jl' },
      { name: 'test_integration.jl' },
      { name: 'test_setup.jl' },
    ],
    note: {
      en: '15 molecular test files in total; 14 names are listed here. File names only — I did not run them.',
      zh: '分子测试文件共 15 个，这里列出 14 个文件名。只是文件名 —— 我没有运行它们。',
    },
  },
];

const CASE_KICKER: LText = { en: '03 · one documented attempt', zh: '03 · 一个有文档的尝试' };

const CASE_TITLE: LText = {
  en: 'An attempt at the missing layer: danielchen26/Gflownet',
  zh: '一个填补空白的尝试：danielchen26/Gflownet',
};

const CASE_URL = 'https://github.com/danielchen26/Gflownet';

const CASE_LEDE: LText = {
  en: 'Not a recommendation and not a benchmark result: one documented attempt, read from its repository metadata. What it has, what it still lacks, and what I did not verify get the same amount of room on this page.',
  zh: '这不是推荐，也不是基准结果：这是一个有文档的尝试，信息全部来自仓库元数据。它已有什么、还缺什么、我没验证什么，在这一页上占同样的篇幅。',
};

const INVENTORY_HEAD: LText = {
  en: 'What the tree contains, by file size',
  zh: '文件树里有什么，按文件大小',
};

const HAS_HEAD: LText = {
  en: 'What it has that the Python reference implementations do not',
  zh: '它已有、而 Python 侧参考实现没有的',
};

const HAS_POINTS: readonly LText[] = [
  {
    en: 'A PMO harness: test/applications/molecular/test_pmo.jl.',
    zh: 'PMO harness：test/applications/molecular/test_pmo.jl。',
  },
  {
    en: 'Docking and oracle test abstractions: test_docking.jl, test_oracles.jl.',
    zh: 'docking 与 oracle 的测试抽象：test_docking.jl、test_oracles.jl。',
  },
  {
    en: 'Cross-objective comparison: experiments/objective_comparison_drd2.jl, scripts/validate_all_gaps.jl, and reports/2026-03-01_molecular_generation_benchmark_report.md all exist in the tree.',
    zh: '跨目标函数对比：experiments/objective_comparison_drd2.jl、scripts/validate_all_gaps.jl 与 reports/2026-03-01_molecular_generation_benchmark_report.md 三者都存在于文件树中。',
  },
  {
    en: 'log Z as a first-class object: examples/core_features/learnable_partition_function.',
    zh: 'log Z 作为一等公民：examples/core_features/learnable_partition_function。',
  },
  {
    en: 'Information-theoretic objectives: extensions/information.jl.',
    zh: '信息论目标：extensions/information.jl。',
  },
];

const HAS_FIGURES: readonly string[] = [
  '152 .jl files',
  'core/balance.jl 38,150 B',
  'applications/molecular_generation.jl 31,572 B',
  '15 molecular test files',
];

const HAS_CAVEAT: LText = {
  en: 'Present in the tree, and nothing more: existence is what I checked, not behaviour.',
  zh: '存在于文件树里，仅此而已：我核对的是存在，不是行为。',
};

const LACKS_HEAD: LText = { en: 'What it still lacks', zh: '它还缺的' };

const LACKS_POINTS: readonly LText[] = [
  {
    en: 'Not registered in the Julia General registry, so Pkg.add("GFlowNet") fails today. Installation means cloning a URL.',
    zh: '未注册到 Julia General registry，所以 Pkg.add("GFlowNet") 目前会失败。安装意味着 clone 一个 URL。',
  },
  {
    en: 'PythonCall sits in [deps] rather than in a weakdep or extension, so every user is forced to drag along a Python environment for the RDKit bridge.',
    zh: 'PythonCall 在 [deps] 里，而不是 weakdep / extension，于是每个用户都被迫为 RDKit 桥拖上一整个 Python 环境。',
  },
  {
    en: 'The name disagrees in three places: repository Gflownet, package GFlowNet, README title GFlowNet.jl.',
    zh: '命名有三处不一致：仓库 Gflownet、包名 GFlowNet、README 标题 GFlowNet.jl。',
  },
];

const IFACE_HEAD: LText = { en: 'Its environment-layer interface', zh: '它的环境层接口' };

const IFACE_LEDE: LText = {
  en: 'Seven generic functions. Six are named verbatim in the file header of applications/molecular_generation.jl; the contract itself lives in core/interface.jl.',
  zh: '七个泛型函数。其中六个在 applications/molecular_generation.jl 的文件头里逐字写明；契约本体在 core/interface.jl。',
};

/** Six of the seven, named verbatim in the molecular_generation.jl file header. */
const IFACE_NAMES: readonly string[] = [
  'state_to_features',
  'is_terminal_state',
  'reward',
  'is_applicable',
  'apply_action',
  'find_parent_for_action',
];

const IFACE_CONTRACT = 'core/interface.jl';

const IFACE_CONTRACT_LABEL: LText = { en: 'the contract itself', zh: '契约本体' };

const IFACE_CLAIM: LText = {
  en: 'Because Julia dispatches on argument types, a new environment is a new set of methods on these same names: an objective, a policy, and an environment can be swapped independently instead of being subclassed together. That orthogonality is the design claim — it is not something I measured.',
  zh: '因为 Julia 按参数类型分派，新环境就是在这些同名函数上新增一组 method：目标函数、policy、环境可以各自独立替换，而不必绑在一起继承。这个正交性是设计主张 —— 不是我测出来的结果。',
};

/* ══ (4) a proposal that exists in no implementation ═════════════════════ */

const PROPOSAL_KICKER: LText = { en: '04 · proposal · claimed', zh: '04 · 提议 · claimed' };

const PROPOSAL_TITLE: LText = {
  en: 'A proposal that exists in no implementation: a pointed-DAG legality checker',
  zh: '一个尚不存在于任何实现的提议：pointed-DAG 合法性检查器',
};

const PROPOSAL_DRIVER: LText = {
  en: 'SynFlowNet (ICLR 2025) reports that on its reaction MDP, under a uniform backward policy, only 11.0\u00b13.7% of backward trajectories reach s\u2080. The defect surfaced in the paper itself — no test caught it, because no library has such a test.',
  zh: 'SynFlowNet（ICLR 2025）报告：在其 reaction MDP 上使用均匀 backward policy 时，只有 11.0\u00b13.7% 的反向轨迹能回到 s\u2080。这个缺陷是在论文里才被发现的 —— 没有测试抓到它，因为没有任何库有这种测试。',
};

const PROPOSAL_CLAIM: LText = {
  en: 'find_parent_for_action correctness is the implicit landmine under every GFlowNet paper. No library — including danielchen26/Gflownet — ships a diagnostic for backward reachability, orphaned parents, or the flow-conservation residual.',
  zh: 'find_parent_for_action 的正确性是每篇 GFlowNet 论文底下的隐性地雷。没有任何库 —— 包括 danielchen26/Gflownet —— 提供反向可达率、孤立父节点或 flow 守恒残差的诊断。',
};

const PROPOSAL_CODE_HEAD: LText = { en: 'Sketch of the API, in Julia:', zh: 'API 草图（Julia）：' };

const PROPOSAL_STAMP: LText = {
  en: 'proposal · not implemented anywhere',
  zh: '提议 · 任何实现中都还不存在',
};

/** A sketch, not a quotation: no such function exists in any library today. */
const PROPOSAL_CODE = `# PROPOSAL — not implemented in any library today
report = check_pointed_dag(env; n_samples=10_000)

report.backward_reachability  # fraction of backward trajectories reaching s0
report.orphaned_parents       # states where find_parent_for_action returns nothing
report.flow_residual          # max |inflow - outflow| over sampled interior states`;

const PROPOSAL_FIELDS: LText = {
  en: 'The three fields are, in order: the backward reachability rate, the orphaned parents, and the flow-conservation residual. The first one is what would have caught the 11.0% before a paper had to report it.',
  zh: '三个字段依次是：反向可达率、孤立父节点、flow 守恒残差。第一个就是那个本该在论文被迫报告 11.0% 之前先抓住它的东西。',
};

/* ══ boundary — the rendered scope of everything above ══════════════════ */

const BOUNDARY_STAMP: LText = { en: 'method and boundary', zh: '方法与边界' };

const BOUNDARY_BODY: LText = {
  en: 'Every repository figure in this section was read through the GitHub API — file tree, README, Project.toml, file sizes — plus direct probes of the Julia General registry. Nothing was cloned, no test suite was run, no benchmark was executed. This section therefore states no test pass rate and no performance result. Data snapshot: 2026-08-27.',
  zh: '本节所有仓库数字都来自 GitHub API 读取 —— 文件树、README、Project.toml、文件大小 —— 以及对 Julia General registry 的直接探测。未 clone、未运行测试、未做基准。因此本节不给出任何测试通过率或性能结果。数据快照日期：2026-08-27。',
};

const BOUNDARY_HEAD: LText = { en: 'What I did not verify', zh: '我没有验证的' };

const BOUNDARY_GAPS: readonly LText[] = [
  {
    en: 'Whether the 15 molecular test files pass, or what they assert at runtime.',
    zh: '那 15 个分子测试文件是否通过，以及它们在运行时到底断言了什么。',
  },
  {
    en: 'Whether reports/2026-03-01_molecular_generation_benchmark_report.md reproduces.',
    zh: 'reports/2026-03-01_molecular_generation_benchmark_report.md 能否复现。',
  },
  {
    en: 'Whether seven generic functions are sufficient for a reaction MDP over a real building-block library.',
    zh: '面对真实 building block 库上的 reaction MDP，七个泛型函数是否够用。',
  },
  {
    en: 'Any runtime, memory, or sample-efficiency comparison against the Python implementations.',
    zh: '与 Python 实现之间的任何运行时间、内存或样本效率对比。',
  },
];

/* ══ render ══════════════════════════════════════════════════════════════ */

/** Bulleted claim list; every item is one sentence, so no nesting. */
function Points({ items }: { items: readonly LText[] }) {
  const { lang } = useLang();
  return (
    <ul className="ecostat__points">
      {items.map((item) => {
        const text = t(item, lang);
        return <li key={text}>{text}</li>;
      })}
    </ul>
  );
}

export function EcosystemStatus({ className }: { className?: string }) {
  const { lang } = useLang();
  const probeTitle = t(PROBE_TITLE, lang);

  return (
    <div className={className ? `ecostat ${className}` : 'ecostat'}>
      {/* ── (1) the blank, measured ─────────────────────────────────── */}
      <section className="ecostat__part" aria-labelledby="ecostat-probe">
        <header className="ecostat__head">
          <span className="ecostat__kicker u-kicker">{t(PROBE_KICKER, lang)}</span>
          <h3 className="ecostat__title u-display" id="ecostat-probe">
            {probeTitle}
          </h3>
          <p className="ecostat__lede u-measure">{t(PROBE_LEDE, lang)}</p>
        </header>

        <div
          className="ecostat__scroll"
          role="region"
          aria-label={`${probeTitle} — ${t(SCROLL_HINT, lang)}`}
          tabIndex={0}
        >
          <table className="ecostat__table">
            <thead>
              <tr>
                <th scope="col" className="ecostat__th">
                  {t(COL_REPO, lang)}
                </th>
                <th scope="col" className="ecostat__th">
                  {t(COL_LICENSE, lang)}
                </th>
                <th scope="col" className="ecostat__th">
                  {t(COL_ACTIVITY, lang)}
                </th>
                <th scope="col" className="ecostat__th">
                  {t(COL_LACKS, lang)}
                </th>
              </tr>
            </thead>
            <tbody>
              {REPOS.map((row) => (
                <tr
                  key={row.repo}
                  className="ecostat__row"
                  data-provenance={row.provenance}
                  data-zero={row.zero ? 'true' : undefined}
                >
                  <th scope="row" className="ecostat__repo">
                    <span className="ecostat__repoInner">
                      <ProvenanceDot provenance={row.provenance} size="sm" />
                      <a
                        className="ecostat__repoLink"
                        href={row.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {row.repo}
                      </a>
                    </span>
                    {row.zero ? (
                      <span className="ecostat__zeroTag">{t(ZERO_TAG, lang)}</span>
                    ) : null}
                  </th>
                  <td className="ecostat__td ecostat__td--license">{t(row.license, lang)}</td>
                  <td className="ecostat__td ecostat__td--activity">{t(row.activity, lang)}</td>
                  <td className="ecostat__td ecostat__td--lacks">{t(row.lacks, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="ecostat__foot">{t(PROBE_FOOT, lang)}</p>
      </section>

      {/* ── (2) the diagnosis, inferred ─────────────────────────────── */}
      <section className="ecostat__part" aria-labelledby="ecostat-diag">
        <header className="ecostat__head">
          <span className="ecostat__kicker u-kicker">{t(DIAG_KICKER, lang)}</span>
          <h3 className="ecostat__title u-display" id="ecostat-diag">
            {t(DIAG_TITLE, lang)}
          </h3>
          <p className="ecostat__lede u-measure">
            <ProvenanceDot provenance="claimed" size="sm" detail={DIAG_TITLE} />
            <span>{t(DIAG_LEDE, lang)}</span>
          </p>
        </header>

        <div className="ecostat__pair">
          {DIAGNOSIS.map((side) => (
            <article className="ecostat__card" data-accent={side.accent} key={side.head}>
              <header className="ecostat__cardHead">
                <h4 className="ecostat__cardTitle">{side.head}</h4>
                <span className="ecostat__cardTag">{t(side.tag, lang)}</span>
              </header>
              <Points items={side.points} />
              {side.chips ? (
                <ul className="ecostat__chips">
                  {side.chips.map((chip) => (
                    <li className="ecostat__chip" key={chip}>
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : null}
              {side.chipNote ? (
                <p className="ecostat__cardNote">{t(side.chipNote, lang)}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* ── (3) one attempt ────────────────────────────────────────── */}
      <section className="ecostat__part" aria-labelledby="ecostat-case">
        <header className="ecostat__head">
          <span className="ecostat__kicker u-kicker">{t(CASE_KICKER, lang)}</span>
          <h3 className="ecostat__title u-display" id="ecostat-case">
            <a
              className="ecostat__titleLink"
              href={CASE_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(CASE_TITLE, lang)}
            </a>
          </h3>
          <p className="ecostat__lede u-measure">{t(CASE_LEDE, lang)}</p>
        </header>

        <ul className="ecostat__meta">
          {CASE_META.map((chip) => (
            <li className="ecostat__metaItem" key={chip.value}>
              <span className="ecostat__metaValue">{chip.value}</span>
              {chip.note ? (
                <span className="ecostat__metaNote">{t(chip.note, lang)}</span>
              ) : null}
            </li>
          ))}
        </ul>

        <details className="ecostat__inv">
          <summary className="ecostat__invSummary">
            <ProvenanceDot provenance="measured" size="sm" decorative />
            <span>{t(INVENTORY_HEAD, lang)}</span>
          </summary>
          <div className="ecostat__invBody">
            {INVENTORY.map((group) => (
              <section className="ecostat__invGroup" key={group.dir}>
                <h5 className="ecostat__invDir">{group.dir}</h5>
                <ul className="ecostat__invList">
                  {group.files.map((file) => (
                    <li className="ecostat__invFile" key={file.name}>
                      <span className="ecostat__invName">{file.name}</span>
                      {file.bytes ? (
                        <span className="ecostat__invBytes">{file.bytes}</span>
                      ) : null}
                      {file.note ? (
                        <span className="ecostat__invNote">{t(file.note, lang)}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {group.note ? (
                  <p className="ecostat__invGroupNote">{t(group.note, lang)}</p>
                ) : null}
              </section>
            ))}
          </div>
        </details>

        {/* Three blocks, one grid, identical weight: the gaps are not a footnote. */}
        <div className="ecostat__trio">
          <article className="ecostat__card" data-accent="assay">
            <header className="ecostat__cardHead">
              <ProvenanceDot provenance="measured" size="sm" detail={HAS_HEAD} />
              <h4 className="ecostat__cardTitle">{t(HAS_HEAD, lang)}</h4>
            </header>
            <Points items={HAS_POINTS} />
            <ul className="ecostat__chips">
              {HAS_FIGURES.map((figure) => (
                <li className="ecostat__chip" key={figure}>
                  {figure}
                </li>
              ))}
            </ul>
            <p className="ecostat__cardNote">{t(HAS_CAVEAT, lang)}</p>
          </article>

          <article className="ecostat__card" data-accent="verdict">
            <header className="ecostat__cardHead">
              <ProvenanceDot provenance="measured" size="sm" detail={LACKS_HEAD} />
              <h4 className="ecostat__cardTitle">{t(LACKS_HEAD, lang)}</h4>
            </header>
            <Points items={LACKS_POINTS} />
          </article>

          <article className="ecostat__card" data-accent="flow">
            <header className="ecostat__cardHead">
              <ProvenanceDot provenance="claimed" size="sm" detail={IFACE_HEAD} />
              <h4 className="ecostat__cardTitle">{t(IFACE_HEAD, lang)}</h4>
            </header>
            <p className="ecostat__cardLede">{t(IFACE_LEDE, lang)}</p>
            <ul className="ecostat__ifaceList">
              {IFACE_NAMES.map((name) => (
                <li className="ecostat__ifaceName" key={name}>
                  {name}
                </li>
              ))}
            </ul>
            <p className="ecostat__ifaceContract">
              <span className="ecostat__ifaceContractLabel">{t(IFACE_CONTRACT_LABEL, lang)}</span>
              <span className="ecostat__ifaceContractFile">{IFACE_CONTRACT}</span>
            </p>
            <p className="ecostat__cardNote">{t(IFACE_CLAIM, lang)}</p>
          </article>
        </div>
      </section>

      {/* ── (4) the proposal ───────────────────────────────────────── */}
      <section className="ecostat__part" aria-labelledby="ecostat-proposal">
        <header className="ecostat__head">
          <span className="ecostat__kicker u-kicker">{t(PROPOSAL_KICKER, lang)}</span>
          <h3 className="ecostat__title u-display" id="ecostat-proposal">
            {t(PROPOSAL_TITLE, lang)}
          </h3>
        </header>

        <article className="ecostat__card ecostat__card--wide" data-accent="flow">
          <p className="ecostat__driver">
            <ProvenanceDot provenance="measured" size="sm" detail={PROPOSAL_DRIVER} />
            <span>{t(PROPOSAL_DRIVER, lang)}</span>
          </p>

          <p className="ecostat__cardNote ecostat__cardNote--claim">
            <ProvenanceDot provenance="claimed" size="sm" detail={PROPOSAL_CLAIM} />
            <span>{t(PROPOSAL_CLAIM, lang)}</span>
          </p>

          <figure className="ecostat__codeFig">
            <figcaption className="ecostat__codeHead">
              <span>{t(PROPOSAL_CODE_HEAD, lang)}</span>
              <span className="ecostat__codeStamp">{t(PROPOSAL_STAMP, lang)}</span>
            </figcaption>
            <pre className="ecostat__code" tabIndex={0}>
              <code>{PROPOSAL_CODE}</code>
            </pre>
          </figure>

          <p className="ecostat__cardNote">{t(PROPOSAL_FIELDS, lang)}</p>
        </article>
      </section>

      {/* ── boundary: rendered, never a code comment ───────────────── */}
      <aside className="ecostat__boundary" aria-labelledby="ecostat-boundary">
        <span className="ecostat__boundaryStamp" id="ecostat-boundary">
          {t(BOUNDARY_STAMP, lang)}
        </span>
        <p className="ecostat__boundaryBody">{t(BOUNDARY_BODY, lang)}</p>
        <p className="ecostat__boundaryHead">{t(BOUNDARY_HEAD, lang)}</p>
        <ul className="ecostat__boundaryList">
          {BOUNDARY_GAPS.map((gap) => {
            const text = t(gap, lang);
            return <li key={text}>{text}</li>;
          })}
        </ul>
      </aside>
    </div>
  );
}
