import type {ArticleScene, ArticleVideoProps} from "./ArticleVideo";
import {templateForScene} from "./figmaTemplateRegistry.ts";

// The measured segmented Fish Audio timeline is the single source of truth.
const sourceAudioDuration = 191.423;
const paragraphRanges = [
  [0.000, 6.896], [6.896, 19.487], [19.487, 26.619], [26.619, 33.776],
  [33.776, 41.273], [41.273, 52.479], [52.479, 61.727], [61.727, 70.060],
  [70.060, 78.811], [78.811, 87.927], [87.927, 102.190], [102.190, 110.471],
  [110.471, 118.098], [118.098, 126.144], [126.144, 135.862], [135.862, 143.646],
  [143.646, 153.834], [153.834, 163.786], [163.786, 173.451], [173.451, 183.038],
  [183.038, 191.423],
] as const;
const paragraphStarts = paragraphRanges.map(([start]) => start);
const paragraphEnds = paragraphRanges.map(([, end]) => end);

const pageHeadings = [
  "把用户放进故事里", "自由输入，而不是选项", "AI 现场续写", "每次选择都能分支",
  "一个产品，三个市场", "从写作文开始", "先做本地 AI 入口", "免费 GPT 带来流量",
  "真正打开收入的是角色聊天", "一个月十亿韩元", "为下一段剧情付费", "用户每天停留两小时",
  "四层记忆维持连续性", "用户也能成为创作者", "日本不是简单翻译", "每个用户贡献约 17 美元",
  "收入增长不等于赚钱", "模型成本会随使用增长", "复制市场也有监管风险", "AI 变成内容引擎",
  "故事模式不会自动消除风险",
];

const pageEyebrows = [
  "产品定义", "交互方式", "实时生成", "剧情分支", "市场路线", "创业起点", "产品演进",
  "增长策略", "收入转折", "商业验证", "按次付费", "用户留存", "记忆系统", "内容生态",
  "本地化", "单位经济", "财务现实", "产品风险", "扩张边界", "核心判断", "最后提醒",
];

const pageSupport = [
  "互动故事世界", "自然语言行动", "文字 · 图片 · 声音", "重新选择节点", "Crack · Kyarapu · OOC",
  "AI 写作训练", "多模型入口", "500 万月活 · 50 万拉新", "无限剧情带来持续输入", "10 亿 → 20 亿韩元",
  "25—230 Cracker / 次", "身份 · 关系 · 选择持续积累", "短期 · 长期 · 关系 · 目标", "5 分钟建立世界观",
  "1.9 万个角色", "月收入 800 万美元以上", "471 亿收入 · 1060 亿成本费用", "记忆错误会破坏付费体验",
  "版权 · 未成年人 · 沉迷", "每一次选择都是内容输入", "质量 · 依赖 · 成本",
];

const paragraphCaptions = [
  "Crack 的核心不是陪用户聊天，而是把用户放进一部可以自己改变的故事里。",
  "用户选择世界、设定身份，还可以直接输入行动，让 AI 现场推进剧情。",
  "AI 同时扮演人物、记住事件，并根据回答生成新的文字、图片和声音。",
  "不满意可以回到节点重选，这更像互动网文和角色扮演游戏的结合。",
  "Wrtn 在韩国做 Crack，在日本做 Kyarapu，在北美推出 OOC。",
  "Wrtn 最初帮助学生写作文，后来扩展到内容工具和商务材料。",
  "团队再把多种大模型接入同一个韩国本地 AI 入口。",
  "免费 GPT 策略降低门槛，带来 500 万月活和 50 万名新用户。",
  "问答产品会被用完即走，但没有结局的剧情会推动用户继续输入。",
  "角色聊天收费后，一个月收入突破 10 亿韩元，随后达到 20 亿韩元。",
  "Crack 让用户按次购买下一段剧情，而不是购买一整部故事。",
  "用户每天停留约两小时，因为身份、关系和选择会持续积累。",
  "四层记忆让 AI 维持相对连续的故事世界。",
  "平台让普通用户建立角色和世界观，再通过对话扩展成自己的故事。",
  "日本市场重新处理角色、题材、语气和付费货币，Kyarapu 已有 1.9 万个角色。",
  "两地产品月活不到 50 万，但月收入超过 800 万美元。",
  "收入增长并不等于赚钱，成本和费用远高于收入。",
  "使用越多，模型调用和上下文成本越高，错误会直接破坏付费体验。",
  "进入更多市场还要面对版权、未成年人保护、沉迷和冲动消费。",
  "它把 AI 从聊天工具变成内容引擎，每个选择都是下一段内容的输入。",
  "故事模式不会自动消除情感依赖、内容质量和商业成本风险。",
];

