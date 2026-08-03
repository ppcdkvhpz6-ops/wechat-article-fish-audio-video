# Audio Render Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every preview and final render of this project includes the existing AD 学姐 Fish Audio narration.

**Architecture:** The project already owns a fixed narration asset, so `demoProject` will reference it directly instead of deriving the path from an environment variable that Remotion filters. A Node regression test will assert the default composition data always contains that path, followed by decoded-PCM checks on short and full renders.

**Tech Stack:** TypeScript 5.8, Node.js 24 built-in test runner, Remotion 4.0.484, bundled FFmpeg/FFprobe.

## Global Constraints

- Keep the existing narration file at `public/assets/audio/voice.mp3`.
- Do not change scenes, captions, duration, Fish TTS generation, or article imagery.
- A successful final render must have H.264 video, AAC audio, and more than zero nonzero PCM samples.

---

### Task 1: Make narration part of the default composition data

**Files:**
- Create: `src/demoData.test.ts`
- Modify: `src/demoData.ts:7`
- Modify: `package.json:6-13`

**Interfaces:**
- Consumes: existing exported object `demoProject: ArticleVideoProps`.
- Produces: `demoProject.voiceAudio === "assets/audio/voice.mp3"` independently of process environment.

- [ ] **Step 1: Write the failing regression test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {demoProject} from "./demoData.ts";

test("default composition always includes the generated narration", () => {
  assert.equal(demoProject.voiceAudio, "assets/audio/voice.mp3");
});
```

Add `"test": "node --test src/demoData.test.ts"` to `package.json`.

- [ ] **Step 2: Run the test and verify the old implementation fails**

Run: `pnpm test`

Expected: FAIL because `demoProject.voiceAudio` is an empty string when `FISH_AUDIO_ENABLED` is not forwarded.

- [ ] **Step 3: Implement the minimal fix**

Replace the conditional value in `src/demoData.ts` with:

```ts
voiceAudio: "assets/audio/voice.mp3",
```

- [ ] **Step 4: Run tests and type checking**

Run: `pnpm test`

Expected: one passing Node test.

Run: `python3 -m unittest scripts/test_fish_tts.py`

Expected: three passing Python tests.

Run: `pnpm run typecheck`

Expected: TypeScript exits with status 0.

- [ ] **Step 5: Commit the behavior change**

```bash
git add demo-wx-article/src/demoData.ts demo-wx-article/src/demoData.test.ts demo-wx-article/package.json
git commit -m "fix: always include article narration"
```

### Task 2: Verify rendered audio and regenerate the deliverable

**Files:**
- Create: `work/audio-fix-proof.mp4` (diagnostic only)
- Replace: `renders/demo.mp4`

**Interfaces:**
- Consumes: Remotion composition `ArticleVideo` and `assets/audio/voice.mp3`.
- Produces: a 64-second MP4 with H.264 video and non-silent AAC audio.

- [ ] **Step 1: Render a three-second proof without audio environment variables**

Run:

```bash
pnpm exec remotion render src/index.ts ArticleVideo work/audio-fix-proof.mp4 --frames=0-89 --overwrite
```

Expected: render exits with status 0.

- [ ] **Step 2: Decode the proof audio and verify nonzero PCM samples**

Use the bundled Remotion FFmpeg to decode the first audio stream to PCM WAV, then count nonzero signed 16-bit samples.

Expected: `nonzero_samples > 0`, `RMS > 0`.

- [ ] **Step 3: Render the complete 1080p deliverable**

Run: `pnpm run render`

Expected: `renders/demo.mp4` is produced successfully.

- [ ] **Step 4: Verify final streams and decoded waveform**

Use bundled FFprobe to confirm one H.264 video stream and one AAC audio stream. Decode the final audio to PCM and calculate total samples, nonzero samples, RMS, and peak.

Expected: H.264 1920×1080 at 30 fps; AAC stereo at 48 kHz; `nonzero_samples > 0`; `RMS > 0`.

- [ ] **Step 5: Open the verified final MP4**

Open `renders/demo.mp4` in the Codex file viewer and provide the user with a clickable absolute path.
