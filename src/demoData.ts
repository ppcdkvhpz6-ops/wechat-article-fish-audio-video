import type {ArticleScene, ArticleVideoProps} from "./ArticleVideo";
import {templateForScene} from "./figmaTemplateRegistry";

// The narration is the timing source. Each paragraph owns one page and one caption.
const sourceAudioDuration = 342.776;
// Source-audio seconds. Root.tsx converts these to final 1.25x playback seconds.
const paragraphRanges = [
  [0.000, 6.530], [6.530, 13.244], [13.244, 35.683], [35.683, 47.490],
  [47.490, 53.394], [53.394, 64.130], [64.130, 83.800], [83.800, 104.097],
  [104.097, 113.501], [113.501, 125.831], [125.831, 137.377], [137.377, 153.939],
  [153.939, 160.652], [160.652, 181.628], [181.628, 184.893], [184.893, 195.133],
  [195.133, 209.396], [209.396, 233.768], [233.768, 243.015], [243.015, 261.641],
  [261.641, 279.221], [279.221, 289.409], [289.409, 308.112], [308.112, 321.696],
  [321.696, 328.644], [328.644, 335.201], [335.201, 342.776],
] as const;
const paragraphStarts = paragraphRanges.map(([start]) => start);
const paragraphEnds = paragraphRanges.map(([, end]) => end);

const pageHeadings = [
  "先重新激活爆款单品",
  "贝恩的核心判断",
  "新品投入很高，成功率却越来越低",
  "新品的首年渗透率并不乐观",
  "真正值得重新评估的是明星产品",
  "明星产品沉淀了品牌资产",
  "创新不等于不断增加 SKU",
  "围绕已有资产创新，试错成本更低",
  "迭代焕新：让熟悉的产品适应新需求",
  "升级扩容：把产品放进新场景",
  "孵化培育：寻找下一代明星产品",
  "案例：三个产品进入新场景",
  "案例的共同点",
  "创新从用户痛点开始",
  "AI 让创新逻辑进一步提速",
  "AI 可以提前识别消费信号",
  "AI 与人的判断形成协同",
  "协同发生在创新的每一个环节",
  "消费者变得更理性了",
  "品牌资产决定持续购买",
  "市场变化要求更快响应",
  "更快确认什么需求值得解决",
  "创新是一种持续经营能力",
  "明星产品是品牌的基本盘",
  "回到消费者真实存在的需求",
  "释放已经拥有的明星产品价值",
];

const pageEyebrows = [
  "开篇判断", "贝恩观点", "新品创新", "市场验证", "明星产品", "品牌资产",
  "创新误区", "增长路径", "迭代焕新", "升级扩容", "孵化培育", "案例观察",
  "空间创新", "用户痛点", "AI 机会", "需求识别", "人机协同", "协同工作流",
  "消费趋势", "品牌价值", "快速响应", "长期主义", "持续经营", "基本盘",
  "真实需求", "资源聚焦", "结论",
];

const pageSupport = [
  "核心判断", "观点来源", "投入规模 · 成功率", "首年渗透率", "明星产品",
  "品牌认知 · 使用习惯 · 信任", "教育消费者 · 重建渠道 · 承担成本",
  "市场验证 · 渠道理解 · 快速反馈", "配方 · 口感 · 健康属性 · 使用体验",
  "即时零售 · 新兴渠道 · 家庭场景", "品牌资产 · 消费者理解 · 主业延展",
  "滴露 · 心相印 · 元气森林", "减少痛点 · 拓宽场景 · 进入生活",
  "消费者在哪个时刻还不够满意", "AI 提升探索速度", "信号 → 方案 → 内容",
  "AI 数据洞察 × 人的价值判断", "AI 找信号 · 人做判断 · 共同交付",
  "功能价值 · 情感价值", "流量触达 · 品牌复购", "供应链 · 营销 · 分销",
  "确认需求 · 长期使用 · 心智占据", "观察使用 · 理解复购 · 修正价值",
  "品牌基本盘", "真实需求优先", "资源集中到核心产品", "价值持续释放",
];

