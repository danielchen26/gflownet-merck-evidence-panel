import type { Section } from './types';

/**
 * 决策叙事：把 14 节备忘录压成 8 节，面向"要不要立项"的读者。
 *
 * `budgetMarker` 是结构标记，用 oracle 预算 / 关键量而非 01/02/03 —— 因为整份
 * 备忘录的论证轴就是"在固定 oracle 预算下谁赢"。
 * `tableIds` / `datumIds` 指向 `evidence.ts` 的 `tables[].id` 与 `keyData[].id`。
 */
export const sections: Section[] = [
  {
    id: 'verdict',
    budgetMarker: '结论',
    kicker: '决策',
    title: '不要把 GFlowNet 当框架立项',
    standfirst:
      '它是 sampler 层的一个可选目标函数，而 2026 年的杠杆不在 sampler。',
    body: [
      '三条独立证据链各自都足以支撑这个结论。第一，固定 oracle 预算下它输：PMO 原表里 GFlowNet 9.131（16/25）、GFlowNet-AL 8.406（22/25），而随机筛选 ZINC-250k 是 8.635（19/25）、REINVENT 是 14.196（1/25）。第二，它唯一的差异化卖点（多样性）在唯一一次公平对照中被否证 —— 在预算受控、给所有方法都装上 diversity filter 的 benchmark 里，GFlowNet 在 DRD2 与 JNK3 上的 diverse hits 是 0，而随机虚拟筛选是 21 和 15。第三，它真正的贡献（reaction-template 合成可达 MDP）与 flow 目标无关，且已被更简单的 sampler 在 1/4 到 1/400 的预算下超越。',
      '真正的瓶颈由 Merck 自己的项目数据给出。Merck & Co. 与 Stanford 用非 GFlowNet 的 SyntheMol-RL 在一个内部靶点上跑了一年：12,796 个生成分子里 0 个同时满足 potency 与 docking 双阈值；最终合成测活 111 个，只有 4 个 IC₅₀ < 10 μM（3.6%），而同一项目历史库里已有 95 个单位数 nM 化合物。团队自己的结论是：分子失败的原因是性质预测器不准，不是生成器不行。',
      '→ 把预算投在 oracle（性质预测器、亲和力模型、独立 retrosynthesis）与 MPO 规格上，而不是换 sampler。',
    ],
    tableIds: ['pmo-original'],
    datumIds: ['pmoGfnVsRandom', 'gfnDrd2Jnk3', 'gfnSynthesized', 'merckHitRate', 'predictorPotencyR2'],
  },
  {
    id: 'guarantee',
    budgetMarker: 'p ∝ R^β',
    kicker: '理论',
    title: '它的保证到底是什么',
    standfirst:
      'GFlowNet 给的是一个分布性保证 —— 不是优化保证，不是样本效率保证；而这个保证已被证明与 MaxEnt / KL 正则 RL 等价。',
    body: [
      '准确表述：在 flow 目标的全局最优处，学到的前向策略在构造动作的 DAG 上满足 p(x) ∝ R(x)。这修正了树形/自回归 value 方法的偏差 —— 后者给出 π(x) ∝ n(x)·R(x)，其中 n(x) 是构造同一分子图的动作序列数，该偏差随轨迹长度指数增长并系统性偏好大分子。由此派生三个真实的工程价值：off-policy 有效性（任意足够覆盖 support 的行为策略都能产生训练轨迹而不引入分布偏差 —— 这是下游所有 GFlowNet 论文实际变现的唯一性质）、log Z 免费给出可达空间大小的估计、以及 reward↔diversity 有采样语义的连续旋钮（逆温度 β、rank 权重 k）。',
      '但"principled 多样性属于 GFlowNet"这一步不成立。GFlowNet 的不动点不坍缩、而 reward-maximizing RL 的最优解是确定性策略，这个不对称是真的；然而"RL 做不到"已被四个归约证伪，其中三篇有 Bengio 署名：GFlowNets 与 MaxEnt RL "one and the same, up to a correction of the reward function"（Tiapkin, AISTATS 2024 Oral）；Trajectory Balance ≡ Path Consistency Learning、Modified Detailed Balance ≡ Soft Q-Learning 变体（Deleu, UAI 2024）；Relative Trajectory Balance ≡ Trust-PCL，且"KL-regularized RL methods achieve comparable performance"（Deleu 2025）；SMILES 序列生成下 P_B(τ|x)=1，TB 直接退化为 PCL。KL 正则 RL 的不动点是 π*(x) ∝ π_prior(x)·exp(R(x)/τ) —— 同一个 Gibbs 族，同样不坍缩，同样 principled。',
      '经验上的刺：需要 DAG 修正的表示（fragment/graph MDP，多路径）正是 PMO 上拿 9.918 的那个；拿 16.213 的 SMILES 表示是单路径，修正项为空、TB 恰好退化成 PCL。Genetic GFN 论文原话："生成 SMILES 明显优于生成 graph-based fragment"。GFlowNet 有独特理论优势的设定，正是经验上输的那个设定。',
      '工程后果反而是加强建议而非削弱：既然 GFlowNet ≡ KL 正则 RL + reward correction，想要它的性质不需要新框架，只需要 (a) 多路径 reward correction（仅当真用 fragment/reaction MDP）+ (b) 一个 KL 正则项 —— 两者都是 loss 层改动，可直接进 REINVENT4 / AIDDISON 的现有 RL 循环，不触发商业产品的重新资格认证。pharma 侧已独立走到这里：KL-to-prior 实测优于 REINVENT 的 reward-shaping（validity +18% / exploration +12%，而 reward-shaping 是 validity +12% / diversity −20%）。',
    ],
    datumIds: ['maxentEquivalence', 'deleuReduction', 'rtbTrustPcl', 'klToPrior', 'bengio2021Proxy'],
  },
  {
    id: 'fixed-budget',
    budgetMarker: '10⁴ calls',
    kicker: '硬数字',
    title: '固定 oracle 预算下它输',
    standfirst:
      'PMO 原表里 fragment GFlowNet 排 16/25、它的 active-learning 版本排 22/25，而随机筛选 ZINC-250k 排 19/25。',
    body: [
      'PMO（23 oracle、10k 调用、5 seed、sum AUC-top10，满分 23）的排名是：REINVENT 14.196（1/25）、Graph GA 13.751、SELFIES-REINVENT 13.471、GP BO 13.156、SynNet 11.498、MARS 10.651、GFlowNet (fragment) 9.131（16）、随机筛选 ZINC-250k 8.635（19）、GFlowNet-AL 8.406（22）。PMO 自己的因果解释是：逐 token / 逐原子从单点组装的方法"最数据低效……浪费大量 oracle 预算，并对 oracle 质量提出强要求"；而且"GFlowNet 在几乎每个任务上都优于 GFlowNet-AL" —— 加 surrogate 反而更差。',
      '同一 codebase、同一协议下的 GFlowNet 变体对比更有说明力：Genetic GFN（SMILES + GraphGA + GFN loss）16.213 ± 0.173、Mol GA 15.686、LS-GFN 15.230 ± 0.026、SMILES REINVENT 15.185，而 fragment GFN / GFN-AL 是 9.918 / 9.928。消融即自我指控：去掉 genetic search → 15.738；把 genetic search 换回 GFlowNet 原生 ε-greedy → 15.626；用 STONED 替代 GraphGA → 15.439；去掉 KL-to-prior → 15.928。即 SOTA 的功劳属于 GraphGA 的算子 + REINVENT 的架构与 KL 正则，GFlowNet 只是 replay 目标。',
      'docking 类任务上差距更大：SARS-CoV-2 Top-100 平均分，vanilla GFlowNet 0.326 / 0.280，而 GraphGA 0.723 / 0.786、REINVENT 0.717 / 0.799、MolRL-MGPT 0.772 / 0.854、Genetic GFN(1000 步) 0.925 / 0.902 —— vanilla GFlowNet 只有 REINVENT 的约 45%。',
      '读表纪律：跨论文 PMO 数值不可比（REINVENT 在不同实现/seed/任务子集下为 13.55 / 14.016 / 15.003 / 15.185），相邻排名典型差 0.3–0.5，任何小于约 0.5 的跨论文差值都不能当结论依据。以上两张表分别引用各自论文内部的可比数字。',
    ],
    tableIds: ['pmo-original', 'gfn-variants'],
    datumIds: ['pmoGfnVsRandom', 'geneticGfnVsFragment', 'geneticGfnAblation', 'dockingSarsCov2'],
  },
  {
    id: 'diversity-refuted',
    budgetMarker: '#Circles',
    kicker: '否证',
    title: '多样性论点在唯一一次公平对照中被否证',
    standfirst:
      '在预算匹配、给所有方法都装上 diversity filter、并用满足公理的 #Circles 指标的 benchmark 里，GFlowNet 在 DRD2 与 JNK3 上找到 0 个 diverse hit。',
    body: [
      'Renz、Luukkonen & Klambauer（JCIM 2024）是全文献里唯一同时满足三个公平条件的对照：预算匹配（10,000 次 scoring-function 调用，沿用 PMO，另加 600 s 墙钟设定）；所有方法的 scoring function 都乘进 Blaschke 2020 的 diversity filter（作者原话"DF 在初步实验中被证明对性能至关重要"）；用 sphere-exclusion 的 #Circles(D=0.7) 而不是 IntDiv 或 mode count。结果：AugMemory 81 / 636 / 176，随机虚拟筛选 21 / 93 / 15，而 Gflownet 1 / 67 / 0、装上 DF 的 GflownetDF 0 / 77 / 0。600 s 预算下同样是 0 / 112 / 0 与 0 / 87 / 0。GFlowNet 在 DRD2/JNK3 的 IntDiv 列是 0.00 ± 0.00 —— 因为一个 hit 都没找到，指标无定义。',
      '作者的直接判决："We also found Mars and GFlowNet to perform poorly in this comparison, despite comparing well in previous diverse optimization studies. This discrepancy highlights the importance of a meaningful benchmark setup."；以及一条药化上更要命的观察："increased diversity is often achieved by generating larger, less drug-like molecules… the models achieving the lowest number of diverse hits (Mars and GFlowNet) struggle to generate drug-like molecules."',
      'GFlowNet 多样性的"好名声"建立在被公理否证的指标上。Xie et al.（ICLR 2023）的公理分析表明 internal diversity 只满足 Dissimilarity，违反 Monotonicity 与 Subadditivity —— 加进更多分子可以让 IntDiv 下降，IntDiv 可以被"两个距离最大的分子"刷满；#Circles 是唯一同时满足三条公理的度量。与"生物功能类别数"这个 proxy gold standard 的相关性：IntDiv 为 Medium/Low，#Circles 为 High/High。所有 GFlowNet 分子论文报告的多样性都是 Tanimoto diversity 或 mode count，恰好落在这个批评范围内。须诚实说明的边界：Xie et al. 并未测试 GFlowNet，所以"#Circles 原论文对 GFlowNet 有利"不成立。',
      '公允保留的一个真实加分项：Genetic GFN 的 β 扫描在 β=30 处（AUC 15.815 / diversity 0.528）于两个轴上同时优于 Mol GA（15.686 / 0.465）与 REINVENT（15.185 / 0.468），是论文内部可比的真实 Pareto 改进。但幅度（+0.13 AUC）落在实现噪声量级，用的正是被否证的 IntDiv 类指标，且该配置的功劳按消融属于 GraphGA。反过来，"设防过的 RL"的覆盖度参照是：Saturn 在 1,000 调用预算下 DRD2 拿到 310 ± 70 个 unique scaffold（Augmented Memory baseline 仅 22 ± 7）。若 hit finding 阶段确实需要覆盖度，正确的对照组是 GEAM / GraphGA / LSTM-HC / AugMemory 这一类，而不是 GFlowNet。',
    ],
    tableIds: ['renz-circles', 'beta-sweep'],
    datumIds: ['gfnDrd2Jnk3', 'intDivAxioms', 'saturnScaffolds', 'saturnGeamCircles'],
  },
  {
    id: 'action-space',
    budgetMarker: '10³ calls',
    kicker: '归因',
    title: '功劳属于 action space，不属于 sampler',
    standfirst:
      '同一个 GFlowNet 换 MDP，独立 retrosynthesis 成功率从 0% 跳到 62%；同一个 reaction MDP 换 sampler，无 ML 的 GA 用 1/4 预算、RL 用 1/400 预算就把它超过。',
    body: [
      '三组消融把两者干净分开。换 MDP：fragment → reaction 使 AiZynthFinder 成功率从 0% 跳到 62%。换 sampler：Graph GA-ReaSyn 在 sEH 上 0.96 / AiZynth 0.97，反超 SynFlowNet 0.92 / 0.65；SynGA/SynGBO 在 LIT-PCBA 上以 16,000 调用打平或超过全部 64,000 调用的 reaction-GFlowNet；Saturn 用 1/400 的预算在 QED（0.70 vs 0.23）、SA（2.11 vs 2.83）、AiZynth（0.91 vs 0.65）三项全面压过 RGFN。连 3D 增益也不来自 flow 目标 —— 3DSynthFlow 与 RxnFlow 同为 TB 目标、同一 reaction MDP，差别只在 3D 状态表示。',
      'SynGA 一侧的细节值得记住：196,907 个 Enamine building block、91 个 template、≤5 步、≤1000 Da、population 500，ML 的全部作用只是一个 fingerprint MLP block filter，把候选 block 从 196,907 压到 117 个（AUROC 0.999）。2026 年的 PMO SOTA 因此是受合成约束的 GA + BO（SynGBO 16.426），而 GPBO / f-RAG / Genetic GFN 三者都内嵌 MolGA/GraphGA。Saturn 侧必须连作者的 caveat 一起引：比较不是 apples-to-apples（Saturn 预训练已偏向可合成空间、未施加 PoseBusters 与 aggregator 过滤、wall-time 不是 1/400，因为 AiZynthFinder 是瓶颈）。',
      '"template 保证可合成"也经不起独立 retrosynthesis 检验：外部 AiZynthFinder 下 RxnFlow 60.25–71.25%、SynFlowNet 52.75–57%、RGFN 46.75–50.25%，而 S3-GFN（SMILES + 软约束）是 96.67–100%。更关键的是 GFlowNet 前沿本身已放弃 reaction MDP —— S3-GFN 明言 reaction-based MDP"缺乏灵活性与可扩展性""编码了固定的可合成性概念""无法利用基础模型学到的丰富化学先验"，转而对预训练 SMILES 语言模型做 GFlowNet post-training（relative trajectory balance）。2026 年的"GFlowNet 分子生成"在架构上已经收敛成"对化学语言模型做 RL 后训练"，GFlowNet 退化为可选目标函数之一。',
      'reaction MDP 上还有 GFlowNet 特有的工程债：均匀 backward policy 只有 11.0 ± 3.7% 的反向轨迹能回到 s₀，修正需给 P_B 单独目标，而 TB 训练出的"free" P_B 在 held-out 上只有 1.0 ± 0.8%；大动作空间需要三个互不相同的补丁（fingerprint action embedding、Morgan 矩阵固定 logits、1% importance-weighted 子采样）对付同一面墙；GFlowNet 目标对 reward shaping 极度脆弱（GSK3β AUC-top10：REINVENT+RS 0.830 vs GFlowNet RTB+RS 0.502）。而 reaction MDP 真实的、与 flow 目标无关的优势是成本：RGFN 的 top-10 ClpP 配体均价 $2.06 vs SyntheMol $152.57，约 74× 差。',
    ],
    tableIds: ['synga-litpcba', 'saturn-vs-rgfn', 's3gfn-retro'],
    datumIds: [
      'fragmentToReaction',
      'reasynGaVsGfn',
      'syngaPmo',
      'blockFilter',
      'aizynthReactionGfn',
      's3gfnRewardShaping',
      'synflownetBackward',
      'rxnflowPatches',
      'rgfnCost',
      'scentCost',
      'synformerProjection',
      'agfnForgetting',
    ],
  },
  {
    id: 'wetlab',
    budgetMarker: '0 synthesized',
    kicker: '不对称',
    title: '湿实验证据的不对称',
    standfirst:
      '所有 GFlowNet 论文合成并测活的分子总数是 0；每一条有湿实验读出的路线用的都是 RL、GA、MCTS 或物理闭环。',
    body: [
      'GFlowNet 侧最强的主张止于"专家化学家人工审阅确认可合成"（RGFN）加成本分析加路线图 —— 横跨 RGFN (NeurIPS 2024)、SynFlowNet (ICLR 2025)、RxnFlow (ICLR 2025)、TacoGFN (TMLR 2024)、A-GFN (ICML 2025)、CGFlow (ICML 2025)、S3-GFN (2026)，全部 in silico。对面：SyntheMol-RL 在 Merck & Co. Program 1 合成测活 111 个、4 个 IC₅₀ < 10 μM；其学术线合成 79 个、13 个 in vitro 强活性（16.5%）、7 个结构新颖、1 个（synthecin）在小鼠 MRSA 模型有效；Saturn 系 granular synthesizability control 在 BRD4 上 6/6 全合成得 2 个 µM binder、Wee1 上 60 个中 1 个 µM binder；Schrödinger 的 AL + FEP+ 闭环 78/129，10 个月到 development candidate（SGR-1505），2025-06 Phase 1 CLL/WM 单药应答。',
      '非生成路线的对照同样刺眼。超大规模 docking：AmpC 11% hit rate（44/549），90 个类似物后达 77 nM；D4 top tranche 22–26%，最优是 180 pM 全激动剂、2500× 选择性。2026 年的 BoltzMol-1 更极端 —— 只做 oracle + 目录采购、每靶点 28–96 个化合物，10 个靶点中 6 个拿到 functional actives 或 binders，且多数靶点在其 affinity 训练数据中无表征。',
      'GFlowNet 推广的合成可达 MDP 已经跨进湿实验室 —— 但驱动它的是 RL 目标，不是 GFlowNet 目标。生产部署侧只有一个可核实实例：HITS / HyperLab 的 Hyper Screening X（以 RxnFlow 为核心技术，Core Plan $3,000/mo、11 万亿化合物、可委托实际合成，AiZynth 可合成率 >60%），但 RxnFlow README 明说生产模型是未公开的 in-house 衍生版，公开版"current version 不能复现论文结果"。',
      '反证来自 GFlowNet 主要贡献者所在的公司：Recursion 官方 platform 页与 FY2025 10-K / Q2-2026 10-Q 提及 GFlowNet 的次数是 0；`recursionpharma/gflownet` 在 2026 全年只有 2 个 commit，主干无 reaction 环境、无 docking、无 ADMET、无 PMO harness；SynFlowNet 最后提交停在 2025-01-31（约 19 个月停滞），docking 还需自行编译 QuickVina2-GPU 二进制。',
    ],
    datumIds: [
      'gfnSynthesized',
      'synthemolAcademic',
      'guoBrd4',
      'guoWee1',
      'malt1',
      'lyuAmpC',
      'lyuD4',
      'boltzmol1Hits',
      'hyperlabProduct',
      'recursionGflownetCommits',
      'recursionZeroMentions',
    ],
  },
  {
    id: 'merck-oracle',
    budgetMarker: 'R²=0.66',
    kicker: 'Merck 自己的数据',
    title: '瓶颈在 oracle，不在 sampler',
    standfirst:
      '12,796 个生成分子里 0 个同时满足双阈值；111 个测活只有 4 个 IC₅₀ < 10 μM —— 团队自己把失败归因于性质预测器不准。',
    body: [
      'Stanford/Merck 一手博客（Swanson、Zou 与 Merck & Co. Discovery Chemistry 的 Chiriac、Cheng，2026-04-27）披露的 Program 1 漏斗，是本备忘录里最直接的项目级证据。方法是 SyntheMol-RL（RL over combinatorial building-block space），oracle 是两套 Chemprop-RDKit 10 模型 ensemble：一个训练在实验 potency（R² 0.66 ± 0.03），一个训练在 docking（R² 0.76 ± 0.01）。为什么不直接用 docking 当 oracle，作者给了可直接引用的成本论证："SyntheMol-RL needs to make thousands of property predictor calls during generation, so speed is crucial and Chemprop-RDKit is orders of magnitude faster than docking, even if it\'s less accurate."',
      '五个失败模式，每一个都指向 oracle 或 MPO 规格，没有一个指向 sampler：训练数据化学多样性太窄，predictor 对新颖结构泛化差（"good performance for molecules resembling those already known but exhibit limited generalizability to the more novel small molecule structures that we\'d like to generate"）；联合目标不可达（12,796 里 0 个同时满足两阈值）；多目标权重坍塌（6 参数 MPO 下 dynamic weighting "put nearly all of the weight on P. aeruginosa potency and almost zero weight on the other four bacterial species"，团队最终放弃六参数联合优化，改为 5 个 2 参数优化）；通用化学空间不匹配项目 pharmacophore，被迫自建 >35B 内部空间；以及 make-on-demand 交付损耗（191 → 111）。',
      '团队自己的总 takeaway 是这份备忘录最该引的一句："even when SyntheMol-RL designs molecules with all the desired predicted properties, many generated molecules still fail experimentally due to the inaccuracy of the property predictors. Therefore, it\'s crucial to continue developing not just generative models but also better molecular property predictors."',
      '边界必须写清，不得越界：博客未披露两个靶点身份、Program 2 的 ADMET 性质与 potency 数值、4 个 hit 的结构、任何实测 ADMET 数据、任何成本/算力数字 —— 以及任何 head-to-head baseline。两个内部项目都没有 GFlowNet / REINVENT / Saturn / 虚拟筛选对照组，唯一"baseline"是 10,000 个随机 Enamine REAL 分子的预测值分布。Program 1 的 4 个 hit 是 μM 级，属 hit finding 阶段，不是 hit-to-lead 或 lead-opt 的成功案例。',
    ],
    datumIds: [
      'predictorPotencyR2',
      'predictorDockingR2',
      'merckHitRate',
      'merckHistoricalLibrary',
      'deliveryLoss',
      'mpoWeightCollapse',
    ],
  },
  {
    id: 'pilot',
    budgetMarker: '下一步',
    kicker: '建议',
    title: '把钱投在 oracle 上，并用一个可证伪的 pilot 关闭争论',
    standfirst:
      '一个内部靶点、固定 oracle 预算、同一动作空间与 reward 的三方对照 —— 验收线预先写死，只有 GFlowNet 在同预算下同时赢 potency 与 #Circles 才进生产路线图。',
    body: [
      '立即（本季度）：搭 oracle 层。Boltz-2（代码与权重均 MIT，自托管 MSA 保 IP）在 FEP+ 基准上接近 FEP 精度、>1000× 更快；它与 SynFlowNet 耦合的生成式筛选只用 117k 次评估（固定库 HLL 筛选需 460k），10 个 de novo 候选做 ABFE 全部预测结合 TYK2 —— 但这一条全部 in silico，作者自陈结果"可能偏乐观"，且 Recursion 自己把该仓库标为 Non-Prod / Tier-4 / Informational。同时把独立 retrosynthesis（Merck KGaA 用 SYNTHIA，Merck & Co. 用 AiZynthFinder/ASKCOS）作为目标函数的一项而非事后过滤 —— 依据是 1/400 预算的结果，以及 SynFormer 的"事后投影把 Tanimoto 打到 0.186"。校准一句：更贵的物理不总是更好（FEP+ pairwise RMSE 1.25 vs 实验跨-assay 再现性 0.91 kcal/mol），且任何"可合成性 %"都带噪声底（AiZynthFinder 处理 10k 分子约 48 h，8 个指标排序强不一致）。',
      '修 MPO：Merck & Co. 的项目已经证明 6 参数联合优化会退化为单目标、双阈值可行域为空。这是 reward 设计问题，换 sampler 不解决。同时记住"基准最优 ≠ 项目可用"—— PMO/MolOpt 最优配置在化学合理性上最差（ACEGEN-MolOpt B&T-CF 6.18 ± 0.27 / SEDiv@1k 12.54 ± 0.25，朴素 REINVENT 是 14.70 / 18.23），而且每个只用 docking 做目标的方法都产出 QED 0.22–0.36 的高脂高分子量垃圾。',
      '一次性对照实验（1 个内部靶点，固定 oracle 预算，同一动作空间与 reward）：(i) SynGA/SynGBO 式合成树 GA；(ii) REINVENT4 或 Saturn + retrosynthesis-in-reward；(iii) RxnFlow 式 GFlowNet。必须包含 AugMemory 或 LSTM-HC 作为多样性对照组，且用 #Circles 而非 IntDiv 验收。还应把 AL 加速的超大规模虚拟筛选放进来当诚实基线 —— MolPAL 类 surrogate 只 dock 2.4% 就回收 top-50k 的 87.9%（EF 36.6），而这正是 Renz 2024 中 GFlowNet 输给的那条基线。评判还应包含独立 retrosynthesis 成功率、化学合理性（B&T-CF/SEDiv 类）、以及化学家愿意实际下单的分子数。验收线：只有当 (iii) 在相同预算下同时赢 potency 与 #Circles，GFlowNet 才进入生产路线图 —— 基于前面的证据，先验预期它不会。这是数周量级实验，不是 program。',
      '分实体的两句话。Merck & Co./MSD：GFlowNet 不是入口，且已有一年的反向证据；正确动作是把钱投在 predictor 精度与 MPO 规格上，GFlowNet 只作一次有边界的 hit-finding bake-off（可直接复用 SyntheMol 仓库里已有的 MIT 许可三方对比装置）。Merck KGaA：这是唯一 GFlowNet 有结构性优势的地方 —— SYNTHIA 的 >115,000 条专家编码 reaction rule × >1,200 万可购起始物、SA-Space ≈250 亿虚拟化合物、以及与生成平台同组的世界级 FEP 实践，正好是 reaction-based GFlowNet 需要的三件东西。但最高投入产出比的单点改动与 sampler 无关：把 SYNTHIA 从事后评分项升级为生成动作空间本身（0% → 62% 独立可合成率），用 GA 或 RL 都能拿到。',
      '不要碰的：SynFlowNet 主干（停滞约 19 个月、需自编译 docking 二进制）；把 SA-score 当可合成性验收标准；把 IntDiv 当多样性验收标准；把 3D diffusion SBDD 当主 sampler（TargetDiff / DiffSBDD 中位 strain 1241.7 / 1243.1 kcal/mol，测试集 102.5）—— 3D 生成适合做构象/姿态生成与打分。',
    ],
    datumIds: [
      'boltz2Calls',
      'boltz2Abfe',
      'fepAccuracyCeiling',
      'syncAizynth',
      'synformerProjection',
      'reinforceIngChem',
      'posecheckStrain',
      'semlaflowSpeedup',
      'boltzmol1Hits',
      'molpalSurrogate',
      'aiddisonAssets',
      'fragmentToReaction',
    ],
  },
];

