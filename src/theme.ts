import {staticFile} from "remotion";
import {figmaTokens} from "./figmaDesignTokens";

const fontFiles = [
  {family: "Noto Sans SC", file: "assets/fonts/NotoSansSC-300.ttf", weight: "300"},
  {family: "Noto Sans SC", file: "assets/fonts/NotoSansSC-400.ttf", weight: "400"},
  {family: "Noto Sans SC", file: "assets/fonts/NotoSansSC-500.ttf", weight: "500"},
  {family: "Noto Sans SC", file: "assets/fonts/NotoSansSC-700.ttf", weight: "700"},
  {family: "Noto Sans SC", file: "assets/fonts/NotoSansSC-900.ttf", weight: "900"},
  {family: "Space Grotesk", file: "assets/fonts/SpaceGrotesk-400.ttf", weight: "400"},
  {family: "Space Grotesk", file: "assets/fonts/SpaceGrotesk-700.ttf", weight: "700"},
] as const;

if (typeof document !== "undefined" && !document.getElementById("studio-font-faces")) {
  const style = document.createElement("style");
  style.id = "studio-font-faces";
  style.textContent = fontFiles
    .map(
      (font) => `@font-face {
  font-family: "${font.family}";
  src: url("${staticFile(font.file)}") format("truetype");
  font-weight: ${font.weight};
  font-style: normal;
  font-display: swap;
}`,
    )
    .join("\n");
  document.head.appendChild(style);
}

export const colors = {
  canvas: figmaTokens.canvas,
  ink: figmaTokens.ink,
  muted: figmaTokens.muted,
  weak: figmaTokens.weak,
  line: figmaTokens.line,
  lineStrong: figmaTokens.lineStrong,
  accent: figmaTokens.accent,
  topbar: figmaTokens.topbar,
  topbarTrack: figmaTokens.topbarTrack,
  topbarMuted: figmaTokens.topbarMuted,
  topbarSeparator: figmaTokens.topbarSeparator,
  gridLine: figmaTokens.gridLine,
  gridLineStrong: figmaTokens.gridLineStrong,
  gridWarm: figmaTokens.gridWarm,
  glass: figmaTokens.glass,
  white: figmaTokens.white,
};

export const fonts = {
  sans: figmaTokens.fontSans,
  mono: figmaTokens.fontMono,
};

export const layout = {
  width: figmaTokens.canvasWidth,
  height: figmaTokens.canvasHeight,
  fps: 30,
  voicePlaybackRate: 1.25,
  backgroundVariant: "paper" as "grid" | "paper" | "blueprint",
  topbarHeight: figmaTokens.topbarHeight,
  // 没 PIP，bottom 可以压得更低，主舞台让给图片
  safeTop: figmaTokens.safeTop,
  safeX: figmaTokens.safeX,
  safeBottom: figmaTokens.safeBottom,
  captionBottom: figmaTokens.captionBottom,
};
