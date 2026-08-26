# GFlowNet 是否适合作为 Merck 小分子药物生成的未来框架？

**决策备忘录 · 2026-08-25 · v2（终版）**
范围：小分子 de novo / 合成可达设计 ｜ 每条事实均附一手来源 ｜ 未验证项在 §13 单列

---

## 0. 结论

**不要把 GFlowNet 当框架立项。它是 sampler 层的一个可选目标函数，而 2026 年的杠杆不在 sampler。**

三条独立证据链各自都足以支撑这个结论：

1. **固定 oracle 预算下它输**。PMO 原表：GFlowNet 9.131（16/25）、GFlowNet-AL 8.406（22/25）、**随机筛选 8.635（19/25）**、REINVENT 14.196（1/25）。
2. **它唯一的差异化卖点（多样性）在唯一一次公平对照中被否证**。在专门为多样性设计、预算受控、且给**所有**方法都装上 diversity filter 的 benchmark 里，GFlowNet 在 DRD2 与 JNK3 上的 diverse hits 是 **0**，而随机虚拟筛选是 21 和 15。
3. **它真正的贡献（reaction-template 合成可达 MDP）与 flow 目标无关**，且已被更简单的 sampler 在 1/4 到 1/400 的预算下超越。

**真正的瓶颈由 Merck 自己的项目数据给出**：Merck & Co. 与 Stanford 用非 GFlowNet 的 SyntheMol-RL 在一个内部靶点上跑了一年 —— 12,796 个生成分子里 **0 个**同时满足 potency 与 docking 双阈值；最终合成测活 111 个，**只有 4 个 IC₅₀ < 10 μM（3.6%）**，而同一项目历史库里已有 95 个单位数 nM 化合物。团队自己的结论是：**分子失败的原因是性质预测器不准，不是生成器不行。**

→ **把预算投在 oracle（性质预测器、亲和力模型、独立 retrosynthesis）与 MPO 规格上，而不是换 sampler。**

---

## 1. GFlowNet 可证明提供什么（准确表述）

一个**分布性**保证 —— 不是优化保证，不是样本效率保证：在 flow 目标的全局最优处，学到的前向策略在**构造动作的 DAG** 上满足 p(x) ∝ R(x)。这修正了树形/自回归 value 方法的偏差：后者给出 π(x) ∝ n(x)·R(x)，其中 n(x) 是构造同一分子图的动作序列数，该偏差随轨迹长度指数增长并系统性偏好大分子。
来源：*Flow Network based Generative Models for Non-Iterative Diverse Candidate Generation*, E. Bengio et al., NeurIPS 2021 — https://arxiv.org/abs/2106.04399（Prop. 1c / 2 / 3）

派生的三个**真实**工程价值：

1. **Off-policy 有效性**（Prop. 3）：任意足够覆盖 support 的行为策略（GA、local search、replay、离线专家数据）都能产生训练轨迹而不引入分布偏差。**这是下游所有 GFlowNet 论文实际变现的唯一性质。**
2. **log Z 免费给出可达空间大小的估计** —— SynFlowNet 就是令 R≡1 训练、读出 log Z 来测量自己的状态空间（https://arxiv.org/pdf/2405.01155 §3.3）。
3. **reward↔diversity 有采样语义的连续旋钮**（逆温度 β、rank 权重 k），而非启发式 filter。

### 1.1 关键澄清：它的"principled 多样性"属于 KL/entropy 正则目标类，不专属 GFlowNet

GFlowNet 的不动点不坍缩，而 **reward-maximizing** RL 的最优解是确定性策略 —— 这个不对称是真的。但"RL 做不到"已被四个归约证伪，三篇有 Bengio 署名：

| 结论 | 出处 |
|---|---|
| GFlowNets 与 MaxEnt RL **"one and the same, up to a correction of the reward function"** | Tiapkin, Morozov, Naumov, Vetrov, *Generative Flow Networks as Entropy-Regularized RL*, **AISTATS 2024 (Oral)** — https://arxiv.org/abs/2310.12934 |
| 把 reward correction 推广到**任意 MDP 结构**；并证 **Trajectory Balance ≡ Path Consistency Learning**（Nachum 2017）、**Modified Detailed Balance ≡ Soft Q-Learning 变体** | **Deleu, Nouri, Malkin, Precup, Y. Bengio**（Mila / Valence Labs / DeepMind），*Discrete Probabilistic Inference as Control in Multi-path Environments*, **UAI 2024**, PMLR 244:997–1021 — https://raw.githubusercontent.com/mlresearch/v244/main/assets/deleu24a/deleu24a.pdf |
| **Relative Trajectory Balance ≡ Trust-PCL**（off-policy KL 正则 RL）；且"KL-regularized RL methods achieve **comparable performance**, offering an alternative perspective to what was previously reported" | **Deleu, Nouri, Y. Bengio, Precup**, 2025-09 — https://arxiv.org/abs/2509.01632 |
| SMILES 序列生成下 P_B(τ\|x)=1，**TB 直接退化为 PCL** | S3-GFN (2026) 正文自述，引 Deleu 2024 / Tiapkin 2024 |

第三条尤其关键：**RTB 正是 2026 年 GFlowNet 前沿（S3-GFN）所用的目标函数**。
KL 正则 RL 的不动点是 π*(x) ∝ π_prior(x)·exp(R(x)/τ) —— 同一个 Gibbs 族，同样不坍缩，同样 principled。GFlowNet 是该类中的一种**参数化**（外加 flow 守恒约束以处理多路径），不是唯一的原理性解法：多路径 n(x) 偏差可直接在 MaxEnt RL 里用修正 reward 消掉。

**经验上的刺**：需要 DAG 修正的表示（fragment/graph MDP，多路径）正是 PMO 上拿 9.918 的那个；拿 16.213 的 SMILES 表示是单路径，修正项为空、TB 恰好退化成 PCL。Genetic GFN 论文原话："生成 SMILES 明显优于生成 graph-based fragment"。
**→ GFlowNet 有独特理论优势的设定，正是经验上输的那个设定。**

**工程后果（对本备忘录的建议是加强而非削弱）**：既然 GFlowNet ≡ KL 正则 RL + reward correction，那么想要它的性质**不需要新框架**，只需要 (a) 多路径 reward correction（仅当真用 fragment/reaction MDP）+ (b) 一个 KL 正则项 —— 两者都是 **loss 层改动**，可直接进 REINVENT4 / AIDDISON 的现有 RL 循环，不触发商业产品的重新资格认证。pharma 侧已独立走到这里：Thomas 等（JCIM 65:12752, 2025）实测 **KL-to-prior 优于 REINVENT 的 reward-shaping**（validity +18% / exploration +12%，而 reward-shaping 是 validity +12% / diversity −20%）。

此外：GFlowNet 的真正竞争对手类别是 **MCMC / 摊销采样**，不是 reward-maximizing RL。*GFlowNet Foundations*（JMLR 24(210), https://arxiv.org/abs/2111.09266）自己的框架就是"用单次训练摊销 MCMC"。

2021 年那篇论文实际跑的分子实验只有**一个 proxy 任务**：fragment 组装、sEH docking 的 MPNN proxy（测试 MSE 0.6）、10⁶ 分子预算。reward 里**没有**类药性、可合成性、毒性 —— 作者明说"对真实药物设计我们需要考虑更多量"。

---

## 2. 固定 oracle 预算下的硬数字

### 2.1 PMO 原始基准（23 oracle，10k 调用，5 seed，sum AUC-top10，满分 23）

来源：*Sample Efficiency Matters*, Gao/Fu/Sun/Coley, NeurIPS 2022 — https://arxiv.org/pdf/2206.12411v2（附录表，**本人直接核对原表**）