const listVisualCards: Record<number, Array<{keyword: string; detail: string}>> = {
  2: [
    {keyword: "人物扮演", detail: "AI 负责推进角色行动"},
    {keyword: "事件记忆", detail: "保留已经发生的情节"},
    {keyword: "多媒体", detail: "文字、图片和声音一起生成"},
  ],
  3: [
    {keyword: "回到节点", detail: "不满意时重新选择"},
    {keyword: "剧情分支", detail: "每个决定改变后续"},
    {keyword: "互动网文", detail: "故事和游戏的中间形态"},
  ],
  4: [
    {keyword: "韩国", detail: "Crack 验证角色聊天"},
    {keyword: "日本", detail: "Kyarapu 调整本地题材"},
    {keyword: "北美", detail: "OOC 延伸互动故事"},
  ],
  5: [
    {keyword: "作文", detail: "最早服务学生写作"},
    {keyword: "内容工具", detail: "从单一场景扩展出去"},
    {keyword: "商务材料", detail: "进入更高频的工作流"},
  ],
  6: [
    {keyword: "本地入口", detail: "把模型能力接近用户"},
    {keyword: "多模型", detail: "一个产品承接多种能力"},
    {keyword: "产品演进", detail: "从工具变成内容平台"},
  ],
  8: [
    {keyword: "没有结局", detail: "剧情不会被一次用完"},
    {keyword: "持续输入", detail: "用户不断提供下一步"},
    {keyword: "留存", detail: "互动本身成为使用理由"},
  ],
  10: [
    {keyword: "按次购买", detail: "为下一段剧情付费"},
    {keyword: "低门槛", detail: "不必买完整故事"},
    {keyword: "即时价值", detail: "付费紧贴当前选择"},
  ],
  11: [
    {keyword: "身份", detail: "角色设定持续积累"},
    {keyword: "关系", detail: "互动历史不断变厚"},
    {keyword: "选择", detail: "分支结果影响下一步"},
  ],
  13: [
    {keyword: "建角色", detail: "普通用户也能开始创作"},
    {keyword: "设世界", detail: "规则和背景由用户定义"},
    {keyword: "扩故事", detail: "对话推动内容继续生长"},
  ],
  14: [
    {keyword: "角色", detail: "调整人物关系和设定"},
    {keyword: "题材", detail: "适应日本本地偏好"},
    {keyword: "货币", detail: "重新设计付费方式"},
  ],
  17: [
    {keyword: "调用增长", detail: "使用越多成本越高"},
    {keyword: "上下文", detail: "长故事需要更多记忆"},
    {keyword: "体验风险", detail: "错误会影响付费"},
  ],
  18: [
    {keyword: "版权", detail: "内容边界需要确认"},
    {keyword: "未成年人", detail: "产品需要保护机制"},
    {keyword: "沉迷", detail: "高频互动带来新风险"},
  ],
};

const makeListScene = (index: number): ArticleScene => ({
  kind: "list",
  start: paragraphStarts[index],
  eyebrow: pageEyebrows[index],
  heading: pageHeadings[index],
  items: [
    {
      index: "·",
      label: "关键线索",
      value: pageSupport[index],
      tone: "accent",
      appearAt: 0.25,
    },
  ],
  visualCards: listVisualCards[index],
  visualMode: "three-box",
});

