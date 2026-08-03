#!/usr/bin/env python3
"""Generate MP3 voice audio with Fish Audio's REST API."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Sequence
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


API_URL = "https://api.fish.audio/v1/tts"
DEFAULT_MODEL = "s2.1-pro-free"
DEFAULT_VOICE_ID = "7f92f8afb8ec43bf81429cc1c9199cb1"


def build_request(text: str, api_key: str, voice_id: str) -> tuple[dict[str, str], dict[str, str]]:
    if not text.strip():
        raise ValueError("TTS text cannot be empty")
    if not api_key.strip():
        raise ValueError("FISH_API_KEY cannot be empty")
    if not voice_id.strip():
        raise ValueError("FISH_VOICE_ID cannot be empty")

    return (
        {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "model": DEFAULT_MODEL,
        },
        {"text": text, "reference_id": voice_id, "format": "mp3"},
    )


def validate_response(status_code: int, content_type: str, body: bytes) -> None:
    if not 200 <= status_code < 300:
        detail = body[:240].decode("utf-8", errors="replace").replace("\n", " ")
        raise RuntimeError(f"Fish Audio request failed ({status_code}): {detail}")
    if not body:
        raise RuntimeError("Fish Audio request returned an empty response")
    if content_type and not content_type.lower().startswith("audio/"):
        raise RuntimeError(f"Fish Audio returned unexpected content type: {content_type}")


def generate_audio(text: str, api_key: str, voice_id: str, output: Path) -> None:
    headers, payload = build_request(text, api_key, voice_id)
    request = Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlopen(request, timeout=120) as response:
            body = response.read()
            content_type = response.headers.get("Content-Type", "")
            validate_response(response.status, content_type, body)
    except HTTPError as error:
        body = error.read()
        detail = body[:240].decode("utf-8", errors="replace").replace("\n", " ")
        raise RuntimeError(f"Fish Audio request failed ({error.code}): {detail}") from error
    except URLError as error:
        raise RuntimeError(f"Fish Audio request could not connect: {error.reason}") from error

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(body)


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--text", help="Text to synthesize")
    source.add_argument("--text-file", type=Path, help="UTF-8 text file to synthesize")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/assets/audio/voice.mp3"),
        help="Output MP3 path (default: public/assets/audio/voice.mp3)",
    )
    parser.add_argument(
        "--voice-id",
        default=os.environ.get("FISH_VOICE_ID", DEFAULT_VOICE_ID),
        help="Fish Audio reference_id (default: AD 学姐)",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    api_key = os.environ.get("FISH_API_KEY", "")
    if not api_key:
        raise SystemExit("FISH_API_KEY is required; export it before running this command")

    text = args.text
    if args.text_file:
        text = args.text_file.read_text(encoding="utf-8")
    assert text is not None

    generate_audio(text, api_key, args.voice_id, args.output)
    print(f"Generated Fish Audio MP3: {args.output}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, OSError, ValueError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error
