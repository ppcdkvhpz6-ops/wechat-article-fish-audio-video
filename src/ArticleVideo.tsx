import type {CSSProperties} from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {colors, fonts, layout} from "./theme";
import {frameFromSeconds} from "./shared";
import {PremiumGridBackground} from "./background";
import {
  type ArticleScene,
  type ArticleVideoProps,
  CaptionLayer,
  SceneRenderer,
  TakeawayLayer,
  TopBar,
} from "./sceneTypes";

// 转发导出，外部 import 仍走 "./ArticleVideo"
export type {ArticleScene, ArticleVideoProps};

export const ArticleVideo = ({
  durationSeconds,
  voiceAudio,
  chapters,
  scenes,
  captions,
  takeaways = [],
  sfxCues = [],
}: ArticleVideoProps) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const transitionFrames = Math.round(0.42 * fps);

  return (
    <AbsoluteFill style={stageStyle}>
      <PremiumGridBackground />
      {/* Fish Audio's free API output is intentionally conservative in level. */}
      {voiceAudio ? (
        <Audio
          src={staticFile(voiceAudio)}
          volume={2.8}
          playbackRate={layout.voicePlaybackRate}
        />
      ) : null}
      {sfxCues.map((cue) => (
        <Sequence
          key={cue.id}
          from={frameFromSeconds(cue.start, fps)}
          durationInFrames={Math.max(1, frameFromSeconds(cue.duration, fps))}
          premountFor={fps}
        >
          <Audio src={staticFile(cue.file)} volume={cue.volume} />
        </Sequence>
      ))}
      {scenes.map((scene, index) => {
        const nextStart = scenes[index + 1]?.start ?? durationSeconds;
        const sceneStart = frameFromSeconds(scene.start, fps);
        const baseDuration = frameFromSeconds(nextStart - scene.start, fps);
        const isLast = index === scenes.length - 1;
        // Include the composition's final frame in the last scene. Without the
        // extra frame, the final still falls just outside the last Sequence.
        const durationInFrames = Math.max(1, baseDuration + (isLast ? 1 : transitionFrames));
        return (
          <Sequence
            key={`${scene.kind}-${scene.start}`}
            from={sceneStart}
            durationInFrames={durationInFrames}
            premountFor={fps}
          >
            <SceneRenderer
              scene={scene}
              durationInFrames={durationInFrames}
              isLast={isLast}
            />
          </Sequence>
        );
      })}
      <TopBar chapters={chapters} durationSeconds={durationSeconds} />
      <TakeawayLayer takeaways={takeaways.slice(1)} />
      <CaptionLayer captions={[]} showBand={frameFromSeconds(scenes[1]?.start ?? 0, fps) <= frame} />
      <BrandMark />
    </AbsoluteFill>
  );
};

// === 底部右下角品牌小标（轻量、不抢戏） ==================

const BrandMark = () => {
  return (
    <div style={brandMarkStyle}>
      <span style={brandRuleStyle} />
      <span>小余学长 · vibeconsulting</span>
    </div>
  );
};

const stageStyle: CSSProperties = {
  backgroundColor: colors.canvas,
  color: colors.ink,
  fontFamily: fonts.sans,
  overflow: "hidden",
};

const brandMarkStyle: CSSProperties = {
  position: "absolute",
  right: 36,
  top: 122,
  zIndex: 80,
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: colors.muted,
  fontFamily: fonts.mono,
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: 0,
};

const brandRuleStyle: CSSProperties = {
  width: 28,
  height: 1,
  backgroundColor: colors.lineStrong,
};
