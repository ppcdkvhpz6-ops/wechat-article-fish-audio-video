export type FigmaStyleFamily = "warm-editorial" | "swiss-signal";

export type FigmaTemplateId =
  | "warm-chapter-opener"
  | "warm-single-image"
  | "warm-before-after"
  | "warm-closing"
  | "warm-key-figure"
  | "warm-three-bullets"
  | "warm-quote-waveform"
  | "swiss-kpi"
  | "swiss-process"
  | "swiss-sources"
  | "swiss-checklist"
  | "swiss-two-by-two";

export type FigmaTemplateDefinition = {
  id: FigmaTemplateId;
  name: string;
  styleFamily: FigmaStyleFamily;
  ratio: "3:4";
  fileKey: string;
  nodeId: string;
  figmaUrl: string;
  components: string[];
  runtimeSceneKinds: string[];
};

const FIGMA_FILE_KEY = "PGEYuf7Vg84A3al3MVbwbu";
const FIGMA_BASE_URL = `https://www.figma.com/design/${FIGMA_FILE_KEY}`;

const template = (
  id: FigmaTemplateId,
  name: string,
  styleFamily: FigmaStyleFamily,
  nodeId: string,
  components: string[],
  runtimeSceneKinds: string[],
): FigmaTemplateDefinition => ({
  id,
  name,
  styleFamily,
  ratio: "3:4",
  fileKey: FIGMA_FILE_KEY,
  nodeId,
  figmaUrl: `${FIGMA_BASE_URL}?node-id=${nodeId.replace(":", "-")}`,
  components,
  runtimeSceneKinds,
});

export const FIGMA_TEMPLATES: Record<FigmaTemplateId, FigmaTemplateDefinition> = {
  "warm-chapter-opener": template("warm-chapter-opener", "中文 Warm / 章节开场", "warm-editorial", "24:3", ["15:3", "15:19"], ["cover"]),
  "warm-single-image": template("warm-single-image", "中文 Warm / 单图观察", "warm-editorial", "24:24", ["15:29"], ["article-image"]),
  "warm-before-after": template("warm-before-after", "中文 Warm / 前后对照", "warm-editorial", "24:44", ["15:19"], ["compare"]),
  "warm-closing": template("warm-closing", "中文 Warm / Closing 收束", "warm-editorial", "24:67", ["15:19"], ["outro"]),
  "warm-key-figure": template("warm-key-figure", "中文 Warm / 核心关键数字", "warm-editorial", "11:2", ["15:39"], ["stat"]),
  "warm-three-bullets": template("warm-three-bullets", "中文 Warm / 三个要点", "warm-editorial", "11:15", ["15:19"], ["list"]),
  "warm-quote-waveform": template("warm-quote-waveform", "中文 Warm / 引语与波形", "warm-editorial", "11:36", ["15:19"], ["outro", "article-image"]),
  "swiss-kpi": template("swiss-kpi", "中文 Swiss / KPI 数据结论", "swiss-signal", "24:88", ["15:11", "15:71"], ["stat"]),
  "swiss-process": template("swiss-process", "中文 Swiss / 流程进度", "swiss-signal", "24:109", ["15:3", "15:11"], ["list"]),
  "swiss-sources": template("swiss-sources", "中文 Swiss / 来源与证据", "swiss-signal", "24:139", ["15:11", "15:29"], ["article-image", "case-grid", "list"]),
  "swiss-checklist": template("swiss-checklist", "中文 Swiss / 清单复盘", "swiss-signal", "24:159", ["15:11"], ["list"]),
  "swiss-two-by-two": template("swiss-two-by-two", "中文 Swiss / 2×2 矩阵", "swiss-signal", "11:176", ["15:11"], ["compare"]),
};

const INDEX_TEMPLATE_MAP: Record<number, FigmaTemplateId> = {
  0: "warm-chapter-opener", 1: "warm-single-image", 2: "swiss-kpi", 3: "swiss-kpi",
  4: "warm-key-figure", 5: "warm-key-figure", 6: "swiss-checklist", 7: "swiss-process",
  8: "warm-three-bullets", 9: "warm-three-bullets", 10: "warm-three-bullets",
  11: "swiss-sources", 12: "swiss-checklist", 13: "warm-before-after", 14: "swiss-kpi",
  15: "swiss-process", 16: "swiss-two-by-two", 17: "swiss-process", 18: "swiss-sources",
  19: "swiss-sources", 20: "swiss-process", 21: "swiss-process", 22: "swiss-checklist",
  23: "warm-key-figure", 24: "warm-single-image", 25: "warm-key-figure", 26: "warm-closing",
};

export const templateForSceneIndex = (index: number): FigmaTemplateId =>
  INDEX_TEMPLATE_MAP[index] ?? "swiss-checklist";

export const resolveFigmaTemplate = (
  id: FigmaTemplateId | undefined,
): FigmaTemplateDefinition => FIGMA_TEMPLATES[id ?? "swiss-checklist"];
