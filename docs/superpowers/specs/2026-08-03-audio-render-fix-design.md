# 成品配音静音修复设计

## 目标

确保当前微信公众号视频工程的所有预览和正式渲染都会加载已经生成的
`public/assets/audio/voice.mp3`，不再因 Remotion 未转发普通系统环境变量而生成纯静音音轨。

## 根因

`src/demoData.ts` 使用 `process.env.FISH_AUDIO_ENABLED` 决定 `voiceAudio` 是否为空。
Remotion 4.0.484 从进程环境中只转发以 `REMOTION_` 开头的变量，因此现有渲染命令里的
`FISH_AUDIO_ENABLED=1` 不会进入浏览器 bundle。最终 `voiceAudio` 为空，成品 AAC 音轨的
所有采样均为 0。

## 设计

当前工程已经包含并要求使用固定的 Fish Audio 配音，因此将 `demoProject.voiceAudio`
直接设为 `assets/audio/voice.mp3`。渲染脚本不再负责控制配音开关，`ArticleVideo` 继续只根据
`voiceAudio` 属性加载音频。

不改动视觉场景、字幕时间、Fish TTS 客户端或文章数据，也不增加新的配置层。

## 验证

1. 添加回归测试，断言默认项目数据始终指向配音文件；先观察旧实现失败。
2. 运行 TypeScript 类型检查和现有单元测试。
3. 渲染 3 秒诊断视频，提取 AAC 为 PCM，断言存在非零采样。
4. 重新渲染 64 秒正式视频，检查视频流、音频流、时长，并再次断言音频采样非零。

## 成功标准

- 正式 MP4 包含 H.264 视频流与 AAC 双声道音频流。
- 解码后的正式音轨非零采样数大于 0，RMS 大于 0。
- 配音内容来自现有 AD 学姐 `voice.mp3`。