| 方法 | Sum AUC-top10 | Rank |
|---|---|---|
| REINVENT (SMILES RL) | **14.196** | 1/25 |
| Graph GA | 13.751 | 2 |
| SELFIES-REINVENT | 13.471 | 3 |
| GP BO | 13.156 | 4 |
| SynNet (synthesis GA) | 11.498 | 8 |
| MARS (MCMC) | 10.651 | 12 |
| **GFlowNet (fragment)** | **9.131** | **16** |
| **随机筛选 ZINC-250k** | **8.635** | **19** |
| **GFlowNet-AL** | **8.406** | **22** |
| Graph MCTS / MolDQN | 7.803 / 5.620 | 24 / 25 |

PMO 自己的因果解释：逐 token / 逐原子从单点组装的方法"最数据低效……浪费大量 oracle 预算，并对 oracle 质量提出强要求"；且"GFlowNet 在几乎每个任务上都优于 GFlowNet-AL"—— **加 surrogate 反而更差**。

### 2.2 GFlowNet 变体之间（同一 codebase、同一协议）

来源：*Genetic-guided GFlowNets*, Kim et al., NeurIPS 2024 — https://arxiv.org/abs/2402.05961（**本人直接核对**）

| 方法 | Sum AUC-top10 |
|---|---|
| **Genetic GFN**（SMILES + GraphGA + GFN loss） | **16.213 ± 0.173** |
| Mol GA | 15.686 |
| LS-GFN（local search GFN） | 15.230 ± 0.026 |
| SMILES REINVENT | 15.185 |
| **fragment GFN / GFN-AL** | **9.918 / 9.928** |

**消融即自我指控**：去掉 genetic search → 15.738；把 genetic search 换回 GFlowNet 原生 ε-greedy → **15.626**；用 STONED 替代 GraphGA → 15.439；去掉 KL-to-prior → 15.928。
即 SOTA 的功劳属于 **GraphGA 的算子 + REINVENT 的架构与 KL 正则**，GFlowNet 只是 replay 目标。论文原话：GFlowNets"即使使用 proxy reward 做 active learning，也一直在样本高效分子优化上挣扎"；且"生成 SMILES 明显优于生成 graph-based fragment"。

### 2.3 docking 类任务（SARS-CoV-2，Top-100 平均分）

同一来源 Table 5：**GFlowNet 0.326 / 0.280** vs GraphGA 0.723/0.786 vs REINVENT 0.717/0.799 vs MolRL-MGPT 0.772/0.854 vs Genetic GFN(100 步) 0.891/0.873、(1000 步) 0.925/0.902。
**vanilla GFlowNet 只有 REINVENT 的 ~45%。**

---

## 3. 多样性论点：唯一一次公平对照否证了它

这一节是本备忘录中**最强的单条反证**，因为它打的是 GFlowNet 唯一的差异化卖点。

### 3.1 唯一同时满足三个公平条件的对照实验

来源：*Diverse Hits in De Novo Molecule Design: Diversity-Based Comparison of Goal-Directed Generators*, Renz, Luukkonen & Klambauer, **JCIM 64(15):5756–5761 (2024)** — https://pmc.ncbi.nlm.nih.gov/articles/PMC11323242/ ；数值取自作者官方仓库 https://github.com/ml-jku/diverse-hits（MIT，Zenodo 10.5281/zenodo.11004835）的 `notebooks/tables/results_allmetrics_samples.tex`，与论文 Figure 2 同源

实验设计（三个条件同时成立，全文仅此一篇）：
- **预算匹配**：10,000 次 scoring-function 调用（沿用 PMO），以及 600 s 墙钟双设定；
- **RL 全部装上 diversity filter**：Blaschke 2020 的 DF（D_DF=0.7）被乘进**所有**方法的 scoring function；作者原话"DF 在初步实验中被证明对性能至关重要"；
- **用 sphere-exclusion 指标**：#Circles（D=0.7），而不是 IntDiv 或 mode count；hit 定义 = score>0.5（RF 活性概率 × 性质过滤 × DF）；
- 每个组合 15 次超参随机搜索 + 5 个 seed；GFlowNet 额外做了 ±DF 消融。

**10,000 调用预算下的 diverse hits（#Circles）：**

| 方法 | 类型 | DRD2 | GSK3β | JNK3 |
|---|---|---|---|---|
| AugMemory | SMILES RL | **81** | 636 | **176** |
| AugmentedHC | SMILES RL | 66 | **674** | 111 |
| LSTM-HC | SMILES HC | 62 | 456 | 103 |
| BAR | SMILES RL | 49 | 361 | 69 |
| Reinvent | SMILES RL | 41 | 198 | 35 |
| GraphGA | GA (graph) | 21 | 115 | 24 |
| **VS Random（随机虚拟筛选）** | 筛选基线 | **21** | **93** | **15** |
| LSTM-PPO | SMILES RL | 14 | 108 | 13 |
| VS MaxMin | 筛选基线 | 19 | 68 | 9 |
| Mimosa / Mars | graph edits | 6 / 3 | 23 / 39 | 8 / 4 |
| SmilesGA / Stoned | GA | 3 / 3 | 27 / 13 | 4 / 4 |
| **GflownetDF**（GFN + DF） | GFlowNet | **0** | 77 | **0** |
| **Gflownet** | GFlowNet | **1** | 67 | **0** |

600 s 预算下同样：LSTM-HC 544 / 2620 / 708；**Gflownet 0 / 112 / 0；GflownetDF 0 / 87 / 0**。
注：GFlowNet 在 DRD2/JNK3 的 IntDiv 列是 0.00±0.00 —— 因为**一个 hit 都没找到**，指标无定义。

**作者的直接判决（原话）**：
> "We also found Mars and GFlowNet to perform poorly in this comparison, **despite comparing well in previous diverse optimization studies**. This discrepancy highlights the importance of a meaningful benchmark setup and comparison to models suited for diverse optimization."

以及一条药化上更要命的观察：
> "increased diversity is often achieved by generating larger, less drug-like molecules. We note that also the models achieving the lowest number of diverse hits (**Mars and GFlowNet**) struggle to generate drug-like molecules."

摘要结论：
> "Our findings highlight the superior performance of **SMILES-based autoregressive models** in generating diverse sets of desired molecules compared to graph-based models or genetic algorithms."

（附注：该论文致谢名单包含 **Merck Healthcare KGaA** 作为 JKU/ELLIS Linz 赞助方之一。）

### 3.2 GFlowNet 多样性的"好名声"建立在被公理否证的指标上

来源：Xie, Xu, Ma & Mei, *How Much Space Has Been Explored?*, **ICLR 2023** — https://openreview.net/forum?id=Yo06F8kfMa1 ；全文 https://ar5iv.labs.arxiv.org/html/2112.12542

- **公理分析**：internal diversity（IntDiv / Tanimoto 多样性）**只满足 Dissimilarity，违反 Monotonicity 与 Subadditivity**；#Circles 是**唯一**同时满足三条公理的度量。
- **后果**：加进更多分子可以让 IntDiv **下降**；IntDiv 可以被"两个距离最大的分子"刷满 —— 而药物发现要的是几百个可测的簇，不是 2 个点；少数几个彼此相似的簇也能拿到高 IntDiv。
- **与"生物功能类别数"这个 proxy gold standard 的相关性**：IntDiv 为 Medium（固定规模）/ **Low**（增长规模）；#Circles 为 High / High。
- **判决原话**："the widely used Diversity measure is rendered inferior both analytically and empirically, **casting doubts on its efficiency in measuring and encouraging exploration**"；小节标题结论："**Diversity should be avoided as a descriptor for exploration**"。
- **同论文另一条与 GFlowNet 叙事直接冲突的发现**："**ML-based models fail to explore a larger effectual area compared to databases**" —— 在 t=0.75 下，对数据库做虚拟筛选覆盖的 #Circles 面积最大。
- **边界（须诚实说明）**：Xie et al. **并未测试 GFlowNet**（被测生成器是 RationaleRL、DST、JANUS、MARS 及变体）。所以"#Circles 原论文对 GFlowNet 有利"不成立。

