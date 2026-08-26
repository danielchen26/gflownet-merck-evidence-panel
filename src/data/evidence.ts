import type { Datum, EvidenceTable, FunnelStage, Source } from './types';

/**
 * 一手来源字典。
 *
 * 全部条目逐字取自决策备忘录《GFlowNet 是否适合作为 Merck 小分子药物生成的未来框架？》
 * （v2 终版 · 2026-08-25）。`firsthand: true` 仅给备忘录中明确标注
 * "本人直接核对" / "一手正文已取回" / "已交叉核对" 的来源。
 *
 * `url: ''` 表示备忘录引用了该来源但**未附一手 URL**（rxnflow2025 / synformer2025 /
 * molpal2021 / semlaflow）。为避免编造链接，此处留空 —— 渲染层应把空 url 当作
 * 纯文本而非超链接。
 */
const S = {
  bengio2021: {
    title: 'Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation',
    venue: 'E. Bengio et al., NeurIPS 2021',
    url: 'https://arxiv.org/abs/2106.04399',
    firsthand: false,
  },
  tiapkin2024: {
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
  rtbTrustPcl2025: {
    title: 'Relative Trajectory Balance ≡ Trust-PCL (off-policy KL 正则 RL)',
    venue: 'Deleu, Nouri, Y. Bengio, Precup, 2025-09',
    url: 'https://arxiv.org/abs/2509.01632',
    firsthand: false,
  },
  pmo2022: {
    title: 'Sample Efficiency Matters: A Benchmark for Practical Molecular Optimization',
    venue: 'Gao / Fu / Sun / Coley — NeurIPS 2022',
    url: 'https://arxiv.org/pdf/2206.12411v2',
    firsthand: true,
  },
  geneticGfn2024: {
    title: 'Genetic-guided GFlowNets for Sample Efficient Molecular Optimization',
    venue: 'Kim et al. — NeurIPS 2024',
    url: 'https://arxiv.org/abs/2402.05961',
    firsthand: true,
  },
  renz2024: {
    title: 'Diverse Hits in De Novo Molecule Design: Diversity-Based Comparison of Goal-Directed Generators',
    venue: 'Renz, Luukkonen & Klambauer — JCIM 64(15):5756–5761 (2024)；数值取自作者官方仓库 ml-jku/diverse-hits 的 results_allmetrics_samples.tex',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11323242/',
    firsthand: true,
  },
  xie2023: {
    title: 'How Much Space Has Been Explored? Measuring the Chemical Space Covered by Databases and Machine-Generated Molecules',
    venue: 'Xie, Xu, Ma & Mei — ICLR 2023',
    url: 'https://openreview.net/forum?id=Yo06F8kfMa1',
    firsthand: false,
  },
  saturn: {
    title: 'Saturn: Sample-efficient Generative Molecular Design using Memory Manipulation',
    venue: 'Guo & Schwaller, 2024',
    url: 'https://arxiv.org/abs/2405.17066',
    firsthand: false,
  },
  synga2026: {
    title: 'A Genetic Algorithm for Navigating Synthesizable Molecular Spaces (SynGA / SynGBO)',
    venue: 'Lo, Coley, Matusik — ICLR 2026',
    url: 'https://proceedings.iclr.cc/paper_files/paper/2026/file/3f61ff6252d38ea099cea2246cec7fa6-Paper-Conference.pdf',
    firsthand: true,
  },
  s3gfn2026: {
    title: 'Synthesizable Molecular Generation via Soft-constrained GFlowNets (S3-GFN)',
    venue: 'Kim, …, Y. Bengio, Hernandez-Garcia, 2026-02',
    url: 'https://arxiv.org/abs/2602.04119',
    firsthand: true,
  },
  synflownet2025: {
    title: 'SynFlowNet: Design of Diverse and Novel Molecules with Synthesis Constraints',
    venue: 'ICLR 2025',
    url: 'https://arxiv.org/pdf/2405.01155',
    firsthand: false,
  },
  rxnflow2025: {
    title: 'RxnFlow (reaction-flow GFlowNet)',
    venue: 'ICLR 2025 —— 备忘录未附一手 URL',
    url: '',
    firsthand: false,
  },
  rgfn2024: {
    title: 'RGFN: Synthesizable Molecular Generation Using GFlowNets',
    venue: 'NeurIPS 2024 (附录 N 成本表；RGFN 侧数字已与原文 Table 交叉核对)',
    url: 'https://arxiv.org/abs/2406.08506',
    firsthand: true,
  },
  guoSchwaller2025: {
    title: 'Directly Optimizing for Synthesizability in Generative Molecular Design Using Retrosynthesis Models',
    venue: 'Guo & Schwaller — RSC Chem Sci 16:6943 (2025)',
    url: 'https://arxiv.org/html/2407.12186v1',
    firsthand: true,
  },
  guoGranular2025: {
    title: 'Generative Molecular Design with Granular Synthesizability Control (BRD4 / Wee1 湿实验)',
    venue: 'Guo et al., 2025',
    url: 'https://arxiv.org/abs/2505.08774',
    firsthand: false,
  },
  reasyn2025: {
    title: 'ReaSyn: Synthesizable Molecular Generation via Chain-of-Reaction',
    venue: 'NVIDIA / KAIST, arXiv 2509.16084',
    url: 'https://arxiv.org/abs/2509.16084',
    firsthand: false,
  },
  synformer2025: {
    title: 'SynFormer: Generative Design of Synthesizable Molecules',
    venue: 'PNAS 122(41):e2415665122, 2025 —— 备忘录未附一手 URL',
    url: '',
    firsthand: false,
  },
  scent2025: {
    title: 'SCENT: Cost-aware Synthesizable Molecular Generation',
    venue: 'Gaiński et al. — NeurIPS 2025, arXiv 2506.19865 (koziarskilab)',
    url: 'https://arxiv.org/abs/2506.19865',
    firsthand: false,
  },
  agfn2025: {
    title: 'A-GFN: Atomic GFlowNets with pretraining and goal-conditioned fine-tuning',
    venue: 'ICML 2025',
    url: 'https://arxiv.org/abs/2503.06337',
    firsthand: false,
  },
  synthemolRl: {
    title: 'SyntheMol-RL: generative AI for antibiotic discovery in combinatorial chemical space',
    venue: 'Mol Syst Biol 2026',
    url: 'https://link.springer.com/article/10.1038/s44320-026-00206-9',
    firsthand: false,
  },
  merckBlog: {
    title: 'Generative AI to Design Small Molecule Therapeutics: Lessons from a Stanford/Merck collaboration',
    venue: 'Swanson (Stanford CS), Zou (Stanford BDS), Chiriac, Cheng (Discovery Chemistry, Merck & Co., South San Francisco)，2026-04-27；正文从 JS bundle 逐字提取',
    url: 'https://swansonkyle.com/blog/synthemol-merck',
    firsthand: true,
  },
  schrodingerMalt1: {
    title: 'Hit to Development Candidate in 10 Months: Rapid Discovery of a Novel, Potent MALT1 Inhibitor',
    venue: 'Schrödinger case study (SGR-1505)',
    url: 'https://www.schrodinger.com/life-science/learn/case-studies/hit-development-candidate-10-months-rapid-discovery-novel-potent-malt1-inhibitor/',
    firsthand: false,
  },
  lyu2019: {
    title: 'Ultra-large library docking for discovering new chemotypes',
    venue: 'Lyu et al. — Nature 2019',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6383769/',
    firsthand: false,
  },
  molpal2021: {
    title: 'MolPAL —— 主动学习加速的超大规模 docking surrogate',
    venue: '备忘录 §8.4 引用，未附一手 URL',
    url: '',
    firsthand: false,
  },
  boltz2: {
    title: 'Boltz-2: Towards Accurate and Efficient Binding Affinity Prediction',
    venue: 'MIT / Recursion, 2025-06；代码与权重均 MIT (许可本人核对)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12262699/',
    firsthand: true,
  },
  boltzmol1: {
    title: 'BoltzMol-1 Technical Report',
    venue: 'Boltz.bio, 2026',
    url: 'https://boltz.bio/boltzmol1-technical-report.pdf',
    firsthand: false,
  },
  ross2023: {
    title: 'The maximal and current accuracy of rigorous protein-ligand binding free energy calculations',
    venue: 'Ross et al. — Commun Chem 6:222 (2023)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10576784/',
    firsthand: false,
  },
  sync2026: {
    title: 'SYNC: 可合成性指标的一致性审计',
    venue: 'ICLR 2026',
    url: 'https://proceedings.iclr.cc/paper_files/paper/2026/file/ffdb280e7c7b4c4af30e04daf5a84b98-Paper-Conference.pdf',
    firsthand: true,
  },
  posecheck: {
    title: 'PoseCheck: Generative Models for 3D Structure-based Drug Design Produce Unrealistic Poses',
    venue: 'arXiv 2308.07413',
    url: 'https://arxiv.org/abs/2308.07413',
    firsthand: false,
  },
  semlaflow: {
    title: 'SemlaFlow / FlowMol3 —— 3D flow-matching 分子生成',
    venue: '备忘录 §8 引用，未附一手 URL',
    url: '',
    firsthand: false,
  },
  reinforceIng2025: {
    title: 'REINFORCE-ING Chemical Language Models in Drug Design',
    venue: 'Thomas et al. (AstraZeneca / Acellera)— JCIM 65:12752 (2025)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12690592/',
    firsthand: false,
  },
  recursion10k: {
    title: 'Recursion 官方 platform 页 + FY2025 10-K / Q2-2026 10-Q',
    venue: 'Recursion Pharmaceuticals 公开披露',
    url: 'https://www.recursion.com/platform',
    firsthand: false,
  },
  recursionGflownetRepo: {
    title: 'recursionpharma/gflownet (MIT，默认分支 trunk)',
    venue: 'GitHub 仓库状态',
    url: 'https://github.com/recursionpharma/gflownet',
    firsthand: false,
  },
  hyperlab: {
    title: 'HITS / HyperLab — Hyper Screening X 官方 release note 与定价页',
    venue: 'docs.hits.ai / hyperlab.ai (技术博客：CTO Jaechang Lim 确认以 RxnFlow 为核心技术)',
    url: 'https://docs.hits.ai/hyperlab-release-note-en/',
    firsthand: false,
  },
  aiddison2023: {
    title: 'AIDDISON™: A Software-as-a-Service Platform for AI-Driven Small Molecule Drug Discovery',
    venue: 'Merck KGaA, 2023-12 (本人直接核对)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10777390/',
    firsthand: true,
  },
} satisfies Record<string, Source>;

export const sources: Record<string, Source> = S;

/**
 * 证据表。
 *
 * 约定：`columns[0]` 是 `TableRow.method` 的表头，`TableRow.cells` 依序对应
 * `columns.slice(1)` —— 即 `cells.length === columns.length - 1`。
 */
export const tables: EvidenceTable[] = [
  {
    id: 'pmo-original',
    caption: {
      en: 'PMO as originally published: under a fixed oracle budget fragment GFlowNet ranks 16/25, while random screening of ZINC-250k ranks 19/25',
      zh: 'PMO 原始基准：固定 oracle 预算下 fragment GFlowNet 排 16/25，而随机筛选 ZINC-250k 排 19/25',
    },
    budgetNote: {
      en: '23 oracles · 10k calls · 5 seeds · sum AUC-top10 (max 23)',
      zh: '23 oracle · 10k 调用 · 5 seed · sum AUC-top10（满分 23）',
    },
    columns: [
      { en: 'Method', zh: '方法' },
      { en: 'Sum AUC-top10', zh: 'Sum AUC-top10' },
      { en: 'Rank', zh: 'Rank' },
    ],
    rows: [
      { method: { en: 'REINVENT (SMILES RL)', zh: 'REINVENT (SMILES RL)' }, cells: ['14.196', '1/25'], provenance: 'measured', emphasis: true },
      { method: { en: 'Graph GA', zh: 'Graph GA' }, cells: ['13.751', '2'], provenance: 'measured' },
      { method: { en: 'SELFIES-REINVENT', zh: 'SELFIES-REINVENT' }, cells: ['13.471', '3'], provenance: 'measured' },
      { method: { en: 'GP BO', zh: 'GP BO' }, cells: ['13.156', '4'], provenance: 'measured' },
      { method: { en: 'SynNet (synthesis GA)', zh: 'SynNet (synthesis GA)' }, cells: ['11.498', '8'], provenance: 'measured' },
      { method: { en: 'MARS (MCMC)', zh: 'MARS (MCMC)' }, cells: ['10.651', '12'], provenance: 'measured' },
      { method: { en: 'GFlowNet (fragment)', zh: 'GFlowNet (fragment)' }, cells: ['9.131', '16'], provenance: 'measured', emphasis: true },
      { method: { en: 'Random screening of ZINC-250k', zh: '随机筛选 ZINC-250k' }, cells: ['8.635', '19'], provenance: 'measured', emphasis: true },
      { method: { en: 'GFlowNet-AL', zh: 'GFlowNet-AL' }, cells: ['8.406', '22'], provenance: 'refuted', emphasis: true },
      { method: { en: 'Graph MCTS / MolDQN', zh: 'Graph MCTS / MolDQN' }, cells: ['7.803 / 5.620', '24 / 25'], provenance: 'refuted' },
    ],
    source: S.pmo2022,
  },
  {
    id: 'gfn-variants',
    caption: {
      en: 'GFlowNet variants plus ablations: the credit for SOTA belongs to the GraphGA operators and the REINVENT architecture — GFlowNet is only the replay objective',
      zh: 'GFlowNet 变体对比 + 消融：SOTA 的功劳属于 GraphGA 算子与 REINVENT 架构，GFlowNet 只是 replay 目标',
    },
    budgetNote: {
      en: 'Same codebase, same protocol · PMO sum AUC-top10 · the ablation rows are single-point changes to Genetic GFN',
      zh: '同一 codebase、同一协议 · PMO sum AUC-top10 · 消融行为 Genetic GFN 的单点改动',
    },
    columns: [
      { en: 'Method / ablation', zh: '方法 / 消融' },
      { en: 'Sum AUC-top10', zh: 'Sum AUC-top10' },
    ],
    rows: [
      { method: { en: 'Genetic GFN (SMILES + GraphGA + GFN loss)', zh: 'Genetic GFN（SMILES + GraphGA + GFN loss）' }, cells: ['16.213 ± 0.173'], provenance: 'measured', emphasis: true },
      { method: { en: 'Mol GA', zh: 'Mol GA' }, cells: ['15.686'], provenance: 'measured' },
      { method: { en: 'LS-GFN (local search GFN)', zh: 'LS-GFN（local search GFN）' }, cells: ['15.230 ± 0.026'], provenance: 'measured' },
      { method: { en: 'SMILES REINVENT', zh: 'SMILES REINVENT' }, cells: ['15.185'], provenance: 'measured' },
      { method: { en: 'fragment GFN / GFN-AL', zh: 'fragment GFN / GFN-AL' }, cells: ['9.918 / 9.928'], provenance: 'refuted', emphasis: true },
      { method: { en: 'Ablation: remove KL-to-prior', zh: '消融：去掉 KL-to-prior' }, cells: ['15.928'], provenance: 'measured' },
      { method: { en: 'Ablation: remove genetic search', zh: '消融：去掉 genetic search' }, cells: ['15.738'], provenance: 'measured' },
      { method: { en: 'Ablation: genetic search → GFlowNet\'s native ε-greedy', zh: '消融：genetic search → GFlowNet 原生 ε-greedy' }, cells: ['15.626'], provenance: 'measured', emphasis: true },
      { method: { en: 'Ablation: STONED in place of GraphGA', zh: '消融：STONED 替代 GraphGA' }, cells: ['15.439'], provenance: 'measured' },
    ],
    source: S.geneticGfn2024,
  },
  {
    id: 'renz-circles',
    caption: {
      en: 'Renz 2024 diverse hits (#Circles, D=0.7): the only controlled experiment that at once matches budgets, gives every method a diversity filter, and scores with an axiomatically sound metric',
      zh: 'Renz 2024 diverse hits（#Circles, D=0.7）：唯一同时做到预算匹配、全员装 diversity filter、并用满足公理的指标的对照实验',
    },
    budgetNote: {
      en: '10,000 scoring-function calls · 15 random hyperparameter searches per combination × 5 seeds · the Blaschke 2020 DF (D_DF=0.7) multiplied into every method\'s scoring function · hit = score>0.5',
      zh: '10,000 次 scoring-function 调用 · 每组合 15 次超参随机搜索 × 5 seed · Blaschke 2020 DF（D_DF=0.7）乘进所有方法的 scoring function · hit = score>0.5',
    },
    columns: [
      { en: 'Method', zh: '方法' },
      { en: 'Type', zh: '类型' },
      { en: 'DRD2', zh: 'DRD2' },
      { en: 'GSK3β', zh: 'GSK3β' },
      { en: 'JNK3', zh: 'JNK3' },
    ],
    rows: [
      { method: { en: 'AugMemory', zh: 'AugMemory' }, cells: ['SMILES RL', '81', '636', '176'], provenance: 'measured', emphasis: true },
      { method: { en: 'AugmentedHC', zh: 'AugmentedHC' }, cells: ['SMILES RL', '66', '674', '111'], provenance: 'measured' },
      { method: { en: 'LSTM-HC', zh: 'LSTM-HC' }, cells: ['SMILES HC', '62', '456', '103'], provenance: 'measured' },
      { method: { en: 'BAR', zh: 'BAR' }, cells: ['SMILES RL', '49', '361', '69'], provenance: 'measured' },
      { method: { en: 'Reinvent', zh: 'Reinvent' }, cells: ['SMILES RL', '41', '198', '35'], provenance: 'measured' },
      { method: { en: 'GraphGA', zh: 'GraphGA' }, cells: ['GA (graph)', '21', '115', '24'], provenance: 'measured' },
      { method: { en: 'VS Random (random virtual screening)', zh: 'VS Random（随机虚拟筛选）' }, cells: [{ en: 'Screening baseline', zh: '筛选基线' }, '21', '93', '15'], provenance: 'measured', emphasis: true },
      { method: { en: 'LSTM-PPO', zh: 'LSTM-PPO' }, cells: ['SMILES RL', '14', '108', '13'], provenance: 'measured' },
      { method: { en: 'VS MaxMin', zh: 'VS MaxMin' }, cells: [{ en: 'Screening baseline', zh: '筛选基线' }, '19', '68', '9'], provenance: 'measured' },
      { method: { en: 'Mimosa', zh: 'Mimosa' }, cells: ['graph edits', '6', '23', '8'], provenance: 'measured' },
      { method: { en: 'Mars', zh: 'Mars' }, cells: ['graph edits', '3', '39', '4'], provenance: 'measured' },
      { method: { en: 'SmilesGA', zh: 'SmilesGA' }, cells: ['GA', '3', '27', '4'], provenance: 'measured' },
      { method: { en: 'Stoned', zh: 'Stoned' }, cells: ['GA', '3', '13', '4'], provenance: 'measured' },
      { method: { en: 'GflownetDF (GFN + DF)', zh: 'GflownetDF（GFN + DF）' }, cells: ['GFlowNet', '0', '77', '0'], provenance: 'refuted', emphasis: true },
      { method: { en: 'Gflownet', zh: 'Gflownet' }, cells: ['GFlowNet', '1', '67', '0'], provenance: 'refuted', emphasis: true },
    ],
    source: S.renz2024,
  },
  {
    id: 'beta-sweep',
    caption: {
      en: 'Genetic GFN\'s β sweep: at β=30 it beats both Mol GA and REINVENT on the AUC axis and the Tanimoto diversity axis at the same time — a genuine Pareto improvement, comparable within the paper',
      zh: 'Genetic GFN 的 β 扫描：β=30 处在 AUC 与 Tanimoto 多样性两个轴上同时优于 Mol GA 与 REINVENT —— 论文内部可比的真实 Pareto 改进',
    },
    budgetNote: {
      en: 'The margin (+0.13 AUC) sits at the scale of implementation noise; the metric used is exactly the IntDiv family that Xie et al. refuted axiomatically; by the ablations, the credit for this configuration belongs to GraphGA',
      zh: '幅度（+0.13 AUC）落在实现噪声量级；用的正是被 Xie et al. 公理否证的 IntDiv 类指标；该配置的功劳按消融属于 GraphGA',
    },
    columns: [
      { en: 'β', zh: 'β' },
      { en: 'AUC-top10', zh: 'AUC-top10' },
      { en: 'Diversity (Tanimoto)', zh: 'Diversity (Tanimoto)' },
    ],
    rows: [
      { method: { en: '1', zh: '1' }, cells: ['11.083', '0.812'], provenance: 'measured' },
      { method: { en: '5', zh: '5' }, cells: ['14.597', '0.670'], provenance: 'measured' },
      { method: { en: '10', zh: '10' }, cells: ['14.735', '0.663'], provenance: 'measured' },
      { method: { en: '30', zh: '30' }, cells: ['15.815', '0.528'], provenance: 'measured', emphasis: true },
      { method: { en: '50', zh: '50' }, cells: ['16.213', '0.432'], provenance: 'measured' },
      { method: { en: 'Reference: Mol GA', zh: '参照 Mol GA' }, cells: ['15.686', '0.465'], provenance: 'measured' },
      { method: { en: 'Reference: REINVENT', zh: '参照 REINVENT' }, cells: ['15.185', '0.468'], provenance: 'measured' },
    ],
    source: S.geneticGfn2024,
  },
  {
    id: 'synga-litpcba',
    caption: {
      en: 'LIT-PCBA docking: a GA with no ML core matches or beats every reaction-GFlowNet using 1/4 of the oracle calls',
      zh: 'LIT-PCBA docking：无 ML 内核的 GA 用 1/4 的 oracle 调用追平或超过全部 reaction-GFlowNet',
    },
    budgetNote: {
      en: 'Mean Vina (kcal/mol) over the top-100 diverse modes · 196,907 Enamine building blocks · 91 templates · ≤5 steps · ≤1000 Da · population 500',
      zh: 'top-100 diverse modes 平均 Vina (kcal/mol) · 196,907 Enamine building block · 91 template · ≤5 步 · ≤1000 Da · population 500',
    },
    columns: [
      { en: 'Method', zh: '方法' },
      { en: 'Oracle calls', zh: 'oracle 调用' },
      { en: 'Mean Vina (kcal/mol)', zh: '平均 Vina (kcal/mol)' },
    ],
    rows: [
      { method: { en: 'SynGBO (SynGA + BO + neural additive model block filter)', zh: 'SynGBO（SynGA + BO + 神经加性模型 block filter）' }, cells: ['16,000', '−11.11'], provenance: 'measured', emphasis: true },
      { method: { en: 'SynGA (pure GA, no ML in the core)', zh: 'SynGA（纯 GA，核心无 ML）' }, cells: ['16,000', '−10.80'], provenance: 'measured', emphasis: true },
      { method: { en: '3DSynthFlow (GFN)', zh: '3DSynthFlow (GFN)' }, cells: ['64,000', '−10.88'], provenance: 'measured' },
      { method: { en: 'RxnFlow (GFN)', zh: 'RxnFlow (GFN)' }, cells: ['64,000', '−10.45'], provenance: 'refuted' },
      { method: { en: 'SynFlowNet (GFN)', zh: 'SynFlowNet (GFN)' }, cells: ['64,000', '−9.99'], provenance: 'refuted' },
      { method: { en: 'BBAR', zh: 'BBAR' }, cells: ['64,000', '−9.36'], provenance: 'measured' },
      { method: { en: 'RGFN (GFN)', zh: 'RGFN (GFN)' }, cells: ['64,000', '−9.20'], provenance: 'refuted' },
      { method: { en: 'SynNet', zh: 'SynNet' }, cells: ['64,000', '−8.22'], provenance: 'measured' },
    ],
    source: S.synga2026,
  },
  {
    id: 'saturn-vs-rgfn',
    caption: {
      en: 'Putting retrosynthesis straight into the reward: with 1/400 of the oracle budget Saturn beats RGFN across QED, SA and AiZynth — on RGFN\'s own ClpP docking case study',
      zh: '把 retrosynthesis 直接放进 reward：Saturn 用 1/400 的 oracle 预算在 QED / SA / AiZynth 三项全面压过 RGFN —— 在 RGFN 自己的 ClpP docking 案例上',
    },
    budgetNote: {
      en: 'The authors state this is not apples-to-apples: pretraining Saturn on ChEMBL/ZINC already biases it toward synthesizable space; RGFN\'s templates may in some cases better represent "true" synthesizability; no PoseBusters or aggregator filters were applied; wall-time is not 1/400 (AiZynthFinder is the bottleneck)',
      zh: '作者自陈非 apples-to-apples：Saturn 在 ChEMBL/ZINC 上预训练已偏向可合成空间；RGFN template 在某些情况下可能更代表"真正的"可合成性；未施加 PoseBusters 与 aggregator 过滤；wall-time 不是 1/400（AiZynthFinder 是瓶颈）',
    },
    columns: [
      { en: 'Method', zh: '方法' },
      { en: 'Oracle calls', zh: 'oracle 调用' },
      { en: 'MW', zh: 'MW' },
      { en: 'QED', zh: 'QED' },
      { en: 'SA', zh: 'SA' },
      { en: 'AiZynth solve rate', zh: 'AiZynth 可解率' },
    ],
    rows: [
      { method: { en: 'Saturn (RL, 4 objectives)', zh: 'Saturn (RL, 4 目标)' }, cells: [{ en: '1,000 (2.9 h)', zh: '1,000（2.9 h）' }, '367.7', '0.70', '2.11', '0.91'], provenance: 'measured', emphasis: true },
      { method: { en: 'RGFN (GFN)', zh: 'RGFN (GFN)' }, cells: [{ en: '400,000 (72 h)', zh: '400,000（72 h）' }, '526.2', '0.23', '2.83', '0.65'], provenance: 'refuted', emphasis: true },
      { method: { en: 'GraphGA', zh: 'GraphGA' }, cells: ['400,000', '521.0', '0.32', '4.14', '0.00'], provenance: 'measured' },
      { method: { en: 'SyntheMol (MCTS)', zh: 'SyntheMol (MCTS)' }, cells: [{ en: '100,000 (72 h)', zh: '100,000（72 h）' }, '458.2', '0.45', '2.86', '0.56'], provenance: 'measured' },
    ],
    source: S.guoSchwaller2025,
  },
  {
    id: 's3gfn-retro',
    caption: {
      en: '"Templates guarantee synthesizability" does not survive an independent retrosynthesis check: reaction-based GFlowNets reach ≤72% under external AiZynthFinder',
      zh: '"template 保证可合成"经不起独立 retrosynthesis 检验：reaction-based GFlowNet 在外部 AiZynthFinder 下 ≤72%',
    },
    budgetNote: {
      en: 'External AiZynthFinder evaluation + Vina (ADRB2) · the paper itself states that validation is at present limited to in silico',
      zh: '外部 AiZynthFinder 评估 + Vina (ADRB2) · 论文自述"验证目前仅限于 in silico"',
    },
    columns: [
      { en: 'Method', zh: '方法' },
      { en: 'AiZynth success rate', zh: 'AiZynth 成功率' },
      { en: 'Vina ADRB2 (kcal/mol)', zh: 'Vina ADRB2 (kcal/mol)' },
    ],
    rows: [
      { method: { en: 'S3-GFN (SMILES + soft constraints)', zh: 'S3-GFN（SMILES + 软约束）' }, cells: ['96.67–100%', '−12.32'], provenance: 'measured', emphasis: true },
      { method: { en: 'RxnFlow', zh: 'RxnFlow' }, cells: ['60.25–71.25%', '−11.45'], provenance: 'refuted' },
      { method: { en: 'SynFlowNet', zh: 'SynFlowNet' }, cells: ['52.75–57%', '−10.85'], provenance: 'refuted' },
      { method: { en: 'RGFN', zh: 'RGFN' }, cells: ['46.75–50.25%', '−9.84'], provenance: 'refuted' },
    ],
    source: S.s3gfn2026,
  },
];

/**
 * Merck & Co. Program 1（人类酶靶点，历史库 ~8k 个已测 potency 分子）的完整漏斗。
 * 全部数值来自 Stanford/Merck 一手博客正文（§6）。
 */
export const merckFunnel: FunnelStage[] = [
  {
    label: { en: 'Single-seed generation', zh: '单 seed 生成' },
    value: 12796,
    display: '12,796',
    provenance: 'measured',
  },
  {
    label: { en: 'Predicted potency < 100 nM', zh: '预测 potency < 100 nM' },
    value: 522,
    display: '522',
    note: {
      en: 'oracle = an ensemble of 10 Chemprop-RDKit models (experimental potency, LBDD)',
      zh: 'oracle = Chemprop-RDKit 10 模型 ensemble（实验 potency，LBDD）',
    },
    provenance: 'measured',
  },
  {
    label: { en: 'Predicted docking < −50', zh: '预测 docking < −50' },
    value: 2451,
    display: '2,451',
    note: {
      en: 'oracle = an ensemble of 10 Chemprop-RDKit models (~1M docked Enamine REAL molecules, MOE Dock Affinity dG)',
      zh: 'oracle = Chemprop-RDKit 10 模型 ensemble（~1M 已 dock 的 Enamine REAL，MOE Dock Affinity dG）',
    },
    provenance: 'measured',
  },
  {
    label: { en: 'Meets both thresholds at once', zh: '同时满足两个阈值' },
    value: 0,
    display: '0',
    note: {
      en: 'The joint objective is unreachable — the docking threshold had to be relaxed to −40',
      zh: '联合目标不可达 —— 只能把 docking 阈值放宽到 −40',
    },
    provenance: 'refuted',
  },
  {
    label: { en: 'Generation pooled over 5 seeds', zh: '5 seeds 合并生成' },
    value: 60134,
    display: '60,134',
    provenance: 'measured',
  },
  {
    label: { en: 'Passes both thresholds (docking relaxed to −40)', zh: '双阈值通过（docking 放宽到 −40）' },
    value: 810,
    display: '810',
    provenance: 'measured',
  },
  {
    label: { en: 'Candidates after all filters', zh: '全部 filter 后候选' },
    value: 488,
    display: '488',
    provenance: 'measured',
  },
  {
    label: { en: 'Hand-picked and ordered', zh: '人工挑选订购' },
    value: 191,
    display: '191',
    provenance: 'measured',
  },
  {
    label: { en: 'Actually delivered by Enamine and assayed', zh: 'Enamine 实际交付并测活' },
    value: 111,
    display: '111（58%）',
    note: {
      en: '59 dropped for synthetic difficulty, 21 for insufficient yield — make-on-demand delivery attrition',
      zh: '59 个因合成难度、21 个因收率不足被剔 —— make-on-demand 交付损耗',
    },
    provenance: 'measured',
  },
  {
    label: { en: 'Measured IC₅₀ < 10 μM', zh: '实测 IC₅₀ < 10 μM' },
    value: 4,
    display: '4',
    note: {
      en: '3.1 / 6.1 / 6.3 / 7.6 μM = 3.6%; the authors state "potencies were weaker than we had hoped"',
      zh: '3.1 / 6.1 / 6.3 / 7.6 μM = 3.6%；作者自陈"potencies were weaker than we had hoped"',
    },
    provenance: 'measured',
  },
  {
    label: {
      en: 'Reference: single-digit nM compounds in the project\'s historical library',
      zh: '对照：项目历史库中单位数 nM 化合物',
    },
    value: 95,
    display: '95 / ~8k',
    note: {
      en: 'Compounds the same project already had before generative design was introduced',
      zh: '同一项目在生成式介入前已有的化合物',
    },
    provenance: 'measured',
  },
];

export const keyData: Datum[] = [
  // —— 理论：GFlowNet 保证什么，以及它与 KL 正则 RL 的等价性 ——
  {
    id: 'maxentEquivalence',
    label: { en: 'The relationship between GFlowNets and MaxEnt RL', zh: 'GFlowNets 与 MaxEnt RL 的关系' },
    value: { en: 'equivalent', zh: '等价' },
    unit: { en: 'up to a correction of the reward function', zh: '至 reward 函数的一个修正项' },
    context: {
      en: 'Verbatim: "one and the same, up to a correction of the reward function"',
      zh: '原话 "one and the same, up to a correction of the reward function"',
    },
    provenance: 'claimed',
    source: S.tiapkin2024,
    note: {
      en: 'AISTATS 2024 Oral. It means "principled diversity" is not exclusive to GFlowNet.',
      zh: 'AISTATS 2024 Oral。意味着"principled 多样性"不专属 GFlowNet。',
    },
  },
  {
    id: 'deleuReduction',
    label: {
      en: 'RL reductions of Trajectory Balance / Modified Detailed Balance',
      zh: 'Trajectory Balance / Modified Detailed Balance 的 RL 归约',
    },
    value: 'TB ≡ PCL',
    unit: { en: 'Modified DB ≡ a Soft Q-Learning variant', zh: 'Modified DB ≡ Soft Q-Learning 变体' },
    context: {
      en: 'Generalises the reward correction to arbitrary MDP structures (Mila / Valence Labs / DeepMind, with Y. Bengio as an author)',
      zh: '把 reward correction 推广到任意 MDP 结构（Mila / Valence Labs / DeepMind，含 Y. Bengio 署名）',
    },
    provenance: 'claimed',
    source: S.deleu2024,
    note: {
      en: 'For SMILES sequence generation P_B(τ|x)=1, so TB degenerates directly into PCL.',
      zh: 'SMILES 序列生成下 P_B(τ|x)=1，TB 直接退化为 PCL。',
    },
  },
  {
    id: 'rtbTrustPcl',
    label: {
      en: 'The relationship between Relative Trajectory Balance and Trust-PCL',
      zh: 'Relative Trajectory Balance 与 Trust-PCL 的关系',
    },
    value: { en: 'equivalent', zh: '等价' },
    unit: { en: 'off-policy KL-regularised RL', zh: 'off-policy KL 正则 RL' },
    context: {
      en: 'RTB is precisely the objective used by the 2026 GFlowNet frontier (S3-GFN)',
      zh: 'RTB 正是 2026 年 GFlowNet 前沿（S3-GFN）所用的目标函数',
    },
    provenance: 'claimed',
    source: S.rtbTrustPcl2025,
    note: {
      en: 'Verbatim: "KL-regularized RL methods achieve comparable performance, offering an alternative perspective to what was previously reported".',
      zh: '原话："KL-regularized RL methods achieve comparable performance, offering an alternative perspective to what was previously reported"。',
    },
  },
  {
    id: 'klToPrior',
    label: {
      en: 'Measured gain of KL-to-prior over REINVENT reward-shaping',
      zh: 'KL-to-prior 相对 REINVENT reward-shaping 的实测增益',
    },
    value: 'validity +18% / exploration +12%',
    unit: {
      en: 'vs reward-shaping at validity +12% / diversity −20%',
      zh: 'vs reward-shaping 的 validity +12% / diversity −20%',
    },
    context: {
      en: 'An independent conclusion from the pharma side — getting GFlowNet\'s properties takes only a loss-level change, not a new framework',
      zh: 'pharma 侧独立结论 —— 想要 GFlowNet 的性质只需 loss 层改动，不需要新框架',
    },
    provenance: 'measured',
    source: S.reinforceIng2025,
  },
  {
    id: 'bengio2021Proxy',
    label: {
      en: 'The molecular experiment the original 2021 GFlowNet paper actually ran',
      zh: '2021 年 GFlowNet 原论文实际跑的分子实验',
    },
    value: { en: '1 proxy task', zh: '1 个 proxy 任务' },
    unit: {
      en: 'fragment assembly · sEH docking MPNN proxy (test MSE 0.6) · a budget of 10⁶ molecules',
      zh: 'fragment 组装 · sEH docking MPNN proxy（测试 MSE 0.6）· 10⁶ 分子预算',
    },
    context: {
      en: 'The reward contains no drug-likeness, no synthesizability and no toxicity; the authors state explicitly that real drug design would require considering more quantities',
      zh: 'reward 里没有类药性、可合成性、毒性；作者明说"对真实药物设计我们需要考虑更多量"',
    },
    provenance: 'measured',
    source: S.bengio2021,
  },

  // —— 固定预算下的硬数字 ——
  {
    id: 'pmoGfnVsRandom',
    label: {
      en: 'GFlowNet vs random screening at PMO\'s fixed budget',
      zh: 'PMO 固定预算下 GFlowNet vs 随机筛选',
    },
    value: '9.131 (16/25) vs 8.635 (19/25)',
    unit: { en: 'sum AUC-top10', zh: 'sum AUC-top10' },
    context: {
      en: '23 oracles · 10k calls · 5 seeds; GFlowNet-AL at 8.406 (22/25) falls below random screening',
      zh: '23 oracle · 10k 调用 · 5 seed；GFlowNet-AL 8.406（22/25）低于随机筛选',
    },
    provenance: 'refuted',
    source: S.pmo2022,
    note: {
      en: 'PMO\'s own causal explanation: methods that assemble token by token or atom by atom from a single starting point are the least data-efficient — they waste a large share of the oracle budget and impose strong requirements on oracle quality; and GFlowNet beats GFlowNet-AL on almost every task — adding a surrogate makes things worse.',
      zh: 'PMO 自己的因果解释：逐 token / 逐原子从单点组装的方法"最数据低效……浪费大量 oracle 预算，并对 oracle 质量提出强要求"；且"GFlowNet 在几乎每个任务上都优于 GFlowNet-AL" —— 加 surrogate 反而更差。',
    },
  },
  {
    id: 'geneticGfnVsFragment',
    label: {
      en: 'Genetic GFN (SMILES) vs fragment GFN (same codebase)',
      zh: 'Genetic GFN（SMILES）vs fragment GFN（同一 codebase）',
    },
    value: '16.213 vs 9.918',
    unit: { en: 'sum AUC-top10', zh: 'sum AUC-top10' },
    context: {
      en: 'The paper\'s own words: generating SMILES is clearly better than generating graph-based fragments',
      zh: '论文原话："生成 SMILES 明显优于生成 graph-based fragment"',
    },
    provenance: 'measured',
    source: S.geneticGfn2024,
    note: {
      en: 'The representation that needs the DAG correction (fragment/graph, multi-path) is exactly the one that loses empirically — the setting where GFlowNet holds a unique theoretical advantage is precisely the setting where it loses.',
      zh: '需要 DAG 修正的表示（fragment/graph，多路径）正是经验上输的那个 —— GFlowNet 有独特理论优势的设定恰是它输的设定。',
    },
  },
  {
    id: 'geneticGfnAblation',
    label: {
      en: 'Genetic GFN ablation: swapping genetic search back for GFlowNet\'s native ε-greedy',
      zh: 'Genetic GFN 消融：把 genetic search 换回 GFlowNet 原生 ε-greedy',
    },
    value: '16.213 → 15.626',
    unit: { en: 'sum AUC-top10', zh: 'sum AUC-top10' },
    context: {
      en: 'Remove genetic search 15.738 / STONED in place of GraphGA 15.439 / remove KL-to-prior 15.928',
      zh: '去掉 genetic search 15.738 / STONED 替代 GraphGA 15.439 / 去掉 KL-to-prior 15.928',
    },
    provenance: 'measured',
    source: S.geneticGfn2024,
    note: {
      en: 'The credit for SOTA belongs to the GraphGA operators plus the REINVENT architecture and its KL regularisation; GFlowNet is only the replay objective.',
      zh: 'SOTA 的功劳属于 GraphGA 算子 + REINVENT 架构与 KL 正则；GFlowNet 只是 replay 目标。',
    },
  },
  {
    id: 'dockingSarsCov2',
    label: {
      en: 'SARS-CoV-2 docking (mean Top-100 score): vanilla GFlowNet vs REINVENT',
      zh: 'SARS-CoV-2 docking（Top-100 平均分）：vanilla GFlowNet vs REINVENT',
    },
    value: '0.326 / 0.280 vs 0.717 / 0.799',
    context: {
      en: 'Table 5 of the same source; GraphGA 0.723/0.786, MolRL-MGPT 0.772/0.854, Genetic GFN (1000 steps) 0.925/0.902',
      zh: '同一来源 Table 5；GraphGA 0.723/0.786、MolRL-MGPT 0.772/0.854、Genetic GFN(1000 步) 0.925/0.902',
    },
    provenance: 'refuted',
    source: S.geneticGfn2024,
    note: {
      en: 'Vanilla GFlowNet reaches only about 45% of REINVENT.',
      zh: 'vanilla GFlowNet 只有 REINVENT 的约 45%。',
    },
  },

  // —— 多样性论点 ——
  {
    id: 'gfnDrd2Jnk3',
    label: {
      en: 'Diverse hits GFlowNet finds on DRD2 / JNK3',
      zh: 'GFlowNet 在 DRD2 / JNK3 上找到的 diverse hits',
    },
    value: { en: '1 / 0 (0 / 0 once the DF is on)', zh: '1 / 0（装 DF 后 0 / 0）' },
    unit: { en: '#Circles, D=0.7', zh: '#Circles, D=0.7' },
    context: {
      en: 'A budget of 10,000 calls; at the same budget VS Random gets 21 / 15 and AugMemory 81 / 176',
      zh: '10,000 调用预算；同预算下 VS Random 为 21 / 15，AugMemory 为 81 / 176',
    },
    provenance: 'refuted',
    source: S.renz2024,
    note: {
      en: 'The same at the 600 s budget: Gflownet 0/112/0, GflownetDF 0/87/0. The IntDiv column reads 0.00±0.00 — with not a single hit found, the metric is undefined. The authors\' verdict: "We also found Mars and GFlowNet to perform poorly in this comparison, despite comparing well in previous diverse optimization studies."',
      zh: '600 s 预算下同样：Gflownet 0/112/0、GflownetDF 0/87/0。IntDiv 列是 0.00±0.00 —— 因为一个 hit 都没找到，指标无定义。作者判决："We also found Mars and GFlowNet to perform poorly in this comparison, despite comparing well in previous diverse optimization studies."',
    },
  },
  {
    id: 'intDivAxioms',
    label: {
      en: 'Number of diversity axioms internal diversity (IntDiv) satisfies',
      zh: 'internal diversity (IntDiv) 满足的多样性公理数',
    },
    value: '1 / 3',
    unit: {
      en: 'Dissimilarity only; violates Monotonicity and Subadditivity',
      zh: '仅 Dissimilarity；违反 Monotonicity 与 Subadditivity',
    },
    context: {
      en: '#Circles is the only measure that satisfies all three axioms at once; correlation with the number of biological function classes: IntDiv Medium/Low, #Circles High/High',
      zh: '#Circles 是唯一同时满足三条公理的度量；与"生物功能类别数"的相关性：IntDiv Medium/Low，#Circles High/High',
    },
    provenance: 'refuted',
    source: S.xie2023,
    note: {
      en: 'The verdict verbatim: "the widely used Diversity measure is rendered inferior both analytically and empirically"; and the subsection conclusion: "Diversity should be avoided as a descriptor for exploration". Boundary: Xie et al. did not test GFlowNet. Every diversity number reported in the GFlowNet molecular papers is Tanimoto diversity or mode count.',
      zh: '判决原话："the widely used Diversity measure is rendered inferior both analytically and empirically"；小节结论："Diversity should be avoided as a descriptor for exploration"。边界：Xie et al. 并未测试 GFlowNet。所有 GFlowNet 分子论文报告的多样性都是 Tanimoto diversity 或 mode count。',
    },
  },
  {
    id: 'saturnScaffolds',
    label: {
      en: 'Unique scaffolds that Saturn\'s scaffold penalty + Selective Memory Purge yield on DRD2',
      zh: 'Saturn 的 scaffold 惩罚 + Selective Memory Purge 在 DRD2 上产出的 unique scaffold',
    },
    value: '310 ± 70',
    unit: { en: 'unique Bemis-Murcko scaffolds', zh: 'unique Bemis-Murcko scaffold' },
    context: {
      en: 'A budget of 1,000 calls; the Augmented Memory baseline reaches only 22 ± 7; AChE 400 ± 96',
      zh: '1,000 调用预算；Augmented Memory baseline 仅 22 ± 7；AChE 400 ± 96',
    },
    provenance: 'measured',
    source: S.saturn,
    note: {
      en: 'Mechanism: once the same scaffold appears more than M=10 times its reward is truncated to 0, and the penalised scaffold is purged from the replay buffer before Augmented Memory runs. "RL with guards in place" is enough to get coverage.',
      zh: '机制：同一 scaffold 超过 M=10 次则 reward 截断为 0，并在执行 Augmented Memory 前把被罚 scaffold 从 replay buffer 清除。"设防过的 RL"就能拿到覆盖度。',
    },
  },
  {
    id: 'saturnGeamCircles',
    label: {
      en: 'The diversity trade-off Saturn reports on itself: #Circles vs fragment-based GEAM',
      zh: 'Saturn 自陈的多样性 trade-off：#Circles vs fragment-based GEAM',
    },
    value: '3–17 vs 7–25',
    unit: { en: '#Circles, t=0.75', zh: '#Circles, t=0.75' },
    context: {
      en: 'A budget of 3,000 with a strict filter (QED>0.7 & SA<3); parp1: 5±0 vs 14±3',
      zh: '3,000 预算、strict filter（QED>0.7 & SA<3）；parp1: 5±0 vs 14±3',
    },
    provenance: 'measured',
    source: S.saturn,
    note: {
      en: 'The authors\' own words, "trading off diversity to do so", together with their argument: "when using lower-fidelity oracles, more false positives means it is beneficial to have more diverse ideas for downstream triaging." → If hit finding really does need coverage, the right comparison group is GEAM / GraphGA / LSTM-HC / AugMemory, not GFlowNet.',
      zh: '作者原话"trading off diversity to do so"，并论证："when using lower-fidelity oracles, more false positives means it is beneficial to have more diverse ideas for downstream triaging." → 若 hit finding 确需覆盖度，正确对照组是 GEAM / GraphGA / LSTM-HC / AugMemory，而不是 GFlowNet。',
    },
  },

  // —— 功劳属于 action space ——
  {
    id: 'fragmentToReaction',
    label: {
      en: 'What fragment MDP → reaction MDP does to the AiZynthFinder success rate',
      zh: 'fragment MDP → reaction MDP 使 AiZynthFinder 成功率',
    },
    value: '0% → 62%',
    unit: { en: 'independent retrosynthesis success rate', zh: '独立 retrosynthesis 成功率' },
    context: { en: 'The same GFlowNet, only the MDP changes', zh: '同一个 GFlowNet，只换 MDP' },
    provenance: 'measured',
    source: S.synflownet2025,
    note: {
      en: 'The highest-return single change in this memo, and entirely unrelated to the flow objective — a GA or RL gets it just as well.',
      zh: '本备忘录中投入产出比最高的单点改动，且与 flow 目标完全无关 —— 用 GA 或 RL 都能拿到。',
    },
  },
  {
    id: 'reasynGaVsGfn',
    label: {
      en: 'Same reaction MDP, different sampler: Graph GA-ReaSyn vs SynFlowNet',
      zh: '同一 reaction MDP 换 sampler：Graph GA-ReaSyn vs SynFlowNet',
    },
    value: '0.96 / 0.97 vs 0.92 / 0.65',
    unit: { en: 'sEH score / AiZynth success rate', zh: 'sEH 分 / AiZynth 成功率' },
    context: { en: 'ReaSyn (NVIDIA / KAIST)', zh: 'ReaSyn（NVIDIA / KAIST）' },
    provenance: 'measured',
    source: S.reasyn2025,
  },
  {
    id: 'syngaPmo',
    label: {
      en: '2026 PMO SOTA: SynGBO (synthesis-constrained GA + BO)',
      zh: '2026 年 PMO SOTA：SynGBO（受合成约束的 GA + BO）',
    },
    value: '16.426',
    unit: { en: 'sum AUC-top10 (22 tasks)', zh: 'sum AUC-top10（22 任务）' },
    context: {
      en: '> GPBO 16.304 ≈ f-RAG 16.301 > Genetic GFN 16.078 > MolGA 15.686 > REINVENT 15.003 > SynGA 13.366 > SynNet 12.610',
      zh: '> GPBO 16.304 ≈ f-RAG 16.301 > Genetic GFN 16.078 > MolGA 15.686 > REINVENT 15.003 > SynGA 13.366 > SynNet 12.610',
    },
    provenance: 'measured',
    source: S.synga2026,
    note: {
      en: 'GPBO, f-RAG and Genetic GFN all embed MolGA/GraphGA. The authors\' own words: strikingly, SynGA achieves docking scores better than every baseline except 3DSynthFlow while using only a quarter of the oracle calls.',
      zh: 'GPBO / f-RAG / Genetic GFN 三者都内嵌 MolGA/GraphGA。作者原话："令人惊讶的是，SynGA 仅用四分之一的 oracle 调用就取得了优于除 3DSynthFlow 之外所有 baseline 的 docking 分数。"',
    },
  },
  {
    id: 'blockFilter',
    label: {
      en: 'The entire role of ML inside SynGBO: a fingerprint MLP block filter',
      zh: 'SynGBO 里 ML 的全部作用：fingerprint MLP block filter',
    },
    value: '196,907 → 117',
    unit: { en: 'number of candidate building blocks', zh: '候选 building block 数' },
    context: { en: 'AUROC 0.999; Morgan similarity 0.459 → 0.721', zh: 'AUROC 0.999；Morgan 相似度 0.459 → 0.721' },
    provenance: 'measured',
    source: S.synga2026,
  },
  {
    id: 'aizynthReactionGfn',
    label: {
      en: 'Ceiling on the success rate of reaction-based GFlowNets under external AiZynthFinder',
      zh: 'reaction-based GFlowNet 在外部 AiZynthFinder 下的成功率上限',
    },
    value: '≤72%',
    unit: {
      en: 'RxnFlow 60.25–71.25% / SynFlowNet 52.75–57% / RGFN 46.75–50.25%',
      zh: 'RxnFlow 60.25–71.25% / SynFlowNet 52.75–57% / RGFN 46.75–50.25%',
    },
    context: {
      en: 'S3-GFN (SMILES + soft constraints) reaches 96.67–100% under the same evaluation',
      zh: 'S3-GFN（SMILES + 软约束）同一评估下 96.67–100%',
    },
    provenance: 'measured',
    source: S.s3gfn2026,
    note: {
      en: 'The paper\'s wording: this reflects a mismatch between internal templates and independent retrosynthesis. The same paper states outright that reaction-based MDPs lack flexibility and scalability and encode a fixed notion of synthesizability — the GFlowNet frontier has itself abandoned the reaction MDP.',
      zh: '论文措辞：这反映"内部 template 与独立 retrosynthesis 之间的错配"。同一篇论文明言 reaction-based MDP"缺乏灵活性与可扩展性""编码了固定的可合成性概念" —— GFlowNet 前沿本身已放弃 reaction MDP。',
    },
  },
  {
    id: 's3gfnRewardShaping',
    label: {
      en: 'Fragility of the GFlowNet objective under reward shaping (GSK3β)',
      zh: 'GFlowNet 目标对 reward shaping 的脆弱性（GSK3β）',
    },
    value: '0.830 vs 0.502',
    unit: {
      en: 'AUC-top10 (REINVENT+RS vs GFlowNet RTB+RS)',
      zh: 'AUC-top10（REINVENT+RS vs GFlowNet RTB+RS）',
    },
    context: {
      en: 'S3-GFN\'s own 0.807 is still below REINVENT+RS; only once genetic exploration is added back does it lead within the GFN family',
      zh: 'S3-GFN 自身 0.807 仍低于 REINVENT+RS；只有再加回 genetic exploration 才在 GFN 家族内领先',
    },
    provenance: 'measured',
    source: S.s3gfn2026,
    note: {
      en: 'With genetic exploration added back, the paper describes itself as comparable to strong non-GFN baselines such as GraphGA-ReaSyn and SynGA.',
      zh: '加回 genetic exploration 后论文自陈"与 GraphGA-ReaSyn、SynGA 等强非 GFN baseline 相当"。',
    },
  },
  {
    id: 'synformerProjection',
    label: {
      en: 'The cost of projecting into synthesizable space after the fact (reported by the SynFormer authors)',
      zh: '"事后投影"到可合成空间的代价（SynFormer 作者自陈）',
    },
    value: 'Tanimoto → 0.186',
    context: {
      en: 'And a large loss of objective score — the projection has to live inside the loop; the best configuration is GraphGA-SF (GraphGA with SynFormer projection as the mutation)',
      zh: '并大幅损失目标分 —— 投影必须在环内；最优配置是 GraphGA-SF（GraphGA + SynFormer 投影作 mutation）',
    },
    provenance: 'measured',
    source: S.synformer2025,
    note: {
      en: 'SynFormer\'s own RL fine-tuning is less sample-efficient than GraphGA / REINVENT.',
      zh: 'SynFormer 自己的 RL fine-tune 样本效率低于 GraphGA / REINVENT。',
    },
  },
  {
    id: 'rxnflowPatches',
    label: {
      en: 'The patches RxnFlow adds to cope with a large action space and docking hacking',
      zh: 'RxnFlow 为对付大动作空间与 docking hack 所加的补丁',
    },
    value: {
      en: '1% action subsampling + a hard constraint QED>0.5',
      zh: '1% 动作子采样 + 硬约束 QED>0.5',
    },
    unit: { en: 'importance-weighted action subsampling', zh: 'importance-weighted 动作子采样' },
    context: {
      en: 'Three mutually different patches sit on the same scalability wall: fingerprint action embedding (RGFN), fixed logits from a Morgan matrix (SynFlowNet), 1% subsampling (RxnFlow)',
      zh: '同一面扩展性墙上有三个互不相同的补丁：fingerprint action embedding (RGFN)、Morgan 矩阵固定 logits (SynFlowNet)、1% 子采样 (RxnFlow)',
    },
    provenance: 'measured',
    source: S.rxnflow2025,
  },
  {
    id: 'synflownetBackward',
    label: {
      en: 'Fraction of backward trajectories in reaction space that get back to s₀ (uniform backward policy)',
      zh: 'reaction 空间里能回到 s₀ 的反向轨迹比例（均匀 backward policy）',
    },
    value: '11.0 ± 3.7%',
    context: {
      en: 'SynFlowNet Table 2 — a uniform P_B hands flow to parent states that cannot be decomposed backwards',
      zh: 'SynFlowNet Table 2 —— 均匀 P_B 会把 flow 分给不可反向分解的父状态',
    },
    provenance: 'measured',
    source: S.synflownet2025,
    note: {
      en: 'Fixing it requires a separate objective for P_B (MaxLikelihood 99.3% / REINFORCE 100.0% on the training set), while the "free" P_B that TB trains generalises catastrophically: only 1.0 ± 0.8% held-out.',
      zh: '修正需给 P_B 单独目标（MaxLikelihood 99.3% / REINFORCE 100.0% 训练集），而 TB 训练出的"free" P_B 泛化灾难性：held-out 仅 1.0 ± 0.8%。',
    },
  },
  {
    id: 'rgfnCost',
    label: {
      en: 'Per-molecule synthesis cost, RGFN vs SyntheMol (the only hard per-molecule cost data)',
      zh: 'RGFN vs SyntheMol 的逐分子合成成本（唯一逐分子成本硬数据）',
    },
    value: '$2.06 vs $152.57',
    unit: { en: 'mean, per 0.1 mmol (≈74× apart)', zh: '均值，每 0.1 mmol（≈74× 差）' },
    context: {
      en: 'RGFN Appendix N, top-10 ClpP ligands: RGFN $1.37–3.93 / SyntheMol $17.68–263.95 (1 not synthesizable)',
      zh: 'RGFN 附录 N，top-10 ClpP 配体：RGFN $1.37–3.93 / SyntheMol $17.68–263.95（1 个不可合成）',
    },
    provenance: 'measured',
    source: S.rgfn2024,
    note: {
      en: 'The price: RGFN takes 4 steps at a theoretical yield of 55–70%; SyntheMol takes 1 step at 90–95%. This is a real advantage of the reaction MDP, and again unrelated to the flow objective.',
      zh: '代价：RGFN 4 步、理论收率 55–70%；SyntheMol 1 步、90–95%。这是 reaction-MDP 的真实优势，同样与 flow 目标无关。',
    },
  },
  {
    id: 'scentCost',
    label: {
      en: 'What SCENT\'s cost-aware reward does to RGFN (sEH SMALL)',
      zh: 'SCENT 成本感知 reward 对 RGFN 的效果（sEH SMALL）',
    },
    value: { en: '37.7 → 19.7 (−48%)', zh: '37.7 → 19.7（−48%）' },
    unit: { en: 'cost; modes at the same time 4755 → 37714 (7.9×)', zh: '成本；同时 modes 4755 → 37714（7.9×）' },
    context: {
      en: 'MEDIUM setting 1268 → 1117 (−12%); the cost model is a recursive product of building-block spot price ÷ reaction yield',
      zh: 'MEDIUM 设定 1268 → 1117（−12%）；成本模型 = 建块现货价 ÷ 反应收率的递归乘积',
    },
    provenance: 'measured',
    source: S.scent2025,
    note: {
      en: 'The cost columns for SynFlowNet / RxnFlow are empty, and there is no cross-paradigm (GA / Saturn) cost comparison — this line of evidence is GFN-internal only.',
      zh: 'SynFlowNet / RxnFlow 的成本列是空的，也没有跨范式（GA / Saturn）成本对比 —— 这条线只有 GFN 内部对比。',
    },
  },
  {
    id: 'agfnForgetting',
    label: { en: 'Failure mode of plain TB fine-tuning', zh: '普通 TB 微调的失效模式' },
    value: 'catastrophic forgetting',
    unit: {
      en: 'loses the ability to generate chemically valid, drug-like molecules',
      zh: '丧失生成化学有效、类药分子的能力',
    },
    context: {
      en: 'A-GFN (ICML 2025); over-training RTB collapses diversity/uniqueness; on simple single-objective tasks plain TB actually beats RTB',
      zh: 'A-GFN (ICML 2025)；RTB 过训练则 diversity/uniqueness 坍缩；简单单目标任务上普通 TB 反而胜 RTB',
    },
    provenance: 'measured',
    source: S.agfn2025,
  },

  // —— 湿实验不对称 ——
  {
    id: 'gfnSynthesized',
    label: {
      en: 'Total molecules any GFlowNet method has synthesized and assayed',
      zh: '任何 GFlowNet 方法合成并测活的分子总数',
    },
    value: '0',
    unit: { en: 'molecules', zh: '个' },
    context: {
      en: 'Across RGFN (NeurIPS 2024), SynFlowNet (ICLR 2025), RxnFlow (ICLR 2025), TacoGFN (TMLR 2024), A-GFN (ICML 2025), CGFlow (ICML 2025) and S3-GFN (2026) — all in silico',
      zh: '横跨 RGFN (NeurIPS 2024)、SynFlowNet (ICLR 2025)、RxnFlow (ICLR 2025)、TacoGFN (TMLR 2024)、A-GFN (ICML 2025)、CGFlow (ICML 2025)、S3-GFN (2026) 全部 in silico',
    },
    provenance: 'refuted',
    source: S.rgfn2024,
    note: {
      en: 'The strongest claim stops at expert chemists reviewing molecules by hand and confirming they are synthesizable (RGFN), plus a cost analysis and proposed routes.',
      zh: '最强主张止于"专家化学家人工审阅确认可合成"（RGFN）+ 成本分析 + 路线图。',
    },
  },
  {
    id: 'synthemolAcademic',
    label: {
      en: 'Wet-lab readout of the academic SyntheMol-RL line (Stanford/McMaster)',
      zh: 'SyntheMol-RL 学术线（Stanford/McMaster）的湿实验读出',
    },
    value: '79 → 13 / 7 / 1',
    unit: {
      en: 'synthesized and assayed → strongly active / structurally novel / effective in an animal model',
      zh: '合成测活 → 强活性 / 结构新颖 / 动物模型有效',
    },
    context: {
      en: '13 strongly active in vitro = 16.5%; one of them (synthecin) is effective in a mouse MRSA model',
      zh: '13 个 in vitro 强活性 = 16.5%；1 个（synthecin）在小鼠 MRSA 模型有效',
    },
    provenance: 'measured',
    source: S.synthemolRl,
  },
  {
    id: 'guoBrd4',
    label: {
      en: 'RL + granular synthesizability control: BRD4',
      zh: 'RL + granular synthesizability control：BRD4',
    },
    value: '6 / 6 → 2',
    unit: { en: 'all synthesized → µM binders', zh: '全合成 → µM binder' },
    context: { en: 'Saturn family, wet-lab readout', zh: 'Saturn 系，湿实验读出' },
    provenance: 'measured',
    source: S.guoGranular2025,
  },
  {
    id: 'guoWee1',
    label: {
      en: 'RL + granular synthesizability control: Wee1',
      zh: 'RL + granular synthesizability control：Wee1',
    },
    value: '60 → 1',
    unit: { en: 'synthesized and assayed → µM binder', zh: '合成测活 → µM binder' },
    context: {
      en: 'A 142B space, a single 8 GB GPU, and only about 320k molecules generated (0.00023% of the library)',
      zh: '142B 空间、单张 8 GB GPU、只生成约 320k 分子（库的 0.00023%）',
    },
    provenance: 'measured',
    source: S.guoGranular2025,
  },
  {
    id: 'malt1',
    label: {
      en: 'AL + FEP+ physics loop (Schrödinger MALT1)',
      zh: 'AL + FEP+ 物理闭环（Schrödinger MALT1）',
    },
    value: '78 / 129',
    unit: {
      en: 'synthesized and assayed / total synthesized — 10 months to a development candidate',
      zh: '合成测活 / 合成总数 —— 10 个月到 development candidate',
    },
    context: {
      en: '8.2B computational evaluations → >1,700 molecules through AL FEP+ in the first 3 months → fewer than 50 syntheses to reach two highly potent series → SGR-1505',
      zh: '8.2B 计算评估 → AL FEP+ 头 3 个月 >1,700 分子 → 合成 <50 即得两个高活性系列 → SGR-1505',
    },
    provenance: 'measured',
    source: S.schrodingerMalt1,
    note: {
      en: 'Single-agent responses in Phase 1 CLL/WM as of 2025-06 — the only firsthand case with a clinical readout. The difference is not the physics; it is the search domain and the synthesizability constraint.',
      zh: '2025-06 Phase 1 CLL/WM 单药应答 —— 唯一有临床读出的一手案例。差别不在物理，在搜索域与可合成性约束。',
    },
  },
  {
    id: 'lyuAmpC',
    label: {
      en: 'Ultra-large-scale docking (non-generative): AmpC hit rate',
      zh: '超大规模 docking（非生成）：AmpC hit rate',
    },
    value: '11%',
    unit: { en: '44 / 549 synthesized and assayed', zh: '44 / 549 合成测活' },
    context: { en: '77 nM after 90 analogues', zh: '90 个类似物后达 77 nM' },
    provenance: 'measured',
    source: S.lyu2019,
  },
  {
    id: 'lyuD4',
    label: {
      en: 'Ultra-large-scale docking (non-generative): D4 top-tranche hit rate',
      zh: '超大规模 docking（非生成）：D4 top tranche hit rate',
    },
    value: '22–26%',
    context: {
      en: 'The best compound is a 180 pM full agonist with 2500× selectivity',
      zh: '最优化合物为 180 pM 全激动剂、2500× 选择性',
    },
    provenance: 'measured',
    source: S.lyu2019,
    note: {
      en: 'Two hard constraints: do not substitute cluster representatives for docking the whole library (confirmed actives drop 1,121,443 ranks on average, and 47 scaffolds shrink to 2); and keep the medicinal chemists\' visual triage (the hit rate is the same ~24%, but the sub-micromolar fraction is 44% vs 27%).',
      zh: '两条硬约束：不要用 cluster 代表分子代替全库 docking（确认活性分子平均掉 1,121,443 名，47 个 scaffold 只剩 2 个）；要保留药化专家视觉筛选（hit rate 同为 ~24%，但亚微摩尔比例 44% vs 27%）。',
    },
  },
  {
    id: 'molpalSurrogate',
    label: {
      en: 'Recovery of AL-accelerated ultra-large virtual screening (MolPAL-style surrogate)',
      zh: 'AL 加速的超大规模虚拟筛选（MolPAL 类 surrogate）的回收率',
    },
    value: {
      en: 'docking only 2.4% recovers 87.9% of the top-50k',
      zh: '只 dock 2.4% 即回收 top-50k 的 87.9%',
    },
    unit: {
      en: 'EF 36.6; a single design round already yields 94.9% of the top-1000',
      zh: 'EF 36.6；单轮设计即得 94.9% 的 top-1000',
    },
    context: {
      en: 'Enamine REAL Space 94.5B (169 protocols × 202,620 building blocks, 3–4 week delivery, >80% success rate) — the honest baseline for hit finding, and the very baseline GFlowNet loses to in Renz 2024',
      zh: 'Enamine REAL Space 94.5B（169 protocol × 202,620 building block，3–4 周交付，>80% 成功率）—— hit finding 的诚实基线，也是 Renz 2024 中 GFlowNet 输给的那条基线',
    },
    provenance: 'measured',
    source: S.molpal2021,
    note: {
      en: 'The memo cites this number in §8.4 but attaches no firsthand URL, so source.url is empty — do not extrapolate from it.',
      zh: '备忘录 §8.4 引用该数字但未附一手 URL，故 source.url 为空 —— 不得据此外推。',
    },
  },
  {
    id: 'boltzmol1Hits',
    label: {
      en: 'Per-target hit rate of BoltzMol-1 (oracle + catalogue purchase, non-generative)',
      zh: 'BoltzMol-1（oracle + 目录采购，非生成）的靶点命中率',
    },
    value: '6 / 10',
    unit: { en: 'targets yielding functional actives or binders', zh: '靶点拿到 functional actives 或 binders' },
    context: {
      en: 'Only 28–96 compounds per target; most of the targets are unrepresented in its affinity training data',
      zh: '每靶点仅 28–96 个化合物；多数靶点在其 affinity 训练数据中无表征',
    },
    provenance: 'measured',
    source: S.boltzmol1,
    note: {
      en: 'The most direct evidence for spending the budget at the oracle layer: no generator is needed, only more accurate scoring plus catalogue purchase.',
      zh: '把预算放在 oracle 层的最直接证据：不需要生成器，只需要更准的打分 + 目录采购。',
    },
  },
  {
    id: 'hyperlabProduct',
    label: {
      en: 'The only verifiable commercial GFlowNet deployment (HITS / HyperLab — Hyper Screening X)',
      zh: '唯一可核实的 GFlowNet 商业部署（HITS / HyperLab — Hyper Screening X）',
    },
    value: '$3,000/mo',
    unit: { en: 'Core Plan; a paid add-on', zh: 'Core Plan；付费 add-on' },
    context: {
      en: '11 trillion compounds, with actual synthesis available on commission; AiZynthFinder synthesizability >60%; RxnFlow as the core technology (confirmed by CTO Jaechang Lim)',
      zh: '11 万亿化合物、可委托实际合成；AiZynthFinder 可合成率 >60%；以 RxnFlow 为核心技术（CTO Jaechang Lim 确认）',
    },
    provenance: 'measured',
    source: S.hyperlab,
    note: {
      en: 'The RxnFlow README states outright that the production model is an unreleased in-house derivative, and that for the public release the "current version" cannot reproduce the paper\'s results.',
      zh: 'RxnFlow README 明说生产模型是未公开的 in-house 衍生版，且公开版"current version 不能复现论文结果"。',
    },
  },
  {
    id: 'recursionGflownetCommits',
    label: {
      en: 'Commits to recursionpharma/gflownet across all of 2026',
      zh: 'recursionpharma/gflownet 在 2026 全年的 commit 数',
    },
    value: '2',
    unit: {
      en: 'commits (a chore on 2026-05-21 and a QM9 backward-mask fix)',
      zh: '个（2026-05-21 的 chore 与 QM9 backward-mask 修复）',
    },
    context: {
      en: '295★ / 54 forks / 24 open issues; the tasks directory holds only seh_frag(_moo), qm9(_moo), make_rings and toy_seq',
      zh: '295★ / 54 fork / 24 open issue；tasks 目录只有 seh_frag(_moo)、qm9(_moo)、make_rings、toy_seq',
    },
    provenance: 'measured',
    source: S.recursionGflownetRepo,
    note: {
      en: 'The trunk has no reaction environment, no docking, no ADMET and no PMO harness — research scaffolding, not a platform.',
      zh: '主干无 reaction 环境、无 docking、无 ADMET、无 PMO harness —— 研究脚手架，非平台。',
    },
  },
  {
    id: 'recursionZeroMentions',
    label: {
      en: 'Times GFlowNet is mentioned on Recursion\'s official platform page and in the FY2025 10-K / Q2-2026 10-Q',
      zh: 'Recursion 官方 platform 页与 FY2025 10-K / Q2-2026 10-Q 提及 GFlowNet 的次数',
    },
    value: '0',
    unit: { en: 'mentions', zh: '次' },
    context: {
      en: 'What they do name is BioHive-2, Recursion OS, their own fine-tuned Boltz-2, and Exscientia generative chemistry',
      zh: '点名的是 BioHive-2、Recursion OS、自有微调版 Boltz-2、Exscientia 生成式化学',
    },
    provenance: 'refuted',
    source: S.recursion10k,
    note: {
      en: 'Counter-evidence: even the company that employs GFlowNet\'s main contributors does not list it as a component of its stack. The `synflownet-boltz` repository labels itself Non-Prod / Tier-4 / Informational and has had zero commits since 2025-06-27.',
      zh: '反证：即便是 GFlowNet 主要贡献者所在的公司，也不把它列为技术栈组件。`synflownet-boltz` 仓库自标 Non-Prod / Tier-4 / Informational，2025-06-27 后零 commit。',
    },
  },

  // —— Merck 自己的数据：瓶颈在 oracle ——
  {
    id: 'predictorPotencyR2',
    label: {
      en: 'Accuracy of the experimental potency predictor (Merck & Co. Program 1)',
      zh: '实验 potency predictor 的精度（Merck & Co. Program 1）',
    },
    value: '0.66 ± 0.03',
    unit: { en: 'R²', zh: 'R²' },
    context: {
      en: 'An ensemble of 10 Chemprop-RDKit models, trained on the project\'s historical ~8k molecules with measured potency',
      zh: 'Chemprop-RDKit 10 模型 ensemble，训练在项目历史 ~8k 个已测 potency 分子上',
    },
    provenance: 'measured',
    source: S.merckBlog,
    note: {
      en: 'The team\'s overall takeaway: "even when SyntheMol-RL designs molecules with all the desired predicted properties, many generated molecules still fail experimentally due to the inaccuracy of the property predictors."',
      zh: '团队总 takeaway："even when SyntheMol-RL designs molecules with all the desired predicted properties, many generated molecules still fail experimentally due to the inaccuracy of the property predictors."',
    },
  },
  {
    id: 'predictorDockingR2',
    label: {
      en: 'Accuracy of the docking predictor (Merck & Co. Program 1)',
      zh: 'docking predictor 的精度（Merck & Co. Program 1）',
    },
    value: '0.76 ± 0.01',
    unit: { en: 'R²', zh: 'R²' },
    context: {
      en: 'Trained on about 1M docked Enamine REAL molecules (MOE Dock Affinity dG)',
      zh: '训练在约 1M 个已 dock 的 Enamine REAL 分子（MOE Dock Affinity dG）上',
    },
    provenance: 'measured',
    source: S.merckBlog,
    note: {
      en: 'Why docking is not used as the oracle directly: "SyntheMol-RL needs to make thousands of property predictor calls during generation, so speed is crucial and Chemprop-RDKit is orders of magnitude faster than docking, even if it\'s less accurate."',
      zh: '为什么不直接用 docking 当 oracle："SyntheMol-RL needs to make thousands of property predictor calls during generation, so speed is crucial and Chemprop-RDKit is orders of magnitude faster than docking, even if it\'s less accurate."',
    },
  },
  {
    id: 'merckHitRate',
    label: {
      en: 'Final wet-lab hit rate of Merck & Co. Program 1',
      zh: 'Merck & Co. Program 1 的最终湿实验命中率',
    },
    value: '4 / 111 = 3.6%',
    unit: { en: 'IC₅₀ < 10 μM (3.1 / 6.1 / 6.3 / 7.6 μM)', zh: 'IC₅₀ < 10 μM（3.1 / 6.1 / 6.3 / 7.6 μM）' },
    context: {
      en: 'One year, two internal proprietary programs, and non-GFlowNet SyntheMol-RL; this is the hit-finding stage, not a hit-to-lead or lead-optimisation success',
      zh: '一年、两个内部专有项目、非 GFlowNet 的 SyntheMol-RL；属 hit finding 阶段，不是 hit-to-lead 或 lead-opt 成功案例',
    },
    provenance: 'measured',
    source: S.merckBlog,
    note: {
      en: 'The authors state "potencies were weaker than we had hoped". Neither internal program ran a baseline arm (the only "baseline" is the predicted-value distribution of 10,000 random Enamine REAL molecules).',
      zh: '作者自陈"potencies were weaker than we had hoped"。两个内部项目都没有做 baseline arm（唯一"baseline"是 10,000 个随机 Enamine REAL 分子的预测值分布）。',
    },
  },
  {
    id: 'merckHistoricalLibrary',
    label: {
      en: 'Reference: single-digit nM compounds in the same project\'s historical library',
      zh: '对照：同一项目历史库中的单位数 nM 化合物',
    },
    value: '95 / ~8k',
    context: {
      en: 'Compounds the project already had before generative design was introduced — the frame of reference for the 4 μM-level hits',
      zh: '生成式介入前项目已有的化合物 —— 4 个 μM 级 hit 的参照系',
    },
    provenance: 'measured',
    source: S.merckBlog,
  },
  {
    id: 'deliveryLoss',
    label: {
      en: 'Make-on-demand delivery attrition (ordered → actually assayed)',
      zh: 'make-on-demand 交付损耗（订购 → 实际测活）',
    },
    value: '191 → 111',
    unit: { en: '58%', zh: '58%' },
    context: {
      en: '59 dropped for synthetic difficulty, 21 dropped for insufficient yield',
      zh: '59 个因合成难度被剔、21 个因收率不足被剔',
    },
    provenance: 'measured',
    source: S.merckBlog,
  },
  {
    id: 'mpoWeightCollapse',
    label: {
      en: 'How joint 6-parameter MPO ended (Program 2, cross-species ESKAPE)',
      zh: '6 参数 MPO 联合优化的结局（Program 2，ESKAPE 跨物种）',
    },
    value: { en: 'abandoned', zh: '放弃' },
    unit: { en: 'replaced by five 2-parameter optimisations', zh: '改为 5 个 2 参数优化' },
    context: {
      en: 'dynamic weighting "put nearly all of the weight on P. aeruginosa potency and almost zero weight on the other four bacterial species"; the root cause is data imbalance (only 2.4k potency data points across the 5 species, 0.9k of them P. aeruginosa)',
      zh: 'dynamic weighting "put nearly all of the weight on P. aeruginosa potency and almost zero weight on the other four bacterial species"；根因是数据不平衡（5 物种 potency 数据仅 2.4k，P. aeruginosa 0.9k）',
    },
    provenance: 'refuted',
    source: S.merckBlog,
    note: {
      en: 'This is a reward-design problem; no change of sampler improves it. Program 2 additionally built a >35B internal building-block space, with the ADMET predictor trained on 370k internal molecules; 91.4k generated → 274 passed the filters → 3 leads assayed, 2 of them active.',
      zh: '这是 reward 设计问题，换任何 sampler 都不会改善。Program 2 另建 >35B 内部 building-block 空间，ADMET predictor 训练集 370k 内部分子；生成 91.4k → 274 通过 filter → 测 3 个先导，2 个有活性。',
    },
  },

  // —— oracle 层：2026 年真正的转移，以及它的上限 ——
  {
    id: 'boltz2Calls',
    label: {
      en: 'Evaluations required by Boltz-2 + SynFlowNet generative screening',
      zh: 'Boltz-2 + SynFlowNet 生成式筛选所需的评估次数',
    },
    value: '117k vs 460k',
    unit: {
      en: 'Boltz-2 evaluations (generative vs fixed-library HLL screening)',
      zh: 'Boltz-2 评估次数（生成式 vs 固定库 HLL 筛选）',
    },
    context: {
      en: 'Sampling the Enamine REAL 76B space; on the FEP+ benchmark Boltz-2 approaches FEP accuracy at >1000× the speed',
      zh: 'Enamine REAL 76B 空间采样；Boltz-2 在 FEP+ 基准上接近 FEP 精度、>1000× 更快',
    },
    provenance: 'measured',
    source: S.boltz2,
    note: {
      en: 'This is the strongest single piece of evidence in the memo in GFlowNet\'s favour — but Recursion itself does not treat it as a production system (`recursionpharma/synflownet-boltz` is labelled Non-Prod / Tier-4 / Informational, with zero commits after the initial push on 2025-06-27).',
      zh: '这是备忘录中支持 GFlowNet 的最强一条证据 —— 但 Recursion 自己不把它当生产系统（`recursionpharma/synflownet-boltz` 标为 Non-Prod / Tier-4 / Informational，2025-06-27 首推后零 commit）。',
    },
  },
  {
    id: 'boltz2Abfe',
    label: {
      en: 'ABFE result for the 10 de novo candidates from Boltz-2 generative screening',
      zh: 'Boltz-2 生成式筛选的 10 个 de novo 候选做 ABFE 的结果',
    },
    value: '10 / 10',
    unit: { en: 'predicted to bind TYK2', zh: '预测结合 TYK2' },
    context: {
      en: 'Mean affinity better than fixed-library screening; no significant Tanimoto similarity to the TYK2 binders known in the PDB',
      zh: '平均亲和力优于固定库筛选；与 PDB 已知 TYK2 binder 无显著 Tanimoto 相似',
    },
    provenance: 'claimed',
    source: S.boltz2,
    note: {
      en: 'All in silico. On this benchmark Boltz-ABFE reaches Pearson R=0.95 with a centered MAE of 0.42 kcal/mol; Boltz-2 reaches Pearson 0.83 on TYK2, and the authors themselves say the results may be optimistic.',
      zh: '全部 in silico。Boltz-ABFE 在该基准 Pearson R=0.95、centered MAE 0.42 kcal/mol；Boltz-2 在 TYK2 上 Pearson 0.83，作者自陈结果"可能偏乐观"。',
    },
  },
  {
    id: 'fepAccuracyCeiling',
    label: {
      en: 'FEP+\'s accuracy ceiling vs experimental cross-assay reproducibility',
      zh: 'FEP+ 的精度上限 vs 实验跨-assay 再现性',
    },
    value: '1.25 vs 0.91',
    unit: { en: 'kcal/mol pairwise RMSE (R² 0.56 vs 0.79)', zh: 'kcal/mol pairwise RMSE（R² 0.56 vs 0.79）' },
    context: {
      en: 'The protocol costs 12 λ windows × 20 ns per edge (24 windows for charge changes) — the calibration that "the more expensive the oracle the better" requires',
      zh: '协议成本每条边 12 个 λ 窗 × 20 ns（电荷变化 24 窗）—— 对"oracle 越贵越好"的必要校准',
    },
    provenance: 'measured',
    source: S.ross2023,
  },
  {
    id: 'syncAizynth',
    label: { en: 'Time AiZynthFinder takes on 10k molecules', zh: 'AiZynthFinder 处理 10k 分子的耗时' },
    value: '~48 h',
    unit: { en: '174,192.6 s (vs 2.67 s for SA score)', zh: '174,192.6 s（vs SA score 2.67 s）' },
    context: {
      en: 'The same paper also finds that 8 synthesizability metrics rank 11 SBDD methods strongly inconsistently (FLAG: 3/8 metrics call it bad, 5/8 call it good)',
      zh: '同一篇还发现 8 个可合成性指标对 11 个 SBDD 方法的排序强不一致（FLAG：3/8 指标说差、5/8 说好）',
    },
    provenance: 'measured',
    source: S.sync2026,
    note: {
      en: 'Every "synthesizability %" carries this noise floor; AiZynthFinder produces false negatives on molecules that are inside Enamine. The paper also points out that GFlowNet-family synthesis methods do not generate 3D structures, which adds docking cost.',
      zh: '任何"可合成性 %"都带着这个噪声底；AiZynthFinder 对 Enamine 内分子有假阴性。该文也点明 GFlowNet 系合成方法"不生成 3D 结构"，需额外 docking 成本。',
    },
  },

  // —— 反面警告：基准最优 ≠ 项目可用；3D 生成不适合当主 sampler ——
  {
    id: 'reinforceIngChem',
    label: {
      en: 'Chemical plausibility of the PMO/MolOpt best configurations (re-evaluated by AstraZeneca/Acellera)',
      zh: 'PMO/MolOpt 最优配置的化学合理性（AstraZeneca/Acellera 复评）',
    },
    value: '6.18 ± 0.27 / 12.54 ± 0.25',
    unit: {
      en: 'B&T-CF / SEDiv@1k for ACEGEN-MolOpt (each out of 23)',
      zh: 'ACEGEN-MolOpt 的 B&T-CF / SEDiv@1k（各 /23）',
    },
    context: {
      en: 'Plain REINVENT scores 14.70 / 18.23 — the benchmark-optimal configuration is the worst on chemical plausibility',
      zh: '朴素 REINVENT 是 14.70 / 18.23 —— 基准最优配置在化学合理性上最差',
    },
    provenance: 'refuted',
    source: S.reinforceIng2025,
    note: {
      en: 'The authors put it precisely: if the scoring function captured chemical desirability perfectly, this would not be a problem — and that condition never holds in a real project. Moreover, every method that optimises docking alone (GraphGA, FGFN, RGFN and Saturn alike) produces greasy, high-molecular-weight junk at QED 0.22–0.36.',
      zh: '作者措辞精准："若 scoring function 完美刻画了化学可取性，这就不是问题" —— 而这个条件在真实项目里从不成立。且每一个只用 docking 做目标的方法（GraphGA、FGFN、RGFN、Saturn 一样）都产出 QED 0.22–0.36 的高脂高分子量垃圾。',
    },
  },
  {
    id: 'posecheckStrain',
    label: {
      en: 'Median strain energy of molecules generated by 3D diffusion SBDD',
      zh: '3D diffusion SBDD 生成分子的中位 strain energy',
    },
    value: '1241.7 / 1243.1',
    unit: {
      en: 'kcal/mol (TargetDiff / DiffSBDD; test set 102.5)',
      zh: 'kcal/mol（TargetDiff / DiffSBDD；测试集 102.5）',
    },
    context: {
      en: 'Mean steric clashes 9.08 / 15.33 (dataset 4.59); median RMSD between the generated pose and redocking 3.19 / 2.83 Å; the modal H-bond count is 0 (reference ligands: 1)',
      zh: '平均 steric clash 9.08 / 15.33（数据集 4.59）；生成 pose 与再对接的中位 RMSD 3.19 / 2.83 Å；H-bond 数众数为 0（参考配体为 1）',
    },
    provenance: 'refuted',
    source: S.posecheck,
    note: {
      en: 'Conclusion: 3D generation suits conformer/pose generation and scoring, not the role of primary sampler for small-molecule design.',
      zh: '结论：3D 生成适合做构象/姿态生成与打分，不适合当小分子设计的主 sampler。',
    },
  },
  {
    id: 'semlaflowSpeedup',
    label: {
      en: 'SemlaFlow\'s speed-up over 500-step EQGAT-diff',
      zh: 'SemlaFlow 相对 500 步 EQGAT-diff 的提速',
    },
    value: '113×',
    unit: {
      en: '2293 s → 20.3 s for 1000 molecules (20 steps already beat 500)',
      zh: '1000 分子 2293 s → 20.3 s（20 步即超过 500 步）',
    },
    context: {
      en: 'strain 1.76 vs 3.23 kcal/mol/atom; FlowMol3 pushes PoseBusters-valid to 91.9% (the training data itself is 93.2%)',
      zh: 'strain 1.76 vs 3.23 kcal/mol/atom；FlowMol3 把 PoseBusters-valid 推到 91.9%（训练数据本身 93.2%）',
    },
    provenance: 'measured',
    source: S.semlaflow,
    note: {
      en: 'FlowMol3\'s gain comes from three tricks unrelated to the flow formulation — self-conditioning, fake atoms and geometry distortion (removing all of them costs −14 pt).',
      zh: 'FlowMol3 的增益来自 self-conditioning / fake atoms / geometry distortion 三个与 flow 公式无关的技巧（去掉全部 −14 pt）。',
    },
  },

  // —— Merck KGaA 侧：唯一 GFlowNet 有结构性优势的地方 ——
  {
    id: 'aiddisonAssets',
    label: {
      en: 'The reaction-GFlowNet prerequisites Merck KGaA already owns (SYNTHIA®)',
      zh: 'Merck KGaA 已有的 reaction-GFlowNet 前置资产（SYNTHIA®）',
    },
    value: { en: '>115,000 × >12 million', zh: '>115,000 × >1,200 万' },
    unit: {
      en: 'expert-encoded reaction rules × purchasable starting materials',
      zh: '专家编码 reaction rule × 可购起始物',
    },
    context: {
      en: 'The SA-Space inside AIDDISON™ (a commercial SaaS launched 2023-12, ISO 27001) holds ≈25 billion virtual compounds and is searchable only within AIDDISON; the de novo engine is REINVENT 2.0, and SYNTHIA is at present merely a synthetic-accessibility scoring term',
      zh: 'AIDDISON™（2023-12 上市的商业 SaaS，ISO 27001）内的 SA-Space ≈250 亿虚拟化合物，仅能在 AIDDISON 内检索；de novo 引擎是 REINVENT 2.0，SYNTHIA 目前只是一个 synthetic-accessibility 评分项',
    },
    provenance: 'measured',
    source: S.aiddison2023,
    note: {
      en: 'In the public versions of RxnFlow / SynFlowNet even the Enamine building-block library is only "available upon request"; for Merck & Co. to reach the same starting point it would have to buy in a catalogue plus a retrosynthesis engine. Note that AIDDISON is an externally sold, ISO 27001-certified product, so replacing its RL core means re-qualifying a commercial product.',
      zh: 'RxnFlow / SynFlowNet 的公开版本连 Enamine building-block 库都只是"available upon request"；Merck & Co. 要达到同样起点必须外购目录 + retrosynthesis 引擎。注意 AIDDISON 是对外销售的 ISO 27001 认证产品，换 RL 内核意味着重新资格认证一个商业产品。',
    },
  },
];
