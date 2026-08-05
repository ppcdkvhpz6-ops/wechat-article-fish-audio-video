---
name: wechat-article-video-design
description: Design and maintain mobile-first WeChat article videos built with Remotion. Use when creating, revising, or reviewing this project's scenes, typography, chapter navigator, captions, timing, audio speed, backgrounds, or social-video export layout.
---

# WeChat Article Video Design

Use this skill for all visual and timing changes in the `wechat-article-fish-audio-video` Remotion project. Preserve the rules below unless the user explicitly requests a different format.

## Content Intake And Audio-First Workflow

When the user provides new article content, script, transcript, or source material, do not start video rendering immediately. Use this order:

1. Extract and rewrite the narration into a concise, standalone voice script.
2. Return:

- A concise summary of the argument and the main takeaway.
- A proposed chapter/scene outline.
- An estimated final duration in minutes and seconds.
- Any assumptions that affect duration, such as narration speed, pauses, image scenes, or missing source material.

Estimate duration from the narration text before generating audio. For the default 1.25x playback setting, use roughly `280-340` Chinese characters per final minute, then add `5-10%` for scene transitions and natural pauses. Report a range when the script is incomplete.

3. After the user confirms the outline and target duration, generate the Fish Audio narration first.
4. Inspect the actual MP3 duration with a media tool. Treat the generated audio, after the configured playback rate, as the source of truth. Derive the final composition duration, chapter starts, scene starts, caption windows, and timed SFX from that measured duration. Do not build or render a video timeline from the pre-TTS estimate alone.
5. Render and verify the video only after the audio and its timing have been accepted.

For paragraph-driven videos, split the narration into its actual natural paragraphs after TTS is approved. Give each paragraph one page segment, one scene start/end interval, and one matching caption window. Calculate paragraph intervals from measured audio duration and paragraph character lengths; do not use a small set of manually guessed global timestamps to cover many unrelated paragraphs. Keep captions concise enough for the lower band while preserving the paragraph's meaning.

### Low-Density Scene Rule

Before rendering, review every page's upper content region for visual density. A page with only a heading, one short line, or a large unused area must receive a content-matched visual treatment before export. Choose the treatment from the narration: a statistic or metric block for numbers, a keyword/process card for an abstract argument, a comparison diagram for two forces, or a local article/product/scene image when the narration names a concrete object. Do not fill empty space with unrelated stock images or duplicate the lower caption.

The visual treatment is part of the workflow: paragraph text -> measured audio segment -> matching visual view -> isolated caption band. Reuse the same page-level visual grammar across scenes, but let the visual content change with the paragraph. Remove decorative numeric badges such as `01/02/03` when they do not carry meaning.

### Visual Copy De-duplication

Before export, compare every visible text element within a page: eyebrow, heading, image annotations, card labels, support text, and caption. The same phrase must not appear twice in the upper visual region, and upper labels must not simply repeat the lower caption. Numeric indexes are layout metadata, not copy; render them as a dot, rule, or omit them. If a repeated phrase is necessary for context, keep it once in the strongest hierarchy position and replace the other instance with a nonverbal marker or a distinct supporting phrase.

When an image has intentional unused space, use that space for up to three concise, segment-matched fact anchors: keywords, named objects, or key numbers. These anchors should explain what the image proves, not transcribe the narration. Prefer `label + value` pairs and keep them visually separate from the caption band. Do not add an anchor when it would repeat the heading, caption, or text already printed inside the source image.

### Format Checks Before Export

Run a format pass on the first frame, chapter boundaries, and the final frame. The first frame must show the opening view rather than a transparent scene. The first navigator label must remain readable when the linear progress fill is still at `0%`. Keep the creator mark `小余学长 · vibeconsulting` in the upper-right content area, below the navigator and above the caption band, on every scene. Confirm that the mark never overlaps titles, images, or captions.

When tighter paragraph alignment is requested, synthesize each paragraph as a separate Fish Audio request, measure each returned MP3, then concatenate the segments and use those measured durations. Do not replace measured segment durations with character-count estimates after segmented TTS is available.

Maintain an explicit segment timing table with source-audio start/end seconds, final-playback start/end seconds, the spoken content focus, and the visual focus. Treat this table as the single review surface before rendering: verify that facts, numbers, images, page headings, captions, and narration all belong to the same segment. If a visual fact appears before the narration introduces it, move the visual to that segment rather than adjusting only the caption.

Unless the user explicitly asks for attribution, keep source-publication names, consulting-firm labels, article-origin labels, and image-credit text out of the video. Use neutral editorial labels instead.

## Core Format

- Default composition: `1080x1440`, 30 fps, 3:4 portrait.
- Treat the composition as two clearly separated regions: roughly 75% content and 25% captions, a 3:1 relationship.
- Keep scenes, images, titles, and data inside the upper content region. The caption band owns the lower region and must never be overlapped.
- Article images always use `object-fit: contain`; never crop source images.
- Use the existing local Noto Sans SC font files for Chinese text and Space Grotesk for compact numeric or mono labels. Register every available Noto Sans SC weight before rendering.

## Typography