/**
 * §13 中最影响本页结论强度的未验证项。诚实展示是这个页面的一部分 ——
 * 这些条目**不得**被当作证据引用。
 */
export const openGaps: string[] = [
  '"不存在第二篇预算匹配的 GFlowNet vs DF-RL 多样性对照"这一断言，只在 OpenAlex 引文图（Renz 2024 全部 17 篇引用）+ arXiv API 五种字段组合 + OpenReview API 的检索范围内为真。无法排除存在一篇既未引用 Renz 2024、又未在 arXiv 摘要出现相关关键词的论文。措辞应为"据我们检索到的一手文献"。',
  'Renz 2024 的 SI PDF 正文（S1–S5）取不到（ACS 与 PMC 镜像均返回跳板页）。表格数值已从作者官方仓库的 .tex 源文件逐字取得、与 Figure 2 同源，但未独立核对 S2.1 的 RF 模型 ROCAUC/AP 与 S5 的 budget-scaling 曲线数值。',
  'Saturn 在 10,000 调用预算下的多样性数值不存在于论文中（论文预算为 1,000 与 3,000）。本页用 3,000 档替代并已标注 —— 因此 Saturn 与 Renz 表不是同预算对照。',
  '跨论文 PMO 数值不可比：REINVENT 在不同实现/seed/任务子集下为 13.55 / 14.016 / 15.003 / 15.185，seed 数 1–10、任务数 2–23；相邻排名典型差 0.3–0.5。任何小于约 0.5 的跨论文差值都不可作为结论依据。',
  'Renz 表（#Circles，D=0.7，ligand-based 任务）与 Saturn 的 #Circles（t=0.75，docking 任务）不可直接互比，只能各自组内比较。',
  'Merck 一手博客未披露：两个靶点身份、Program 2 的 ADMET 性质与 potency 数值、4 个 hit 的结构、任何实测 ADMET 数据、任何成本/算力数字，以及任何 head-to-head baseline。博客图表数值未 OCR。',
  'Merck 两实体均无公开发表或宣布的 GFlowNet 工作（Europe PMC 署名检索 AFF:"Merck KGaA" / AFF:"Merck & Co" / AFF:"Rahway" 为空）—— 缺证据不等于不存在。AIDDISON 2026 年的生成内核是否已升级同样未验证（论文为 2023-12）。',
  'Gkeka 等《Computational Hit Finding: An Industry Perspective》（J Med Chem 68(11):10507, 2025）仅摘要可得（closed OA，六条取全文路径全部失败）。其正文的"生成式 vs 超大规模筛选 vs DEL"头对头命中率对比 = UNVERIFIED；也未找到任何 DEL vs 生成式的一手头对头比较。',
];
