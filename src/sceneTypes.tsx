import {Fragment, type CSSProperties, type ReactNode} from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {colors, fonts, layout} from "./theme";
import {clamp, frameFromSeconds, progress} from "./shared";
import {resolveFigmaTemplate, type FigmaTemplateId, type FigmaTemplateRole} from "./figmaTemplateRegistry";

// === 数据模型 ============================================

export type Tone = "accent" | "white" | "muted";
export type VisualMode = "three-box" | "table" | "process" | "key-figure" | "image-evidence" | "compare" | "closing";

export type RichTextPart = {
  text: string;
  tone?: Tone;
};

export type Chapter = {
  label: string;
  start: number;
};

export type Caption = {
  start: number;
  end: number;
  parts: RichTextPart[];
};

export type Takeaway = {
  start: number;
  end: number;
  text: string;
};

export type SfxCue = {
  id: string;
  start: number;
  duration: number;
  file: string;
  volume: number;
};

// === 基础 5 场景（与 talking-head-remotion 对齐） ===========

type CoverScene = {
  kind: "cover";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  titleLines: RichTextPart[][];
  subtitle: string;
  imageSrc?: string;
  imageRole?: "generated-concept";
};

type ListScene = {
  kind: "list";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  heading: string;
  items: Array<{
    index: string;
    label: string;
    value: string;
    tone?: Tone;
    /** 进场时刻（场景内相对秒数），来自口播说到该行内容的字幕起点 */
    appearAt?: number;
  }>;
  visualCards?: Array<{keyword: string; detail: string; imageSrc?: string}>;
  visualMode?: VisualMode;
};

type CaseGridScene = {
  kind: "case-grid";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  heading: string;
  cases: Array<{
    label: string;
    title: string;
    detail: string;
    visual: string;
    imageSrc: string;
    color: string;
  }>;
};

type StatScene = {
  kind: "stat";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  number: string;
  unit: string;
  title: RichTextPart[];
  metrics: Array<{
    label: string;
    value: string;
    tone?: Tone;
    /** 进场时刻（场景内相对秒数），来自口播说到该指标的字幕起点 */
    appearAt?: number;
  }>;
};

type CompareScene = {
  kind: "compare";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  heading: string;
  choices: Array<{
    code: string;
    title: string;
    subtitle: string;
    imageSrc?: string;
    tone?: Tone;
    /** 进场时刻（场景内相对秒数），来自口播说到该选项的字幕起点 */
    appearAt?: number;
  }>;
};

type OutroScene = {
  kind: "outro";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  title: string;
  subtitle: string;
};

// === 新增：article-image 场景 =============================

type ArticleImageScene = {
  kind: "article-image";
  start: number;
  template?: FigmaTemplateId;
  templateRole?: FigmaTemplateRole;
  eyebrow: string;
  /** 公众号原文图，相对 staticFile() 路径 */
  imageSrc: string;
  /** Provenance controls whether the image is treated as source evidence or a generated concept. */
  imageRole?: "source-screenshot" | "generated-concept";
  /** Generated cover images use a direct hero treatment instead of the evidence card. */
  imagePresentation?: "evidence" | "hero";
  /** 图片宽/高，由 PIL 预读，用于决定 max-width 还是 max-height 优先 */
  imageAspect: number;
  title: RichTextPart[];
  /** 图片留白中的事实锚点，不得重复标题或下方字幕 */
  insights?: Array<{label: string; value: string}>;
  /** 解读短句（≤ 14 字） */
  caption?: string;
  /** 图源标注，例如 "图源：公众号 / 性能对比章节" */
  source?: string;
  appearAt?: number;
  titleAppearAt?: number;
  captionAppearAt?: number;
};

export type ArticleScene =
  | CoverScene
  | ListScene
  | CaseGridScene
  | StatScene
  | CompareScene
  | OutroScene
  | ArticleImageScene;

// === Props ================================================

export type ArticleVideoProps = {
  title: string;
  fps: number;
  durationSeconds: number;
  voiceAudio?: string;
  chapters: Chapter[];
  scenes: ArticleScene[];
  captions: Caption[];
  takeaways?: Takeaway[];
  sfxCues?: SfxCue[];
};

// === 工具函数 ============================================

