#!/usr/bin/env python3
"""Generate one Fish Audio MP3 per narration paragraph and build a measured timeline."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import tempfile
from pathlib import Path
from urllib.request import Request, urlopen


API_URL = "https://api.fish.audio/v1/tts"
MODEL = "s2.1-pro-free"
VOICE_ID = "c7cbda1c101c4ce8906c046f01eca1a2"


def audio_duration(path: Path) -> float:
    result = subprocess.run(
        ["afinfo", str(path)], capture_output=True, text=True, check=True
    )
    for line in result.stdout.splitlines():
        if "estimated duration" in line:
            return float(line.split(":", 1)[1].split(" sec", 1)[0].strip())
    raise RuntimeError(f"Could not read duration from {path}")


def synthesize(text: str, api_key: str, output: Path) -> None:
    request = Request(
        API_URL,
        data=json.dumps(
            {"text": text, "reference_id": VOICE_ID, "format": "mp3"}
        ).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "model": MODEL,
        },
        method="POST",
    )
    with urlopen(request, timeout=120) as response:
        body = response.read()
        content_type = response.headers.get("Content-Type", "")
        if not body or not content_type.lower().startswith("audio/"):
            raise RuntimeError(f"Fish Audio returned invalid audio for segment: {text[:24]}")
    output.write_bytes(body)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text-file", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--timing", type=Path, required=True)
    args = parser.parse_args()
    api_key = os.environ.get("FISH_API_KEY", "")
    if not api_key:
        raise SystemExit("FISH_API_KEY is required")

    paragraphs = [
        part.strip()
        for part in args.text_file.read_text(encoding="utf-8").split("\n\n")
        if part.strip()
    ]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.timing.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="fish-segments-") as temp_dir:
        parts: list[bytes] = []
        timings: list[dict[str, object]] = []
        elapsed = 0.0
        for index, paragraph in enumerate(paragraphs, start=1):
            part_path = Path(temp_dir) / f"{index:02d}.mp3"
            print(f"Generating segment {index}/{len(paragraphs)}", flush=True)
            synthesize(paragraph, api_key, part_path)
            duration = audio_duration(part_path)
            timings.append(
                {
                    "segment": index,
                    "text": paragraph,
                    "sourceStart": round(elapsed, 3),
                    "sourceEnd": round(elapsed + duration, 3),
                    "duration": round(duration, 3),
                }
            )
            elapsed += duration
            parts.append(part_path.read_bytes())
        args.output.write_bytes(b"".join(parts))
        args.timing.write_text(
            json.dumps(
                {"sourceDuration": round(elapsed, 3), "segments": timings},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
    print(f"Generated {len(paragraphs)} segments, {elapsed:.3f}s total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
