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

This order is mandatory for every new project. A project is not ready to render unless it has: a generated 3:4 cover, an approved fact brief, measured narration timing, and a scene-to-fact mapping. Do not skip the image-generation or fact-extraction gate because the article appears short.

### Fact Brief Gate

Before writing the voice script, extract a fact brief from the source article. For every material claim, record:

- **Actor**: who or which company, team, product, institution, or researcher is involved.
- **Action**: what they launched, built, changed, measured, acquired, announced, or decided.
- **Object/context**: what the action concerns and where or when it happened.
- **Result/evidence**: the concrete outcome, metric, quote, date, price, user count, or other support.

The final narration must contain the key actor-action pairs, not only an abstract interpretation. Every statistic, named entity, and concrete example shown in a visual must map to a source paragraph and a measured audio segment. If the article does not support a detail, omit it or label it as analysis; never invent a company action, number, or causal explanation.

For paragraph-driven videos, split the narration into its actual natural paragraphs after TTS is approved. Give each paragraph one page segment, one scene start/end interval, and one matching caption window. Calculate paragraph intervals from measured audio duration and paragraph character lengths; do not use a small set of manually guessed global timestamps to cover many unrelated paragraphs. Keep captions concise enough for the lower band while preserving the paragraph's meaning.

### Low-Density Scene Rule

Before rendering, review every page's upper content region for visual density. A page with only a heading, one short line, or a large unused area must receive a content-matched visual treatment before export. Choose the treatment from the narration: a statistic or metric block for numbers, a keyword/process card for an abstract argument, a comparison diagram for two forces, or a local article/product/scene image when the narration names a concrete object. Do not fill empty space with unrelated stock images or duplicate the lower caption.

The visual treatment is part of the workflow: paragraph text -> measured audio segment -> matching visual view -> isolated caption band. Reuse the same page-level visual grammar across scenes, but let the visual content change with the paragraph. Remove decorative numeric badges such as `01/02/03` when they do not carry meaning.

For abstract or low-density paragraphs, choose the visual mode from the content instead of applying one fixed layout:

- `three-box`: three independent concepts or takeaways, one keyword and one short explanation per box.
- `table`: two or more comparable metrics, attributes, costs, or outcomes.
- `process`: ordered actions, steps, or a user journey.
- `key-figure`: one dominant number or a single conclusion.
- `image-evidence`: a concrete product, interface, screenshot, person, or place named by the narration.
- `compare`: two opposing forces, before/after states, or process versus result.
- `closing`: a final judgment or principle.

Use a relationship diagram only when the narration describes an actual sequence or dependency. Do not fill the page with one oversized card or an unrelated generated image. Store the decision as `visualMode` in scene data and route it to the matching Figma-derived Remotion template.

### Batch Visual Audit For Cards

Before export, scan every `list` scene with `three-box` or `process` visual mode card by card. If a card has a concrete concept named by the narration and its upper area would otherwise be mostly blank, generate one matching concept bitmap and attach it to that card through `visualCards[].imageSrc`. Generate images in a batch for the full audit, but keep one prompt and one asset per distinct card concept; do not reuse a generic image across unrelated cards. The generated image must contain no text, numbers, logo, watermark, or invented evidence. Keep the card keyword and detail as editable Remotion text, and keep the lower caption separate. Table and key-figure scenes should use semantic layouts unless an image is specifically needed to explain a named object.

### Designer-Driven Composition

Do not make every card in a row identical. For `process` and `three-box` scenes, establish a shared baseline but vary one or two deliberate properties: image height, crop, vertical offset, card width, or amount of negative space. Use asymmetry to express hierarchy, not decoration: the most important step can be larger, the supporting step can recede, and connectors should be quiet rules or nodes rather than repeated arrow glyphs. Keep one visual family, one accent color, and a stable reading direction. Avoid dashboard-like equal boxes, repeated UI borders, centered icon grids, and generic stock composition. A designer pass must ask: what is the dominant image, where does the eye move next, and which card should be visually quieter?

### Visual Copy De-duplication

### Image Generation Policy

Every article video must have one article-specific generated cover image. Generate it with the configured `generate_image` MCP before the Remotion render, using a prompt derived from the article argument and the selected Swiss Signal visual system. The generated cover must be a clean bitmap without readable text, page numbers, logos, watermark, fake UI copy, or embedded title; Remotion owns all typography and metadata. Keep generous negative space and a subject that remains legible at 3:4.