**所有 GFlowNet 分子论文报告的多样性都是 Tanimoto diversity 或 mode count** —— 恰好落在这个批评范围内。

### 3.3 论文内部仍有的一个真实加分项（须公允保留）

Genetic GFN 的 β 扫描（https://arxiv.org/abs/2402.05961 Fig. 3）：

| β | AUC-top10 | Diversity (Tanimoto) |
|---|---|---|
| 1 | 11.083 | 0.812 |
| 5 / 10 | 14.597 / 14.735 | 0.670 / 0.663 |
| **30** | **15.815** | **0.528** |
| 50 | 16.213 | 0.432 |
| 参照 Mol GA | 15.686 | 0.465 |
| 参照 REINVENT | 15.185 | 0.468 |

在 β=30 处 Genetic GFN 在**两个轴上同时**优于 Mol GA 与 REINVENT —— 论文内部可比，是真实的 Pareto 改进。但：(a) 幅度（+0.13 AUC）落在实现噪声量级；(b) 用的正是被 §3.2 否证的 IntDiv 类指标；(c) 该配置的功劳按 §2.2 消融属于 GraphGA。

### 3.4 "设防过的 RL"的多样性参照，以及一条对 Merck 的诚实提醒

Saturn（https://ar5iv.labs.arxiv.org/html/2405.17066）的 diversity filter 机制：存储每个生成 SMILES 的 Bemis-Murcko scaffold，同一 scaffold 超过 **M=10** 次则 reward 截断为 0，并在执行 Augmented Memory 前**把被罚 scaffold 从 replay buffer 清除**（Selective Memory Purge），"preventing mode collapse"。
效果：1,000 调用预算下 DRD2 拿到 **310±70** 个 unique scaffold（Augmented Memory baseline 仅 22±7），AChE **400±96**。

但 Saturn 自己也在 trade-off 上诚实：3,000 预算、strict filter（QED>0.7 & SA<3）下 **#Circles(t=0.75) Saturn 3–17 vs fragment-based GEAM 7–25**（parp1: 5±0 vs 14±3），作者原话"**trading off diversity to do so**"。它的辩护逻辑对 Merck 直接相关：
> "when moving to high-fidelity oracles where satisfying the objective function equates to higher true positive hit rates, **low diversity need not be detrimental**… when using **lower-fidelity oracles, more false positives means it is beneficial to have more diverse ideas for downstream triaging**."

**→ 若 hit finding 阶段确实需要覆盖度，正确的对照组是 GEAM / GraphGA / LSTM-HC / AugMemory 这一类，而不是 GFlowNet。**
成本提醒：Saturn(Mamba) 在 CPU 上 1,426 min ≈ 24 h（Augmented Memory 172 min；GPU 上 RNN 与 Mamba 无显著差异）。

---

## 4. GFlowNet 真正的贡献是 action space，不是 sampler

三组消融把两者干净分开：

**同一 GFlowNet，换 MDP** → 效果巨变：
- fragment MDP → reaction MDP 使 AiZynthFinder 成功率从 **0% 跳到 62%**（SynFlowNet, https://arxiv.org/pdf/2405.01155）。

**同一 reaction MDP，换 sampler** → GFlowNet 输：
- **GA**：Graph GA-ReaSyn 在 sEH 上 0.96 / AiZynth 0.97，反超 SynFlowNet 0.92 / 0.65（ReaSyn, NVIDIA/KAIST, arXiv 2509.16084）。
- **GA（另一组）**：SynGA/SynGBO 在 LIT-PCBA 上以 **16,000** 调用打平/超过全部 64,000 调用的 reaction-GFlowNet（下表）。
- **RL**：Saturn 用 **1/400** 的预算在 QED（0.70 vs 0.23）、SA（2.11 vs 2.83）、AiZynth（0.91 vs 0.65）三项全面压过 RGFN。
- **3D 增益也不来自 flow 目标**：3DSynthFlow 与 RxnFlow 同为 TB 目标、同一 reaction MDP，差别只在 3D 状态表示（CGFlow, ICML 2025, PMLR v267）。

### 4.1 无 ML 的 GA 在 1/4 预算下追平全部 reaction-GFlowNet

来源：*A Genetic Algorithm for Navigating Synthesizable Molecular Spaces*（SynGA/SynGBO），Lo, Coley, Matusik, **ICLR 2026** — https://proceedings.iclr.cc/paper_files/paper/2026/file/3f61ff6252d38ea099cea2246cec7fa6-Paper-Conference.pdf（**本人直接核对**）

LIT-PCBA，top-100 diverse modes 平均 Vina (kcal/mol)：

| 方法 | oracle 调用 | 平均 Vina |
|---|---|---|
| **SynGBO**（SynGA + BO + 神经加性模型 block filter） | **16,000** | **−11.11** |
| **SynGA**（纯 GA，核心无 ML） | **16,000** | **−10.80** |
| 3DSynthFlow (GFN) | 64,000 | −10.88 |
| RxnFlow (GFN) | 64,000 | −10.45 |
| SynFlowNet (GFN) | 64,000 | −9.99 |
| BBAR | 64,000 | −9.36 |
| RGFN (GFN) | 64,000 | −9.20 |
| SynNet | 64,000 | −8.22 |

作者原话："令人惊讶的是，SynGA 仅用四分之一的 oracle 调用就取得了优于除 3DSynthFlow 之外所有 baseline 的 docking 分数。这凸显了 GA 的样本效率与有效性。"

PMO（22 任务）：**SynGBO 16.426** > GPBO 16.304 ≈ f-RAG 16.301 > Genetic GFN 16.078 > MolGA 15.686 > REINVENT 15.003 > SynGA 13.366 > SynNet 12.610。
**2026 年 PMO SOTA 是受合成约束的 GA + BO；GPBO / f-RAG / Genetic GFN 三者都内嵌 MolGA/GraphGA。**
配置：196,907 Enamine building block、91 template、≤5 步、≤1000 Da、population 500。ML 的作用只是一个 fingerprint MLP block filter，把候选 block 从 196,907 压到 **117** 个（AUROC 0.999），Morgan 相似度 0.459 → 0.721。

### 4.2 把 retrosynthesis 直接放进 reward，1/400 预算胜出

来源：Guo & Schwaller, RSC Chem Sci 16:6943 (2025) / https://arxiv.org/html/2407.12186v1 —— 在 **RGFN 自己的 ClpP docking 案例**上（RGFN 侧数字与 RGFN 原文 Table 完全一致，**已交叉核对** https://arxiv.org/html/2406.08506v1）：

| 方法 | oracle 调用 | MW | QED | SA | AiZynth 可解率 |
|---|---|---|---|---|---|
| **Saturn (RL, 4 目标)** | **1,000**（2.9 h） | 367.7 | **0.70** | **2.11** | **0.91** |
| RGFN (GFN) | 400,000（72 h） | 526.2 | 0.23 | 2.83 | 0.65 |
| GraphGA | 400,000 | 521.0 | 0.32 | 4.14 | **0.00** |
| SyntheMol (MCTS) | 100,000（72 h） | 458.2 | 0.45 | 2.86 | 0.56 |

作者自陈 caveat（必须一起引用）：比较**不是** apples-to-apples（Saturn 在 ChEMBL/ZINC 上预训练，已偏向可合成空间；RGFN 的 template 在某些情况下可能更代表"真正的"可合成性；未施加 PoseBusters 与 aggregator 过滤）；wall-time 不是 1/400，因为 AiZynthFinder 是瓶颈。

### 4.3 "template 保证可合成"经不起独立 retrosynthesis 检验

