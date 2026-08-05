import type {ArticleScene, ArticleVideoProps} from "./ArticleVideo";
import type {VisualMode} from "./sceneTypes";
import {templateForScene} from "./figmaTemplateRegistry";

const sourceAudioDuration = 103.783;
// Keep these boundaries in source-audio seconds. Root applies the 1.25x
// playback scale once for scenes, captions, chapters, and composition length.
const starts = [0, 9.064, 17.711, 23.719, 29.596, 35.918, 43.284, 50.233, 56.894, 63.085, 70.582, 78.392, 86.621, 94.902];
const ends = [9.064, 17.711, 23.719, 29.596, 35.918, 43.284, 50.233, 56.894, 63.085, 70.582, 78.392, 86.621, 94.902, 103.783];

const captions = [
  "多巴胺网站把购物体验保留下来，但支付和发货都变成了虚拟的。",
  "FoodNeverComes 让你完整体验点外卖，却不真的让食物送到家。",
  "第一步是浏览菜单、选择店铺和商品，把想吃的东西放进购物车。",
  "第二步是填写地址、选择支付方式，完成一次看起来真实的下单。",
  "第三步是等待虚拟地图，把配送过程继续演示下去。",
  "最后不送来食物，而是告诉你因为没吃到，节省了多少卡路里。",
  "这是一个无需注册的 AI 纯前端演示，却意外获得了很多人的体验。",
  "它击中的不是饥饿，而是深夜打开外卖 App、滑一滑菜单的冲动。",
  "加进去又删掉，换成烧烤和奶茶，犹豫半天最后什么也没有点。",
  "多巴胺管的从来不只是得到，而是想要；浏览和挑选本身就让人快乐。",
  "FoodNeverComes 把逛的过程和买的结果分离开，让结果不再成为负担。",
  "不是所有过程都应该被自动化，AI 需要判断什么应该省掉、什么应该保留。",
  "重复乏味的过程可以交给 AI，有趣并能产生期待的过程应该被留下。",
  "工作可以快一点，生活却不一定要更快；过程本身也可以成为产品价值。",
];

const visualCards = (cards: Array<{keyword: string; detail: string}>, visualMode: VisualMode): ArticleScene => ({
  kind: "list", start: 0, eyebrow: "", heading: "", items: [], visualCards: cards, visualMode,
});

const makeList = (
  index: number,
  eyebrow: string,
  heading: string,
  cards: Array<{keyword: string; detail: string}>,
  visualMode: VisualMode = "three-box",
): ArticleScene => ({
  ...(visualCards(cards, visualMode) as Extract<ArticleScene, {kind: "list"}>),
  start: starts[index], eyebrow, heading,
  items: [{index: "·", label: "关键线索", value: cards.map((card) => card.keyword).join(" · "), tone: "accent", appearAt: 0.2}],
});

