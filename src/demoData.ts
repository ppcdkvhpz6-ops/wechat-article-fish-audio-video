import type {ArticleVideoProps} from "./ArticleVideo";

export const demoProject: ArticleVideoProps = {
  title: "一个婚恋App，最不应该关注什么指标？",
  fps: 30,
  durationSeconds: 64.0,
  voiceAudio: "assets/audio/voice.mp3",
  chapters: [
    {label: "开篇", start: 0},
    {label: "Context", start: 12},
    {label: "1v1", start: 26},
    {label: "关系", start: 42},
    {label: "结论", start: 56},
  ],
  scenes: [
    {
      kind: "cover",
      start: 0,
      eyebrow: "AI 新榜 · 良配AI",
      titleLines: [
        [{text: "一个婚恋App，"}],
        [{text: "最不该关注什么指标？", tone: "accent"}],
      ],
      subtitle: "答案可能是：用户留存和活跃度。",
    },
    {
      kind: "article-image",
      start: 7,
      eyebrow: "反常识设计",
      imageSrc: "assets/article-images/img-02.jpg",
      imageAspect: 1.4136,
      title: [{text: "找到对象后，"}, {text: "为什么还要追求活跃？", tone: "accent"}],
      caption: "婚恋产品不该靠用户迟迟找不到对象赚钱",
      source: "图源：公众号原文",
      appearAt: 0.1,
      titleAppearAt: 0.28,
      captionAppearAt: 0.62,
    },
    {
      kind: "list",
      start: 15,
      eyebrow: "良配AI的反常识设计",
      heading: "先认真，再匹配",
      items: [
        {index: "01", label: "聊天关系", value: "一次只匹配1人", tone: "accent", appearAt: 0.35},
        {index: "02", label: "注册门槛", value: "实名·未婚·真人", tone: "accent", appearAt: 0.8},
        {index: "03", label: "会员计划", value: "三年不婚退2000元", tone: "accent", appearAt: 1.25},
      ],
    },
    {
      kind: "stat",
      start: 26,
      eyebrow: "AI做婚恋，关键是 Context",
      number: "1500",
      unit: "字上下文",
      title: [{text: "AI红娘先帮用户把自己说清楚"}],
      metrics: [
        {label: "平均对话", value: "34轮", tone: "accent", appearAt: 0.58},
        {label: "公开资料", value: "470字", tone: "accent", appearAt: 0.9},
        {label: "传统产品平均", value: "110字", tone: "muted", appearAt: 1.22},
      ],
    },
    {
      kind: "article-image",
      start: 35,
      eyebrow: "从大海捞针到池塘筛选",
      imageSrc: "assets/article-images/img-04.jpg",
      imageAspect: 1.1169,
      title: [{text: "推荐系统要理解的，"}, {text: "不只是资料", tone: "accent"}],
      caption: "过去另一边是网页，现在另一边是一个人",
      source: "图源：公众号原文",
      appearAt: 0.1,
      titleAppearAt: 0.28,
      captionAppearAt: 0.64,
    },
    {
      kind: "compare",
      start: 42,
      eyebrow: "为什么坚持 1v1？",
      heading: "少一点选择，可能更接近关系",
      choices: [
        {code: "过去", title: "广撒网", subtitle: "候选越多越高效？", tone: "muted", appearAt: 0.36},
        {code: "现在", title: "1v1匹配", subtitle: "把大海变成池塘", tone: "accent", appearAt: 0.86},
      ],
    },
    {
      kind: "stat",
      start: 50,
      eyebrow: "保结婚会员计划",
      number: "2000",
      unit: "元",
      title: [{text: "三年后仍未结婚，"}, {text: "全额退款", tone: "accent"}],
      metrics: [
        {label: "产品价值判断", value: "不靠拖延赚钱", tone: "accent", appearAt: 0.62},
        {label: "长期方向", value: "从找人到经营关系", tone: "accent", appearAt: 1.08},
      ],
    },
    {
      kind: "outro",
      start: 58,
      eyebrow: "文章结论",
      title: "先理解一个人，再找到更对的人",
      subtitle: "婚恋或许只是 AI 重新做“人找人”的第一个场景。",
    },
  ],
  captions: [
    {
      start: 0.45,
      end: 5.8,
      parts: [
        {text: "一个婚恋App，最不应该关注什么指标？答案可能是"},
        {text: "留存和活跃度", tone: "accent"},
        {text: "。"},
      ],
    },
    {
      start: 7.5,
      end: 12.8,
      parts: [
        {text: "良配AI不追求让用户一直留在App里，而是用"},
        {text: "反常识设计", tone: "accent"},
        {text: "逼用户认真开始一段关系。"},
      ],
    },
    {
      start: 15.4,
      end: 23.8,
      parts: [
        {text: "一次只能匹配一个人，注册前完成实名、未婚和真人认证，三年不结婚还"},
        {text: "退回2000元", tone: "accent"},
        {text: "会员费。"},
      ],
    },
    {
      start: 26.6,
      end: 33.8,
      parts: [
        {text: "AI做婚恋，真正要解决的不是认识更多人，而是理解一个人的"},
        {text: "Context", tone: "accent"},
        {text: "。"},
      ],
    },
    {
      start: 35.5,
      end: 40.8,
      parts: [{text: "AI红娘通过34轮对话，沉淀大约1500字上下文，让用户先把自己说清楚。"}],
    },
    {
      start: 42.5,
      end: 48.6,
      parts: [{text: "当AI已经把大海变成池塘，再用广撒网的心态沟通，反而会错过可能合适的人。"}],
    },
    {
      start: 50.5,
      end: 56.6,
      parts: [
        {text: "AI不只是帮你找到对象，也可能继续做一个长期存在于关系中的"},
        {text: "AI军师", tone: "accent"},
        {text: "。"},
      ],
    },
    {
      start: 58.5,
      end: 63.5,
      parts: [{text: "过去互联网让人找到更多人，大模型想验证的，是先理解一个人，再找到一个更对的人。"}],
    },
  ],
  sfxCues: [],
};