来源：*Synthesizable Molecular Generation via Soft-constrained GFlowNets*（S3-GFN），Kim, …, Y. Bengio, Hernandez-Garcia, 2026-02 — https://arxiv.org/abs/2602.04119（**本人直接核对**）

- reaction-based GFlowNet 在**外部** AiZynthFinder 评估下成功率 **≤72%**（RxnFlow 60.25–71.25%、SynFlowNet 52.75–57%、RGFN 46.75–50.25%）；S3-GFN（SMILES + 软约束）**96.67–100%**。论文措辞：这反映"内部 template 与独立 retrosynthesis 之间的错配"。
- Vina（ADRB2）：S3-GFN **−12.32** vs RxnFlow −11.45 vs SynFlowNet −10.85 vs RGFN −9.84。
- **GFlowNet 前沿本身已放弃 reaction MDP**：论文明言 reaction-based MDP"缺乏灵活性与可扩展性""编码了固定的可合成性概念""无法利用基础模型学到的丰富化学先验"，转而对预训练 SMILES 语言模型（GP-MolFormer）做 GFlowNet post-training（relative trajectory balance）。**这意味着 2026 年的"GFlowNet 分子生成"在架构上已经收敛成"对化学语言模型做 RL 后训练"，GFlowNet 退化为可选目标函数之一。**
- **GFlowNet 目标对 reward shaping 极度脆弱**：GSK3β AUC-top10 —— REINVENT+RS **0.830** vs GFlowNet RTB+RS **0.502**（S3-GFN 0.807 仍低于 REINVENT+RS；只有再加回 genetic exploration 才在 GFN 家族内领先，并"与 GraphGA-ReaSyn、SynGA 等强非 GFN baseline 相当"）。
- 论文自述局限："验证目前仅限于 in silico。"

### 4.4 测量仪器本身不可靠

*SYNC*（ICLR 2026 — https://proceedings.iclr.cc/paper_files/paper/2026/file/ffdb280e7c7b4c4af30e04daf5a84b98-Paper-Conference.pdf，**本人直接核对**）：8 个可合成性指标对同 11 个 SBDD 方法的排序**强不一致**（FLAG：3/8 指标说差，5/8 说好）；AiZynthFinder 处理 10k 分子需 **~48 h**（174,192.6 s）vs SA score 2.67 s，且对 Enamine 内分子有假阴性。
**任何"可合成性 %"都带着这个噪声底。** 该文也点明 GFlowNet 系合成方法"不生成 3D 结构"，需额外 docking 成本。

---

## 5. 湿实验证据的不对称

| 路线 | 合成并测活 | 结果 |
|---|---|---|
| **任何 GFlowNet 方法** | **0** | 最强主张止于"专家化学家人工审阅确认可合成"（RGFN）+ 成本分析 + 路线图。横跨 RGFN(NeurIPS 2024)、SynFlowNet(ICLR 2025)、RxnFlow(ICLR 2025)、TacoGFN(TMLR 2024)、A-GFN(ICML 2025)、CGFlow(ICML 2025)、S3-GFN(2026) 全部 in silico |
| **SyntheMol-RL @ Merck & Co. Program 1** | **111** | **4 个 IC₅₀ < 10 μM（3.1 / 6.1 / 6.3 / 7.6 μM）= 3.6%**；作者自陈"potencies were weaker than we had hoped" |
| SyntheMol-RL @ Merck & Co. Program 2 | 3（先导） | 2 个有活性；全量结果"a few months away"（截至 2026-04-27） |
| SyntheMol-RL（Stanford/McMaster 学术） | **79** | **13 个 in vitro 强活性（16.5%）、7 个结构新颖、1 个（synthecin）在小鼠 MRSA 模型有效** |
| RL + granular synthesizability control（Saturn 系） | 6 / 60 | BRD4：6/6 全合成，**2 个 µM binder**；Wee1：60 个中 **1 个 µM binder**，142B 空间、单张 8 GB GPU、只生成 ~320k 分子（库的 0.00023%） |
| **AL + FEP+ 物理闭环（Schrödinger MALT1）** | **78 / 129** | 8.2B 计算评估 → AL FEP+ 头 3 个月 >1,700 分子 → **合成 <50 即得两个高活性系列** → 10 个月到 development candidate（SGR-1505）→ **2025-06 Phase 1 CLL/WM 单药应答** |
| 超大规模 docking（非生成） | 44 / 549 | AmpC **11% hit rate**，90 个类似物后达 **77 nM**；D4 top tranche **22–26%**，最优 **180 pM 全激动剂、2500× 选择性** |
| **BoltzMol-1（2026，oracle + 目录采购，非生成）** | 28–96 / 靶点 | **10 个靶点中 6 个拿到 functional actives 或 binders**（多数靶点在其 affinity 训练数据中无表征） |
| 自动化并联合成（JACS 2026 COMBINAUT） | 100 | 22.9M 枚举空间、32 h 并行合成 → **9 个不同骨架经放射配体验证（12% hit rate）**，含全新化学型 |

来源：RGFN https://arxiv.org/abs/2406.08506；Merck 博客 https://swansonkyle.com/blog/synthemol-merck（**一手正文已取回**）；SyntheMol-RL Mol Syst Biol 2026 https://link.springer.com/article/10.1038/s44320-026-00206-9；Guo et al. https://arxiv.org/abs/2505.08774；Schrödinger MALT1 https://www.schrodinger.com/life-science/learn/case-studies/hit-development-candidate-10-months-rapid-discovery-novel-potent-malt1-inhibitor/；Lyu et al. Nature 2019 https://pmc.ncbi.nlm.nih.gov/articles/PMC6383769/；BoltzMol-1 https://boltz.bio/boltzmol1-technical-report.pdf；COMBINAUT J Am Chem Soc 148(28):29908 (2026), doi 10.1021/jacs.6c05055

Saturn 摘要对整个领域的定性：实验验证浪潮中"language-based backbone 是最常见架构"，且"优化算法、尤其是强化学习显著过度代表"（https://arxiv.org/abs/2405.17066）。

> **GFlowNet 推广的合成可达 MDP 已经跨进湿实验室 —— 但驱动它的是 RL 目标，不是 GFlowNet 目标。**

---

## 6. Merck & Co. 自己的项目数据：瓶颈在 oracle，不在 sampler

一手来源：*Generative AI to Design Small Molecule Therapeutics: Lessons from a Stanford/Merck collaboration*，Swanson (Stanford CS)、Zou (Stanford BDS)、**Chiriac、Cheng（Discovery Chemistry, Merck & Co., Inc., South San Francisco）**，2026-04-27 — https://swansonkyle.com/blog/synthemol-merck
（该站是 Vite SPA；正文从 JS bundle 逐字提取，非转述。全文 **0 次**出现 GFlowNet / REINVENT / Saturn。）

**方法**：SyntheMol-RL（RL over combinatorial building-block space）；oracle = **Chemprop-RDKit 10 模型 ensemble ×2**：一个训练在实验 potency（LBDD），一个训练在 docking（SBDD，~1M Enamine REAL 已 dock 分子，MOE Dock Affinity dG）。
为什么不直接用 docking 当 oracle（可直接引用的成本论证）：
> "SyntheMol-RL needs to make thousands of property predictor calls during generation, so **speed is crucial** and Chemprop-RDKit is **orders of magnitude faster** than docking, even if it's less accurate."

**Program 1（人类酶靶点，历史库 ~8k 个已测 potency 分子）漏斗**：

| 阶段 | 数值 |
|---|---|
| 单 seed 生成 | 12,796 |
| 预测 potency < 100 nM | 522 |
| 预测 docking < −50 | 2,451 |
| **同时满足两个阈值** | **0** ← 只能把 docking 阈值放宽到 −40 |
| 5 seeds 合并生成 / 双阈值(−40) 通过 | 60,134 / 810 |
| 全部 filter 后候选 | 488 |
| 人工挑选订购 | 191 |
| Enamine 实际交付并测活（59 因合成难度、21 因收率不足被剔） | **111（58%）** |
| **实测 IC₅₀ < 10 μM** | **4（3.1 / 6.1 / 6.3 / 7.6 μM）= 3.6%** |
| 对照：项目历史库中单位数 nM 化合物 | **95 / ~8k** |