const makeScene = (index: number): ArticleScene => {
  const start = paragraphStarts[index];
  if (index === 0) {
    return {
      kind: "cover",
      start,
      eyebrow: "Wrtn · Crack",
      titleLines: [[{text: "把用户放进"}], [{text: "一部 AI 故事里", tone: "accent"}]],
      subtitle: "每一次选择，都成为下一段剧情的输入。",
    };
  }
  if (index === 1) {
    return {
      kind: "article-image",
      start,
      templateRole: "single-image",
      eyebrow: pageEyebrows[index],
      imageSrc: "assets/article-images/crack/cover.jpg",
      imageAspect: 1280 / 544,
      title: [{text: pageHeadings[index], tone: "accent"}],
      insights: [
        {label: "交互", value: "自然语言"},
        {label: "故事", value: "实时生成"},
        {label: "结果", value: "持续分支"},
      ],
      appearAt: 0.1,
      titleAppearAt: 0.24,
      captionAppearAt: 0.56,
    };
  }
  if (index === 7) {
    return {
      kind: "stat",
      start,
      templateRole: "key-figure",
      eyebrow: pageEyebrows[index],
      number: "500万",
      unit: "月活用户",
      title: [{text: pageHeadings[index]}],
      metrics: [
        {label: "圣诞节活动", value: "50万新用户", tone: "accent", appearAt: 0.3},
        {label: "增长方式", value: "先免费，再转化", tone: "muted", appearAt: 0.6},
      ],
    };
  }
  if (index === 9) {
    return {
      kind: "stat",
      start,
      templateRole: "kpi",
      eyebrow: pageEyebrows[index],
      number: "10亿",
      unit: "韩元 / 月",
      title: [{text: "角色聊天开始收费"}],
      metrics: [
        {label: "一个月后", value: "首次突破 10 亿", tone: "accent", appearAt: 0.3},
        {label: "两个月后", value: "达到 20 亿", tone: "accent", appearAt: 0.65},
      ],
    };
  }
  if (index === 12) {
    return {
      kind: "compare",
      start,
      eyebrow: pageEyebrows[index],
      heading: "四层记忆，让故事保持连续",
      choices: [
        {code: "短期", title: "最近情节", subtitle: "记录刚发生的事件", tone: "accent", appearAt: 0.25},
        {code: "长期", title: "重要事件", subtitle: "保留过去的关键记忆", tone: "muted", appearAt: 0.48},
        {code: "关系", title: "人物态度", subtitle: "维护角色之间的变化", tone: "accent", appearAt: 0.71},
        {code: "目标", title: "当前任务", subtitle: "提醒故事正在解决什么", tone: "muted", appearAt: 0.94},
      ],
    };
  }
  if (index === 15) {
    return {
      kind: "stat",
      start,
      templateRole: "kpi",
      eyebrow: pageEyebrows[index],
      number: "$800万+",
      unit: "月收入",
      title: [{text: "小体量，高收入密度"}],
      metrics: [
        {label: "月活", value: "不到 50 万", tone: "muted", appearAt: 0.3},
        {label: "单个用户", value: "约 17 美元 / 月", tone: "accent", appearAt: 0.65},
      ],
    };
  }
  if (index === 16) {
    return {
      kind: "compare",
      start,
      eyebrow: pageEyebrows[index],
      heading: "收入增长，不等于已经赚钱",
      choices: [
        {code: "收入", title: "471 亿韩元", subtitle: "2025 年收入", tone: "accent", appearAt: 0.3},
        {code: "成本", title: "1060 亿韩元+", subtitle: "营业成本和费用", tone: "muted", appearAt: 0.65},
      ],
    };
  }
  if (index === 19) {
    return {
      kind: "outro",
      start,
      eyebrow: "核心判断",
      title: "AI 不只是聊天\n它在生成内容世界",
      subtitle: paragraphCaptions[index],
    };
  }
  if (index === 20) {
    return {
      kind: "outro",
      start,
      eyebrow: "最后提醒",
      title: "故事模式\n不会自动消除风险",
      subtitle: paragraphCaptions[index],
    };
  }
  return makeListScene(index);
};

export const demoProject: ArticleVideoProps = {
  title: "Crack：把用户放进一部 AI 故事里",
  fps: 30,
  durationSeconds: sourceAudioDuration,
  voiceAudio: "assets/audio/voice.mp3",
  chapters: [
    {label: "产品", start: paragraphStarts[0]},
    {label: "增长", start: paragraphStarts[5]},
    {label: "收费", start: paragraphStarts[9]},
    {label: "留存", start: paragraphStarts[11]},
    {label: "风险", start: paragraphStarts[16]},
  ],
  scenes: paragraphStarts.map((_, index) => {
    const scene = makeScene(index);
    return {...scene, template: templateForScene(scene)};
  }),
  takeaways: paragraphCaptions.map((text, index) => ({
    start: paragraphStarts[index],
    end: paragraphEnds[index],
    text,
  })),
  captions: paragraphCaptions.map((text, index) => ({
    start: paragraphStarts[index],
    end: paragraphEnds[index],
    parts: [{text}],
  })),
  sfxCues: [],
};
