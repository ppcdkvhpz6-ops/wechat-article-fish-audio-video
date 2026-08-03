import type {ArticleScene, ArticleVideoProps} from "./ArticleVideo";

// The narration is the timing source. Each paragraph owns one page and one caption.
const sourceAudioDuration = 351.006937;
// Source-audio seconds. Root.tsx converts these to final 1.25x playback seconds.
const paragraphRanges = [
  [0.000, 6.014], [6.014, 12.530], [12.530, 35.752], [35.752, 48.449],
  [48.449, 54.965], [54.965, 65.824], [65.824, 85.538], [85.538, 106.254],
  [106.254, 116.278], [116.278, 127.973], [127.973, 139.166], [139.166, 155.372],
  [155.372, 162.723], [162.723, 183.773], [183.773, 186.446], [186.446, 197.473],
  [197.473, 213.010], [213.010, 236.566], [236.566, 246.757], [246.757, 265.803],
  [265.803, 283.846], [283.846, 294.538], [294.538, 314.085], [314.085, 328.453],
  [328.453, 335.804], [335.804, 342.821], [342.821, 351.007],
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
  "案例：把家庭清洁变得更轻松",
  "案例：重新设计纸巾的空间使用",
  "案例：把养生饮品变成便携选择",
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
  "滴露消毒喷雾，把耗时的家庭清洁变成更轻松的日常动作。",
  "悬挂式抽纸重新设计了纸巾与生活空间的关系。",
  "红豆薏米水把传统养生饮品变成了便携的即饮场景。",
  "这些产品减少了用户痛点，也拓宽了原有产品的使用场景。",
  "AI 会让这套创新逻辑进一步提速。",
  "它可以从碎片化消费信号中提前识别用户需求。",
  "AI 擅长数据洞察，人类擅长创意塑造和价值判断。",
  "先让 AI 找到信号，再由人判断它是否是真需求。",
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
  eyebrow: `分幕 ${String(index + 1).padStart(2, "0")}`,
  heading: pageHeadings[index],
  items: [
    {
      index: String(index + 1).padStart(2, "0"),
      label: "本段重点",
      value: paragraphCaptions[index],
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
  if (index === 4 || index === 11 || index === 12 || index === 13) {
    return {
      kind: "article-image",
      start,
      eyebrow: pageHeadings[index],
      imageSrc: index === 4 ? "assets/article-images/star-product/01.png" : "assets/article-images/star-product/02.png",
      imageAspect: index === 4 ? 2 : 0.499,
      title: toneCaption(pageHeadings[index]),
      caption: paragraphCaptions[index],
      appearAt: 0.1,
      titleAppearAt: 0.24,
      captionAppearAt: 0.56,
    };
  }
  if (index === 14 || index === 15 || index === 16 || index === 17) {
    return {
      kind: "compare",
      start,
      eyebrow: pageHeadings[index],
      heading: index === 14 ? "从用户痛点开始创新" : "让 AI 和人的判断形成协同",
      choices: [
        {code: "AI", title: "数据洞察", subtitle: "捕捉信号·迭代方案", tone: "accent", appearAt: 0.3},
        {code: "人", title: "价值判断", subtitle: "理解生活·做出选择", tone: "muted", appearAt: 0.65},
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
  scenes: paragraphStarts.map((_, index) => makeScene(index)),
  captions: paragraphCaptions.map((text, index) => ({
    start: paragraphStarts[index],
    end: paragraphEnds[index],
    parts: [{text}],
  })),
  sfxCues: [],
};
