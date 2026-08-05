import type {ArticleScene, ArticleVideoProps} from "./ArticleVideo";
import type {VisualMode} from "./sceneTypes";
import {templateForScene} from "./figmaTemplateRegistry";

const sourceAudioDuration = 305.605;
const starts = [0, 21.185, 45.975, 68.153, 95.451, 121.286, 144.274, 168.986, 192.234, 217.782, 245.942, 274.18];
const ends = [21.185, 45.975, 68.153, 95.451, 121.286, 144.274, 168.986, 192.234, 217.782, 245.942, 274.18, 305.605];

const captions = [
  "Suno 把音乐生成做成了超过一亿人使用的、可以反复玩的创作体验。",
  "一亿用户、两百万付费订阅、三亿美元 ARR，AI 音乐正在形成消费市场。",
  "两轮融资合计三亿七千五百万美元，C 轮投后估值二十四点五亿美元。",
  "四位创始人来自 Kensho，Mikey Shulman 还曾负责机器学习并在 MIT Sloan 授课。",
  "Discord 测试让团队发现，用户沉浸在生成、修改、保存和分享的连续过程里。",
  "Suno 选择先生成完整歌曲和人声，而不是只做十秒或十二秒的背景音乐。",
  "文字、哼唱、节奏、录音、诗歌和群聊，都可以成为一首歌的入口。",
  "它不先拆音符、和弦和乐器，而是直接从连续声音和原始音频中学习。",
  "保存、修改、分享和付费行为，连接成产品体验、偏好数据和商业化的飞轮。",
  "Voices、Custom Models、My Taste，加上八美元和二十四美元订阅，构成产品阶梯。",
  "唱片公司起诉后，华纳与 Suno 和解合作，Songkick 把版权议题带向音乐生态。",
  "当每天有近七万五千首 AI 歌曲上传，稀缺的就不再是生成，而是品味和信任。",
];

const asList = (
  index: number,
  eyebrow: string,
  heading: string,
  cards: Array<{keyword: string; detail: string; imageSrc?: string}>,
  visualMode: VisualMode = "three-box",
): ArticleScene => ({
  kind: "list",
  start: starts[index],
  templateRole: visualMode === "process" ? "process" : visualMode === "table" ? "checklist" : "three-bullets",
  eyebrow,
  heading,
  items: [{index: "·", label: "事实", value: cards.map((card) => card.keyword).join(" · "), tone: "accent", appearAt: 0.2}],
  visualCards: cards,
  visualMode,
});