const enterStyle = (
  frame: number,
  fps: number,
  delaySeconds: number,
  durationSeconds: number,
  y: number,
): CSSProperties => {
  const p = progress(frame, delaySeconds * fps, durationSeconds * fps);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * y}px)`,
  };
};

const toneColor = (tone?: Tone) => {
  if (tone === "accent") return colors.accent;
  if (tone === "white") return colors.ink;
  if (tone === "muted") return colors.muted;
  return colors.ink;
};

const RichText = ({
  parts,
  strong = false,
  preserveLineBreaks = false,
  defaultColor = colors.ink,
}: {
  parts: RichTextPart[];
  strong?: boolean;
  preserveLineBreaks?: boolean;
  defaultColor?: string;
}) => (
  <>
    {parts.map((part, index) => (
      <span
        key={`${part.text}-${index}`}
        style={{
          color: part.tone ? toneColor(part.tone) : defaultColor,
          fontWeight: part.tone || strong ? 700 : undefined,
          whiteSpace: preserveLineBreaks ? "pre-line" : undefined,
        }}
      >
        {part.text}
      </span>
    ))}
  </>
);

const Eyebrow = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{...eyebrowStyle, ...style}}>
    <span style={eyebrowRuleStyle} />
    <span>{children}</span>
  </div>
);

const scaleXStyle = (
  frame: number,
  fps: number,
  delaySeconds: number,
  durationSeconds: number,
): CSSProperties => ({
  transform: `scaleX(${progress(frame, delaySeconds * fps, durationSeconds * fps)})`,
  transformOrigin: "left center",
});

const scaleYStyle = (
  frame: number,
  fps: number,
  delaySeconds: number,
  durationSeconds: number,
): CSSProperties => ({
  transform: `scaleY(${progress(frame, delaySeconds * fps, durationSeconds * fps)})`,
  transformOrigin: "center center",
});

// === Cover 场景 =========================================

const CoverSceneView = ({scene}: {scene: CoverScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <div style={{...sceneContentStyle, justifyContent: "center"}}>
      <Eyebrow style={enterStyle(frame, fps, -0.12, 0.42, 18)}>{scene.eyebrow}</Eyebrow>
      <h1
        style={{
          ...(portrait ? portraitCoverTitleStyle : coverTitleStyle),
          ...enterStyle(frame, fps, -0.06, 0.56, 42),
        }}
      >
        {scene.titleLines.map((line, index) => (
          <span key={index} style={{display: "block"}}>
            <RichText parts={line} strong />
          </span>
        ))}
      </h1>
      <div
        style={{
          ...(portrait ? portraitSubtitleStyle : subtitleStyle),
          ...enterStyle(frame, fps, 0, 0.44, 24),
        }}
      >
        {scene.subtitle}
      </div>
    </div>
  );
};

// === List 场景 ==========================================

const ListSceneView = ({scene}: {scene: ListScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <div style={{...sceneContentStyle, ...(portrait ? portraitListLayoutStyle : splitLayoutStyle)}}>
      <div style={portrait ? portraitSectionTitleRailStyle : sectionTitleRailStyle}>
        <span style={{...smallRuleStyle, ...scaleXStyle(frame, fps, 0.1, 0.28)}} />
        <div style={{...sectionLabelStyle, ...enterStyle(frame, fps, 0.16, 0.34, 16)}}>
          {scene.eyebrow}
        </div>
        <div
          style={{
            ...(portrait ? portraitSectionHeadingStyle : sectionHeadingStyle),
            ...enterStyle(frame, fps, 0.24, 0.44, 28),
          }}
        >
          {scene.heading}
        </div>
      </div>
      <div style={{...listCardsStyle, gridTemplateColumns: `repeat(${Math.min(scene.items.length, 2)}, minmax(0, 1fr))`}}>
        {scene.items.map((item, index) => (
          <div
            key={item.index}
            style={{
              ...listCardStyle,
              ...enterStyle(frame, fps, item.appearAt ?? 0.28 + index * 0.1, 0.38, 24),
            }}
          >
            <div style={listCardTopStyle}>
              {item.index.match(/^\d+$/) ? (
                <span aria-hidden="true" style={listCardDotStyle} />
              ) : (
                <span style={listCardMarkerStyle}>{item.index}</span>
              )}
              <span style={listCardLabelStyle}>{item.label}</span>
            </div>
            <span
              style={{
                ...(portrait ? portraitListCardValueStyle : listCardValueStyle),
                color: toneColor(item.tone),
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CaseGridSceneView = ({scene}: {scene: CaseGridScene}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const portrait = height > 0;
  return (
    <div style={{...sceneContentStyle, ...caseGridLayoutStyle}}>
      <div>
        <span style={{...smallRuleStyle, ...scaleXStyle(frame, fps, 0.1, 0.28)}} />
        <div style={{...sectionLabelStyle, ...enterStyle(frame, fps, 0.16, 0.34, 16)}}>
          {scene.eyebrow}
        </div>
        <div style={{...portraitSectionHeadingStyle, ...enterStyle(frame, fps, 0.24, 0.44, 28)}}>
          {scene.heading}
        </div>
      </div>
      <div style={caseGridStyle}>
        {scene.cases.map((item, index) => (
            <div
              key={item.label}
              style={{...caseTileStyle, borderTopColor: item.color, ...enterStyle(frame, fps, 0.38 + index * 0.12, 0.36, 28)}}
            >
              <div style={{...caseVisualStyle, backgroundColor: item.color}}>
                <Img
                  src={staticFile(item.imageSrc)}
                  style={caseImageStyle}
                />
                <span style={caseVisualTagStyle}>{item.visual} · 场景示意</span>
              </div>
              <div style={caseMetaStyle}>{item.label}</div>
              <div style={caseTitleStyle}>{item.title}</div>
              <div style={caseDetailStyle}>{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Stat 场景 ==========================================

const StatSceneView = ({scene}: {scene: StatScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <div style={{...sceneContentStyle, ...(portrait ? portraitStatLayoutStyle : statLayoutStyle)}}>
      <div style={portrait ? portraitBigStatStyle : bigStatStyle}>
        <div style={{...sectionLabelStyle, ...enterStyle(frame, fps, 0.08, 0.34, 0)}}>
          {scene.eyebrow}
        </div>
        <div style={{...statNumberWrapStyle, ...enterStyle(frame, fps, 0.16, 0.48, 34)}}>
          <span style={portrait ? portraitStatNumberStyle : statNumberStyle}>{scene.number}</span>
          <span style={portrait ? portraitStatUnitStyle : statUnitStyle}>{scene.unit}</span>
        </div>
        <span style={{...statRuleStyle, ...scaleXStyle(frame, fps, 0.48, 0.32)}} />
      </div>
      <div style={{...(portrait ? portraitStatDetailStyle : statDetailStyle), ...enterStyle(frame, fps, 0.28, 0.48, 0)}}>
        <div style={portrait ? portraitDetailTitleStyle : detailTitleStyle}>
          <RichText parts={scene.title} strong preserveLineBreaks />
        </div>
        <div style={miniStatsStyle}>
          {scene.metrics.map((metric, index) => (
            <div
              key={metric.label}
              style={{
                ...miniRowStyle,
                ...enterStyle(
                  frame,
                  fps,
                  metric.appearAt ?? 0.52 + index * 0.08,
                  0.28,
                  18,
                ),
              }}
            >
              <span>{metric.label}</span>
              <span style={{color: toneColor(metric.tone), fontFamily: fonts.mono}}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === Compare 场景 =======================================

const CompareSceneView = ({scene}: {scene: CompareScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <div style={{...sceneContentStyle, justifyContent: "flex-start"}}>
      <span style={{...smallRuleStyle, ...scaleXStyle(frame, fps, 0.1, 0.28)}} />
      <div style={{...sectionLabelStyle, ...enterStyle(frame, fps, 0.16, 0.34, 16)}}>
        {scene.eyebrow}
      </div>
      <div
        style={{
          ...sectionHeadingStyle,
          fontSize: portrait ? 66 : 88,
          ...enterStyle(frame, fps, 0.24, 0.44, 28),
        }}
      >
        {scene.heading}
      </div>
      <div style={compareGridStyle(portrait)}>
        {scene.choices.map((choice, index) => (
          <div
            key={choice.code}
            style={{
              ...choiceStyle(index, portrait),
              ...enterStyle(
                frame,
                fps,
                choice.appearAt ?? 0.38 + index * 0.12,
                0.44,
                28,
              ),
            }}
          >
            <span style={{...choiceCodeStyle, color: toneColor(choice.tone)}}>
              {choice.code}
            </span>
              <div style={{...choiceTitleStyle, ...(portrait ? portraitChoiceTitleStyle : {})}}>
                {choice.title}
              </div>
              <div style={{...choiceSubtitleStyle, ...(portrait ? portraitChoiceSubtitleStyle : {})}}>
                {choice.subtitle}
              </div>
          </div>
        ))}
        <div
          style={{
            ...(portrait ? portraitDividerStyle : dividerStyle),
            ...(portrait
              ? scaleXStyle(frame, fps, 0.34, 0.36)
              : scaleYStyle(frame, fps, 0.34, 0.36)),
          }}
        />
      </div>
    </div>
  );
};

// === Outro 场景 =========================================

const OutroSceneView = ({scene}: {scene: OutroScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <div
      style={{
        ...sceneContentStyle,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <span style={{...outroRuleStyle, ...scaleXStyle(frame, fps, 0.08, 0.3)}} />
      <div style={{...sectionLabelStyle, ...enterStyle(frame, fps, 0.16, 0.34, 16)}}>
        {scene.eyebrow}
      </div>
      <div
        style={{
          ...outroTitleStyle,
          ...(portrait ? portraitOutroTitleStyle : {}),
          ...enterStyle(frame, fps, 0.24, 0.5, 34),
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          ...outroSubtitleStyle,
          ...(portrait ? portraitOutroSubtitleStyle : {}),
          ...enterStyle(frame, fps, 0.48, 0.4, 22),
        }}
      >
        {scene.subtitle}
      </div>
    </div>
  );
};

// === article-image 场景（核心新增） ======================

const ArticleImageSceneView = ({scene}: {scene: ArticleImageScene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;

  // 铁律：object-fit: contain，永不 cover
  // 宽高比决定 max-width 还是 max-height 优先
  // 注意：maxHeight 用 calc(100% - X) 而不是 78vh，避免在紧凑布局里溢出 frame
  // 标题(~80) + caption(~50) + eyebrow(~50) + 间距(36) ≈ 216，需要从高度里让出
  const isWideImage = scene.imageAspect >= 1.78;
  const imageSizeStyle: CSSProperties = isWideImage
    ? {maxWidth: "88%", maxHeight: "calc(100% - 16px)", width: "auto", height: "auto"}
    : {maxHeight: "calc(100% - 16px)", maxWidth: "88%", width: "auto", height: "auto"};

  // 持续动效：图源标签 6s 呼吸一次
  const sourceGlow = 0.6 + Math.sin((frame / fps) * (Math.PI / 3)) * 0.4;

  return (
    <div style={{...sceneContentStyle, ...articleImageLayoutStyle}}>
      <div style={articleImageHeaderStyle}>
        <Eyebrow style={enterStyle(frame, fps, scene.appearAt ?? 0.08, 0.34, 12)}>
          {scene.eyebrow}
        </Eyebrow>
        <h2
          style={{
            ...(portrait ? portraitArticleImageTitleStyle : articleImageTitleStyle),
            ...enterStyle(frame, fps, scene.titleAppearAt ?? 0.24, 0.5, 24),
          }}
        >
          <RichText parts={scene.title} strong />
        </h2>
      </div>

      <div
        style={{
          ...articleImageFrameStyle,
          ...enterStyle(frame, fps, scene.appearAt ?? 0.16, 0.6, 16),
        }}
      >
        <Img
          src={staticFile(scene.imageSrc)}
          style={{...articleImageImgStyle, ...imageSizeStyle}}
        />
        {scene.source ? (
          <div style={{...imageSourceBadgeStyle, opacity: sourceGlow}}>
            {scene.source}
          </div>
        ) : null}
        {scene.insights?.length ? (
          <div style={articleImageInsightsStyle}>
            {scene.insights.map((insight) => (
              <div key={insight.label} style={articleImageInsightStyle}>
                <span style={articleImageInsightLabelStyle}>{insight.label}</span>
                <span style={articleImageInsightValueStyle}>{insight.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {scene.caption ? (
        <div
          style={{
            ...articleImageCaptionStyle,
            ...enterStyle(frame, fps, scene.captionAppearAt ?? 0.5, 0.4, 14),
          }}
        >
          {scene.caption}
        </div>
      ) : null}
    </div>
  );
};

// === SceneRouter ========================================

const FigmaTemplateSceneView = ({
  scene,
  template,
}: {
  scene: ArticleScene;
  template: ReturnType<typeof resolveFigmaTemplate>;
}) => {
  const isSwiss = template.styleFamily === "swiss-signal";
  const templateBackground = {
    backgroundColor: isSwiss ? "#f7f7f2" : "#f0e8d6",
  } as CSSProperties;
  const accent = isSwiss ? "#2448d8" : "#d9361e";
  return (
    <AbsoluteFill style={figmaTemplateLayerStyle}>
      <Img src={staticFile(template.asset!)} style={figmaTemplateImageStyle} />
      <div style={{...figmaMaskStyle, ...figmaTitleMaskStyle, ...templateBackground}} />
      <div style={{...figmaMaskStyle, ...figmaReserveMaskStyle, ...templateBackground}} />
      {scene.kind === "article-image" ? (
        <>
          <div style={figmaTemplateTitleStyle}>
            <RichText parts={scene.title} strong />
          </div>
          <div style={figmaImageWindowStyle}>
            <Img src={staticFile(scene.imageSrc)} style={figmaImageWindowImageStyle} />
          </div>
        </>
      ) : null}
      {scene.kind === "stat" ? (
        <>
          <div style={figmaTemplateTitleStyle}>{scene.title.map((part) => part.text).join("")}</div>
          <div style={{...figmaStatNumberStyle, color: accent}}>{scene.number}</div>
          <div style={figmaStatUnitStyle}>{scene.unit}</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// Figma roles are resolved here into editable Remotion templates. The Figma
// frame supplies the visual contract; no exported placeholder layer is painted.
const SwissTemplateRenderer = ({
  scene,
  template,
}: {
  scene: ArticleScene;
  template: ReturnType<typeof resolveFigmaTemplate>;
}) => {
  const supported = template.runtimeSceneKinds.includes(scene.kind);
  if (!supported) return null;
  return <FigmaSwissTemplate scene={scene} />;
};

type FigmaScene = Extract<ArticleScene, {kind: "cover" | "list" | "stat" | "compare" | "outro" | "article-image" | "case-grid"}>;

const FigmaSwissTemplate = ({scene}: {scene: FigmaScene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = enterStyle(frame, fps, 0.04, 0.38, 18);

  return (
    <AbsoluteFill style={figmaRuntimeFrameStyle}>
      {scene.kind === "cover" ? (
        scene.imageSrc ? (
          <AbsoluteFill style={figmaFullCoverStyle}>
            <Img src={staticFile(scene.imageSrc)} style={figmaFullCoverImageStyle} />
            <div style={{...figmaFullCoverTitleStyle, ...(scene.imageSrc ? {opacity: 1, transform: "none"} : reveal)}}>
              {scene.titleLines.map((line, index) => <div key={index}><RichText parts={line} strong defaultColor={colors.white} /></div>)}
            </div>
          </AbsoluteFill>
        ) : (
          <div style={figmaCoverLayoutStyle}>
            <FigmaEyebrow text={scene.eyebrow} />
            <div style={{...figmaCoverTitleStyle, ...reveal}}>
              {scene.titleLines.map((line, index) => <div key={index}><RichText parts={line} strong /></div>)}
            </div>
            <div style={figmaCoverSubtitleStyle}>{scene.subtitle}</div>
          </div>
        )
      ) : null}
      {scene.kind === "outro" ? (
        <div style={figmaCoverLayoutStyle}>
          <FigmaEyebrow text={scene.eyebrow} />
          <div style={{...figmaCoverTitleStyle, ...reveal, whiteSpace: "pre-line"}}>{scene.title}</div>
          <div style={figmaCoverSubtitleStyle}>{scene.subtitle}</div>
        </div>
      ) : null}
      {scene.kind === "stat" ? <FigmaStatTemplate scene={scene} reveal={reveal} /> : null}
      {scene.kind === "article-image" ? <FigmaImageTemplate scene={scene} reveal={reveal} /> : null}
      {scene.kind === "list" ? <FigmaListTemplate scene={scene} reveal={reveal} /> : null}
      {scene.kind === "compare" ? <FigmaCompareTemplate scene={scene} reveal={reveal} /> : null}
      {scene.kind === "case-grid" ? <CaseGridSceneView scene={scene} /> : null}
    </AbsoluteFill>
  );
};

const FigmaEyebrow = ({text}: {text: string}) => (
  <div style={figmaEyebrowStyle}><span style={figmaEyebrowRuleStyle} />{text}</div>
);

const FigmaStatTemplate = ({scene, reveal}: {scene: Extract<ArticleScene, {kind: "stat"}>; reveal: CSSProperties}) => (
  <div style={figmaTemplateBodyStyle}>
    <FigmaEyebrow text={scene.eyebrow} />
    <div style={{...figmaTemplateHeadingStyle, ...reveal}}><RichText parts={scene.title} strong /></div>
    <div style={{...figmaMetricValueStyle, ...reveal}}>{scene.number}</div>
    <div style={figmaMetricUnitStyle}>{scene.unit}</div>
    <span style={figmaAccentRuleStyle} />
    <div style={figmaMetricRowsStyle}>
      {scene.metrics.map((metric) => <div key={metric.label} style={figmaMetricRowStyle}>
        <span style={figmaMetricLabelStyle}>{metric.label}</span>
        <span style={figmaMetricDetailStyle}>{metric.value}</span>
      </div>)}
    </div>
  </div>
);

const FigmaImageTemplate = ({scene, reveal}: {scene: Extract<ArticleScene, {kind: "article-image"}>; reveal: CSSProperties}) => (
  <div style={figmaTemplateBodyStyle}>
    <FigmaEyebrow text={scene.eyebrow} />
    <div style={{...figmaTemplateHeadingStyle, ...reveal}}><RichText parts={scene.title} strong /></div>
    <div style={scene.imagePresentation === "hero" ? figmaHeroImageSurfaceStyle : figmaImageSurfaceStyle}>
      <Img src={staticFile(scene.imageSrc)} style={scene.imagePresentation === "hero" ? figmaHeroImageStyle : figmaRuntimeImageStyle} />
    </div>
    {scene.imagePresentation !== "hero" && scene.insights?.length ? <div style={figmaInsightRowStyle}>
      {scene.insights.map((insight) => <div key={insight.label} style={figmaInsightStyle}>
        <span>{insight.label}</span><strong>{insight.value}</strong>
      </div>)}
    </div> : null}
  </div>
);

const FigmaListTemplate = ({scene, reveal}: {scene: Extract<ArticleScene, {kind: "list"}>; reveal: CSSProperties}) => (
  <div style={figmaTemplateBodyStyle}>
    <FigmaEyebrow text={scene.eyebrow} />
    <div style={{...figmaTemplateHeadingStyle, ...reveal}}>{scene.heading}</div>
    {scene.visualMode === "table" ? <FigmaTableVisual scene={scene} /> : null}
    {scene.visualMode === "process" ? <FigmaProcessVisual scene={scene} /> : null}
    {!scene.visualMode || scene.visualMode === "three-box" ? <div style={figmaThreeCardGridStyle}>
      {(scene.visualCards ?? scene.items.slice(0, 3).map((item) => ({keyword: item.value, detail: item.label, imageSrc: undefined}))).slice(0, 3).map((card, index) => (
        <div key={`${card.keyword}-${index}`} style={figmaThreeCardStyle}>
          {card.imageSrc ? <Img src={staticFile(card.imageSrc)} style={figmaCardInlineImageStyle} /> : null}
          <span style={figmaThreeCardIndexStyle}>•</span>
          <strong style={figmaThreeCardKeywordStyle}>{card.keyword}</strong>
          <span style={figmaThreeCardDetailStyle}>{card.detail}</span>
        </div>
      ))}
    </div> : null}
  </div>
);

const FigmaTableVisual = ({scene}: {scene: Extract<ArticleScene, {kind: "list"}>}) => (
  <div style={figmaTableStyle}>
    <div style={figmaTableHeaderStyle}><span>维度</span><span>文章里的判断</span></div>
    {(scene.visualCards ?? []).slice(0, 4).map((card) => (
      <div key={card.keyword} style={figmaTableRowStyle}><strong>{card.keyword}</strong><span>{card.detail}</span></div>
    ))}
  </div>
);

const FigmaProcessVisual = ({scene}: {scene: Extract<ArticleScene, {kind: "list"}>}) => (
  <div style={figmaProcessStyle}>
    {(scene.visualCards ?? []).slice(0, 4).map((card, index, cards) => (
      <Fragment key={card.keyword}>
        <div style={{...figmaProcessStepStyle, ...figmaProcessStepVariantStyle(index)}}>
          {card.imageSrc ? <Img src={staticFile(card.imageSrc)} style={{...figmaProcessImageStyle, height: figmaProcessImageHeights[index] ?? 148}} /> : null}
          <span style={figmaThreeCardIndexStyle}>•</span><strong>{card.keyword}</strong><span>{card.detail}</span>
        </div>
        {index < cards.length - 1 ? <span style={figmaProcessArrowStyle}><span style={figmaProcessArrowLineStyle} /></span> : null}
      </Fragment>
    ))}
  </div>
);

const FigmaCompareTemplate = ({scene, reveal}: {scene: Extract<ArticleScene, {kind: "compare"}>; reveal: CSSProperties}) => (
  <div style={figmaTemplateBodyStyle}>
    <FigmaEyebrow text={scene.eyebrow} />
    <div style={{...figmaTemplateHeadingStyle, ...reveal}}>{scene.heading}</div>
    <div style={figmaCompareGridStyle}>
      {scene.choices.map((choice) => <div key={choice.code} style={figmaCompareCardStyle}>
        {choice.imageSrc ? <Img src={staticFile(choice.imageSrc)} style={figmaCompareCardImageStyle} /> : null}
        <span style={figmaCardLabelStyle}>{choice.code}</span>
        <strong style={figmaCardValueStyle}>{choice.title}</strong>
        <span style={figmaCompareSubtitleStyle}>{choice.subtitle}</span>
      </div>)}
    </div>
  </div>
);

export const SceneRenderer = ({
  scene,
  durationInFrames,
  isLast,
}: {
  scene: ArticleScene;
  durationInFrames: number;
  isLast: boolean;
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const template = resolveFigmaTemplate(scene.template);
  // Start slightly before frame zero so the opening frame is never blank.
  const enter = progress(frame, -0.12 * fps, 0.42 * fps);
  const exit = isLast ? 0 : progress(frame, durationInFrames - 0.42 * fps, 0.42 * fps);
  const opacity = clamp(enter - exit, 0, 1);

  return (
    <AbsoluteFill
      data-figma-template={template.id}
      data-figma-style={template.styleFamily}
      style={{
        ...sceneShellStyle,
        ...(portrait ? portraitSceneShellStyle : {}),
        opacity,
      }}
    >
      <SwissTemplateRenderer scene={scene} template={template} />
    </AbsoluteFill>
  );
};

// === Caption / TopBar（暴露给 ArticleVideo 使用） =======

export const CaptionPill = ({caption}: {caption: Caption}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const start = frameFromSeconds(caption.start, fps);
  const end = frameFromSeconds(caption.end, fps);

  if (frame < start - 1 || frame > end) {
    return null;
  }

  const enter = progress(frame, start, 0.16 * fps);
  const exit = progress(frame, Math.max(start, end - 0.12 * fps), 0.12 * fps);
  const visible = clamp(enter - exit, 0, 1);

  return (
    <div
      style={{
        ...captionStyle,
        ...(portrait ? portraitCaptionStyle : {}),
        opacity: visible,
        transform: portrait
          ? `translate(-50%, calc(-50% + ${(1 - visible) * 18}px)) scale(${0.98 + visible * 0.02})`
          : `translate(-50%, ${(1 - visible) * 18}px) scale(${0.98 + visible * 0.02})`,
      }}
    >
      <RichText parts={caption.parts} defaultColor={colors.ink} />
    </div>
  );
};

export const CaptionLayer = ({captions, showBand = true}: {captions: Caption[]; showBand?: boolean}) => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  return (
    <AbsoluteFill style={{...captionLayerStyle, ...(portrait ? portraitCaptionLayerStyle : {})}}>
      {portrait && showBand ? <div style={captionBandStyle} /> : null}
      {captions.map((caption, index) => (
        <CaptionPill key={`${caption.start}-${index}`} caption={caption} />
      ))}
    </AbsoluteFill>
  );
};

export const TakeawayLayer = ({takeaways}: {takeaways: Takeaway[]}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const portrait = height > 0;
  const time = frame / fps;
  const active = takeaways.find((takeaway) => time >= takeaway.start && time < takeaway.end);

  if (!active) return null;

  const start = frameFromSeconds(active.start, fps);
  const end = frameFromSeconds(active.end, fps);
  const enter = progress(frame, start, 0.14 * fps);
  const exit = progress(frame, Math.max(start, end - 0.12 * fps), 0.12 * fps);
  const visible = clamp(enter - exit, 0, 1);

  return (
    <div
      style={{
        ...takeawayLayerStyle,
        ...(portrait ? portraitTakeawayLayerStyle : {}),
        opacity: visible,
        transform: `translateY(${(1 - visible) * 12}px)`,
      }}
    >
      <span style={takeawayTextStyle}>{active.text}</span>
    </div>
  );
};

export const TopBar = ({
  chapters,
  durationSeconds,
}: {
  chapters: Chapter[];
  durationSeconds: number;
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const time = frame / fps;
  const timelineProgress = clamp(frame / (durationSeconds * fps), 0, 1);
  const progressWidth = timelineProgress * 100;
  const chapterLabelColor = (index: number, reached: boolean) => {
    // The first label starts after the left inset; switch to white when black fill reaches it.
    if (index === 0) return progressWidth < 4 ? colors.ink : colors.white;
    return reached ? colors.white : colors.topbarMuted;
  };

  return (
    <div style={{...topbarStyle, ...(portrait ? portraitTopbarStyle : {})}}>
      <div style={{...navFillStyle, width: `${progressWidth}%`}} />
      {portrait ? (
        <div style={portraitChapterRowStyle}>
          {chapters.map((chapter, index) => {
            const nextStart = chapters[index + 1]?.start ?? durationSeconds;
            const reached = time >= chapter.start;
            const active = time >= chapter.start && time < nextStart;
            return (
              <div
                key={chapter.label}
                style={{
                  ...portraitChapterSegmentStyle,
                  flex: `${Math.max(1, nextStart - chapter.start)} 1 0`,
                  borderRight:
                    index < chapters.length - 1
                      ? `1px solid ${colors.topbarSeparator}`
                      : "none",
                }}
              >
                <span
                  style={{
                    ...portraitChapterLabelStyle,
                    color: chapterLabelColor(index, reached),
                    fontWeight: active ? 700 : reached ? 600 : 500,
                  }}
                >
                  {chapter.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={chapterRowStyle}>
          {chapters.map((chapter, index) => {
            const reached = time >= chapter.start;
            return (
              <span key={chapter.label} style={chapterGroupStyle}>
                <span
                  style={{
                    ...chapterLabelStyle,
                    color: chapterLabelColor(index, reached),
                    fontWeight: reached ? 600 : 500,
                  }}
                >
                  {chapter.label}
                </span>
                {index < chapters.length - 1 ? <span style={chapterSepStyle}>|</span> : null}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

// === 样式 ================================================

const sceneShellStyle: CSSProperties = {
  padding: `${layout.safeTop}px ${layout.safeX}px ${layout.safeBottom}px`,
};
const portraitSceneShellStyle: CSSProperties = {
  padding: "164px 84px 480px",
};

const sceneContentStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const eyebrowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 24,
  color: colors.accent,
  fontFamily: fonts.mono,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const eyebrowRuleStyle: CSSProperties = {
  width: 52,
  height: 2,
  backgroundColor: colors.accent,
  flex: "none",
};

// Cover
const coverTitleStyle: CSSProperties = {
  maxWidth: 1400,
  margin: 0,
  color: colors.ink,
  fontSize: 112,
  fontWeight: 800,
  lineHeight: 1.14,
  letterSpacing: 0,
};
const portraitCoverTitleStyle: CSSProperties = {
  ...coverTitleStyle,
  maxWidth: 900,
  fontSize: 96,
  lineHeight: 1.12,
};
const subtitleStyle: CSSProperties = {
  marginTop: 46,
  color: colors.muted,
  fontSize: 38,
  fontWeight: 300,
  letterSpacing: 0,
};
const portraitSubtitleStyle: CSSProperties = {
  ...subtitleStyle,
  maxWidth: 760,
  fontSize: 32,
  lineHeight: 1.35,
};

// List
const splitLayoutStyle: CSSProperties = {flexDirection: "row", alignItems: "center", gap: 100};
const portraitListLayoutStyle: CSSProperties = {
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  gap: 54,
};
const caseGridLayoutStyle: CSSProperties = {
  gap: 44,
};
const caseGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 22,
  flex: 1,
  alignItems: "center",
};
const caseTileStyle: CSSProperties = {
  minHeight: 420,
  padding: 24,
  border: `1px solid ${colors.lineStrong}`,
  borderTopWidth: 8,
  backgroundColor: colors.white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
const caseVisualStyle: CSSProperties = {
  height: 170,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.white,
};
const caseVisualMarkStyle: CSSProperties = {
  fontFamily: fonts.sans,
  fontSize: 86,
  fontWeight: 900,
};
const caseImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.92,
};
const caseVisualTagStyle: CSSProperties = {
  position: "absolute",
  alignSelf: "flex-end",
  margin: "0 12px 12px 0",
  padding: "7px 10px",
  color: colors.white,
  backgroundColor: "rgba(20, 24, 28, 0.72)",
  fontFamily: fonts.mono,
  fontSize: 16,
  fontWeight: 600,
};
const caseMetaStyle: CSSProperties = {
  marginTop: 22,
  color: colors.muted,
  fontFamily: fonts.mono,
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 0,
};
const caseTitleStyle: CSSProperties = {
  marginTop: 24,
  color: colors.ink,
  fontSize: 34,
  fontWeight: 800,
};
const caseDetailStyle: CSSProperties = {
  marginTop: 12,
  color: colors.muted,
  fontSize: 25,
  lineHeight: 1.3,
};
const sectionTitleRailStyle: CSSProperties = {width: 420, flex: "none"};
const portraitSectionTitleRailStyle: CSSProperties = {width: "100%", flex: "none"};
const smallRuleStyle: CSSProperties = {
  width: 48,
  height: 2,
  backgroundColor: colors.accent,
  display: "block",
  marginBottom: 30,
};
const sectionLabelStyle: CSSProperties = {
  color: colors.accent,
  fontFamily: fonts.mono,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
  marginBottom: 20,
};
const sectionHeadingStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 96,
  fontWeight: 800,
  lineHeight: 1.08,
  letterSpacing: 0,
};
const portraitSectionHeadingStyle: CSSProperties = {
  ...sectionHeadingStyle,
  fontSize: 72,
  lineHeight: 1.12,
};
const rowsStyle: CSSProperties = {flex: 1, display: "flex", flexDirection: "column"};
const listCardsStyle: CSSProperties = {
  flex: 1,
  display: "grid",
  gap: 22,
  alignContent: "center",
  paddingTop: 12,
};
const listCardStyle: CSSProperties = {
  minHeight: 250,
  padding: 28,
  border: `1px solid ${colors.lineStrong}`,
  borderTop: `5px solid ${colors.accent}`,
  backgroundColor: colors.white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
const listCardTopStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
const listCardMarkerStyle: CSSProperties = {
  color: colors.accent,
  fontFamily: fonts.mono,
  fontSize: 24,
  fontWeight: 700,
};
const listCardDotStyle: CSSProperties = {
  width: 28,
  height: 5,
  backgroundColor: colors.accent,
  display: "block",
};
const listCardLabelStyle: CSSProperties = {
  color: colors.muted,
  fontSize: 23,
  fontWeight: 500,
};
const listCardValueStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 42,
  fontWeight: 700,
  lineHeight: 1.2,
};
const portraitListCardValueStyle: CSSProperties = {
  ...listCardValueStyle,
  fontSize: 37,
  lineHeight: 1.24,
};
const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 46,
  padding: "42px 0",
  borderTop: `1px solid ${colors.line}`,
};
const rowIndexStyle: CSSProperties = {
  width: 74,
  flex: "none",
  color: colors.weak,
  fontFamily: fonts.mono,
  fontSize: 40,
  fontWeight: 500,
};
const rowLabelStyle: CSSProperties = {
  width: 150,
  flex: "none",
  color: colors.muted,
  fontSize: 27,
  fontWeight: 400,
  letterSpacing: 0,
};
const rowValueStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 56,
  fontWeight: 600,
  lineHeight: 1.2,
};
const portraitRowValueStyle: CSSProperties = {
  ...rowValueStyle,
  fontSize: 44,
  lineHeight: 1.18,
};

// Stat
const statLayoutStyle: CSSProperties = {flexDirection: "row", alignItems: "center", gap: 110};
const portraitStatLayoutStyle: CSSProperties = {flexDirection: "column", alignItems: "stretch", gap: 58};
const bigStatStyle: CSSProperties = {flex: "none"};
const portraitBigStatStyle: CSSProperties = {flex: "none", alignItems: "center"};
const statNumberWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  flexWrap: "nowrap",
  whiteSpace: "nowrap",
};
const statNumberStyle: CSSProperties = {
  color: colors.ink,
  fontFamily: fonts.mono,
  fontSize: 420,
  fontWeight: 700,
  lineHeight: 0.82,
  letterSpacing: 0,
};
const portraitStatNumberStyle: CSSProperties = {
  ...statNumberStyle,
  fontSize: 264,
  whiteSpace: "nowrap",
};
const statUnitStyle: CSSProperties = {
  marginTop: 54,
  color: colors.muted,
  fontFamily: fonts.mono,
  fontSize: 72,
  fontWeight: 500,
  whiteSpace: "nowrap",
};
const portraitStatUnitStyle: CSSProperties = {
  ...statUnitStyle,
  marginTop: 38,
  fontSize: 42,
  whiteSpace: "nowrap",
};
const statRuleStyle: CSSProperties = {
  display: "block",
  width: 380,
  height: 3,
  marginTop: 6,
  backgroundColor: colors.accent,
};
const statDetailStyle: CSSProperties = {
  flex: 1,
  borderLeft: `1px solid ${colors.line}`,
  padding: "18px 0 18px 88px",
};
const portraitStatDetailStyle: CSSProperties = {
  flex: "none",
  width: "100%",
  borderTop: `1px solid ${colors.line}`,
  padding: "46px 0 0",
};
const detailTitleStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 54,
  fontWeight: 700,
  lineHeight: 1.28,
};
const portraitDetailTitleStyle: CSSProperties = {
  ...detailTitleStyle,
  fontSize: 46,
  lineHeight: 1.22,
};
const miniStatsStyle: CSSProperties = {maxWidth: 540, marginTop: 48};
const miniRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  padding: "24px 0",
  borderTop: `1px solid ${colors.line}`,
  color: colors.muted,
  fontSize: 32,
};

// Compare
const compareGridStyle = (portrait: boolean): CSSProperties => ({
  flex: 1,
  display: "grid",
  gridTemplateColumns: portrait ? "1fr" : "1fr 1px 1fr",
  gridTemplateRows: portrait ? "1fr 1px 1fr" : undefined,
  alignItems: "stretch",
  marginTop: 60,
});
const choiceStyle = (index: number, portrait: boolean): CSSProperties => ({
  gridColumn: portrait ? 1 : index === 0 ? 1 : 3,
  gridRow: portrait ? (index === 0 ? 1 : 3) : undefined,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: index === 0 ? "12px 90px 12px 0" : "12px 0 12px 90px",
});
const choiceCodeStyle: CSSProperties = {
  color: colors.weak,
  fontFamily: fonts.mono,
  fontSize: 40,
  fontWeight: 600,
};
const choiceTitleStyle: CSSProperties = {
  margin: "16px 0 30px",
  color: colors.ink,
  fontSize: 84,
  fontWeight: 800,
  letterSpacing: 0,
};
const choiceSubtitleStyle: CSSProperties = {
  color: colors.muted,
  fontSize: 40,
  fontWeight: 300,
  letterSpacing: 0,
};
const portraitChoiceTitleStyle: CSSProperties = {
  fontSize: 62,
  lineHeight: 1.12,
};
const portraitChoiceSubtitleStyle: CSSProperties = {
  fontSize: 32,
  lineHeight: 1.3,
};
const dividerStyle: CSSProperties = {
  gridColumn: 2,
  width: 1,
  backgroundColor: colors.lineStrong,
};
const portraitDividerStyle: CSSProperties = {
  gridColumn: 1,
  gridRow: 2,
  width: "100%",
  height: 1,
  backgroundColor: colors.lineStrong,
};

// Outro
const outroRuleStyle: CSSProperties = {
  width: 70,
  height: 2,
  backgroundColor: colors.accent,
  marginBottom: 38,
};
const outroTitleStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 172,
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: 0,
};
const outroSubtitleStyle: CSSProperties = {
  marginTop: 42,
  color: colors.muted,
  fontSize: 40,
  fontWeight: 300,
  letterSpacing: 0,
};
const portraitOutroTitleStyle: CSSProperties = {
  fontSize: 104,
  lineHeight: 1.08,
};
const portraitOutroSubtitleStyle: CSSProperties = {
  fontSize: 32,
  lineHeight: 1.35,
  maxWidth: 760,
};

// Article-image（核心新增）
const articleImageLayoutStyle: CSSProperties = {
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
};
const articleImageHeaderStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 18,
};
const articleImageTitleStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1500,
  margin: 0,
  color: colors.ink,
  fontSize: 64,
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: 0,
};
const portraitArticleImageTitleStyle: CSSProperties = {
  ...articleImageTitleStyle,
  maxWidth: 880,
  fontSize: 52,
  lineHeight: 1.22,
};
const articleImageFrameStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 0,
  overflow: "hidden",
};
const articleImageImgStyle: CSSProperties = {
  objectFit: "contain",
  borderRadius: 12,
  boxShadow:
    "0 30px 90px rgba(28,38,54,0.18), 0 4px 16px rgba(28,38,54,0.08)",
  backgroundColor: colors.white,
  display: "block",
};
const imageSourceBadgeStyle: CSSProperties = {
  position: "absolute",
  right: 12,
  bottom: 12,
  padding: "6px 14px",
  borderRadius: 100,
  backgroundColor: "rgba(28,38,54,0.78)",
  color: colors.white,
  fontFamily: fonts.mono,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.4,
};
const articleImageInsightsStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 22,
  transform: "translateX(-50%)",
  display: "flex",
  gap: 12,
  width: "min(92%, 860px)",
  justifyContent: "center",
};
const articleImageInsightStyle: CSSProperties = {
  minWidth: 170,
  padding: "12px 18px",
  border: `1px solid ${colors.lineStrong}`,
  backgroundColor: "rgba(255,255,255,0.94)",
  boxShadow: "0 8px 24px rgba(28,38,54,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: 5,
};
const articleImageInsightLabelStyle: CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.mono,
  fontSize: 15,
  fontWeight: 600,
};
const articleImageInsightValueStyle: CSSProperties = {
  color: colors.ink,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.15,
};
const articleImageCaptionStyle: CSSProperties = {
  marginTop: 20,
  color: colors.muted,
  fontSize: 26,
  fontWeight: 400,
  letterSpacing: 0,
  maxWidth: 1200,
};

// Caption
const captionLayerStyle: CSSProperties = {zIndex: 100, pointerEvents: "none"};
const figmaTemplateLayerStyle: CSSProperties = {position: "absolute", inset: 0, zIndex: 0};
const figmaTemplateImageStyle: CSSProperties = {width: "100%", height: "100%", objectFit: "fill"};
const figmaRuntimeFrameStyle: CSSProperties = {
  position: "absolute", inset: 0, zIndex: 1, color: colors.ink,
};
const figmaRuntimeFramePadding = "154px 84px 480px";
const figmaTemplateBodyStyle: CSSProperties = {
  position: "absolute", inset: figmaRuntimeFramePadding, display: "flex", flexDirection: "column",
};
const figmaEyebrowStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: 16, color: colors.accent,
  fontFamily: fonts.mono, fontSize: 20, fontWeight: 700, marginBottom: 22,
};
const figmaEyebrowRuleStyle: CSSProperties = {width: 48, height: 3, backgroundColor: colors.accent, display: "inline-block"};
const figmaTemplateHeadingStyle: CSSProperties = {
  maxWidth: 880, color: colors.ink, fontSize: 68, fontWeight: 900, lineHeight: 1.12, marginBottom: 38,
};
const figmaCoverLayoutStyle: CSSProperties = {...figmaTemplateBodyStyle, justifyContent: "center"};
const figmaFullCoverStyle: CSSProperties = {position: "absolute", inset: 0, overflow: "hidden"};
const figmaFullCoverImageStyle: CSSProperties = {width: "100%", height: "100%", objectFit: "cover"};
const figmaFullCoverTitleStyle: CSSProperties = {
  position: "absolute", top: 168, left: 78, right: 78, color: colors.white,
  fontSize: 88, fontWeight: 900, lineHeight: 1.08, textShadow: "0 3px 18px rgba(0,0,0,0.85)",
};
const figmaCoverTitleStyle: CSSProperties = {
  maxWidth: 880, color: colors.ink, fontSize: 92, fontWeight: 900, lineHeight: 1.08,
};
const figmaCoverSubtitleStyle: CSSProperties = {marginTop: 30, color: colors.muted, fontSize: 30, lineHeight: 1.35, maxWidth: 760};
const figmaMetricValueStyle: CSSProperties = {
  color: colors.ink, fontFamily: fonts.mono, fontSize: 250, fontWeight: 700, lineHeight: 0.88,
  whiteSpace: "nowrap", marginTop: 18,
};
const figmaMetricUnitStyle: CSSProperties = {color: colors.muted, fontFamily: fonts.mono, fontSize: 40, fontWeight: 600, marginTop: 18, whiteSpace: "nowrap"};
const figmaAccentRuleStyle: CSSProperties = {width: 380, height: 3, backgroundColor: colors.accent, marginTop: 18, marginBottom: 22};
const figmaMetricRowsStyle: CSSProperties = {width: "100%", maxWidth: 880, borderTop: `1px solid ${colors.lineStrong}`};
const figmaMetricRowStyle: CSSProperties = {display: "flex", justifyContent: "space-between", gap: 24, padding: "18px 0", borderBottom: `1px solid ${colors.line}`};
const figmaMetricLabelStyle: CSSProperties = {color: colors.muted, fontSize: 24, fontWeight: 500};
const figmaMetricDetailStyle: CSSProperties = {color: colors.accent, fontSize: 26, fontWeight: 700, textAlign: "right"};
const figmaImageSurfaceStyle: CSSProperties = {
  width: "100%", height: 360, display: "flex", alignItems: "center", justifyContent: "center",
  backgroundColor: colors.white, border: `1px solid ${colors.lineStrong}`, borderRadius: 10, overflow: "hidden",
};
const figmaRuntimeImageStyle: CSSProperties = {width: "100%", height: "100%", objectFit: "contain"};
const figmaHeroImageSurfaceStyle: CSSProperties = {
  width: "100%", height: 620, display: "flex", alignItems: "center", justifyContent: "center",
  backgroundColor: colors.canvas, overflow: "hidden",
};
const figmaHeroImageStyle: CSSProperties = {width: "100%", height: "100%", objectFit: "cover"};
const figmaInsightRowStyle: CSSProperties = {display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18};
const figmaInsightStyle: CSSProperties = {display: "flex", flexDirection: "column", gap: 6, padding: "14px 16px", borderTop: `3px solid ${colors.accent}`, backgroundColor: colors.white};
const figmaCardGridStyle: CSSProperties = {display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 18};
const figmaCardStyle: CSSProperties = {minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24, backgroundColor: colors.white, border: `1px solid ${colors.lineStrong}`, borderTop: `4px solid ${colors.accent}`};
const figmaCardLabelStyle: CSSProperties = {color: colors.muted, fontSize: 20, fontWeight: 600};
const figmaCardValueStyle: CSSProperties = {color: colors.ink, fontSize: 34, fontWeight: 800, lineHeight: 1.2};
const figmaSignalPanelStyle: CSSProperties = {marginTop: 18, minHeight: 330, padding: "28px 26px", backgroundColor: colors.white, border: `1px solid ${colors.lineStrong}`, borderTop: `4px solid ${colors.accent}`};
const figmaSignalGroupStyle: CSSProperties = {display: "flex", flexDirection: "column", gap: 18};
const figmaSignalRowStyle: CSSProperties = {display: "flex", alignItems: "stretch", gap: 14, width: "100%"};
const figmaSignalNodeStyle: CSSProperties = {flex: 1, minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18, border: `1px solid ${colors.lineStrong}`, borderTopWidth: 3, backgroundColor: colors.canvas};
const figmaSignalNodeIndexStyle: CSSProperties = {color: colors.accent, fontFamily: fonts.mono, fontSize: 18, fontWeight: 700};
const figmaSignalConnectorStyle: CSSProperties = {alignSelf: "center", color: colors.accent, fontFamily: fonts.mono, fontSize: 24, fontWeight: 700};
const figmaSignalDividerStyle: CSSProperties = {height: 1, backgroundColor: colors.line, margin: "22px 0"};
const figmaThreeCardGridStyle: CSSProperties = {display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 22};
const figmaThreeCardStyle: CSSProperties = {minHeight: 250, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 22, backgroundColor: colors.white, border: `1px solid ${colors.lineStrong}`, borderTop: `4px solid ${colors.accent}`};
const figmaCardInlineImageStyle: CSSProperties = {width: "100%", height: 92, objectFit: "cover", border: `1px solid ${colors.line}`, display: "block", marginBottom: 8};
const figmaThreeCardIndexStyle: CSSProperties = {color: colors.accent, fontFamily: fonts.mono, fontSize: 18, fontWeight: 700};
const figmaThreeCardKeywordStyle: CSSProperties = {color: colors.ink, fontSize: 30, fontWeight: 800, lineHeight: 1.2};
const figmaThreeCardDetailStyle: CSSProperties = {color: colors.muted, fontSize: 21, lineHeight: 1.35};
const figmaTableStyle: CSSProperties = {marginTop: 22, border: `1px solid ${colors.lineStrong}`, backgroundColor: colors.white};
const figmaTableHeaderStyle: CSSProperties = {display: "grid", gridTemplateColumns: "0.8fr 1.8fr", gap: 20, padding: "16px 22px", color: colors.accent, fontSize: 19, fontWeight: 700, borderBottom: `2px solid ${colors.accent}`};
const figmaTableRowStyle: CSSProperties = {display: "grid", gridTemplateColumns: "0.8fr 1.8fr", gap: 20, padding: "22px", color: colors.muted, fontSize: 22, lineHeight: 1.3, borderBottom: `1px solid ${colors.line}`};
const figmaProcessStyle: CSSProperties = {display: "flex", alignItems: "stretch", gap: 18, marginTop: 26};
const figmaProcessStepStyle: CSSProperties = {flex: 1, minHeight: 330, display: "flex", flexDirection: "column", gap: 10, padding: "0 10px 18px", backgroundColor: "transparent", border: "none", borderTop: `3px solid ${colors.accent}`, color: colors.muted, fontSize: 20, lineHeight: 1.3};
const figmaProcessStepVariantStyle = (index: number): CSSProperties => ({marginTop: index === 1 ? 22 : index === 2 ? 8 : 0});
const figmaProcessImageHeights = [164, 132, 150];
const figmaProcessImageStyle: CSSProperties = {width: "100%", objectFit: "cover", border: "none", display: "block", marginBottom: 8};
const figmaProcessArrowStyle: CSSProperties = {width: 24, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center"};
const figmaProcessArrowLineStyle: CSSProperties = {width: "100%", height: 1, backgroundColor: colors.accent, display: "block", position: "relative"};
const figmaCompareGridStyle: CSSProperties = {display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 18};
const figmaCompareCardStyle: CSSProperties = {minHeight: 390, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12, padding: 20, backgroundColor: colors.white, border: `1px solid ${colors.lineStrong}`};
const figmaCompareCardImageStyle: CSSProperties = {width: "100%", height: 150, objectFit: "cover", border: `1px solid ${colors.line}`, display: "block"};
const figmaCompareSubtitleStyle: CSSProperties = {color: colors.muted, fontSize: 22, lineHeight: 1.3};
const figmaMaskStyle: CSSProperties = {position: "absolute", left: "5%", right: "5%"};
const figmaTitleMaskStyle: CSSProperties = {top: "13%", height: "30%"};
const figmaReserveMaskStyle: CSSProperties = {top: "84%", height: "16%", left: 0, right: 0, backgroundColor: "#ffffff"};
const figmaTemplateTitleStyle: CSSProperties = {
  position: "absolute", top: "16%", left: "8%", right: "8%", color: "#111111",
  fontSize: 70, fontWeight: 800, lineHeight: 1.1, zIndex: 2,
};
const figmaImageWindowStyle: CSSProperties = {
  position: "absolute", top: "42%", left: "8%", width: "84%", height: "25%",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
  backgroundColor: "#ffffff", border: "1px solid rgba(49,58,69,0.18)", borderRadius: 12,
};
const figmaImageWindowImageStyle: CSSProperties = {width: "100%", height: "100%", objectFit: "contain"};
const figmaStatNumberStyle: CSSProperties = {
  position: "absolute", top: "43%", left: "8%", color: "#d9361e", fontSize: 138,
  fontWeight: 900, lineHeight: 0.9, zIndex: 2,
};
const figmaStatUnitStyle: CSSProperties = {
  position: "absolute", top: "58%", left: "8%", color: "#111111", fontSize: 30,
  fontWeight: 700, zIndex: 2,
};
const portraitCaptionLayerStyle: CSSProperties = {
  top: "83%",
  height: "17%",
};
const captionBandStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundColor: colors.white,
  borderTop: "2px solid #4a4f55",
};
const takeawayLayerStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 105,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px 56px",
  backgroundColor: colors.ink,
  color: colors.white,
  pointerEvents: "none",
};
const portraitTakeawayLayerStyle: CSSProperties = {
  top: "67%",
  bottom: "17%",
  padding: "22px 84px",
};
const takeawayTextStyle: CSSProperties = {
  width: "100%",
  maxWidth: 920,
  color: colors.white,
  fontSize: 42,
  fontWeight: 800,
  lineHeight: 1.3,
  textAlign: "center",
};
const captionStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: layout.captionBottom,
  maxWidth: 1300,
  color: colors.ink,
  fontSize: 40,
  fontWeight: 500,
  lineHeight: 1.25,
  textAlign: "center",
  letterSpacing: 0,
};
const portraitCaptionStyle: CSSProperties = {
  top: "50%",
  bottom: "auto",
  width: "calc(100% - 120px)",
  maxWidth: 880,
  fontSize: 44,
  fontWeight: 700,
  lineHeight: 1.28,
};

// TopBar
const topbarStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: layout.topbarHeight,
  zIndex: 120,
  backgroundColor: colors.topbarTrack,
  overflow: "hidden",
};
const portraitTopbarStyle: CSSProperties = {
  height: 92,
};
const navFillStyle: CSSProperties = {
  position: "absolute",
  top: 7,
  bottom: 7,
  left: 0,
  backgroundColor: colors.ink,
  borderRadius: "0 14px 14px 0",
};
const chapterRowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 34px",
  fontSize: 22,
  lineHeight: 1,
  whiteSpace: "nowrap",
  zIndex: 2,
};
const chapterGroupStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 28,
};
const chapterLabelStyle: CSSProperties = {
  fontWeight: 500,
  letterSpacing: 0,
};
const chapterSepStyle: CSSProperties = {
  color: colors.topbarSeparator,
};
const portraitChapterRowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  padding: "0 26px",
  zIndex: 2,
};
const portraitChapterSegmentStyle: CSSProperties = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingLeft: 14,
  minWidth: 0,
};
const portraitChapterLabelStyle: CSSProperties = {
  fontSize: 20,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