predictor 精度：实验 potency **R² 0.66 ± 0.03**；docking **R² 0.76 ± 0.01**。

**Program 2（抗菌，ESKAPE 跨物种）**：自建 Merck 内部 building-block 空间 **>35B**；ADMET predictor 训练集 **370k** 内部分子；5 物种 potency 数据仅 **2.4k**（P. aeruginosa 0.9k）；生成 91.4k → 274 通过 filter → **测 3 个先导，2 个有活性**。

**五个失败模式（每一个都指向 oracle / MPO 规格，不指向 sampler）**：
1. **训练数据化学多样性太窄** → predictor 对新颖结构泛化差："good performance for molecules resembling those already known but **exhibit limited generalizability** to the more novel small molecule structures that we'd like to generate."
2. **联合目标不可达**：12,796 个里 0 个同时满足两阈值。
3. **多目标权重坍塌**：6 参数 MPO 下 dynamic weighting "put **nearly all of the weight on P. aeruginosa** potency and **almost zero weight on the other four bacterial species**"；团队"**forgo a simultaneous six-parameter optimization**"，改为 5 个 2 参数优化。根因是数据不平衡。
4. **通用化学空间不匹配项目 pharmacophore** → 被迫自建 35B 内部空间。
5. **make-on-demand 交付损耗**：191 → 111。

**团队自己的总 takeaway（本备忘录最该引的一句）**：
> "even when SyntheMol-RL designs molecules with **all the desired predicted properties**, many generated molecules **still fail experimentally due to the inaccuracy of the property predictors**. Therefore, it's crucial to continue developing **not just generative models but also better molecular property predictors**."

**博客明确未披露的边界**（备忘录不得越界）：两个靶点身份；Program 2 的 ADMET 性质；4 个 hit 的结构/SMILES；任何**实测** ADMET 数据（全部为预测）；Program 2 的 potency 数值与是否广谱；任何成本/算力数字；**以及任何 head-to-head baseline**（两个内部项目**都没有** GFlowNet / REINVENT / Saturn / 虚拟筛选对照组；唯一"baseline"是 10,000 个随机 Enamine REAL 分子的**预测值**分布）。
Program 1 的 4 个 hit 是 μM 级，属 **hit finding** 阶段，**不是** hit-to-lead 或 lead-opt 的成功案例。

---

## 7. 2026 年真正的转移：oracle 变便宜且准确

**Boltz-2**（MIT/Recursion, 2025-06；代码**与权重**均 MIT）：FEP+ 基准上接近 FEP 精度、**>1000× 更快**；CASP16 affinity track 开箱即用超过全部参赛者；MF-PCBA 上 binder/decoy 富集超过 docking 与 ML 方法。
来源：https://pmc.ncbi.nlm.nih.gov/articles/PMC12262699/ ；许可 https://github.com/jwohlwend/boltz（**本人核对 = MIT**）

**支持 GFlowNet 的最强一条证据**：Boltz-2 论文自己的生成式筛选把 Boltz-2 耦合到 **SynFlowNet（一个 GFlowNet）**，在 Enamine REAL **76B** 空间采样 ——
- **117k 次 Boltz-2 评估** vs 固定库 HLL 筛选的 **460k 次**；
- 10 个 de novo 候选做 ABFE，**10/10 全部预测结合 TYK2**，平均亲和力优于固定库筛选；与 PDB 已知 TYK2 binder 无显著 Tanimoto 相似；
- **但全部 in silico**（Boltz-ABFE 在该基准 Pearson R=0.95、centered MAE 0.42 kcal/mol；Boltz-2 在 TYK2 上 Pearson 0.83，作者自陈结果"可能偏乐观"）。
- **且 Recursion 自己不把它当生产系统**：`recursionpharma/synflownet-boltz` 的仓库属性是 `environment=Non-Prod`、`business-criticality=Tier-4`、`repo-type=Informational`，2025-06-27 首推后**零 commit**。

**FEP 的精度上限（对"oracle 越贵越好"的必要校准）**：FEP+ pairwise RMSE **1.25** kcal/mol vs 实验跨-assay 再现性 **0.91**；R² 0.56 vs 0.79（Ross et al., Commun Chem 6:222, 2023 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10576784/）。协议成本每条边 12 个 λ 窗 × 20 ns（电荷变化 24 窗）。
**Boltz-ABFE**（Recursion/Valence, arXiv 2508.19385）：4 个 kinase MUE 全部 <1 kcal/mol；结构缺陷率 clash 2.64→0.00%、aromaticity 20.00→0.00%，但 **stereochemistry 6.55%→6.32% 未修好**；且 **Boltz-2 Affinity module 的相关性反而略胜 Boltz-ABFE** —— 即更贵的物理不总是更好。

**一条反例警告**：*Optimal Molecular Design: Generative Active Learning Combining REINVENT with Precise Binding Free Energy Ranking Simulations*（Loeffler, …, Coveney；AstraZeneca + UCL，**JCTC 20(18):8308, 2024**，doi 10.1021/acs.jctc.4c00576 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11428133/）：
**注意此文常被误引为 Schrödinger 的 AB-FEP 工作 —— 它不是**；oracle 是 ESMACS（MMPBSA 端点法，作者自述绝对值非物理、应视为 score）。代价：约 **3.2×10⁵ GPU-小时**、39,440 次 oracle 调用、累计 ~2 ms 模拟；**合成数与测活数均为 0**；且**完全没有考虑可合成性**；6–7 轮后只富集局部极小。
**对比 Schrödinger MALT1**：同样是 physics-in-the-loop，但域是可枚举合成空间 + ML surrogate + AL acquisition，结果是 129 个合成、10 个月到候选、Phase 1 有应答。**差别不在物理，在搜索域与可合成性约束。**

---

## 8. 2026 年更好的框架排序（按对大药企小分子组合的期望价值）

1. **Reward oracle 层 —— 最高杠杆**：Boltz-2 / BoltzMol-1 类共折叠+亲和力模型（MIT 权重）+ 内部 ADMET/PK + FEP 终审。依据：BoltzMol-1 在 28–96 化合物/靶点下 6/10 靶点命中；Merck 自己的项目诊断（§6）把失败归因于 predictor R²=0.66 的精度天花板。
2. **合成路径空间上的搜索**：SynGBO/SynGA（ICLR 2026，PMO 16.426，1/4 预算追平全部 reaction-GFN）；SynFormer（PNAS 122(41):e2415665122, 2025，115 template × 223,244 building block，>10⁶⁰；PKM2 hit expansion 191→179 满足 Tc>0.5 且 ΔVina<1）；ReaSyn（NVIDIA/KAIST，arXiv 2509.16084）。
   **SynFormer 作者自陈**：其 RL fine-tune 样本效率低于 GraphGA/REINVENT，最优配置是 **GraphGA-SF**（GraphGA + SynFormer 投影作 mutation）；且"事后投影"会把 Tanimoto 打到 **0.186** 并大幅损失目标分 —— **投影必须在环内**。