const paragraphCaptions = [
  "不要靠盲目上新填补业绩缺口，而是用创新重新激活爆款单品。",
  "这是贝恩公司对消费品创新的一条核心判断。",
  "很多企业把增长停滞归因于产品不够多，于是不断推出新品。",
  "投入很高，但真正获得首年渗透的新品并不多。",
  "真正值得重新评估的，可能不是下一个新品，而是明星产品。",
  "明星产品已经积累了品牌认知、使用习惯和信任。",
  "把创新理解成不断增加 SKU，带来的可能只是更多复杂度。",
  "围绕已有资产做创新，试错成本更低，反馈速度也更快。",
  "第一条路径，是在原有产品上改进配方、口感和使用体验。",
  "第二条路径，是把成熟单品放进新的场景和渠道。",
  "第三条路径，是在已有品牌资产上孵化下一代明星产品。",
  "文章中的案例很有代表性：滴露、悬挂式抽纸和红豆薏米水，都把熟悉产品放进了新的生活场景。",
  "这些产品的共同点，不是增加一个新名字，而是减少用户痛点，拓宽原有产品的使用场景。",
  "产品创新的起点，不是我们还能生产什么，而是消费者在哪个时刻还不够满意。",
  "AI 会让这套创新逻辑进一步提速。",
  "AI 可以从碎片化消费信号中提前识别需求，并参与方案与内容迭代。",
  "AI 擅长数据洞察，人类擅长创意塑造、价值判断和理解真实生活。",
  "先让 AI 找到信号，再由人判断它是否是真需求，AI 提速，人决定最终价值。",
  "消费者不再只看品牌讲了什么，而会判断功能是否兑现。",
  "流量带来第一次看到，品牌资产带来主动搜索和持续购买。",
  "企业需要打通供应链、营销和渠道，建立更快的响应能力。",
  "更快确认什么需求值得解决，什么创新能够被长期使用。",
  "创新不再是一次发布动作，而是持续经营的能力。",
  "越是变化快速的市场，越需要先把明星产品这个基本盘经营好。",
  "消费品创新真正要解决的是消费者当下真实存在的需求。",
  "已经拥有的明星产品，还有哪些价值没有被释放？",
];

const toneCaption = (text: string) => [{text, tone: "accent" as const}];

const makeListScene = (index: number): ArticleScene => ({
  kind: "list",
  start: paragraphStarts[index],
  eyebrow: pageEyebrows[index],
  heading: pageHeadings[index],
  items: [
    {
      index: String(index + 1).padStart(2, "0"),
      label: "关键线索",
      value: pageSupport[index] ?? pageHeadings[index],
      tone: "accent",
      appearAt: 0.25,
    },
  ],
});

