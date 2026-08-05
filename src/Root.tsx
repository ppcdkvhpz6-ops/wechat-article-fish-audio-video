import {Composition, Folder} from "remotion";
import {sunoProject as demoProject} from "./sunoData";
import {ArticleVideo, type ArticleVideoProps} from "./ArticleVideo";
import {layout} from "./theme";

const scaleSeconds = (seconds: number) => seconds / layout.voicePlaybackRate;

const scaledProject: ArticleVideoProps = {
  ...demoProject,
  durationSeconds: scaleSeconds(demoProject.durationSeconds),
  chapters: demoProject.chapters.map((chapter) => ({
    ...chapter,
    start: scaleSeconds(chapter.start),
  })),
  scenes: demoProject.scenes.map((scene) => ({
    ...scene,
    start: scaleSeconds(scene.start),
  })),
  captions: demoProject.captions.map((caption) => ({
    ...caption,
    start: scaleSeconds(caption.start),
    end: scaleSeconds(caption.end),
  })),
  takeaways: demoProject.takeaways?.map((takeaway) => ({
    ...takeaway,
    start: scaleSeconds(takeaway.start),
    end: scaleSeconds(takeaway.end),
  })),
  sfxCues: demoProject.sfxCues?.map((cue) => ({
    ...cue,
    start: scaleSeconds(cue.start),
    duration: scaleSeconds(cue.duration),
  })),
};

export const RemotionRoot = () => {
  return (
    <Folder name="WechatArticle">
      <Composition
        id="ArticleVideo"
        component={ArticleVideo}
        durationInFrames={Math.round(scaledProject.durationSeconds * scaledProject.fps)}
        fps={demoProject.fps}
        width={layout.width}
        height={layout.height}
        defaultProps={scaledProject satisfies ArticleVideoProps}
      />
    </Folder>
  );
};