3. **对 chemical LM 做 RL post-training**：REINVENT 4（Apache-2.0，RL 阶段 GPU 可选）→ Augmented Memory（PMO 15.002；Renz 2024 diverse-hits 榜首）→ Saturn → ACEGEN（Top-10 AUC 15.94）。**昂贵 oracle（10³ 量级预算）下唯一现实选择，也是唯一有湿实验记录的路线。**
4. **AL 加速的超大规模虚拟筛选**：Enamine REAL Space 94.5B（169 protocol × 202,620 building block，3–4 周交付，>80% 成功率）+ MolPAL 类 surrogate（只 dock 2.4% 即回收 top-50k 的 87.9%，EF 36.6；单轮设计即得 94.9% 的 top-1000）。**hit finding 的诚实基线**，也是 Renz 2024 中 GFlowNet 输给的那条基线。
   两条硬约束：**不要**用 cluster 代表分子代替全库 docking（Lyu 等：确认活性分子平均掉 1,121,443 名，47 个 scaffold 只剩 2 个）；**要**保留药化专家视觉筛选（hit rate 同为 ~24%，但亚微摩尔比例 44% vs 27%）。
5. **物理闭环（AL + FEP+）用于 hit-to-lead / lead-opt**：Schrödinger MALT1 是唯一有临床读出的一手案例（§5）。
6. **GFlowNet**：作为 (a) off-policy replay 目标、(b) 需要显式 p ∝ R 采样语义或 Pareto 采样时的组件。**不是框架级投资。**

**3D / diffusion SBDD 这条线：证据上不成立**（PoseCheck, arXiv 2308.07413）：TargetDiff / DiffSBDD 生成分子的中位 strain energy **1241.7 / 1243.1 kcal/mol**（测试集 102.5）；平均 steric clash **9.08 / 15.33**（数据集 4.59）；生成 pose 与再对接的中位 RMSD **3.19 / 2.83 Å**；H-bond 数众数为 **0**（参考配体为 1）。
2026 年的改进是 flow matching 提速与物理有效性（SemlaFlow 20 步即超过 500 步 EQGAT-diff，strain 1.76 vs 3.23 kcal/mol/atom，1000 分子 2293 s → 20.3 s，**113×**；FlowMol3 把 PoseBusters-valid 推到 **91.9%**，训练数据本身 93.2%）—— 但 FlowMol3 的增益来自 self-conditioning / fake atoms / geometry distortion 三个**与 flow 公式无关**的技巧（去掉全部 −14 pt）。**结论：3D 生成适合做构象/姿态生成与打分，不适合当小分子设计的主 sampler。**

**反面警告（必须写进任何提案）**：AstraZeneca/Acellera 的 chemistry-aware 复评显示 PMO/MolOpt 最优配置在化学合理性上最差 —— ACEGEN-MolOpt B&T-CF **6.18±0.27** / 23、SEDiv@1k **12.54±0.25** / 23，而朴素 REINVENT 是 **14.70 / 18.23**（*REINFORCE-ING Chemical Language Models*, JCIM 65:12752, 2025 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12690592/）。作者措辞精准："若 scoring function 完美刻画了化学可取性，这就不是问题"—— 而这个条件在真实项目里从不成立。**基准最优 ≠ 项目可用。**
且每一个只用 docking 做目标的方法（GraphGA、FGFN、RGFN、Saturn 一样）都产出 QED 0.22–0.36 的高脂高分子量垃圾。

---

## 9. 分实体建议

两家公司无共享基础设施。**Merck & Co./MSD**（Rahway，美加以外称 MSD）；**Merck KGaA**（Darmstadt，美加对应 MilliporeSigma / EMD Serono / EMD Electronics）。
**注意**：Recursion 官方 partners 页上的 "Merck" 是 **Merck KGaA, Darmstadt**（继承自 Exscientia 2023 年合作），**名单中没有 Merck & Co./MSD 任何实体**（https://www.recursion.com/partners）。

### 9.1 Merck & Co. / MSD —— GFlowNet 不是入口，且已有一年的反向证据

**既有事实**：
- 与 Stanford 就 SyntheMol-RL 在**两个内部专有项目**上跑了一年，结果与失败模式见 §6：**3.6% 的弱 hit 率、6 参数 MPO 权重坍塌、团队把失败归因于 predictor 精度**。
- 2025-09 与 **Variational AI** 签约（Enki 平台，两个未披露靶点，里程碑至 **$349M**），定位于 preclinical 之前的 **lead optimisation**。
- 自身发表重心在 **oracle 层**：ADMET/渗透性（JCIM 65(22):12563, 2025）、conformal selection 筛选效率（JCIM 65(24):13070, 2025）、MMP 类似物设计（JCIM 66(15):8908, 2026）、大环肽构象/物理方法。Europe PMC 上 Rahway 署名的 JCIM 论文（2024–2026）中**没有** de novo 生成或 GFlowNet 工作。

**建议**：
1. **把钱投在 predictor 精度上**，这是他们自己数据指出的瓶颈：R²=0.66 的实验 potency predictor + 化学系列过窄的训练集，是 3.6% hit 率的直接成因。具体动作 —— 用 Boltz-2（MIT 权重，自托管 MSA 保 IP）替换或补强 docking-proxy 层；对内部 370k ADMET 数据做主动学习式扩充；解决 P. aeruginosa 式的数据不平衡而不是靠 dynamic weighting 掩盖。
2. **修 MPO 规格**：他们已经证明 6 参数联合优化会退化为单目标。这是 reward 设计问题，换任何 sampler 都不会改善。
3. **GFlowNet 的正确定位**：一次**有边界的 hit-finding bake-off**，直接复用 SyntheMol 仓库里已有的 MIT 许可三方对比装置（`docs/rl/gflownet.md`、`docs/rl/reinvent4.md`、`scripts/plot/plot_synthemol_vs_gflownet_vs_reinvent.ipynb`）与已建好的 reward stack —— **数周量级实验，不是 program**。注意两个 Merck 内部项目**都没有做 baseline arm**，所以"SyntheMol-RL 是否已经是最优 sampler"目前也无证据 —— 这个 bake-off 本身有独立价值，但它测的是"换 sampler 值不值"，先验答案按 §3/§4 是"不值"。

### 9.2 Merck KGaA / MilliporeSigma —— 唯一 GFlowNet 有结构性优势的地方

**既有资产**（**本人直接核对** AIDDISON 论文 https://pmc.ncbi.nlm.nih.gov/articles/PMC10777390/）：
- **AIDDISON™**（2023-12 上市的商业 SaaS，ISO 27001）：de novo 引擎是 **REINVENT 2.0**（正文表述；软件可用性章节写"平台集成 REINVENT 3.2"），reward 由 QED + FTrees 相似度构成，**并通过 API 把 SYNTHIA retrosynthesis 作为一个 synthetic-accessibility 评分项**。第三方组件：BioSolveIT FTrees v6.10、Cresset Flare v7.2（LF RankScore，明确**不是** FEP）、RDKit。
- **SA-Space ≈250 亿**虚拟化合物，由 Sigma-Aldrich building block + robust transformation rule 生成，**仅能在 AIDDISON 内检索**。
- **SYNTHIA®**（2017 收购 Chematica）：**>115,000 条专家编码 reaction rule + >1,200 万可购起始物**，可用客户自有库存化合物。
- 世界级 FEP 实践与公开基准（Schindler/Kuhn, JCIM 60(11):5457, 2020；MCompChem/fep-benchmark）；Kuhn 同时是 FEP 基准与 AIDDISON 论文作者 —— **potency oracle 与生成平台在同一个组里。**

**这正好是 reaction-based GFlowNet 需要的三件东西**（building-block 库、reaction template 集、独立路线验证 oracle），而 RxnFlow / SynFlowNet 的公开版本连 Enamine building-block 库都只是"available upon request"。**Merck & Co. 要达到同样起点必须外购目录 + retrosynthesis 引擎。**

