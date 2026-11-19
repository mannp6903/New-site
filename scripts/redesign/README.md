# Redesign media scripts

- `record-reel.cjs <out-dir>`: records the studio reel from a running local build (`http://127.0.0.1:4321`).
- Encode (from the recorded `.webm`):

```bash
ffmpeg -ss 0.7 -to 24.4 -i raw.webm -an -vf "setpts=PTS/1.2,fps=30,scale=1280:800:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart public/media/studio-reel.mp4
ffmpeg -ss 0.7 -to 24.4 -i raw.webm -an -vf "setpts=PTS/1.2,fps=30,scale=1280:800:flags=lanczos" \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 public/media/studio-reel.webm
ffmpeg -ss 2.6 -i raw.webm -frames:v 1 -vf scale=1280:800 poster.png   # then save as JPEG q78
```

- `make-display-font.py`: rebuilds Mann Display (see its docstring for the licence note).
