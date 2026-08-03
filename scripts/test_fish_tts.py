import os
import unittest
from unittest.mock import patch

from scripts.fish_tts import DEFAULT_VOICE_ID, build_request, main, validate_response


class FishTtsTests(unittest.TestCase):
    def test_build_request_uses_fish_audio_defaults(self):
        headers, payload = build_request("你好", "secret", DEFAULT_VOICE_ID)

        self.assertEqual(headers["Authorization"], "Bearer secret")
        self.assertEqual(headers["model"], "s2.1-pro-free")
        self.assertEqual(
            payload,
            {"text": "你好", "reference_id": DEFAULT_VOICE_ID, "format": "mp3"},
        )

    def test_validate_response_rejects_non_success(self):
        with self.assertRaisesRegex(RuntimeError, "Fish Audio request failed"):
            validate_response(401, "application/json", b'{"message":"bad key"}')

    def test_cli_requires_fish_api_key(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(SystemExit, "FISH_API_KEY"):
                main(["--text", "你好"])


if __name__ == "__main__":
    unittest.main()