const makeScene = (index: number): ArticleScene => {
  const start = starts[index];
  if (index === 0) {
    return {
      kind: "cover",
      start,
      templateRole: "chapter-opener",
      eyebrow: "AI MUSIC / PRODUCT STORY",
      imageSrc: "assets/article-images/suno/generated-cover.png",
      imageRole: "generated-concept",
      titleLines: [[{text: "Suno：把音乐变成一种可以玩的创作"}]],
      subtitle: "",
    };
  }
  if (index === 1) {
    return {
      kind: "stat",
      start,
      templateRole: "key-figure",
      eyebrow: "规模 / 2026.02",
      number: "1亿+",
      unit: "累计用户",
      title: [{text: "AI 音乐开始进入消费市场"}],
      metrics: [
        {label: "付费订阅", value: "200万", tone: "accent"},
        {label: "年经常性收入", value: "$300M", tone: "accent"},
        {label: "产品路径", value: "免费 → 订阅 → 专业"},
      ],
    };
  }
  if (index === 2) {
    return {
      kind: "stat",
      start,
      templateRole: "kpi",
      eyebrow: "融资 / 2024—2025",
      number: "$375M",
      unit: "两轮融资合计",
      title: [{text: "资本押注的不是一次爆款，而是持续创作"}],
      metrics: [
        {label: "2024.05", value: "$125M", tone: "accent"},
        {label: "2025.11 C轮", value: "$250M", tone: "accent"},
        {label: "投后估值", value: "$2.45B"},
      ],
    };
  }
  if (index === 3) {
    return {
      kind: "article-image",
      start,
      templateRole: "single-image",
      eyebrow: "团队 / FOUNDERS",
      imageSrc: "assets/article-images/suno/article-02.jpg",
      imageRole: "source-screenshot",
      imageAspect: 1077 / 932,
      title: [{text: "四位创始人，把机器学习带进音乐"}],
      insights: [
        {label: "背景", value: "Kensho"},
        {label: "CEO", value: "Mikey Shulman"},
        {label: "经验", value: "ML + FinTech"},
      ],
    };
  }
  if (index === 4) {
    return asList(index, "早期测试 / DISCORD", "用户留下的不是一次结果，而是一条创作链", [
      {keyword: "生成", detail: "先把一个想法变成可听的歌曲", imageSrc: "assets/article-images/suno/generated-discord-create.png"},
      {keyword: "修改", detail: "围绕上一版继续试错和调整", imageSrc: "assets/article-images/suno/generated-discord-edit.png"},
      {keyword: "分享", detail: "把反馈带回下一次创作", imageSrc: "assets/article-images/suno/generated-discord-share.png"},
    ], "process");
  }
  if (index === 5) {
    return {
      kind: "compare",
      start,
      templateRole: "before-after",
      eyebrow: "产品判断 / FORMAT",
      heading: "完整歌曲，还是一段背景音乐？",
      choices: [
        {code: "Suno", title: "完整歌曲 + 人声", subtitle: "一开始就得到可听、可改、可分享的结果", imageSrc: "assets/article-images/suno/generated-complete-song.png", tone: "accent", appearAt: 0.2},
        {code: "旧路径", title: "10 / 12 秒片段", subtitle: "更像素材，用户还要自己完成后续创作", imageSrc: "assets/article-images/suno/generated-background-fragment.png", tone: "muted", appearAt: 0.42},
      ],
    };
  }
  if (index === 6) {
    return {
      kind: "article-image",
      start,
      templateRole: "single-image",
      eyebrow: "输入 / EVERYDAY EXPRESSION",
      imageSrc: "assets/article-images/suno/article-04.jpg",
      imageRole: "source-screenshot",
      imageAspect: 640 / 282,
      title: [{text: "把日常表达，变成可以听见的东西"}],
      insights: [
        {label: "输入", value: "文字 / 哼唱 / 节奏"},
        {label: "素材", value: "录音 / 诗歌 / 群聊"},
        {label: "门槛", value: "不要求乐理"},
      ],
    };
  }
  if (index === 7) {
    return asList(index, "技术路线 / RAW AUDIO", "不先把音乐塞进乐理盒子", [
      {keyword: "连续声音", detail: "直接学习原始音频中的关系"},
      {keyword: "少翻译", detail: "用户不必先说出专业术语"},
      {keyword: "再判断", detail: "模型先给结果，人决定是否继续"},
    ], "three-box");
  }
  if (index === 8) {
    return asList(index, "数据飞轮 / USER SIGNAL", "每一次创作动作，都在告诉产品下一步", [
      {keyword: "创作", detail: "生成更多版本，留下偏好信号", imageSrc: "assets/article-images/suno/generated-flywheel-create.png"},
      {keyword: "数据", detail: "保存、修改、分享比播放更具体", imageSrc: "assets/article-images/suno/generated-flywheel-data.png"},
      {keyword: "收入", detail: "声音控制和个性化模型承接付费", imageSrc: "assets/article-images/suno/generated-flywheel-revenue.png"},
    ], "process");
  }
  if (index === 9) {
    return asList(index, "商业化 / V5.5", "从大众体验，走向个性化工作流", [
      {keyword: "免费层", detail: "让更多人先开始创作"},
      {keyword: "$8 / 月", detail: "让高频用户持续留下"},
      {keyword: "$24 / 月", detail: "服务 Studio 与专业需求"},
      {keyword: "Voices · Custom Models · My Taste", detail: "把个性化做成产品阶梯"},
    ], "table");
  }
  if (index === 10) {
    return {
      kind: "compare",
      start,
      templateRole: "two-by-two",
      eyebrow: "版权 / ECOSYSTEM",
      heading: "从训练争议，走向授权与合作",
      choices: [
        {code: "争议", title: "662 首歌曲", subtitle: "索尼、环球、华纳起诉；最高 15 万美元 / 首", tone: "muted", appearAt: 0.2},
        {code: "转向", title: "华纳 + Suno + Songkick", subtitle: "和解、合作，并进入现场演出生态", tone: "accent", appearAt: 0.42},
      ],
    };
  }
  return asList(index, "风险 / DISTRIBUTION", "生成变容易之后，稀缺的是品味和信任", [
    {keyword: "7.5万 / 天", detail: "Deezer 每天接近的 AI 音乐上传量"},
    {keyword: "44% 上传", detail: "AI 音乐占每日上传的比例"},
    {keyword: "85% 欺诈", detail: "相关播放被识别并取消变现"},
    {keyword: "1%—3% 播放", detail: "AI 音乐目前只占总播放量的一小部分"},
  ], "table");
};

export const sunoProject: ArticleVideoProps = {
  title: "Suno：两年 1 亿用户，把音乐变成一种可以玩的创作",
  fps: 30,
  durationSeconds: sourceAudioDuration,
  voiceAudio: "assets/audio/suno.mp3",
  chapters: [
    {label: "规模", start: starts[0]},
    {label: "产品", start: starts[4]},
    {label: "商业", start: starts[9]},
    {label: "风险", start: starts[10]},
  ],
  scenes: starts.map((_, index) => {
    const scene = makeScene(index);
    return {...scene, template: templateForScene(scene)};
  }),
  captions: captions.map((text, index) => ({start: starts[index], end: ends[index], parts: [{text}]})),
  takeaways: captions.map((text, index) => ({start: starts[index], end: ends[index], text})),
  sfxCues: [],
};
