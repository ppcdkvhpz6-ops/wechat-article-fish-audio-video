import assert from "node:assert/strict";
import test from "node:test";

import {demoProject} from "../src/demoData.ts";

test("default composition always includes the generated narration", () => {
  assert.equal(demoProject.voiceAudio, "assets/audio/voice.mp3");
});