**建议**：
1. **把 SYNTHIA 的路线可行性从事后评分项提升为生成动作空间本身** —— 这一步的收益（§4.1 的 fragment→reaction 0%→62%）与 sampler 无关，用 GA 或 RL 都能拿到，且工程量最小。
2. **同一动作空间上做三方对照**（相同 oracle 调用预算）：(i) SynGA/SynGBO 式合成树 GA；(ii) REINVENT4/Saturn 式 RL + SYNTHIA-in-reward；(iii) RxnFlow 式 GFlowNet。评判：top-100 diverse mode 的 Vina/FEP、**独立** retrosynthesis 成功率、化学合理性（B&T-CF/SEDiv 类）、**#Circles 而非 IntDiv**、以及化学家愿意实际下单的分子数。**先验预期 (i) 或 (ii) 胜。**
3. **若不胜，就只改 reward 与搜索算子** —— 这也正是 incumbent 的选择：AstraZeneca 2026 的答案是 *Synthesizability via reward engineering*（Chem Sci 17(20):10015, 2026, doi 10.1039/d5sc09263a）。
4. **注意**：AIDDISON 是对外销售的 ISO 27001 认证产品，换 RL 内核意味着重新资格认证一个**商业产品**。

---

## 10. GFlowNet 是否已进入生产？—— 只有一个可核实实例

| 主体 | 证据 | 判定 |
|---|---|---|
| **HITS / HyperLab — Hyper Screening X** | 官方 release note（https://docs.hits.ai/hyperlab-release-note-en/）：2025-04-10 上线、2025-08-11 模型改进、2025-11-13 改进多样性 + "截至 2025 年 10 月，不可获得的建块已从训练与生成结果中剔除"（真实采购驱动的运维动作）。官方定价页（https://hyperlab.ai/en/pricing）：作为付费 add-on 在售，11 万亿化合物、可委托实际合成；Core Plan $3,000/mo。技术博客（CTO Jaechang Lim）确认**以 RxnFlow 为核心技术**，AiZynthFinder 可合成率 >60%；HITS CEO Woo Youn Kim = RxnFlow 论文末位作者 | **唯一可核实的 GFlowNet 商业部署。** 但 RxnFlow README 明说生产模型是**未公开的 in-house 衍生版**（"will release … soon"），且公开版"current version 不能复现论文结果" |
| Recursion | 官方 platform 页（https://www.recursion.com/platform）**0 次**提到 GFlowNet；只有 "generative de novo chemistry" 与 "LLMs"。`synflownet-boltz` 仓库自标 Non-Prod / Tier-4 / Informational，2025-06-27 后零 commit。**FY2025 10-K 与 Q2-2026 10-Q 正文全文零次提及 GFlowNet**；点名的是 BioHive-2、Recursion OS、**自有微调版 Boltz-2**、Exscientia 生成式化学 | **反证**：即便是 GFlowNet 主要贡献者所在的公司，也不把它列为技术栈组件 |
| recursionpharma/gflownet | MIT，默认分支 `trunk`；**2026 全年仅 2 个 commit**（2026-05-21 的 chore 与 QM9 backward-mask 修复）；295★ / 54 fork / 24 open issue；tasks 目录只有 `seh_frag(_moo)`、`qm9(_moo)`、`make_rings`、`toy_seq` —— **主干无 reaction 环境、无 docking、无 ADMET、无 PMO harness** | 研究脚手架，非平台 |
| SynFlowNet | MIT，**最后提交 2025-01-31（约 19 个月停滞）**；docking 需自行编译 QuickVina2-GPU 二进制 | 不建议采用 |

**成本感知这条线（SCENT）**：*Gaiński et al., NeurIPS 2025*，arXiv 2506.19865（koziarskilab）—— 成本模型 = 建块现货价 ÷ 反应收率的递归乘积。sEH SMALL 设定把 RGFN 成本 37.7 → **19.7（−48%）**，MEDIUM 1268 → 1117（−12%），同时 modes 4755 → 37714（**7.9×**）。**但 SynFlowNet/RxnFlow 的成本列是空的，也没有跨范式（GA / Saturn）成本对比** —— 这条线只有 GFN 内部对比。
**唯一逐分子的成本硬数据**（RGFN 附录 N，top-10 ClpP 配体，每 0.1 mmol）：**RGFN $1.37–3.93（均值 $2.06）vs SyntheMol $17.68–263.95（均值 $152.57，1 个不可合成）→ 均值差约 74×**。代价：RGFN 4 步、理论收率 55–70%；SyntheMol 1 步、90–95%。**这是 reaction-MDP 的真实优势，同样与 flow 目标无关。**

---

## 11. GFlowNet 风险登记表（每条有出处）

1. **长轨迹信用分配**：FM/DB"在长动作序列上信用传播低效"→ 才有 Trajectory Balance（https://arxiv.org/abs/2201.13259）；TB 自身处于 bias-variance 高方差端 → 才有 SubTB(λ)（https://arxiv.org/abs/2209.12782）。
2. **稀疏 reward 直接失效**：SubTB 的存在理由是支持"比以往可能的更长动作序列与更稀疏 reward"。具体地，在 RGFN 的 senolytic 任务（proxy 训练集 <100 个 active）上 fragment GFN **没找到任何高 reward 分子** —— 这正是真实早期项目的数据情形（对照 §6 中 P. aeruginosa 只有 0.9k 数据）。
3. **温度 / reward 指数是承重参数**：β 从 1→50 使 AUC 从 11.083→16.213、diversity 从 0.812→0.432，无原则性停止准则。PMO 的普适警告同样适用："最优超参数总不是原论文建议的默认值"。
4. **proxy 被利用**：RGFN 作者因"GFlowNet 可能生成 proxy 训练分布之外的分子"而改用在环 GPU docking，并观察到 sEH proxy 与 sEH docking 的**结构性不一致**；RxnFlow 因 docking"可被增大分子量 hack"而硬约束 QED>0.5。
5. **微调时遗忘 / 坍缩**：A-GFN（ICML 2025, https://arxiv.org/abs/2503.06337）报告普通 TB 微调导致 **catastrophic forgetting**（丧失生成化学有效、类药分子的能力）；RTB 过训练则 diversity/uniqueness 坍缩；简单单目标任务上普通 TB 反而胜 RTB。
6. **reaction 空间特有的 MDP 缺陷**：均匀 backward policy 会把 flow 分给不可反向分解的父状态 —— 只有 **11.0±3.7%** 的反向轨迹能回到 s₀；修正需给 P_B 单独目标（MaxLikelihood 99.3% / REINFORCE 100.0% 训练集），而 TB 训练出的"free" P_B 泛化灾难性（held-out **1.0±0.8%**）（SynFlowNet Table 2）。
7. **大动作空间需要专门 trick**：fingerprint action embedding（RGFN）、Morgan 矩阵固定 logits（SynFlowNet）、1% importance-weighted 动作子采样（RxnFlow）—— 三个互不相同的补丁对付同一面扩展性墙。
8. **多样性指标不可信**：GFlowNet 报告的 Tanimoto diversity / mode count 属于被 Xie et al. (ICLR 2023) 公理否证的度量类（§3.2）。
9. **可合成性指标不可信**：8 个指标排序强不一致；AiZynthFinder 10k 分子 ~48 h（SYNC, ICLR 2026）。
10. **领域级定性**：*The elephant in the lab: synthesizability in generative small-molecule design*（Papidocha, Burger, Bernales, Aspuru-Guzik; Curr Opin Chem Eng 51:101217, 2025, doi 10.1016/j.coche.2025.101217）—— 全文未取到，仅核实文献记录。

---

## 12. 何时 GFlowNet 确实是正确选择

只有**同时**满足以下四条：

1. 你要的是**分布**而非 argmax —— 需要覆盖多个可行 mode（且你接受用 #Circles 而非 IntDiv 来验收）；**并且**
2. reward oracle **便宜到能吃掉 10⁴–10⁵ 次调用**（Boltz-2 类模型、Chemprop proxy、GPU docking —— 不是 FEP，不是 assay）；**并且**
3. 你要把**外部搜索算子**（GA、local search、MCMC、离线专家数据）无偏地喂进同一个摊销策略 —— 这是 off-policy 有效性唯一无法被 RL 简单替代的地方；**并且**
4. 你已经有 building-block 库 + reaction template 集 + 独立 retrosynthesis 验证（Merck KGaA 有；Merck & Co. 需外购）。

