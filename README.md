# GFlowNet for Merck Small-Molecule Design — An Evidence Panel

**Live:** https://danielchen26.github.io/gflownet-merck-evidence-panel/


## What this is

一份决策备忘录《GFlowNet 是否适合作为 Merck 小分子药物生成的未来框架？》（2026-08-25, v2）的交互式呈现，用 React + Three.js 构建。备忘录的每条事实都附有一手来源 URL，本面板只做呈现，不新增任何主张。

这不是 Merck 的官方文件，也不代表任何雇主的立场。本项目与 Merck & Co., Inc.（Rahway, NJ, USA）及 Merck KGaA（Darmstadt, Germany）均无隶属关系，未获其背书或审阅。

## Conclusion

- **不要把 GFlowNet 当框架立项**。它是 sampler 层的一个可选目标函数，而 2026 年的杠杆不在 sampler。
- **固定 oracle 预算下它输**：PMO 原表（23 oracle · 10k 调用 · 5 seed · sum AUC-top10）里 GFlowNet (fragment) **9.131（16/25）**、GFlowNet-AL **8.406（22/25）**，而**随机筛选 ZINC-250k 拿到 8.635（19/25）**、REINVENT 拿到 14.196（1/25）。
- **它唯一的差异化卖点（多样性）在唯一一次公平对照中被否证**：在预算受控、且给所有方法都装上 diversity filter 的 Renz 2024 benchmark 中，GFlowNet 在 DRD2 与 JNK3 上的 diverse hits 是 **0**，随机虚拟筛选是 **21 和 15**。
- **它真正的贡献（reaction-template 合成可达 MDP）与 flow 目标无关**，且已被更简单的 sampler 在 1/4 到 1/400 的预算下超越；Genetic GFN 的 16.213 由 GraphGA 算子 + REINVENT 架构 + KL 正则贡献，GFlowNet 只是 replay 目标。
- **真正的瓶颈由 Merck 自己的项目数据给出**：Merck & Co. 与 Stanford 用非 GFlowNet 的 SyntheMol-RL 跑了一年，12,796 个生成分子里 **0 个**同时满足 potency 与 docking 双阈值；合成测活 111 个，**只有 4 个 IC₅₀ < 10 μM（3.1 / 6.1 / 6.3 / 7.6 μM）= 3.6%**，而同一项目历史库里已有 95 个单位数 nM 化合物。
- 团队自己的归因是**性质预测器不准，不是生成器不行**：实验 potency predictor **R² 0.66 ± 0.03**（docking R² 0.76 ± 0.01）；6 参数 MPO 的 dynamic weighting 把几乎全部权重压到 P. aeruginosa potency 上，团队最终放弃六参数联合优化。
- **行动**：把预算投在 oracle（性质预测器、亲和力模型、独立 retrosynthesis）与 MPO 规格上，而不是换 sampler。GFlowNet 的正确定位是一次有边界的 hit-finding bake-off（数周量级实验），只有当它在相同预算下同时赢 potency 与 #Circles 才进入生产路线图。

## Run

需要 Node ≥ 20。

```bash
npm i
npm run dev     # 本地开发服务器
npm run build   # 产出静态站点到 ./dist
```

## Data provenance

面板用颜色编码认知状态，这是结构性约定而非装饰：

| 颜色 | 含义 |
|---|---|
| 蓝 `--flow` | **理论主张**（claimed）—— 论文中的原理性论证或厂商自报、未经独立审计的数字 |
| 琥珀 `--assay` | **实测证据**（measured）—— 固定预算基准表、湿实验读数、可核对的原表数值 |
| 深红 `--verdict` | **被否证**（refuted）—— 在预算受控的公平对照中被推翻的主张 |

每个数字都携带 `provenance` 与一手 `source`（标题 / venue / URL），并据此着色。跨论文的 PMO 数值不可比：备忘录的规则是"任何小于 ~0.5 的跨论文差值都不可作为结论依据"，因此 §2.1 与 §2.2 各自只在论文内部比较。Renz 表（D=0.7, ligand-based）与 Saturn #Circles（t=0.75, docking）同理只能组内比较。

## Open gaps

以下项在备忘录 §13 中被明确标为未验证，**不可引用为证据**：

1. **Renz 2024 的 SI PDF 正文（S1–S5）取不到**（ACS 与 PMC 镜像均返回跳板页）；表格数值来自作者官方仓库 `.tex` 源文件，但 S2.1 的 RF 模型 ROCAUC/AP 与 S5 的 budget-scaling 曲线数值未独立核对。
2. **"不存在第二篇预算匹配的 GFlowNet vs DF-RL 多样性对照"**只在 OpenAlex 引文图 + arXiv API 五种字段组合 + OpenReview API 的检索范围内为真；措辞应为"据我们检索到的一手文献"。
3. **Merck 两实体均无公开发表或宣布的 GFlowNet 工作**（Europe PMC 署名检索 `AFF:"Merck KGaA"` / `AFF:"Merck & Co"` / `AFF:"Rahway"` 为空）—— 缺证据不等于不存在。
4. **Merck 博客未披露项**：两个靶点身份、Program 2 的 ADMET 性质与 potency 数值、4 个 hit 的结构、任何实测 ADMET 数据、任何成本/算力数字，以及**任何 head-to-head baseline**。
5. **Gkeka 等《Computational Hit Finding: An Industry Perspective》**（J Med Chem 68(11):10507, 2025）仅摘要可得；正文的"生成式 vs 超大规模筛选 vs DEL"头对头命中率对比为 UNVERIFIED。此外未找到任何 **DEL vs 生成式**的一手头对头比较。

## Not affiliated

本仓库是独立的技术评估呈现。"Merck" 是 Merck & Co., Inc. 与 Merck KGaA 各自的商标，此处仅作指称性使用。所有观点归作者个人，不构成投资、法律或医疗建议。备忘录中的第三方数据归各自版权人所有，均通过一手来源 URL 引用。

## License

MIT. 见 [LICENSE](./LICENSE)。
