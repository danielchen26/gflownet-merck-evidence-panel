import type { LText } from '../i18n/i18n';
import type { Section } from './types';

/**
 * 决策叙事：把 14 节备忘录压成 9 节，面向"要不要立项、以及装在哪一层"的读者。
 *
 * `budgetMarker` 是结构标记，用 oracle 预算 / 关键量而非 01/02/03 —— 因为整份
 * 备忘录的论证轴就是"在固定 oracle 预算下谁赢"。
 * `tableIds` / `datumIds` 指向 `evidence.ts` 的 `tables[].id` 与 `keyData[].id`。
 *
 * 英文是中文原文的忠实翻译：不新增、不削弱、不强化任何主张；数字与 URL 逐字一致。
 */
export const sections: Section[] = [
  {
    id: 'verdict',
    budgetMarker: { en: 'Placement', zh: '定位' },
    kicker: { en: 'Placement', zh: '定位' },
    title: {
      en: 'GFlowNet is a layer, not a platform',
      zh: 'GFlowNet 是一层，不是一个平台',
    },
    standfirst: {
      en: 'It sits at the sampler-objective layer, and it has been proven to belong to the KL-regularised RL family — so integrating it is a loss-layer change inside REINVENT4 / AIDDISON, not a platform migration. The binding constraint sits one layer below, at the oracle.',
      zh: '它位于 sampler objective 层，且已被证明属于 KL 正则 RL 族 —— 所以集成它是 REINVENT4 / AIDDISON 内部的 loss 层改动，而不是平台迁移。真正的绑定约束在下面一层：oracle。',
    },
    body: [
      {
        en: 'What the evidence constrains is the framework-level bet, not the technique. Under a fixed oracle budget the flow objective loses: in the original PMO table GFlowNet scores 9.131 (16/25) and GFlowNet-AL 8.406 (22/25), while random screening of ZINC-250k scores 8.635 (19/25) and REINVENT 14.196 (1/25). Its one differentiating selling point — diversity — does not survive the one fair comparison either: with matched budgets and a diversity filter given to every method, GFlowNet finds 0 diverse hits on DRD2 and JNK3, where random virtual screening finds 21 and 15. And the total number of molecules any GFlowNet method has synthesized and assayed is 0. Not one of these numbers is retired here — they stay, and their job changes: from a reason not to touch it, to the constraint on which layers it can be trusted to carry.',
        zh: '证据约束的是框架级押注，不是这项技术本身。固定 oracle 预算下 flow 目标输：PMO 原表里 GFlowNet 9.131（16/25）、GFlowNet-AL 8.406（22/25），而随机筛选 ZINC-250k 是 8.635（19/25）、REINVENT 是 14.196（1/25）。它唯一的差异化卖点（多样性）也没能通过唯一一次公平对照：预算匹配、所有方法都装上 diversity filter 时，GFlowNet 在 DRD2 与 JNK3 上的 diverse hits 是 0，而随机虚拟筛选是 21 和 15。任何 GFlowNet 方法合成并测活的分子总数是 0。这些数字一个都不作废 —— 它们留在原处，只是角色变了：从"不要碰它的理由"，变成"它能装在哪一层"的约束。',
      },
      {
        en: 'But losing as a platform is not the same as having no place. The stack has four layers — oracle, action space, sampler objective, search operator — and GFlowNet occupies exactly one of them: L3, the sampler objective. It also contributed the largest single measured win at L2: hold the GFlowNet fixed and change only the MDP, and fragment → reaction lifts the independent AiZynthFinder success rate from 0% to 62% — a gain that is objective-function agnostic and collectable with a GA or with plain RL. At L4 it holds a lever nobody else holds: off-policy validity absorbs GA operators, local search, MCMC and offline expert data into one amortised policy without distributional bias (Genetic GFN 16.213; remove genetic search → 15.738).',
        zh: '但"作为平台输"不等于"没有位置"。栈有四层 —— oracle、action space、sampler objective、search operator —— GFlowNet 恰好占其中一层：L3，sampler objective。它同时在 L2 贡献了实测最大的单点收益：固定住 GFlowNet 只换 MDP，fragment → reaction 使独立 AiZynthFinder 成功率从 0% 跳到 62% —— 这个收益与目标函数无关，用 GA 或普通 RL 都能拿到。在 L4 它握有别人没有的杠杆：off-policy 有效性可把 GA 算子、local search、MCMC 与离线专家数据无偏地吸收进同一个摊销策略（Genetic GFN 16.213；去掉 genetic search → 15.738）。',
      },
      {
        en: 'The integration path is correspondingly narrow and cheap. GFlowNets and MaxEnt RL are "one and the same, up to a correction of the reward function" (Tiapkin, AISTATS 2024 Oral); Trajectory Balance ≡ Path Consistency Learning and Modified Detailed Balance ≡ a Soft Q-Learning variant (Deleu, UAI 2024); Relative Trajectory Balance ≡ Trust-PCL (Deleu 2025). Getting the properties therefore takes (a) the multi-path reward correction — only when a fragment or reaction MDP is genuinely in use — plus (b) one KL regularisation term. Both are loss-layer edits that drop straight into the RL loops REINVENT4 / AIDDISON already run, with no requalification of a commercial product.',
        zh: '相应地，集成路径既窄又便宜。GFlowNets 与 MaxEnt RL 是 "one and the same, up to a correction of the reward function"（Tiapkin, AISTATS 2024 Oral）；Trajectory Balance ≡ Path Consistency Learning、Modified Detailed Balance ≡ Soft Q-Learning 变体（Deleu, UAI 2024）；Relative Trajectory Balance ≡ Trust-PCL（Deleu 2025）。所以要它的性质只需 (a) 多路径 reward correction —— 仅当真用 fragment 或 reaction MDP —— 加 (b) 一个 KL 正则项。两者都是 loss 层改动，可直接进 REINVENT4 / AIDDISON 已在跑的 RL 循环，不触发商业产品的重新资格认证。',
      },
      {
        en: '→ First: put the money on the oracle (property predictors, affinity models, independent retrosynthesis) and fix the MPO specification — Merck & Co.\'s own project traced a 3.6% wet-lab hit rate to predictors at R² 0.66 / 0.76, not to the sampler. Then close the L3 argument the only way it can be closed: an equal-budget comparison on one internal target, same action space and same reward, with GFlowNet entering the production roadmap only if it wins on both potency and #Circles.',
        zh: '→ 先做两件事：把钱投在 oracle（性质预测器、亲和力模型、独立 retrosynthesis）上，并修 MPO 规格 —— Merck & Co. 自己的项目把 3.6% 的湿实验命中率归因于 R² 0.66 / 0.76 的预测器，而不是 sampler。然后用唯一可行的方式关闭 L3 的争论：一个内部靶点上的等预算对照，同一动作空间、同一 reward，只有 GFlowNet 同时赢 potency 与 #Circles 才进生产路线图。',
      },
    ],
    tableIds: ['pmo-original'],
    datumIds: ['pmoGfnVsRandom', 'gfnDrd2Jnk3', 'gfnSynthesized', 'merckHitRate', 'predictorPotencyR2'],
  },
  {
    id: 'guarantee',
    budgetMarker: 'p ∝ R^β',
    kicker: { en: 'Theory', zh: '理论' },
    title: {
      en: 'What it actually guarantees',
      zh: '它的保证到底是什么',
    },
    standfirst: {
      en: 'GFlowNet gives a distributional guarantee — not an optimisation guarantee, not a sample-efficiency guarantee; and that guarantee has been proven equivalent to MaxEnt / KL-regularised RL.',
      zh: 'GFlowNet 给的是一个分布性保证 —— 不是优化保证，不是样本效率保证；而这个保证已被证明与 MaxEnt / KL 正则 RL 等价。',
    },
    body: [
      {
        en: 'The precise statement: at the global optimum of the flow objective, the learned forward policy satisfies p(x) ∝ R(x) over the DAG of construction actions. This corrects the bias of tree-shaped / autoregressive value methods — those give π(x) ∝ n(x)·R(x), where n(x) is the number of action sequences that build the same molecular graph, a bias that grows exponentially with trajectory length and systematically favours large molecules. Three real engineering values follow: off-policy validity (any behaviour policy that covers the support well enough can produce training trajectories without introducing distributional bias — the one property that every downstream GFlowNet paper actually cashes in), log Z as a free estimate of the size of the reachable space, and a continuous reward↔diversity knob with sampling semantics (inverse temperature β, rank weight k).',
        zh: '准确表述：在 flow 目标的全局最优处，学到的前向策略在构造动作的 DAG 上满足 p(x) ∝ R(x)。这修正了树形/自回归 value 方法的偏差 —— 后者给出 π(x) ∝ n(x)·R(x)，其中 n(x) 是构造同一分子图的动作序列数，该偏差随轨迹长度指数增长并系统性偏好大分子。由此派生三个真实的工程价值：off-policy 有效性（任意足够覆盖 support 的行为策略都能产生训练轨迹而不引入分布偏差 —— 这是下游所有 GFlowNet 论文实际变现的唯一性质）、log Z 免费给出可达空间大小的估计、以及 reward↔diversity 有采样语义的连续旋钮（逆温度 β、rank 权重 k）。',
      },
      {
        en: 'But the step to "principled diversity belongs to GFlowNet" does not hold. The asymmetry itself is real — GFlowNet\'s fixed point does not collapse, whereas the optimum of reward-maximizing RL is a deterministic policy; yet "RL cannot do this" has been falsified by four reductions, three of them co-authored by Bengio: GFlowNets and MaxEnt RL are "one and the same, up to a correction of the reward function" (Tiapkin, AISTATS 2024 Oral); Trajectory Balance ≡ Path Consistency Learning and Modified Detailed Balance ≡ a Soft Q-Learning variant (Deleu, UAI 2024); Relative Trajectory Balance ≡ Trust-PCL, and "KL-regularized RL methods achieve comparable performance" (Deleu 2025); under SMILES sequence generation P_B(τ|x)=1, so TB degenerates straight into PCL. The fixed point of KL-regularised RL is π*(x) ∝ π_prior(x)·exp(R(x)/τ) — the same Gibbs family, equally non-collapsing, equally principled.',
        zh: '但"principled 多样性属于 GFlowNet"这一步不成立。GFlowNet 的不动点不坍缩、而 reward-maximizing RL 的最优解是确定性策略，这个不对称是真的；然而"RL 做不到"已被四个归约证伪，其中三篇有 Bengio 署名：GFlowNets 与 MaxEnt RL "one and the same, up to a correction of the reward function"（Tiapkin, AISTATS 2024 Oral）；Trajectory Balance ≡ Path Consistency Learning、Modified Detailed Balance ≡ Soft Q-Learning 变体（Deleu, UAI 2024）；Relative Trajectory Balance ≡ Trust-PCL，且"KL-regularized RL methods achieve comparable performance"（Deleu 2025）；SMILES 序列生成下 P_B(τ|x)=1，TB 直接退化为 PCL。KL 正则 RL 的不动点是 π*(x) ∝ π_prior(x)·exp(R(x)/τ) —— 同一个 Gibbs 族，同样不坍缩，同样 principled。',
      },
      {
        en: 'The empirical sting: the representation that needs the DAG correction (fragment/graph MDP, multiple paths) is exactly the one that scores 9.918 on PMO; the SMILES representation that scores 16.213 is single-path, so the correction term is empty and TB degenerates precisely into PCL. In the Genetic GFN paper\'s own words: "generating SMILES is significantly better than generating graph-based fragments". The setting in which GFlowNet has a unique theoretical advantage is exactly the setting in which it loses empirically.',
        zh: '经验上的刺：需要 DAG 修正的表示（fragment/graph MDP，多路径）正是 PMO 上拿 9.918 的那个；拿 16.213 的 SMILES 表示是单路径，修正项为空、TB 恰好退化成 PCL。Genetic GFN 论文原话："生成 SMILES 明显优于生成 graph-based fragment"。GFlowNet 有独特理论优势的设定，正是经验上输的那个设定。',
      },
      {
        en: 'The engineering consequence strengthens the recommendation rather than weakening it: since GFlowNet ≡ KL-regularised RL + reward correction, getting its properties needs no new framework, only (a) the multi-path reward correction (only if a fragment/reaction MDP is genuinely used) plus (b) one KL regularisation term — both are loss-layer changes that drop straight into the existing RL loops of REINVENT4 / AIDDISON without triggering requalification of a commercial product. Pharma has independently arrived here already: KL-to-prior measurably beats REINVENT\'s reward-shaping (validity +18% / exploration +12%, where reward-shaping gives validity +12% / diversity −20%).',
        zh: '工程后果反而是加强建议而非削弱：既然 GFlowNet ≡ KL 正则 RL + reward correction，想要它的性质不需要新框架，只需要 (a) 多路径 reward correction（仅当真用 fragment/reaction MDP）+ (b) 一个 KL 正则项 —— 两者都是 loss 层改动，可直接进 REINVENT4 / AIDDISON 的现有 RL 循环，不触发商业产品的重新资格认证。pharma 侧已独立走到这里：KL-to-prior 实测优于 REINVENT 的 reward-shaping（validity +18% / exploration +12%，而 reward-shaping 是 validity +12% / diversity −20%）。',
      },
    ],
    datumIds: ['maxentEquivalence', 'deleuReduction', 'rtbTrustPcl', 'klToPrior', 'bengio2021Proxy'],
  },
  {
    id: 'fixed-budget',
    budgetMarker: '10⁴ calls',
    kicker: { en: 'Hard numbers', zh: '硬数字' },
    title: {
      en: 'It loses under a fixed oracle budget',
      zh: '固定 oracle 预算下它输',
    },
    standfirst: {
      en: 'In the original PMO table the fragment GFlowNet ranks 16/25 and its active-learning version 22/25, while random screening of ZINC-250k ranks 19/25.',
      zh: 'PMO 原表里 fragment GFlowNet 排 16/25、它的 active-learning 版本排 22/25，而随机筛选 ZINC-250k 排 19/25。',
    },
    body: [
      {
        en: 'The PMO ranking (23 oracles, 10k calls, 5 seeds, sum AUC-top10, maximum 23) is: REINVENT 14.196 (1/25), Graph GA 13.751, SELFIES-REINVENT 13.471, GP BO 13.156, SynNet 11.498, MARS 10.651, GFlowNet (fragment) 9.131 (16), random screening of ZINC-250k 8.635 (19), GFlowNet-AL 8.406 (22). PMO\'s own causal explanation: methods that assemble token by token / atom by atom from a single starting point are "the most data-inefficient… wasting a large amount of oracle budget and imposing a strong requirement on oracle quality"; and "GFlowNet outperforms GFlowNet-AL on almost every task" — adding a surrogate makes it worse.',
        zh: 'PMO（23 oracle、10k 调用、5 seed、sum AUC-top10，满分 23）的排名是：REINVENT 14.196（1/25）、Graph GA 13.751、SELFIES-REINVENT 13.471、GP BO 13.156、SynNet 11.498、MARS 10.651、GFlowNet (fragment) 9.131（16）、随机筛选 ZINC-250k 8.635（19）、GFlowNet-AL 8.406（22）。PMO 自己的因果解释是：逐 token / 逐原子从单点组装的方法"最数据低效……浪费大量 oracle 预算，并对 oracle 质量提出强要求"；而且"GFlowNet 在几乎每个任务上都优于 GFlowNet-AL" —— 加 surrogate 反而更差。',
      },
      {
        en: 'The comparison of GFlowNet variants inside one codebase under one protocol is more telling still: Genetic GFN (SMILES + GraphGA + GFN loss) 16.213 ± 0.173, Mol GA 15.686, LS-GFN 15.230 ± 0.026, SMILES REINVENT 15.185, against 9.918 / 9.928 for fragment GFN / GFN-AL. The ablation is a self-indictment: remove genetic search → 15.738; swap genetic search back for GFlowNet\'s native ε-greedy → 15.626; replace GraphGA with STONED → 15.439; remove KL-to-prior → 15.928. That is, the credit for the SOTA belongs to GraphGA\'s operators plus REINVENT\'s architecture and KL regularisation; GFlowNet is only the replay objective.',
        zh: '同一 codebase、同一协议下的 GFlowNet 变体对比更有说明力：Genetic GFN（SMILES + GraphGA + GFN loss）16.213 ± 0.173、Mol GA 15.686、LS-GFN 15.230 ± 0.026、SMILES REINVENT 15.185，而 fragment GFN / GFN-AL 是 9.918 / 9.928。消融即自我指控：去掉 genetic search → 15.738；把 genetic search 换回 GFlowNet 原生 ε-greedy → 15.626；用 STONED 替代 GraphGA → 15.439；去掉 KL-to-prior → 15.928。即 SOTA 的功劳属于 GraphGA 的算子 + REINVENT 的架构与 KL 正则，GFlowNet 只是 replay 目标。',
      },
      {
        en: 'On docking-style tasks the gap is larger: SARS-CoV-2 Top-100 mean score, vanilla GFlowNet 0.326 / 0.280, against GraphGA 0.723 / 0.786, REINVENT 0.717 / 0.799, MolRL-MGPT 0.772 / 0.854, Genetic GFN (1000 steps) 0.925 / 0.902 — vanilla GFlowNet reaches only about 45% of REINVENT.',
        zh: 'docking 类任务上差距更大：SARS-CoV-2 Top-100 平均分，vanilla GFlowNet 0.326 / 0.280，而 GraphGA 0.723 / 0.786、REINVENT 0.717 / 0.799、MolRL-MGPT 0.772 / 0.854、Genetic GFN(1000 步) 0.925 / 0.902 —— vanilla GFlowNet 只有 REINVENT 的约 45%。',
      },
      {
        en: 'Table-reading discipline: PMO numbers are not comparable across papers (REINVENT scores 13.55 / 14.016 / 15.003 / 15.185 under different implementations/seeds/task subsets), adjacent ranks typically differ by 0.3–0.5, and no cross-paper difference smaller than about 0.5 can carry a conclusion. The two tables above each cite numbers that are comparable within their own paper.',
        zh: '读表纪律：跨论文 PMO 数值不可比（REINVENT 在不同实现/seed/任务子集下为 13.55 / 14.016 / 15.003 / 15.185），相邻排名典型差 0.3–0.5，任何小于约 0.5 的跨论文差值都不能当结论依据。以上两张表分别引用各自论文内部的可比数字。',
      },
    ],
    tableIds: ['pmo-original', 'gfn-variants'],
    datumIds: ['pmoGfnVsRandom', 'geneticGfnVsFragment', 'geneticGfnAblation', 'dockingSarsCov2'],
  },
  {
    id: 'diversity-refuted',
    budgetMarker: '#Circles',
    kicker: { en: 'Refutation', zh: '否证' },
    title: {
      en: 'The diversity claim is refuted by the one fair comparison',
      zh: '多样性论点在唯一一次公平对照中被否证',
    },
    standfirst: {
      en: 'In the one benchmark that matches budgets, gives every method a diversity filter, and scores with an axiomatically sound #Circles metric, GFlowNet finds zero diverse hits on DRD2 and JNK3.',
      zh: '在预算匹配、给所有方法都装上 diversity filter、并用满足公理的 #Circles 指标的 benchmark 里，GFlowNet 在 DRD2 与 JNK3 上找到 0 个 diverse hit。',
    },
    body: [
      {
        en: 'Renz, Luukkonen & Klambauer (JCIM 2024) is the only comparison in the entire literature that satisfies all three fairness conditions at once: matched budgets (10,000 scoring-function calls, following PMO, plus a 600 s wall-clock setting); the scoring function of every method multiplied by Blaschke 2020\'s diversity filter (the authors\' own words: "the DF proved crucial for performance in preliminary experiments"); and sphere-exclusion #Circles(D=0.7) instead of IntDiv or mode count. The results: AugMemory 81 / 636 / 176, random virtual screening 21 / 93 / 15, against Gflownet 1 / 67 / 0 and, with the DF attached, GflownetDF 0 / 77 / 0. Under the 600 s budget it is likewise 0 / 112 / 0 and 0 / 87 / 0. GFlowNet\'s IntDiv column on DRD2/JNK3 is 0.00 ± 0.00 — because not a single hit was found, so the metric is undefined.',
        zh: 'Renz、Luukkonen & Klambauer（JCIM 2024）是全文献里唯一同时满足三个公平条件的对照：预算匹配（10,000 次 scoring-function 调用，沿用 PMO，另加 600 s 墙钟设定）；所有方法的 scoring function 都乘进 Blaschke 2020 的 diversity filter（作者原话"DF 在初步实验中被证明对性能至关重要"）；用 sphere-exclusion 的 #Circles(D=0.7) 而不是 IntDiv 或 mode count。结果：AugMemory 81 / 636 / 176，随机虚拟筛选 21 / 93 / 15，而 Gflownet 1 / 67 / 0、装上 DF 的 GflownetDF 0 / 77 / 0。600 s 预算下同样是 0 / 112 / 0 与 0 / 87 / 0。GFlowNet 在 DRD2/JNK3 的 IntDiv 列是 0.00 ± 0.00 —— 因为一个 hit 都没找到，指标无定义。',
      },
      {
        en: 'The authors\' direct verdict: "We also found Mars and GFlowNet to perform poorly in this comparison, despite comparing well in previous diverse optimization studies. This discrepancy highlights the importance of a meaningful benchmark setup." And an observation that is even more damaging in medicinal-chemistry terms: "increased diversity is often achieved by generating larger, less drug-like molecules… the models achieving the lowest number of diverse hits (Mars and GFlowNet) struggle to generate drug-like molecules."',
        zh: '作者的直接判决："We also found Mars and GFlowNet to perform poorly in this comparison, despite comparing well in previous diverse optimization studies. This discrepancy highlights the importance of a meaningful benchmark setup."；以及一条药化上更要命的观察："increased diversity is often achieved by generating larger, less drug-like molecules… the models achieving the lowest number of diverse hits (Mars and GFlowNet) struggle to generate drug-like molecules."',
      },
      {
        en: 'GFlowNet\'s diversity "good name" rests on a metric that the axioms refute. The axiomatic analysis of Xie et al. (ICLR 2023) shows that internal diversity satisfies Dissimilarity only and violates Monotonicity and Subadditivity — adding more molecules can push IntDiv down, and IntDiv can be maxed out by "the two most distant molecules"; #Circles is the only measure that satisfies all three axioms. Correlation with the proxy gold standard "number of biological function classes": Medium/Low for IntDiv, High/High for #Circles. Every diversity number reported in the GFlowNet molecule papers is Tanimoto diversity or mode count, landing squarely inside this criticism. The boundary that must be stated honestly: Xie et al. did not test GFlowNet, so "the original #Circles paper favours GFlowNet" does not hold.',
        zh: 'GFlowNet 多样性的"好名声"建立在被公理否证的指标上。Xie et al.（ICLR 2023）的公理分析表明 internal diversity 只满足 Dissimilarity，违反 Monotonicity 与 Subadditivity —— 加进更多分子可以让 IntDiv 下降，IntDiv 可以被"两个距离最大的分子"刷满；#Circles 是唯一同时满足三条公理的度量。与"生物功能类别数"这个 proxy gold standard 的相关性：IntDiv 为 Medium/Low，#Circles 为 High/High。所有 GFlowNet 分子论文报告的多样性都是 Tanimoto diversity 或 mode count，恰好落在这个批评范围内。须诚实说明的边界：Xie et al. 并未测试 GFlowNet，所以"#Circles 原论文对 GFlowNet 有利"不成立。',
      },
      {
        en: 'One genuine point in its favour, kept for fairness: in the Genetic GFN β sweep, β=30 (AUC 15.815 / diversity 0.528) beats both Mol GA (15.686 / 0.465) and REINVENT (15.185 / 0.468) on both axes at once — a real Pareto improvement, comparable within the paper. But the margin (+0.13 AUC) sits at the magnitude of implementation noise, it is measured with exactly the refuted IntDiv-family metric, and by the ablation the credit for that configuration belongs to GraphGA. Conversely, the coverage reference for "RL with defences in place" is: Saturn reaches 310 ± 70 unique scaffolds on DRD2 under a 1,000-call budget (the Augmented Memory baseline gets only 22 ± 7). If coverage really is needed at the hit finding stage, the right comparison group is GEAM / GraphGA / LSTM-HC / AugMemory, not GFlowNet.',
        zh: '公允保留的一个真实加分项：Genetic GFN 的 β 扫描在 β=30 处（AUC 15.815 / diversity 0.528）于两个轴上同时优于 Mol GA（15.686 / 0.465）与 REINVENT（15.185 / 0.468），是论文内部可比的真实 Pareto 改进。但幅度（+0.13 AUC）落在实现噪声量级，用的正是被否证的 IntDiv 类指标，且该配置的功劳按消融属于 GraphGA。反过来，"设防过的 RL"的覆盖度参照是：Saturn 在 1,000 调用预算下 DRD2 拿到 310 ± 70 个 unique scaffold（Augmented Memory baseline 仅 22 ± 7）。若 hit finding 阶段确实需要覆盖度，正确的对照组是 GEAM / GraphGA / LSTM-HC / AugMemory 这一类，而不是 GFlowNet。',
      },
    ],
    tableIds: ['renz-circles', 'beta-sweep'],
    datumIds: ['gfnDrd2Jnk3', 'intDivAxioms', 'saturnScaffolds', 'saturnGeamCircles'],
  },
  {
    id: 'action-space',
    budgetMarker: '10³ calls',
    kicker: { en: 'Attribution', zh: '归因' },
    title: {
      en: 'The credit belongs to the action space, not the sampler',
      zh: '功劳属于 action space，不属于 sampler',
    },
    standfirst: {
      en: 'Change the MDP under the same GFlowNet and the independent retrosynthesis success rate jumps from 0% to 62%; change the sampler under the same reaction MDP and an ML-free GA beats it on 1/4 of the budget, RL on 1/400.',
      zh: '同一个 GFlowNet 换 MDP，独立 retrosynthesis 成功率从 0% 跳到 62%；同一个 reaction MDP 换 sampler，无 ML 的 GA 用 1/4 预算、RL 用 1/400 预算就把它超过。',
    },
    body: [
      {
        en: 'Three ablations separate the two cleanly. Change the MDP: fragment → reaction lifts the AiZynthFinder success rate from 0% to 62%. Change the sampler: Graph GA-ReaSyn scores 0.96 on sEH with AiZynth 0.97, overtaking SynFlowNet\'s 0.92 / 0.65; SynGA/SynGBO match or beat every 64,000-call reaction-GFlowNet on LIT-PCBA using 16,000 calls; Saturn, on 1/400 of the budget, beats RGFN across the board on QED (0.70 vs 0.23), SA (2.11 vs 2.83) and AiZynth (0.91 vs 0.65). Even the 3D gain does not come from the flow objective — 3DSynthFlow and RxnFlow share the TB objective and the same reaction MDP, differing only in the 3D state representation.',
        zh: '三组消融把两者干净分开。换 MDP：fragment → reaction 使 AiZynthFinder 成功率从 0% 跳到 62%。换 sampler：Graph GA-ReaSyn 在 sEH 上 0.96 / AiZynth 0.97，反超 SynFlowNet 0.92 / 0.65；SynGA/SynGBO 在 LIT-PCBA 上以 16,000 调用打平或超过全部 64,000 调用的 reaction-GFlowNet；Saturn 用 1/400 的预算在 QED（0.70 vs 0.23）、SA（2.11 vs 2.83）、AiZynth（0.91 vs 0.65）三项全面压过 RGFN。连 3D 增益也不来自 flow 目标 —— 3DSynthFlow 与 RxnFlow 同为 TB 目标、同一 reaction MDP，差别只在 3D 状态表示。',
      },
      {
        en: 'The details on the SynGA side are worth remembering: 196,907 Enamine building blocks, 91 templates, ≤5 steps, ≤1000 Da, population 500, and the entire role of ML is a single fingerprint MLP block filter that compresses the candidate blocks from 196,907 to 117 (AUROC 0.999). The 2026 PMO SOTA is therefore a synthesis-constrained GA + BO (SynGBO 16.426), while GPBO, f-RAG and Genetic GFN all embed MolGA/GraphGA. On the Saturn side the authors\' caveat must be quoted along with it: the comparison is not apples-to-apples (Saturn\'s pretraining is already biased toward synthesizable space, PoseBusters and aggregator filters were not applied, and the wall-time is not 1/400 because AiZynthFinder is the bottleneck).',
        zh: 'SynGA 一侧的细节值得记住：196,907 个 Enamine building block、91 个 template、≤5 步、≤1000 Da、population 500，ML 的全部作用只是一个 fingerprint MLP block filter，把候选 block 从 196,907 压到 117 个（AUROC 0.999）。2026 年的 PMO SOTA 因此是受合成约束的 GA + BO（SynGBO 16.426），而 GPBO / f-RAG / Genetic GFN 三者都内嵌 MolGA/GraphGA。Saturn 侧必须连作者的 caveat 一起引：比较不是 apples-to-apples（Saturn 预训练已偏向可合成空间、未施加 PoseBusters 与 aggregator 过滤、wall-time 不是 1/400，因为 AiZynthFinder 是瓶颈）。',
      },
      {
        en: '"Templates guarantee synthesizability" does not survive independent retrosynthesis either: under external AiZynthFinder, RxnFlow gets 60.25–71.25%, SynFlowNet 52.75–57%, RGFN 46.75–50.25%, while S3-GFN (SMILES + soft constraints) gets 96.67–100%. More decisively, the GFlowNet frontier itself has abandoned the reaction MDP — S3-GFN states plainly that reaction-based MDPs "lack flexibility and scalability", "encode a fixed notion of synthesizability" and "cannot exploit the rich chemical priors learned by foundation models", turning instead to GFlowNet post-training (relative trajectory balance) of a pretrained SMILES language model. Architecturally, "GFlowNet molecule generation" in 2026 has already converged on "RL post-training of a chemical language model", with GFlowNet demoted to one optional objective function among others.',
        zh: '"template 保证可合成"也经不起独立 retrosynthesis 检验：外部 AiZynthFinder 下 RxnFlow 60.25–71.25%、SynFlowNet 52.75–57%、RGFN 46.75–50.25%，而 S3-GFN（SMILES + 软约束）是 96.67–100%。更关键的是 GFlowNet 前沿本身已放弃 reaction MDP —— S3-GFN 明言 reaction-based MDP"缺乏灵活性与可扩展性""编码了固定的可合成性概念""无法利用基础模型学到的丰富化学先验"，转而对预训练 SMILES 语言模型做 GFlowNet post-training（relative trajectory balance）。2026 年的"GFlowNet 分子生成"在架构上已经收敛成"对化学语言模型做 RL 后训练"，GFlowNet 退化为可选目标函数之一。',
      },
      {
        en: 'The reaction MDP also carries engineering debt specific to GFlowNet: with a uniform backward policy only 11.0 ± 3.7% of backward trajectories can reach s₀, correcting this requires a separate objective for P_B, and the "free" P_B trained by TB reaches only 1.0 ± 0.8% on held-out data; the large action space needs three mutually different patches (fingerprint action embeddings, fixed logits from a Morgan matrix, 1% importance-weighted subsampling) against the same wall; the GFlowNet objective is extremely fragile under reward shaping (GSK3β AUC-top10: REINVENT+RS 0.830 vs GFlowNet RTB+RS 0.502). The real advantage of the reaction MDP, the one unrelated to the flow objective, is cost: RGFN\'s top-10 ClpP ligands average $2.06 vs SyntheMol\'s $152.57, a roughly 74× difference.',
        zh: 'reaction MDP 上还有 GFlowNet 特有的工程债：均匀 backward policy 只有 11.0 ± 3.7% 的反向轨迹能回到 s₀，修正需给 P_B 单独目标，而 TB 训练出的"free" P_B 在 held-out 上只有 1.0 ± 0.8%；大动作空间需要三个互不相同的补丁（fingerprint action embedding、Morgan 矩阵固定 logits、1% importance-weighted 子采样）对付同一面墙；GFlowNet 目标对 reward shaping 极度脆弱（GSK3β AUC-top10：REINVENT+RS 0.830 vs GFlowNet RTB+RS 0.502）。而 reaction MDP 真实的、与 flow 目标无关的优势是成本：RGFN 的 top-10 ClpP 配体均价 $2.06 vs SyntheMol $152.57，约 74× 差。',
      },
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
    id: 'integration',
    budgetMarker: { en: 'loss-level', zh: 'loss 级' },
    kicker: { en: 'Integration', zh: '集成' },
    title: {
      en: 'How it plugs into the stack',
      zh: '它如何插进现有的栈',
    },
    standfirst: {
      en: 'GFlowNets ≡ MaxEnt RL up to a reward correction; Trajectory Balance ≡ PCL; Relative Trajectory Balance ≡ Trust-PCL — so getting its properties needs no new framework, only two loss-layer changes.',
      zh: 'GFlowNets ≡ MaxEnt RL up to a reward correction；Trajectory Balance ≡ PCL；Relative Trajectory Balance ≡ Trust-PCL —— 所以要它的性质不需要新框架，只需两个 loss 级改动。',
    },
    body: [
      {
        en: 'L1 — the oracle. This is where the binding constraint lives, and it is the one layer no sampler change can relieve. Merck & Co.\'s Program 1 ran on two Chemprop-RDKit ensembles as the oracle: R² 0.66 ± 0.03 on experimental potency, R² 0.76 ± 0.01 on docking. Of 12,796 generated molecules 0 met both thresholds; 111 were finally synthesized and assayed and 4 came in under IC₅₀ 10 μM (3.6%). What changed in 2026 is the supply side: Boltz-2 approaches FEP accuracy on the FEP+ benchmark at >1000× the speed, with code and weights both MIT; BoltzMol-1 — oracle plus catalogue purchase only, 28–96 compounds per target — returned functional actives or binders on 6 of 10 targets. Money spent at L1 raises the ceiling of every layer above it.',
        zh: 'L1 —— oracle。绑定约束就在这里，而且这是唯一一层换 sampler 无法缓解的。Merck & Co. 的 Program 1 用两套 Chemprop-RDKit ensemble 当 oracle：实验 potency R² 0.66 ± 0.03、docking R² 0.76 ± 0.01。12,796 个生成分子里 0 个同时满足双阈值；最终合成测活 111 个，4 个 IC₅₀ < 10 μM（3.6%）。2026 年变了的是供给侧：Boltz-2 在 FEP+ 基准上接近 FEP 精度、>1000× 更快，代码与权重均为 MIT；BoltzMol-1 —— 只做 oracle + 目录采购、每靶点 28–96 个化合物 —— 在 10 个靶点中 6 个拿到 functional actives 或 binders。投在 L1 的钱会抬高它上面每一层的天花板。',
      },
      {
        en: 'L2 — the action space, and the real gift of GFlowNet. Hold the sampler fixed and change only the MDP: fragment → reaction lifts the independent AiZynthFinder success rate from 0% to 62%. The gain is objective-function agnostic — a GA or plain RL collects it just as well — which is exactly why it is the highest-return single change available. Its ceiling belongs in the same sentence: under external AiZynthFinder, reaction templates reach only ≤72% (RxnFlow 60.25–71.25%, SynFlowNet 52.75–57%, RGFN 46.75–50.25%), while S3-GFN\'s SMILES soft constraints reach 96.67–100%. Merck KGaA already owns what this layer needs: SYNTHIA\'s >115,000 expert-encoded reaction rules × >12 million purchasable starting materials.',
        zh: 'L2 —— action space，GFlowNet 真正的馈赠。固定 sampler 只换 MDP：fragment → reaction 使独立 AiZynthFinder 成功率从 0% 跳到 62%。这个收益与目标函数无关 —— 用 GA 或普通 RL 一样能拿到 —— 也正因如此它是投入产出比最高的单点改动。它的天花板必须写在同一句里：外部 AiZynthFinder 下 reaction template 只有 ≤72%（RxnFlow 60.25–71.25%、SynFlowNet 52.75–57%、RGFN 46.75–50.25%），而 S3-GFN 的 SMILES 软约束是 96.67–100%。Merck KGaA 已经拥有这一层需要的东西：SYNTHIA 的 >115,000 条专家编码 reaction rule × >1,200 万可购起始物。',
      },
      {
        en: 'L3 — the sampler objective: this is where GFlowNet plugs in. The theory here is settled. GFlowNets and MaxEnt RL are "one and the same, up to a correction of the reward function" (Tiapkin, AISTATS 2024 Oral); Trajectory Balance ≡ Path Consistency Learning and Modified Detailed Balance ≡ a Soft Q-Learning variant (Deleu, UAI 2024); Relative Trajectory Balance ≡ Trust-PCL, and "KL-regularized RL methods achieve comparable performance" (Deleu 2025). What follows is an integration recipe rather than a migration: (a) the multi-path reward correction, required only when a fragment or reaction MDP is genuinely in use, plus (b) one KL regularisation term. Both are loss-layer edits inside the RL loops REINVENT4 / AIDDISON already run. The constraint on this layer is just as explicit: at a fixed budget vanilla GFN scores 9.131 against REINVENT\'s 14.196, and on SARS-CoV-2 docking vanilla GFlowNet reaches 0.326 / 0.280 against REINVENT\'s 0.717 / 0.799 — so it must be run with a pretrained prior plus KL-to-prior, which independently measures out ahead of REINVENT\'s reward-shaping (validity +18% / exploration +12%, against validity +12% / diversity −20%).',
        zh: 'L3 —— sampler objective：GFlowNet 就插在这一层。这里的理论已经定论。GFlowNets 与 MaxEnt RL 是 "one and the same, up to a correction of the reward function"（Tiapkin, AISTATS 2024 Oral）；Trajectory Balance ≡ Path Consistency Learning、Modified Detailed Balance ≡ Soft Q-Learning 变体（Deleu, UAI 2024）；Relative Trajectory Balance ≡ Trust-PCL，且"KL-regularized RL methods achieve comparable performance"（Deleu 2025）。由此得到的是一份集成配方，而不是一次迁移：(a) 多路径 reward correction，仅当真用 fragment 或 reaction MDP 时需要；加 (b) 一个 KL 正则项。两者都是 REINVENT4 / AIDDISON 已在跑的 RL 循环内部的 loss 层改动。这一层的约束同样明确：固定预算下 vanilla GFN 9.131 vs REINVENT 14.196，SARS-CoV-2 docking 上 vanilla GFlowNet 0.326 / 0.280 vs REINVENT 0.717 / 0.799 —— 所以它必须配预训练 prior 加 KL-to-prior 才能跑，而 KL-to-prior 本身实测优于 REINVENT 的 reward-shaping（validity +18% / exploration +12%，对比 validity +12% / diversity −20%）。',
      },
      {
        en: 'L4 — the search operator: GFlowNet\'s one exclusive lever. Off-policy validity means any behaviour policy that covers the support well enough can supply training trajectories without introducing distributional bias, so GA operators, local search, MCMC and offline expert data can all be absorbed unbiasedly into a single amortised policy. The measured ledger, all inside one codebase under one protocol: Genetic GFN 16.213; remove genetic search → 15.738; swap genetic search back for GFlowNet\'s native ε-greedy → 15.626; replace GraphGA with STONED → 15.439. Read honestly, that ledger does two things at once — it credits GraphGA with the SOTA, and it names the one job the flow objective is actually for: absorbing an external search operator without bias.',
        zh: 'L4 —— search operator：GFlowNet 独有的杠杆。off-policy 有效性意味着任意足够覆盖 support 的行为策略都能提供训练轨迹而不引入分布偏差，于是 GA 算子、local search、MCMC 与离线专家数据都能被无偏地吸收进同一个摊销策略。实测账本全部来自同一 codebase、同一协议：Genetic GFN 16.213；去掉 genetic search → 15.738；把 genetic search 换回 GFlowNet 原生 ε-greedy → 15.626；用 STONED 代替 GraphGA → 15.439。诚实读这份账本，它同时做了两件事 —— 把 SOTA 的功劳归给 GraphGA，也点明 flow 目标真正的用处：无偏地吸收一个外部搜索算子。',
      },
      {
        en: 'Concretely, per entity. Merck KGaA: promote SYNTHIA from a post-hoc scoring term to the L2 generative action space itself — that is the 0% → 62% change, it is sampler-independent, and it is the smallest engineering job in this memo; only on top of that is an L3 objective comparison worth running, and since AIDDISON is an externally sold ISO 27001 product, an L3 change must stay loss-level. Merck & Co.: fix L1 first — predictor accuracy and the MPO specification, given that 6-parameter joint MPO put nearly all the weight on P. aeruginosa potency and the two-threshold feasible region came out empty (0 of 12,796) — then run the L3 question as a bounded bake-off, reusing the MIT-licensed three-way comparison rig already sitting in the SyntheMol repository.',
        zh: '落到两个实体的具体动作。Merck KGaA：把 SYNTHIA 从事后评分项升级为 L2 的生成动作空间本身 —— 这就是 0% → 62% 的那一步，它与 sampler 无关，是本备忘录里工程量最小的改动；只有在它之上，L3 的目标函数对照才值得跑，而且因为 AIDDISON 是对外销售的 ISO 27001 产品，L3 的改动必须停在 loss 级。Merck & Co.：先修 L1 —— predictor 精度与 MPO 规格，毕竟 6 参数联合 MPO 把几乎全部权重压到 P. aeruginosa potency 上、双阈值可行域为空（12,796 里 0 个）—— 然后把 L3 的问题当作一次有边界的 bake-off 来跑，直接复用 SyntheMol 仓库里已有的 MIT 许可三方对比装置。',
      },
    ],
    tableIds: ['s3gfn-retro'],
    datumIds: [
      'predictorPotencyR2',
      'predictorDockingR2',
      'merckHitRate',
      'boltzmol1Hits',
      'fragmentToReaction',
      'aizynthReactionGfn',
      'aiddisonAssets',
      'maxentEquivalence',
      'deleuReduction',
      'rtbTrustPcl',
      'klToPrior',
      'dockingSarsCov2',
      'geneticGfnVsFragment',
      'geneticGfnAblation',
      'mpoWeightCollapse',
    ],
  },
  {
    id: 'wetlab',
    budgetMarker: '0 synthesized',
    kicker: { en: 'Asymmetry', zh: '不对称' },
    title: {
      en: 'The wet-lab asymmetry',
      zh: '湿实验证据的不对称',
    },
    standfirst: {
      en: 'The total number of molecules synthesized and assayed across all GFlowNet papers is 0; every route with a wet-lab readout used RL, a GA, MCTS or a physics-based closed loop.',
      zh: '所有 GFlowNet 论文合成并测活的分子总数是 0；每一条有湿实验读出的路线用的都是 RL、GA、MCTS 或物理闭环。',
    },
    body: [
      {
        en: 'The strongest claim on the GFlowNet side stops at "expert chemists manually reviewed and confirmed synthesizability" (RGFN) plus a cost analysis plus a roadmap — across RGFN (NeurIPS 2024), SynFlowNet (ICLR 2025), RxnFlow (ICLR 2025), TacoGFN (TMLR 2024), A-GFN (ICML 2025), CGFlow (ICML 2025) and S3-GFN (2026), all in silico. On the other side: SyntheMol-RL synthesized and assayed 111 molecules in Merck & Co. Program 1 with 4 at IC₅₀ < 10 μM; its academic line synthesized 79, of which 13 were strongly active in vitro (16.5%), 7 were structurally novel and 1 (synthecin) was effective in a mouse MRSA model; the Saturn line of granular synthesizability control synthesized 6/6 on BRD4 for 2 µM binders, and 1 µM binder out of 60 on Wee1; Schrödinger\'s AL + FEP+ closed loop ran 78/129 and reached a development candidate in 10 months (SGR-1505), with a Phase 1 CLL/WM single-agent response in 2025-06.',
        zh: 'GFlowNet 侧最强的主张止于"专家化学家人工审阅确认可合成"（RGFN）加成本分析加路线图 —— 横跨 RGFN (NeurIPS 2024)、SynFlowNet (ICLR 2025)、RxnFlow (ICLR 2025)、TacoGFN (TMLR 2024)、A-GFN (ICML 2025)、CGFlow (ICML 2025)、S3-GFN (2026)，全部 in silico。对面：SyntheMol-RL 在 Merck & Co. Program 1 合成测活 111 个、4 个 IC₅₀ < 10 μM；其学术线合成 79 个、13 个 in vitro 强活性（16.5%）、7 个结构新颖、1 个（synthecin）在小鼠 MRSA 模型有效；Saturn 系 granular synthesizability control 在 BRD4 上 6/6 全合成得 2 个 µM binder、Wee1 上 60 个中 1 个 µM binder；Schrödinger 的 AL + FEP+ 闭环 78/129，10 个月到 development candidate（SGR-1505），2025-06 Phase 1 CLL/WM 单药应答。',
      },
      {
        en: 'The non-generative comparison is just as pointed. Ultra-large-scale docking: AmpC an 11% hit rate (44/549), reaching 77 nM after 90 analogues; D4 top tranche 22–26%, the best being a 180 pM full agonist with 2500× selectivity. BoltzMol-1 in 2026 is more extreme still — oracle plus catalogue purchase only, 28–96 compounds per target, functional actives or binders on 6 of 10 targets, and most of those targets are unrepresented in its affinity training data.',
        zh: '非生成路线的对照同样刺眼。超大规模 docking：AmpC 11% hit rate（44/549），90 个类似物后达 77 nM；D4 top tranche 22–26%，最优是 180 pM 全激动剂、2500× 选择性。2026 年的 BoltzMol-1 更极端 —— 只做 oracle + 目录采购、每靶点 28–96 个化合物，10 个靶点中 6 个拿到 functional actives 或 binders，且多数靶点在其 affinity 训练数据中无表征。',
      },
      {
        en: 'The synthesizable MDP that GFlowNet popularised has crossed into the wet lab — but what drives it there is an RL objective, not the GFlowNet objective. On production deployment there is exactly one verifiable instance: HITS / HyperLab\'s Hyper Screening X (RxnFlow as the core technology, Core Plan $3,000/mo, 11 trillion compounds, actual synthesis available on commission, AiZynth synthesizability >60%), but the RxnFlow README states plainly that the production model is an undisclosed in-house derivative and that for the public version the "current version cannot reproduce the results of the paper".',
        zh: 'GFlowNet 推广的合成可达 MDP 已经跨进湿实验室 —— 但驱动它的是 RL 目标，不是 GFlowNet 目标。生产部署侧只有一个可核实实例：HITS / HyperLab 的 Hyper Screening X（以 RxnFlow 为核心技术，Core Plan $3,000/mo、11 万亿化合物、可委托实际合成，AiZynth 可合成率 >60%），但 RxnFlow README 明说生产模型是未公开的 in-house 衍生版，公开版"current version 不能复现论文结果"。',
      },
      {
        en: 'The counter-evidence comes from the company that employs GFlowNet\'s principal contributors: Recursion\'s official platform page and its FY2025 10-K / Q2-2026 10-Q mention GFlowNet 0 times; `recursionpharma/gflownet` had only 2 commits in all of 2026, and its main branch has no reaction environment, no docking, no ADMET and no PMO harness; SynFlowNet\'s last commit stops at 2025-01-31 (about 19 months of stagnation), and docking still requires compiling the QuickVina2-GPU binary yourself.',
        zh: '反证来自 GFlowNet 主要贡献者所在的公司：Recursion 官方 platform 页与 FY2025 10-K / Q2-2026 10-Q 提及 GFlowNet 的次数是 0；`recursionpharma/gflownet` 在 2026 全年只有 2 个 commit，主干无 reaction 环境、无 docking、无 ADMET、无 PMO harness；SynFlowNet 最后提交停在 2025-01-31（约 19 个月停滞），docking 还需自行编译 QuickVina2-GPU 二进制。',
      },
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
    kicker: { en: "Merck's own data", zh: 'Merck 自己的数据' },
    title: {
      en: 'The bottleneck is the oracle, not the sampler',
      zh: '瓶颈在 oracle，不在 sampler',
    },
    standfirst: {
      en: 'Of 12,796 generated molecules, 0 met both thresholds; of the 111 assayed, only 4 had IC₅₀ < 10 μM — and the team itself attributed the failure to inaccurate property predictors.',
      zh: '12,796 个生成分子里 0 个同时满足双阈值；111 个测活只有 4 个 IC₅₀ < 10 μM —— 团队自己把失败归因于性质预测器不准。',
    },
    body: [
      {
        en: 'The Program 1 funnel disclosed in the firsthand Stanford/Merck blog post (Swanson and Zou, with Chiriac and Cheng of Merck & Co. Discovery Chemistry, 2026-04-27) is the most direct project-level evidence in this memo. The method is SyntheMol-RL (RL over combinatorial building-block space), and the oracle is two Chemprop-RDKit 10-model ensembles: one trained on experimental potency (R² 0.66 ± 0.03), one trained on docking (R² 0.76 ± 0.01). On why docking was not used as the oracle directly, the authors give a directly quotable cost argument: "SyntheMol-RL needs to make thousands of property predictor calls during generation, so speed is crucial and Chemprop-RDKit is orders of magnitude faster than docking, even if it\'s less accurate."',
        zh: 'Stanford/Merck 一手博客（Swanson、Zou 与 Merck & Co. Discovery Chemistry 的 Chiriac、Cheng，2026-04-27）披露的 Program 1 漏斗，是本备忘录里最直接的项目级证据。方法是 SyntheMol-RL（RL over combinatorial building-block space），oracle 是两套 Chemprop-RDKit 10 模型 ensemble：一个训练在实验 potency（R² 0.66 ± 0.03），一个训练在 docking（R² 0.76 ± 0.01）。为什么不直接用 docking 当 oracle，作者给了可直接引用的成本论证："SyntheMol-RL needs to make thousands of property predictor calls during generation, so speed is crucial and Chemprop-RDKit is orders of magnitude faster than docking, even if it\'s less accurate."',
      },
      {
        en: 'Five failure modes, every one of them pointing at the oracle or the MPO specification and none at the sampler: the chemical diversity of the training data is too narrow, so the predictors generalise poorly to novel structures ("good performance for molecules resembling those already known but exhibit limited generalizability to the more novel small molecule structures that we\'d like to generate"); the joint objective is unreachable (0 of 12,796 met both thresholds); multi-objective weight collapse (under the 6-parameter MPO, dynamic weighting "put nearly all of the weight on P. aeruginosa potency and almost zero weight on the other four bacterial species", and the team ultimately abandoned six-parameter joint optimisation in favour of five 2-parameter optimisations); the generic chemical space did not match the project pharmacophore, forcing them to build a >35B internal space; and make-on-demand delivery loss (191 → 111).',
        zh: '五个失败模式，每一个都指向 oracle 或 MPO 规格，没有一个指向 sampler：训练数据化学多样性太窄，predictor 对新颖结构泛化差（"good performance for molecules resembling those already known but exhibit limited generalizability to the more novel small molecule structures that we\'d like to generate"）；联合目标不可达（12,796 里 0 个同时满足两阈值）；多目标权重坍塌（6 参数 MPO 下 dynamic weighting "put nearly all of the weight on P. aeruginosa potency and almost zero weight on the other four bacterial species"，团队最终放弃六参数联合优化，改为 5 个 2 参数优化）；通用化学空间不匹配项目 pharmacophore，被迫自建 >35B 内部空间；以及 make-on-demand 交付损耗（191 → 111）。',
      },
      {
        en: 'The team\'s own overall takeaway is the one line this memo should quote above all: "even when SyntheMol-RL designs molecules with all the desired predicted properties, many generated molecules still fail experimentally due to the inaccuracy of the property predictors. Therefore, it\'s crucial to continue developing not just generative models but also better molecular property predictors."',
        zh: '团队自己的总 takeaway 是这份备忘录最该引的一句："even when SyntheMol-RL designs molecules with all the desired predicted properties, many generated molecules still fail experimentally due to the inaccuracy of the property predictors. Therefore, it\'s crucial to continue developing not just generative models but also better molecular property predictors."',
      },
      {
        en: 'The boundaries must be written down and not overstepped: the blog post does not disclose the identity of the two targets, the ADMET properties or potency numbers of Program 2, the structures of the 4 hits, any measured ADMET data, any cost or compute figures — or any head-to-head baseline. Neither internal program had a GFlowNet / REINVENT / Saturn / virtual-screening comparison group; the only "baseline" is the predicted-value distribution of 10,000 random Enamine REAL molecules. The 4 hits from Program 1 are μM-level and belong to the hit finding stage; they are not a hit-to-lead or lead optimisation success story.',
        zh: '边界必须写清，不得越界：博客未披露两个靶点身份、Program 2 的 ADMET 性质与 potency 数值、4 个 hit 的结构、任何实测 ADMET 数据、任何成本/算力数字 —— 以及任何 head-to-head baseline。两个内部项目都没有 GFlowNet / REINVENT / Saturn / 虚拟筛选对照组，唯一"baseline"是 10,000 个随机 Enamine REAL 分子的预测值分布。Program 1 的 4 个 hit 是 μM 级，属 hit finding 阶段，不是 hit-to-lead 或 lead-opt 的成功案例。',
      },
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
    budgetMarker: { en: 'Next', zh: '下一步' },
    kicker: { en: 'Recommendation', zh: '建议' },
    title: {
      en: 'Fix L1 first, then let an equal-budget comparison pick the L3 objective',
      zh: '先修 L1，再用等预算对照决定 L3 用哪个目标函数',
    },
    standfirst: {
      en: 'The oracle and the MPO specification come first; the sampler-objective question is then settled by a three-way comparison on one internal target, under a fixed oracle budget with the same action space and reward — the acceptance line fixed in advance: GFlowNet enters the production roadmap only if it wins on both potency and #Circles at the same budget.',
      zh: 'oracle 与 MPO 规格先做；sampler objective 的问题随后由一个内部靶点、固定 oracle 预算、同一动作空间与 reward 的三方对照关闭 —— 验收线预先写死：只有 GFlowNet 在同预算下同时赢 potency 与 #Circles 才进生产路线图。',
    },
    body: [
      {
        en: 'Immediately (this quarter): build the oracle layer. Boltz-2 (code and weights both MIT, self-hosted MSA to protect IP) approaches FEP accuracy on the FEP+ benchmark at >1000× the speed; its generative screen coupled with SynFlowNet used only 117k evaluations (a fixed-library HLL screen needs 460k), and all 10 de novo candidates taken to ABFE were predicted to bind TYK2 — but this whole line is in silico, the authors themselves state the results "may be optimistic", and Recursion labels that repository Non-Prod / Tier-4 / Informational. At the same time, make independent retrosynthesis (SYNTHIA for Merck KGaA, AiZynthFinder/ASKCOS for Merck & Co.) a term of the objective function rather than a post-hoc filter — the basis being the 1/400-budget result, and SynFormer\'s "post-hoc projection drives Tanimoto down to 0.186". One calibrating remark: more expensive physics is not always better (FEP+ pairwise RMSE 1.25 vs 0.91 kcal/mol experimental cross-assay reproducibility), and any "synthesizability %" carries a noise floor (AiZynthFinder takes about 48 h for 10k molecules, and 8 metrics rank strongly inconsistently).',
        zh: '立即（本季度）：搭 oracle 层。Boltz-2（代码与权重均 MIT，自托管 MSA 保 IP）在 FEP+ 基准上接近 FEP 精度、>1000× 更快；它与 SynFlowNet 耦合的生成式筛选只用 117k 次评估（固定库 HLL 筛选需 460k），10 个 de novo 候选做 ABFE 全部预测结合 TYK2 —— 但这一条全部 in silico，作者自陈结果"可能偏乐观"，且 Recursion 自己把该仓库标为 Non-Prod / Tier-4 / Informational。同时把独立 retrosynthesis（Merck KGaA 用 SYNTHIA，Merck & Co. 用 AiZynthFinder/ASKCOS）作为目标函数的一项而非事后过滤 —— 依据是 1/400 预算的结果，以及 SynFormer 的"事后投影把 Tanimoto 打到 0.186"。校准一句：更贵的物理不总是更好（FEP+ pairwise RMSE 1.25 vs 实验跨-assay 再现性 0.91 kcal/mol），且任何"可合成性 %"都带噪声底（AiZynthFinder 处理 10k 分子约 48 h，8 个指标排序强不一致）。',
      },
      {
        en: 'Fix the MPO: Merck & Co.\'s project has already shown that 6-parameter joint optimisation degenerates into a single objective and that the two-threshold feasible region is empty. This is a reward-design problem; swapping the sampler does not solve it. And remember that "best on the benchmark ≠ usable on the project" — the best PMO/MolOpt configurations are the worst on chemical plausibility (ACEGEN-MolOpt B&T-CF 6.18 ± 0.27 / SEDiv@1k 12.54 ± 0.25, where plain REINVENT is 14.70 / 18.23), and every method that optimises docking alone produces greasy, high-molecular-weight garbage at QED 0.22–0.36.',
        zh: '修 MPO：Merck & Co. 的项目已经证明 6 参数联合优化会退化为单目标、双阈值可行域为空。这是 reward 设计问题，换 sampler 不解决。同时记住"基准最优 ≠ 项目可用"—— PMO/MolOpt 最优配置在化学合理性上最差（ACEGEN-MolOpt B&T-CF 6.18 ± 0.27 / SEDiv@1k 12.54 ± 0.25，朴素 REINVENT 是 14.70 / 18.23），而且每个只用 docking 做目标的方法都产出 QED 0.22–0.36 的高脂高分子量垃圾。',
      },
      {
        en: 'A one-off controlled experiment (1 internal target, fixed oracle budget, same action space and reward): (i) a SynGA/SynGBO-style synthesis-tree GA; (ii) REINVENT4 or Saturn with retrosynthesis-in-reward; (iii) an RxnFlow-style GFlowNet. It must include AugMemory or LSTM-HC as the diversity comparison group, and acceptance must be scored with #Circles rather than IntDiv. AL-accelerated ultra-large-scale virtual screening should also be brought in as an honest baseline — a MolPAL-style surrogate docks only 2.4% and recovers 87.9% of the top-50k (EF 36.6), and this is precisely the baseline GFlowNet lost to in Renz 2024. The judging should also include independent retrosynthesis success rate, chemical plausibility (B&T-CF/SEDiv-style), and the number of molecules chemists are actually willing to order. The acceptance line: GFlowNet enters the production roadmap only if (iii) wins on both potency and #Circles at the same budget — and on the evidence above, the prior expectation is that it will not. This is a weeks-scale experiment, not a program.',
        zh: '一次性对照实验（1 个内部靶点，固定 oracle 预算，同一动作空间与 reward）：(i) SynGA/SynGBO 式合成树 GA；(ii) REINVENT4 或 Saturn + retrosynthesis-in-reward；(iii) RxnFlow 式 GFlowNet。必须包含 AugMemory 或 LSTM-HC 作为多样性对照组，且用 #Circles 而非 IntDiv 验收。还应把 AL 加速的超大规模虚拟筛选放进来当诚实基线 —— MolPAL 类 surrogate 只 dock 2.4% 就回收 top-50k 的 87.9%（EF 36.6），而这正是 Renz 2024 中 GFlowNet 输给的那条基线。评判还应包含独立 retrosynthesis 成功率、化学合理性（B&T-CF/SEDiv 类）、以及化学家愿意实际下单的分子数。验收线：只有当 (iii) 在相同预算下同时赢 potency 与 #Circles，GFlowNet 才进入生产路线图 —— 基于前面的证据，先验预期它不会。这是数周量级实验，不是 program。',
      },
      {
        en: 'One sentence each, by entity. Merck & Co./MSD: GFlowNet is not the entry point, and a year of counter-evidence already exists; the right action is to spend the money on predictor accuracy and the MPO specification, with GFlowNet limited to a single bounded hit-finding bake-off (the MIT-licensed three-way comparison rig already present in the SyntheMol repository can be reused directly). Merck KGaA: this is the one place where GFlowNet has a structural advantage — SYNTHIA\'s >115,000 expert-coded reaction rules × >12 million purchasable starting materials, the SA-Space of ≈25 billion virtual compounds, and world-class FEP practice in the same organisation as the generative platform are exactly the three things a reaction-based GFlowNet needs. But the single change with the highest return has nothing to do with the sampler: promote SYNTHIA from a post-hoc scoring term to the generative action space itself (0% → 62% independent synthesizability), which either a GA or RL can deliver.',
        zh: '分实体的两句话。Merck & Co./MSD：GFlowNet 不是入口，且已有一年的反向证据；正确动作是把钱投在 predictor 精度与 MPO 规格上，GFlowNet 只作一次有边界的 hit-finding bake-off（可直接复用 SyntheMol 仓库里已有的 MIT 许可三方对比装置）。Merck KGaA：这是唯一 GFlowNet 有结构性优势的地方 —— SYNTHIA 的 >115,000 条专家编码 reaction rule × >1,200 万可购起始物、SA-Space ≈250 亿虚拟化合物、以及与生成平台同组的世界级 FEP 实践，正好是 reaction-based GFlowNet 需要的三件东西。但最高投入产出比的单点改动与 sampler 无关：把 SYNTHIA 从事后评分项升级为生成动作空间本身（0% → 62% 独立可合成率），用 GA 或 RL 都能拿到。',
      },
      {
        en: 'What not to touch: the SynFlowNet main branch (about 19 months stagnant, requires compiling the docking binary yourself); SA-score as the synthesizability acceptance criterion; IntDiv as the diversity acceptance criterion; 3D diffusion SBDD as the primary sampler (TargetDiff / DiffSBDD median strain 1241.7 / 1243.1 kcal/mol, against 102.5 for the test set) — 3D generation is suited to conformer/pose generation and scoring.',
        zh: '不要碰的：SynFlowNet 主干（停滞约 19 个月、需自编译 docking 二进制）；把 SA-score 当可合成性验收标准；把 IntDiv 当多样性验收标准；把 3D diffusion SBDD 当主 sampler（TargetDiff / DiffSBDD 中位 strain 1241.7 / 1243.1 kcal/mol，测试集 102.5）—— 3D 生成适合做构象/姿态生成与打分。',
      },
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
  {
    id: 'infrastructure',
    budgetMarker: { en: '2 commits', zh: '2 commits' },
    kicker: { en: 'Infrastructure', zh: '基础设施' },
    title: {
      en: 'The shared infrastructure never accumulated',
      zh: '共享基础设施从未积累起来',
    },
    standfirst: {
      en: 'The papers are prolific; the shared toolchain is not. The reference implementation took 2 commits in all of 2026 and its trunk still ships no real task, while the Julia ecosystem does not contain a single GFlowNet package. That contrast is the most material evidence there is for "a layer, not a platform".',
      zh: '论文很活跃，共享工具链没有。参考实现 2026 全年只有 2 个 commit、主干至今没有一个真实任务，而 Julia 生态里连一个 GFlowNet 包都没有。这个反差本身就是"它是一层而不是平台"最物质化的证据。',
    },
    body: [
      {
        en: 'Measured on 2026-08-27, from repository metadata and README text alone. recursionpharma/gflownet (MIT, default branch trunk) has 295 stars, 54 forks and 24 open issues, took 2 commits in all of 2026 — both on 2026-05-21 — and its trunk tasks are seh_frag, seh_frag_moo, qm9, qm9_moo, make_rings and toy_seq: no reaction environment, no docking, no ADMET, no PMO harness. GFNOrg/torchgfn has 313 stars, 57 forks and 52 open issues, and its README scopes the library to "fast prototyping" and to accompanying researchers in "learning about" GFlowNets; none of the gym environments it ships is molecular. mirunacrt/synflownet (MIT, 135 stars, 22 forks) stops at 2025-01-31. SeonghwanSeo/RxnFlow (MIT, 38 stars, 9 forks, last commit 2025-10-23) keeps a vendored copy of recursionpharma/gflownet v0.2.0 under src/gflownet/, and its README states that the improved in-house architecture drives the commercial product HyperLab while the public "current version cannot reproduce the results of the paper". recursionpharma/synflownet-boltz carries its owner\'s own repository properties environment=Non-Prod, business-criticality=Tier-4, repo-type=Informational, and has had zero commits since the 2025-06-27 initial push. And in Julia the General registry returns 404 for GFlowNet, for GFlowNets and for GenerativeFlowNetworks alike — the ecosystem holds no GFlowNet package at all.',
        zh: '2026-08-27 实测，全部来自仓库元数据与 README 文本。recursionpharma/gflownet（MIT，默认分支 trunk）有 295★ / 54 fork / 24 open issue，2026 全年只有 2 个 commit —— 都在 2026-05-21 —— 主干任务是 seh_frag、seh_frag_moo、qm9、qm9_moo、make_rings、toy_seq：无 reaction 环境、无 docking、无 ADMET、无 PMO harness。GFNOrg/torchgfn 有 313★ / 57 fork / 52 open issue，README 把自己的范围写成 "fast prototyping" 与陪伴研究者 "learning about" GFlowNets；它 shipped 的 gym 环境里没有一个是分子环境。mirunacrt/synflownet（MIT，135★ / 22 fork）停在 2025-01-31。SeonghwanSeo/RxnFlow（MIT，38★ / 9 fork，最后提交 2025-10-23）在 src/gflownet/ 下保留 recursionpharma/gflownet v0.2.0 的 vendored 副本，README 声明改进版 in-house 架构在驱动商业产品 HyperLab，而公开版 "current version 不能复现论文结果"。recursionpharma/synflownet-boltz 带着仓库所有者自己写的 custom properties：environment=Non-Prod、business-criticality=Tier-4、repo-type=Informational，2025-06-27 首推后零 commit。而在 Julia 侧，General registry 对 GFlowNet、GFlowNets、GenerativeFlowNetworks 一律返回 404 —— 这个生态里没有任何 GFlowNet 包。',
      },
      {
        en: 'Why nothing accumulated is an inference, not a measurement. The differentiating contribution in this field sits in the environment layer — the reaction MDP, the fragment library, the docking oracle, the ADMET filter — and the environment layer has no stable interface. With nothing to implement against, nothing can be upstreamed, so each contribution ships as its own fork: RGFN, SynFlowNet, RxnFlow, Genetic GFN, A-GFN, TacoGFN and S3-GFN are seven mutually incompatible codebases, and the capability is scattered across them. Contrast the one comparable stack that does accumulate. REINVENT4 is Apache-2.0, uses a namespace-package plugin mechanism, and lets a site attach its own scoring component with zero changes to the core — because the shared interface is score(smiles) -> float. One function signature.',
        zh: '为什么没能积累，这是推断而非实测。这个领域的差异化贡献在环境层 —— reaction MDP、fragment library、docking oracle、ADMET 过滤 —— 而环境层没有稳定接口。没有可供实现的对象，就没有任何东西能上游，于是每份贡献都以自己的 fork 出货：RGFN、SynFlowNet、RxnFlow、Genetic GFN、A-GFN、TacoGFN、S3-GFN 是七个互不兼容的代码库，能力散在它们之间。对照唯一一个可比且确实在积累的栈：REINVENT4 是 Apache-2.0、用 namespace package 插件机制，一个站点核心零改动就能接上自有 scoring component —— 因为共享接口是 score(smiles) -> float。一个函数签名。',
      },
      {
        en: 'One documented attempt, presented as an attempt. danielchen26/Gflownet is a Julia implementation (MIT, Project.toml version 1.0.0, author "Tianchi Chen", Zenodo 10.5281/zenodo.22117533), created 2025-05-17, last pushed 2026-08-27, 94,661 KB across 152 .jl files, on Julia 1.11 with Lux 1.6 + Zygote 0.6 for autodiff, PythonCall 0.9.31 as the RDKit bridge and Oxygen for its HTTP server. It answers the interface question with 7 generic functions, written out verbatim in the header of its molecular_generation.jl — state_to_features, is_terminal_state, reward, is_applicable, apply_action, find_parent_for_action, plus core/interface.jl. The core is balance.jl (38,150 B; TB / DB / FM / SubTB), interface.jl (32,911 B), policies.jl (30,471 B), flows.jl (20,198 B), sampling.jl (11,438 B), multi_start.jl (10,969 B); the applications are grid_world.jl (17,366 B), molecular_generation.jl (31,572 B, BRICS fragment-based), molecular_design.jl (12,181 B, atom-level, marked legacy in the README), causal_discovery.jl (10,303 B), active_learning.jl (7,976 B); the extensions are information.jl (4,357 B, information-theoretic objectives), non_acyclic.jl (6,622 B), continuous.jl (3,724 B). Files present here that the Python reference implementations do not carry: a PMO harness (test_pmo.jl), docking and oracle test abstractions (test_docking.jl, test_oracles.jl), a cross-objective comparison (experiments/objective_comparison_drd2.jl together with reports/2026-03-01_molecular_generation_benchmark_report.md), log Z as a first-class object (examples/core_features/learnable_partition_function, alongside sub_trajectory_balance, flow_matching, direct_flow and multi_start), and information-theoretic objectives — with 15 molecular test files in all under test/applications/molecular/. What it lacks, at exactly the same weight: it is not registered in the General registry, so Pkg.add("GFlowNet") fails today; PythonCall sits in [deps] rather than as a weak dependency behind an extension, so every user is forced to drag a Python environment along; and the name is inconsistent in three places — repository Gflownet, package GFlowNet, README title GFlowNet.jl. An implementation that cannot be installed by name has not yet solved the accumulation problem it describes.',
        zh: '一个有文档的尝试，就当成一个尝试来看。danielchen26/Gflownet 是一个 Julia 实现（MIT，Project.toml version 1.0.0，author "Tianchi Chen"，Zenodo 10.5281/zenodo.22117533），created 2025-05-17、last push 2026-08-27，94,661 KB、152 个 .jl 文件，跑在 Julia 1.11 上，autodiff 用 Lux 1.6 + Zygote 0.6，RDKit 桥用 PythonCall 0.9.31，HTTP server 用 Oxygen。它对接口问题的回答是 7 个泛型函数，逐字写在它的 molecular_generation.jl 文件头里 —— state_to_features、is_terminal_state、reward、is_applicable、apply_action、find_parent_for_action，加 core/interface.jl。core 是 balance.jl（38,150 B；TB / DB / FM / SubTB）、interface.jl（32,911 B）、policies.jl（30,471 B）、flows.jl（20,198 B）、sampling.jl（11,438 B）、multi_start.jl（10,969 B）；applications 是 grid_world.jl（17,366 B）、molecular_generation.jl（31,572 B，BRICS fragment-based）、molecular_design.jl（12,181 B，atom-level，README 标 legacy）、causal_discovery.jl（10,303 B）、active_learning.jl（7,976 B）；extensions 是 information.jl（4,357 B，信息论目标）、non_acyclic.jl（6,622 B）、continuous.jl（3,724 B）。这里有、而 Python 侧参考实现没有的文件：PMO harness（test_pmo.jl）、docking 与 oracle 测试抽象（test_docking.jl、test_oracles.jl）、跨目标函数对比（experiments/objective_comparison_drd2.jl 连同 reports/2026-03-01_molecular_generation_benchmark_report.md）、log Z 作为一等公民（examples/core_features/learnable_partition_function，旁边还有 sub_trajectory_balance、flow_matching、direct_flow、multi_start）、以及信息论目标 —— test/applications/molecular/ 下共 15 个分子测试文件。它还缺的，权重完全相同：未注册到 General registry，Pkg.add("GFlowNet") 目前失败；PythonCall 在 [deps] 而不是放在 extension 后面当 weakdep，每个用户都被迫拖一个 Python 环境；命名三处不一致 —— repo Gflownet、包名 GFlowNet、README 标题 GFlowNet.jl。一个不能按名字安装的实现，还没有解决它自己描述的那个积累问题。',
      },
      {
        en: 'One proposal that exists in no implementation yet — a claim, not a result: a pointed-DAG legality checker. The motivation is a measured fact already on this page. SynFlowNet (ICLR 2025) reports that with a uniform backward policy only 11.0 ± 3.7% of backward trajectories in its reaction MDP get back to s₀, and that defect surfaced in a paper rather than in a test. The correctness of find_parent_for_action is the implicit landmine under every GFlowNet paper: get it wrong and the loss still decreases. No library ships diagnostics for backward reachability, orphaned parents, or flow-conservation residuals, so a checker that reports those three numbers before training starts belongs in the environment interface itself — in whichever language the interface finally stabilises.',
        zh: '一个尚不存在于任何实现中的提议 —— 这是主张，不是结果：pointed-DAG 合法性检查器。动机是这一页上已有的实测事实。SynFlowNet（ICLR 2025）报告在它的 reaction MDP 上用均匀 backward policy 时，只有 11.0 ± 3.7% 的反向轨迹能回到 s₀，而这个缺陷是在论文里、不是在测试里被发现的。find_parent_for_action 的正确性是每篇 GFlowNet 论文底下的隐性地雷：写错了，loss 照样下降。没有任何库提供反向可达率、孤立父节点、flow 守恒残差的诊断，所以一个在训练开始前就报出这三个数字的检查器，应当属于环境接口本身 —— 无论这个接口最终在哪种语言里稳定下来。',
      },
      {
        en: 'The boundary of this section, written down so it cannot be over-read: everything above was read through the GitHub API — the file tree, the README, Project.toml, file sizes — plus a path probe against the Julia registry. Nothing was cloned, no test was executed, no benchmark was reproduced. This section therefore makes no claim about any test pass rate and no claim about performance, for danielchen26/Gflownet or for anything else; a file named test_pmo.jl is evidence that the file exists, not that it passes. The star, fork, issue and commit counts are a 2026-08-27 snapshot and will drift.',
        zh: '这一节的边界，写下来以免被过度解读：以上全部经 GitHub API 读取 —— 文件树、README、Project.toml、文件大小 —— 加一次对 Julia registry 的路径探测。没有 clone、没有运行任何测试、没有复现任何基准。因此这一节对 danielchen26/Gflownet 或任何其他实现，都不作任何测试通过率主张、不作任何性能主张；一个叫 test_pmo.jl 的文件只能证明该文件存在，不能证明它通过。★数、fork 数、issue 数与 commit 数是 2026-08-27 的时点快照，会漂移。',
      },
    ],
    tableIds: ['ecosystem-status'],
    datumIds: [
      'recursionGflownetCommits',
      'recursionZeroMentions',
      'synflownetBackward',
    ],
  },
];

/**
 * §13 中最影响本页结论强度的未验证项。诚实展示是这个页面的一部分 ——
 * 这些条目**不得**被当作证据引用。
 */
export const openGaps: LText[] = [
  {
    en: 'The claim that "no second budget-matched GFlowNet vs DF-RL diversity comparison exists" is true only within the search scope of the OpenAlex citation graph (all 17 papers citing Renz 2024) + five field combinations of the arXiv API + the OpenReview API. A paper that neither cites Renz 2024 nor surfaces the relevant keywords in its arXiv abstract cannot be ruled out. The wording should be "within the firsthand literature we retrieved".',
    zh: '"不存在第二篇预算匹配的 GFlowNet vs DF-RL 多样性对照"这一断言，只在 OpenAlex 引文图（Renz 2024 全部 17 篇引用）+ arXiv API 五种字段组合 + OpenReview API 的检索范围内为真。无法排除存在一篇既未引用 Renz 2024、又未在 arXiv 摘要出现相关关键词的论文。措辞应为"据我们检索到的一手文献"。',
  },
  {
    en: 'The body of the Renz 2024 SI PDF (S1–S5) is unobtainable (both the ACS and the PMC mirror return an interstitial page). The table values were taken verbatim from the .tex source in the authors\' official repository and share their source with Figure 2, but the RF model ROCAUC/AP in S2.1 and the budget-scaling curve values in S5 were not independently checked.',
    zh: 'Renz 2024 的 SI PDF 正文（S1–S5）取不到（ACS 与 PMC 镜像均返回跳板页）。表格数值已从作者官方仓库的 .tex 源文件逐字取得、与 Figure 2 同源，但未独立核对 S2.1 的 RF 模型 ROCAUC/AP 与 S5 的 budget-scaling 曲线数值。',
  },
  {
    en: 'Saturn diversity numbers under a 10,000-call budget do not exist in the paper (its budgets are 1,000 and 3,000). This page substitutes the 3,000 tier and labels it as such — so Saturn and the Renz table are not a same-budget comparison.',
    zh: 'Saturn 在 10,000 调用预算下的多样性数值不存在于论文中（论文预算为 1,000 与 3,000）。本页用 3,000 档替代并已标注 —— 因此 Saturn 与 Renz 表不是同预算对照。',
  },
  {
    en: 'PMO numbers are not comparable across papers: REINVENT scores 13.55 / 14.016 / 15.003 / 15.185 under different implementations/seeds/task subsets, with 1–10 seeds and 2–23 tasks; adjacent ranks typically differ by 0.3–0.5. No cross-paper difference smaller than about 0.5 can serve as grounds for a conclusion.',
    zh: '跨论文 PMO 数值不可比：REINVENT 在不同实现/seed/任务子集下为 13.55 / 14.016 / 15.003 / 15.185，seed 数 1–10、任务数 2–23；相邻排名典型差 0.3–0.5。任何小于约 0.5 的跨论文差值都不可作为结论依据。',
  },
  {
    en: 'The Renz table (#Circles, D=0.7, ligand-based tasks) and Saturn\'s #Circles (t=0.75, docking tasks) cannot be compared directly with each other; each is only comparable within its own group.',
    zh: 'Renz 表（#Circles，D=0.7，ligand-based 任务）与 Saturn 的 #Circles（t=0.75，docking 任务）不可直接互比，只能各自组内比较。',
  },
  {
    en: 'The firsthand Merck blog post does not disclose: the identity of the two targets, the ADMET properties and potency numbers of Program 2, the structures of the 4 hits, any measured ADMET data, any cost or compute figures, or any head-to-head baseline. The values in the blog\'s charts were not OCRed.',
    zh: 'Merck 一手博客未披露：两个靶点身份、Program 2 的 ADMET 性质与 potency 数值、4 个 hit 的结构、任何实测 ADMET 数据、任何成本/算力数字，以及任何 head-to-head baseline。博客图表数值未 OCR。',
  },
  {
    en: 'Neither Merck entity has any published or announced GFlowNet work (Europe PMC affiliation searches for AFF:"Merck KGaA" / AFF:"Merck & Co" / AFF:"Rahway" return nothing) — absence of evidence is not evidence of absence. Whether AIDDISON\'s generative core has been upgraded as of 2026 is likewise unverified (the paper is 2023-12).',
    zh: 'Merck 两实体均无公开发表或宣布的 GFlowNet 工作（Europe PMC 署名检索 AFF:"Merck KGaA" / AFF:"Merck & Co" / AFF:"Rahway" 为空）—— 缺证据不等于不存在。AIDDISON 2026 年的生成内核是否已升级同样未验证（论文为 2023-12）。',
  },
  {
    en: 'Gkeka et al., "Computational Hit Finding: An Industry Perspective" (J Med Chem 68(11):10507, 2025) is available in abstract only (closed OA; all six full-text routes failed). Its in-text head-to-head hit-rate comparison of "generative vs ultra-large-scale screening vs DEL" = UNVERIFIED; nor was any firsthand DEL vs generative head-to-head comparison found.',
    zh: 'Gkeka 等《Computational Hit Finding: An Industry Perspective》（J Med Chem 68(11):10507, 2025）仅摘要可得（closed OA，六条取全文路径全部失败）。其正文的"生成式 vs 超大规模筛选 vs DEL"头对头命中率对比 = UNVERIFIED；也未找到任何 DEL vs 生成式的一手头对头比较。',
  },
  {
    en: 'The test pass rate and the benchmark numbers of danielchen26/Gflownet are UNVERIFIED: only repository metadata was read through the GitHub API and nothing was cloned or executed. The existence of test_pmo.jl / test_docking.jl / objective_comparison_drd2.jl and of reports/2026-03-01_molecular_generation_benchmark_report.md does not mean those tests pass or that those numbers reproduce.',
    zh: 'danielchen26/Gflownet 的测试通过率与基准数字 = UNVERIFIED：仅经 GitHub API 读取仓库元数据，未 clone、未运行。test_pmo.jl / test_docking.jl / objective_comparison_drd2.jl 与 reports/2026-03-01_molecular_generation_benchmark_report.md 的存在，不等于这些测试通过、也不等于这些数字可复现。',
  },
  {
    en: 'The Julia registry probe is a point-in-time snapshot taken on 2026-08-27 (three package paths: GFlowNet, GFlowNets, GenerativeFlowNetworks). The same holds for every repository commit count, star count, fork count and open-issue count on this page: they are that day\'s values, not standing facts.',
    zh: 'Julia registry 探测是 2026-08-27 的时点快照（三个包路径：GFlowNet、GFlowNets、GenerativeFlowNetworks）。本页所有仓库的 commit 计数、★数、fork 数与 open issue 数同理：它们是那一天的值，不是恒定事实。',
  },
];