**不满足 (2) → RL over chemical LM；不满足 (1) → GA 或 AL 加速的超大规模筛选。**
**且即便四条全满足，按 §3.1 你也应该先跑一个 AugMemory/LSTM-HC 对照组。**

---

## 13. 未验证 / 空白（勿引用为证据）

1. **rentosertib（ISM001-055）**已升级为一手：Nature Medicine 全文（EuropePMC PMC12353801）确认 **主要终点 = 安全性**（≥1 例 TEAE 患者比例），达成描述性目标；**FVC 是次要终点**，60 mg QD 组 ΔFVC **+98.4 mL（95% CI 10.9–185.9）**、安慰剂 **−20.3 mL（−116.1–75.6）**，n=18/17，论文自称仅为 "trend toward an increase"，且**明确写明未做效力计算**。Phase III（NCT07687459）：n=320、47 家中心**全在中国**、主要终点为 52 周 FVC 年下降率、预计 2026-08-30 启动、**尚未招募**。
   **AI 的实际贡献边界**：PandaOmics 选靶（TNIK）、Chemistry42 出 hit，**lead optimisation 是常规结构导向药化**（J Med Chem 2024, doi 10.1021/acs.jmedchem.4c01580）。
   Insilico 的组合数字（31 PCC / 13 IND / 8 Phase I / 1 Phase III；12–18 个月到 PCC；每项目合成测试 60–200 分子）仍为**厂商自报、未经独立审计**。
   AI 分子临床成功率的唯一一手数字仍是 Jayatunga/BCG 2024（Phase I 80–90%、Phase II ~40%），作者自陈样本量有限；2026 年同行评审立场（Frontiers in Pharmacology, doi 10.3389/fphar.2026.1870527）认为 **Phase II 衰减率 20 年未变**。
2. **Renz 2024 的 SI PDF 正文**（S1–S5）取不到（ACS 与 PMC 镜像均返回跳板页）；表格数值已从作者官方仓库的 `.tex` 源文件逐字取得，与 Figure 2 同源。未独立核对的是 S2.1 的 RF 模型 ROCAUC/AP 与 S5 的 budget-scaling 曲线数值。
3. **"不存在第二篇预算匹配的 GFlowNet vs DF-RL 多样性对照"**这一断言的强度：在 OpenAlex 引文图（Renz 2024 全部 17 篇引用）+ arXiv API 五种字段组合（全部 0 结果）+ OpenReview API 范围内为真；无法排除存在一篇既未引用 Renz 2024、又未在 arXiv 摘要出现相关关键词的论文。**措辞应为"据我们检索到的一手文献"。**
4. **Saturn 在 10,000 调用预算下的多样性数值不存在于论文中**（论文预算为 1,000 与 3,000）；§3.4 用 3,000 档替代并已标注。
5. **OpenReview forum `Hbpzrh7JbN`（Saturn）审稿讨论**取不到（Cloudflare Turnstile，九条路径全部失败）→ **不得在备忘录中写"审稿人认为…"**；§3.4 全部内容来自论文本体。
6. **Merck 两实体均无公开发表或宣布的 GFlowNet 工作**（Europe PMC 署名检索 `AFF:"Merck KGaA"` / `AFF:"Merck & Co"` / `AFF:"Rahway"` 为空）—— 缺证据不等于不存在。
7. **AIDDISON 2026 年的生成内核是否已升级**未验证（论文为 2023-12，且自陈"下一版本计划实现更多功能"）。
8. **Merck 博客未披露项**：两个靶点身份、Program 2 的 ADMET 性质、4 个 hit 的结构、任何**实测** ADMET 数据、Program 2 的 potency 数值、任何成本/算力数字、以及**任何 head-to-head baseline**。博客图表数值未 OCR。
9. **Gkeka 等《Computational Hit Finding: An Industry Perspective》**（J Med Chem 68(11):10507, 2025）仅摘要可得（closed OA，六条取全文路径全部失败）；摘要级可引事实：变革驱动力清单为算力、ultralarge make-on-demand 库、大容量神经网络、自由能计算适用域扩张、结构预测 —— **不含**生成式 de novo 设计。**正文的"生成式 vs 超大规模筛选 vs DEL"头对头命中率对比 = UNVERIFIED。**
10. **AQFEP 每分子成本、FEP+ 商业单位成本、SCENT 的跨范式成本对比、Iambic / Isomorphic Labs 的任何披露命中率**均未取到。Isomorphic Labs 在 ClinicalTrials.gov 上**零注册试验**。
11. **Chai-2 的 16% 命中率是抗体/miniprotein**，对小分子备忘录不适用；Chai-2 权重不在公开仓库。
12. 未找到任何 **DEL vs 生成式** 或 DEL vs docking 的一手头对头比较。
13. **跨论文 PMO 数值不可比**：REINVENT 在不同实现/seed/任务子集下为 13.55 / 14.016 / 15.003 / 15.185；seed 数 1–10，任务数 2–23。Guo & Schwaller 的校准是"相邻排名典型差 0.3–0.5"。**任何小于 ~0.5 的跨论文差值都不可作为结论依据**（本备忘录已按此规则表述，§2.1 与 §2.2 分别引用各自论文内部的可比数字）。
14. **Renz 表 A/B（D=0.7、ligand-based 任务）与 Saturn #Circles（t=0.75、docking 任务）不可直接互比**，只能各自组内比较。
15. 无任何一手来源证明这些框架与 **ELN / DMTA 系统集成**。

---

## 14. 一页纸的行动建议

**不要立 GFlowNet 项目。把预算投在 oracle 与 MPO 规格上，并用一个 sampler-无关的对照实验来关闭争论。**

- **立即（本季度）**：搭 oracle 层 —— Boltz-2（MIT 权重，自托管 MSA 保 IP）+ 内部 ADMET/PK + FEP 终审；把**独立** retrosynthesis（Merck KGaA 用 SYNTHIA，Merck & Co. 用 AiZynthFinder/ASKCOS）作为**目标函数的一项**而非事后过滤（依据 §4.2 的 1/400 结果与 SynFormer 的"事后投影 Tanimoto 掉到 0.186"）。
- **修 MPO**：Merck & Co. 的项目已证明 6 参数联合优化会退化为单目标、双阈值可行域为空。这是 reward 设计问题，换 sampler 不解决。
- **一次性对照实验**（1 个内部靶点，固定 oracle 预算，同一动作空间与 reward）：(i) SynGA/SynGBO，(ii) REINVENT4 或 Saturn + retrosynthesis-in-reward，(iii) RxnFlow。
  **必须包含 AugMemory 或 LSTM-HC 作为多样性对照组，且用 #Circles 而非 IntDiv 验收**（依据 §3.1/§3.2）。
- **验收线**：只有当 (iii) 在**相同预算**下同时赢 potency 与 #Circles，GFlowNet 才进入生产路线图。基于 §3.1、§4.1、§4.2 的先验，我预期它不会。
- **不要碰的**：SynFlowNet 主干（停滞 19 个月、需自编译 docking 二进制）；把 SA-score 当可合成性验收标准（RGFN 自己的消融证明加 SA-score 到 reward 改善了 SA-score 但**几乎没改善** AiZynthFinder 成功率）；把 IntDiv 当多样性验收标准；把 3D diffusion SBDD 当主 sampler（中位 strain 1241 kcal/mol）。
- **可以直接抄的一条**：Merck KGaA 把 SYNTHIA 从评分项升级为动作空间 —— 这个收益（0%→62% 独立可合成率）与 sampler 无关，是本备忘录中投入产出比最高的单点改动。