const makeScene = (index: number): ArticleScene => {
  const start = paragraphStarts[index];
  if (index === 0) {
    return {
      kind: "cover",
      start,
      eyebrow: "消费品创新 · 贝恩观察",
      titleLines: [[{text: "别再盲目上新，"}], [{text: "先重新激活明星产品", tone: "accent"}]],
      subtitle: "增长的答案，可能就在已经被消费者选择的产品里。",
    };
  }
  if (index === 2) {
    return {
      kind: "stat",
      start,
      eyebrow: "新品创新的真实成本",
      number: "14",
      unit: "亿美元 / 年",
      title: [{text: pageHeadings[index]}],
      metrics: [
        {label: "研发占销售额", value: "2%—3%", tone: "accent", appearAt: 0.25},
        {label: "创新资源最高占比", value: "30%", tone: "accent", appearAt: 0.5},
      ],
    };
  }
  if (index === 3) {
    return {
      kind: "stat",
      start,
      eyebrow: pageEyebrows[index],
      number: "3.9%",
      unit: "首年渗透率",
      title: [{text: pageHeadings[index]}],
      metrics: [
        {label: "2024 年上市新品", value: "达到 1% 的比例", tone: "accent", appearAt: 0.25},
        {label: "市场含义", value: "更多新品掩盖增长放缓", tone: "muted", appearAt: 0.55},
      ],
    };
  }
  if (index === 1) {
    return {
      kind: "article-image",
      start,
      eyebrow: pageHeadings[index],
      imageSrc: "assets/article-images/star-product/01.png",
      imageAspect: 2,
      title: toneCaption(pageHeadings[index]),
      insights: [
        {label: "创新对象", value: "明星产品"},
        {label: "核心资产", value: "认知 · 信任"},
        {label: "增长方向", value: "重新激活"},
      ],
      appearAt: 0.1,
      titleAppearAt: 0.24,
      captionAppearAt: 0.56,
    };
  }
  if (index === 11) {
    return {
      kind: "case-grid",
      start,
      eyebrow: pageEyebrows[index],
      heading: pageHeadings[index],
      cases: [
        {
          label: "滴露消毒喷雾",
          title: "家庭清洁",
          detail: "把耗时动作变成随手完成的日常",
          visual: "喷雾",
          imageSrc: "assets/case-images/dettol-spray.jpg",
          color: "#2F80ED",
        },
        {
          label: "心相印悬挂式抽纸",
          title: "墙面取纸",
          detail: "把纸巾从桌面搬到更顺手的位置",
          visual: "抽纸",
          imageSrc: "assets/case-images/tissue-box.jpg",
          color: "#E76F51",
        },
        {
          label: "元气森林红豆薏米水",
          title: "便携即饮",
          detail: "把传统养生饮品放进移动生活",
          visual: "饮品",
          imageSrc: "assets/case-images/drink-bottle.jpg",
          color: "#4C956C",
        },
      ],
    };
  }
  if (index === 12 || index === 13) {
    return makeListScene(index);
  }
  if (index === 14) {
    return {
      kind: "stat",
      start,
      eyebrow: pageEyebrows[index],
      number: "AI",
      unit: "创新提速",
      title: [{text: pageHeadings[index]}],
      metrics: [
        {label: "消费信号", value: "更早识别", tone: "accent", appearAt: 0.25},
        {label: "产品方案", value: "更快迭代", tone: "accent", appearAt: 0.55},
      ],
    };
  }
  if (index === 15) {
    return {
      kind: "list",
      start,
      templateRole: "process",
      eyebrow: pageEyebrows[index],
      heading: pageHeadings[index],
      items: [
        {index: "信号", label: "AI 先做什么", value: "从碎片化消费信号中提前识别需求", tone: "accent", appearAt: 0.25},
        {index: "方案", label: "继续参与", value: "配方、包装和产品方案迭代", tone: "accent", appearAt: 0.55},
        {index: "内容", label: "最后输出", value: "根据渠道和场景生成更精准的内容", tone: "accent", appearAt: 0.85},
      ],
    };
  }
  if (index === 16) {
    return {
      kind: "compare",
      start,
      eyebrow: pageHeadings[index],
      heading: "让 AI 和人的判断形成协同",
      choices: [
        {code: "AI", title: "数据洞察", subtitle: "捕捉信号·迭代方案", tone: "accent", appearAt: 0.3},
        {code: "人", title: "价值判断", subtitle: "理解生活·做出选择", tone: "muted", appearAt: 0.65},
      ],
    };
  }
  if (index === 17) {
    return {
      kind: "list",
      start,
      templateRole: "process",
      eyebrow: pageEyebrows[index],
      heading: pageHeadings[index],
      items: [
        {index: "01", label: "AI 找信号", value: "从评论、搜索和购买行为中发现重复需求", tone: "accent", appearAt: 0.25},
        {index: "02", label: "人做判断", value: "判断是否是真需求，是否符合品牌气质", tone: "accent", appearAt: 0.55},
        {index: "03", label: "共同交付", value: "AI 提升探索速度，人决定最终价值", tone: "accent", appearAt: 0.85},
      ],
    };
  }
  if (index === 26) {
    return {
      kind: "outro",
      start,
      eyebrow: "文章结论",
      title: "别急着寻找下一个爆款",
      subtitle: paragraphCaptions[index],
    };
  }
  return makeListScene(index);
};

export const demoProject: ArticleVideoProps = {
  title: "别再盲目上新：重新激活明星产品",
  fps: 30,
  durationSeconds: sourceAudioDuration,
  voiceAudio: "assets/audio/voice.mp3",
  chapters: [
    {label: "开篇", start: paragraphStarts[0]},
    {label: "明星产品", start: paragraphStarts[4]},
    {label: "焕新路径", start: paragraphStarts[8]},
    {label: "AI机会", start: paragraphStarts[14]},
    {label: "结论", start: paragraphStarts[22]},
  ],
  scenes: paragraphStarts.map((_, index) => {
    const scene = makeScene(index);
    return {
      ...scene,
      template: templateForScene(scene),
    };
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