The generated cover uses a direct full-frame `3:4` image presentation in the first scene. Do not route it through the source-evidence card or screenshot window, and do not add insight cards underneath it unless the cover genuinely needs one concise fact anchor. Keep one title element over the image; hide the normal lower takeaway band on this opening scene.

For middle scenes, use this priority order:

1. Reuse a relevant screenshot or image captured from the source article when the narration refers to a real product, interface, person, place, or chart.
2. Use a semantic Figma-derived layout when the narration is abstract but the content can be represented by a comparison, table, process, key figure, or three concise anchors.
3. Call `generate_image` only when the segment has a concrete visual concept that is missing from the source material and the semantic layout would leave the content region materially empty. Mark the scene `imageRole: "generated-concept"`; keep the prompt free of copy and let Remotion render the matching keywords, figures, and captions separately.

Generated images are supplements, not evidence. Never use one to invent an article fact, replace a source screenshot, or repeat the lower caption. Persist project-bound results under `public/assets/article-images/<article-slug>/`, record the prompt and provenance in the source notes, and inspect each generated bitmap before wiring it into a scene. Source screenshots use `imageRole: "source-screenshot"`.

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

- Choose one style family for the entire project before scene generation. The default is **Swiss Signal**: off-white, black, dark gray, and one royal-blue accent. Do not alternate Warm Editorial and Swiss Signal within one video.
- Warm Editorial may remain in the Figma library as an optional reference, but it must not be mixed into a Swiss Signal project.

Reusable scene components:

- `Navigator / 4-Step` and `Navigator / 6-Step`
- `Highlight / Takeaway`
- `Image Placeholder / 3:4`
- `Key Figure`, `Three Bullet Points`, `Comparison Split`, `Timeline`, `Three Steps`, `2x2 Matrix`, `KPI`, `Sources`, `Checklist`, `Chapter Opener`, `Single Image`, and `Closing`

Scene routing:

- All scene roles -> the selected project style family (default: Swiss Signal)

Chinese variants use Noto Sans SC. Keep all Navigator, Takeaway, image placeholder, and letter-reserve layers editable. The Figma library is a reusable design source; do not turn placeholder text into final narration without a scene-specific content pass.

## Runtime Figma Sync

The runtime bridge lives in src/figmaTemplateRegistry.ts. Each scene may carry a template ID, and the registry maps that ID to the Figma file key, node ID, style family, ratio, reusable components, and supported runtime scene kinds. src/demoData.ts assigns a template ID to every demo scene, and SceneRenderer exposes the resolved template as data-figma-template and data-figma-style metadata.

This is a deliberate snapshot sync, not a live Figma API call during rendering. Remotion must remain renderable in CI and offline. When a Figma template changes, update the registry node ID or style mapping, then review the corresponding runtime renderer and run the normal verification workflow. Do not copy Figma placeholder copy into narration or captions without a content pass.

## Upgrade Rules

Template selection is semantic, not page-index based. Use templateRole values such as key-figure, three-bullets, process, kpi, sources, two-by-two, and closing. src/figmaTemplateRegistry.ts maps these roles to the reusable Figma nodes.

Runtime design tokens live in src/figmaDesignTokens.ts and are consumed by src/theme.ts. Keep the 3:4 Figma canvas at 900x1200 and the runtime canvas at 1080x1440; preserve the Navigator, Takeaway, and bottom letter-reserve zones.

When generating a new article, classify each paragraph by semantic intent first, then create its scene. Do not assign templates by array index. Keep audio timing as the source of truth, pass timed captions into CaptionLayer, and use templateRole only for visual routing. Figma remains a snapshot design source: node IDs and token mappings must be reviewed when the Figma file changes.

### Exported Template Assets

When a Figma template is available, inspect or export the actual 900x1200 frame through the authenticated Figma desktop session and store it under `public/assets/figma-templates/` as a design reference. Do not paint a complete exported PNG behind editable runtime content: that leaves placeholder numbers, labels, navigation, and takeaway copy underneath the new layers. Translate the Figma frame into Remotion tokens, geometry, and editable components, then render each visible text and image exactly once. Registry assets are evidence of the source design, not a second UI layer. Verify the first frame, one image-evidence scene, one key-figure scene, a chapter boundary, and the final frame visually.

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