const makeScene = (index: number): ArticleScene => {
  const start = starts[index];
  if (index === 0) return {kind: "cover", start, templateRole: "chapter-opener", eyebrow: "", imageSrc: "assets/article-images/foodnevercomes/generated-cover-3x4.png", imageRole: "generated-concept", titleLines: [[{text: "想吃的东西可以永远不送到"}]], subtitle: ""};
  if (index === 1) return {kind: "article-image", start, templateRole: "single-image", eyebrow: "案例入口", imageSrc: "assets/article-images/foodnevercomes/cover.jpg", imageRole: "source-screenshot", imageAspect: 1280 / 545, title: [{text: "FoodNeverComes", tone: "accent"}], insights: [{label: "体验", value: "像真的点外卖"}, {label: "支付", value: "完全虚拟"}, {label: "结果", value: "食物不送达"}]};
  if (index === 2) return {kind: "article-image", start, templateRole: "sources", eyebrow: "过程 01 · 浏览", imageSrc: "assets/article-images/foodnevercomes/menu.png", imageRole: "source-screenshot", imageAspect: 1080 / 940, title: [{text: "先逛菜单，再决定想吃什么"}], insights: [{label: "动作", value: "选店铺"}, {label: "动作", value: "选商品"}, {label: "状态", value: "加入购物车"}]};
  if (index === 3) return {kind: "article-image", start, templateRole: "sources", eyebrow: "过程 02 · 下单", imageSrc: "assets/article-images/foodnevercomes/checkout.png", imageRole: "source-screenshot", imageAspect: 1080 / 961, title: [{text: "把下单流程做得像真的一样"}], insights: [{label: "地址", value: "可填写"}, {label: "支付", value: "可选择"}, {label: "结果", value: "不扣款"}]};
  if (index === 4) return {kind: "article-image", start, templateRole: "sources", eyebrow: "过程 03 · 等待", imageSrc: "assets/article-images/foodnevercomes/map.png", imageRole: "source-screenshot", imageAspect: 1080 / 1183, title: [{text: "配送地图继续制造等待"}], insights: [{label: "画面", value: "虚拟地图"}, {label: "体验", value: "继续等待"}, {label: "事实", value: "不会送达"}]};
  if (index === 5) return makeList(index, "过程 04 · 结算", "最后留下的是一张订单", [{keyword: "虚拟订单", detail: "模拟真实的支付结果"}, {keyword: "节省卡路里", detail: "把没吃到变成反馈"}, {keyword: "没有配送", detail: "取消真实结果的负担"}]);
  if (index === 6) return makeList(index, "产品形态", "一个轻量的 AI 前端演示", [{keyword: "无需注册", detail: "打开就能直接体验"}, {keyword: "纯前端", detail: "不依赖复杂后端流程"}, {keyword: "AI 开发", detail: "小产品也能快速上线"}]);
  if (index === 7) return {kind: "article-image", start, templateRole: "single-image", eyebrow: "情绪入口", imageSrc: "assets/article-images/foodnevercomes/generated-late-night-browse.png", imageRole: "generated-concept", imagePresentation: "hero", imageAspect: 1024 / 1536, title: [{text: "它满足的是滑菜单的冲动"}]};
  if (index === 8) return makeList(index, "深夜场景", "犹豫本身就是一种体验", [{keyword: "加进去", detail: "先把想吃的放进购物车"}, {keyword: "再删掉", detail: "反复比较不同选择"}, {keyword: "什么也没点", detail: "最后保留了兴奋感"}]);
  if (index === 9) return {kind: "compare", start, templateRole: "two-by-two", eyebrow: "多巴胺机制", heading: "多巴胺管的是想要，不只是得到", choices: [{code: "想要", title: "浏览 · 挑选 · 下单", subtitle: "过程持续刺激大脑", tone: "accent", appearAt: 0.2}, {code: "得到", title: "食物真正到手", subtitle: "兴奋感可能开始消退", tone: "muted", appearAt: 0.45}]};
  if (index === 10) return {kind: "compare", start, templateRole: "before-after", eyebrow: "产品判断", heading: "把逛的过程和买的结果分开", choices: [{code: "保留", title: "逛的过程", subtitle: "提供期待和情绪价值", tone: "accent", appearAt: 0.2}, {code: "取消", title: "支付结果", subtitle: "不让结果变成负担", tone: "muted", appearAt: 0.45}]};
  if (index === 11) return makeList(index, "AI 产品启示", "不是所有过程都应该自动化", [{keyword: "省掉", detail: "重复、乏味、低效的中间环节"}, {keyword: "保留", detail: "有趣、快乐、能产生期待的过程"}, {keyword: "判断", detail: "AI 提效也需要产品取舍"}], "table");
  if (index === 12) return makeList(index, "过程取舍", "让 AI 处理无聊，让人保留快乐", [{keyword: "重复", detail: "交给 AI 自动完成"}, {keyword: "有趣", detail: "让用户继续参与体验"}, {keyword: "情绪", detail: "保留生活中的期待感"}], "process");
  return {kind: "outro", start, templateRole: "closing", eyebrow: "最后判断", title: "工作可以快一点\n生活却不一定要更快", subtitle: captions[index]};
};

export const foodNeverComesProject: ArticleVideoProps = {
  title: "FoodNeverComes：想吃的东西可以永远不送到",
  fps: 30,
  durationSeconds: sourceAudioDuration,
  voiceAudio: "assets/audio/foodnevercomes.mp3",
  chapters: [{label: "现象", start: 0}, {label: "案例", start: starts[1]}, {label: "机制", start: starts[7]}, {label: "启示", start: starts[11]}],
  scenes: starts.map((_, index) => { const scene = makeScene(index); return {...scene, template: templateForScene(scene)}; }),
  captions: captions.map((text, index) => ({start: starts[index], end: ends[index], parts: [{text}]})),
  takeaways: captions.map((text, index) => ({start: starts[index], end: ends[index], text})),
  sfxCues: [],
};
