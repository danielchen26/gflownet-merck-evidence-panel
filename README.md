# GFlowNet for Merck Small-Molecule Design — An Evidence Panel

**Live:** https://danielchen26.github.io/gflownet-merck-evidence-panel/


## What this is

一份决策备忘录《GFlowNet 是否适合作为 Merck 小分子药物生成的未来框架？》（2026-08-25, v2）的交互式呈现，用 React + Three.js 构建。备忘录的每条事实都附有一手来源 URL，本面板只做呈现，不新增任何主张。

这不是 Merck 的官方文件，也不代表任何雇主的立场。本项目与 Merck & Co., Inc.（Rahway, NJ, USA）及 Merck KGaA（Darmstadt, Germany）均无隶属关系，未获其背书或审阅。

## Placement, not a verdict

GFlowNet is a layer, not a platform. The panel places it in a four-layer stack
and attaches the measured constraint to each layer:

- **L1 Oracle — the binding constraint.** Merck's own programme: potency
  predictor R² 0.66 / docking R² 0.76, 111 compounds synthesised and assayed,
  4 with IC50 < 10 uM (3.6%). The team attributed the failure to predictor
  accuracy, not to the generator.
- **L2 Action space — GFlowNet's durable contribution, and it is objective
  agnostic.** Hold the sampler fixed and change only the MDP: fragment to
  reaction lifts independent AiZynthFinder success from 0% to 62%. Reaction
  templates themselves only reach <=72% under external checking.
- **L3 Sampler objective — where GFlowNet plugs in.** GFlowNets are MaxEnt RL
  up to a reward correction (Tiapkin, AISTATS 2024); TB = Path Consistency
  Learning (Deleu, UAI 2024); RTB = Trust-PCL (Deleu 2025). Integration is
  therefore two loss-layer edits, not a platform migration. The boundary of
  this layer: vanilla GFlowNet 9.131 against REINVENT 14.196 at a fixed budget.
- **L4 Search operator — its unique lever.** Off-policy soundness absorbs
  GraphGA, local search, MCMC and offline expert data without bias:
  Genetic GFN 16.213, and 15.738 once the genetic search is removed.

The numbers that constrain the framework-level bet are kept, not retired:
PMO 9.131 (16/25) and GFlowNet-AL 8.406 (22/25) against random screening
8.635 (19/25); 0 diverse hits on DRD2 and JNK3 under #Circles with a diversity
filter on every method, where random virtual screening gets 21 and 15; and 0
molecules synthesised and assayed by any GFlowNet method. Their job changes
from "a reason not to touch it" to "the constraint on which layers it can
carry".

## Language

The panel ships in English and Chinese. English is the default; the switcher
sits at the top of the left rail and the choice persists in `localStorage`.
`document.documentElement.lang` and `document.title` follow the selection.
Every user-facing string is an `{ en, zh }` pair (`src/i18n/i18n.tsx`); numbers,
URLs, paper titles, venues and method names are never translated.

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