- Use a deliberate hierarchy: 900/800 for cover and outro titles, 700 for key values and captions, 500 for labels and supporting text, 300/400 for secondary explanations.
- Mobile captions are primary information, not annotations: use a large bold face, generous line height, a constrained readable width, and automatic wrapping.
- Avoid negative letter spacing. Prefer fewer, larger text elements over dense paragraphs.
- Check long Chinese titles and metric values at the final 3:4 dimensions; no text may overflow its parent.

## Reusable 3:4 Figma Template System

Use the companion Figma template library for reusable 3:4 scene structures. The Figma source is 900x1200; the Remotion composition remains 1080x1440. Scale the geometry proportionally and preserve the project's runtime safe areas.

Every reusable scene follows this architecture:

1. **Navigator** at the top: a segmented progress bar with all chapter labels visible.
2. **Main content** in the upper region: key figure, bullets, process, comparison, image evidence, or framework.
3. **Quote / Takeaway** below the main content when a concise editorial conclusion is useful.
4. **Letter reserve** at the bottom: keep a quiet blank area for the chapter letter or sequence marker.

Style routing:

- **Warm Editorial**: use for chapter openers, voice, field notes, single-image observations, image-led scenes, and closing / next-step pages. Use warm paper, ink-black type, and brick-red accent.
- **Swiss Signal**: use for KPI conclusions, comparisons, timelines, process progress, sources / evidence, checklists, and framework pages. Use off-white, black, and one royal-blue accent.
- Keep one style family consistent across a sequence so the Navigator, Takeaway, caption band, and bottom reserve feel continuous.

Reusable scene components:

- `Navigator / 4-Step` and `Navigator / 6-Step`
- `Highlight / Takeaway`
- `Image Placeholder / 3:4`
- `Key Figure`, `Three Bullet Points`, `Comparison Split`, `Timeline`, `Three Steps`, `2x2 Matrix`, `KPI`, `Sources`, `Checklist`, `Chapter Opener`, `Single Image`, and `Closing`

Scene routing:

- Chapter opener -> Warm Editorial
- Single image observation -> Warm Editorial
- Before / after -> Warm Editorial for narrative contrast; Swiss Signal for measured comparison
- KPI conclusion -> Swiss Signal
- Process progress -> Swiss Signal
- Sources and evidence -> Swiss Signal
- Checklist review -> Swiss Signal
- Closing / Next Step -> Warm Editorial

Chinese variants use Noto Sans SC. Keep all Navigator, Takeaway, image placeholder, and letter-reserve layers editable. The Figma library is a reusable design source; do not turn placeholder text into final narration without a scene-specific content pass.

## Chapter Navigator

- Keep all chapter labels visible in a segmented top navigator, aligned to the left within each segment.
- Do not add numeric badges such as `01`, `02`, or `03` unless explicitly requested.
- Segment widths should follow chapter duration: each segment spans from its chapter start to the next chapter start.
- The black progress fill must start at `0%`, end at `100%`, and use linear frame progress based on the final composition duration. Do not use the eased `progress()` helper for this bar and do not retain legacy offsets such as `16 + 84 * progress`.
- Use a light gray track for the navigator, white text over the black filled portion, and muted dark text over the unfilled portion.
- The current segment is emphasized; reached segments remain readable and future segments are muted.
- Navigator contrast check: text must stay above the progress fill; use white text where the black fill is underneath and dark/muted text where the track is uncovered. Verify at frame 0, just after the first fill reaches the first label, at a chapter boundary, and at the final frame.

## Audio And Timeline

- Fish Audio narration uses `s2.1-pro-free`, MP3 output, and the configured `reference_id` from environment variables.
- Default narration playback rate is `1.25`.
- When changing playback rate, scale the composition duration, scene starts, chapter starts, caption starts/ends, and any timed SFX together. Never speed up audio alone while leaving captions on the old timeline.
- Validate the final duration from the exported composition, not from the source narration duration.

## Backgrounds

- Default background is the restrained `paper` variant: Kimi-like cool gray-blue `#F7F7F7` / `#F0F4F9`, subtle horizontal rule texture, and low-contrast grain.
- Keep the lower caption band pure white with a dark-gray (`#4A4F55`) top divider; the upper content area remains light gray/off-white.
- Use a three-zone portrait layout: approximately 67% content, 16% black text band, and 17% pure-white blank reserve. Move the full measured paragraph caption into the black band as large bold white text; do not show a `TAKEAWAY` label. Keep the bottom white zone empty for visual breathing room and future subtitle overlays.
- `grid` and `blueprint` remain supported alternatives through `layout.backgroundVariant`.
- Background motion and decoration must stay subordinate to the article content. Avoid heavy gradients, large decorative blobs, and high-contrast patterns behind captions.

## Verification Workflow

1. Run `pnpm run typecheck` and `pnpm test`.
2. Run `pnpm exec remotion compositions src/index.ts` and confirm `1080x1440` plus the expected duration.
3. Inspect the Studio preview at `http://localhost:3000/ArticleVideo`.
4. Check the top navigator at the beginning, a chapter boundary, and the end; verify linear progress and readable labels.
5. Check that the black text band switches on measured segment boundaries, contains the full paragraph caption once, and has no `TAKEAWAY` label.
6. Check that the bottom white reserve remains blank and that long text wraps inside the black band without touching the content region.
7. Review the segment timing table at every factual or visual transition, especially statistics, case images, and chapter boundaries.
