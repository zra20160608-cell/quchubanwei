---
name: remotion
description: Programmatic video creation with React and Remotion. Use when: (1) Creating or editing Remotion video projects, (2) Generating videos from React components, (3) Rendering/exporting video files, (4) Setting up Remotion compositions and sequences, (5) Adding animations, text, images, or effects to videos programmatically, (6) Previewing or deploying Remotion projects.
---

# Remotion

Programmatic video creation using React components.

## Prerequisites

- Node.js 16+ with npm/yarn/pnpm
- Remotion CLI (`npm install -g remotion` or use `npx`)

## Quick Start

### Initialize a New Project

```bash
npx create-video@latest my-video
# or with specific template
npx create-video@latest my-video --template=hello-world
```

Templates available via `npx create-video@latest --help`.

### Project Structure

```
my-video/
├── src/
│   ├── Root.tsx          # Register compositions here
│   ├── Video.tsx         # Main video component
│   └── MyComp.tsx        # Individual scenes
├── public/               # Static assets (images, audio, fonts)
├── remotion.config.ts    # Render config (output, concurrency, etc.)
└── package.json
```

### Key Concepts

- **Composition**: A video configuration (duration, fps, dimensions) registered in `Root.tsx`
- **Sequence**: Time-segmented component for scenes (`<Sequence from={0} durationInFrames={90} />`)
- **Frame**: Single image at a point in time. At 30fps, 900 frames = 30 seconds
- **Interpolate**: Animate values over time using `interpolate()` from `remotion`

### Render Video

```bash
# Preview in browser (hot reload)
npx remotion studio

# Render to file
npx remotion render src/Root.tsx MyComposition out.mp4

# Render specific frame range
npx remotion render src/Root.tsx MyComposition out.mp4 --frames=0-300
```

## Workflows

### 1. Create a New Video Component

Create `.tsx` file in `src/`, import Remotion hooks:

```tsx
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const MyScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0, 1, 2, ... up to durationInFrames

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <div style={{ opacity }}>
        Hello World
      </div>
    </AbsoluteFill>
  );
};
```

### 2. Register in Root.tsx

```tsx
import { Composition } from 'remotion';
import { MyScene } from './MyScene';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MyScene"
      component={MyScene}
      durationInFrames={300}  // 10 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
```

### 3. Add Static Assets

Place images/audio/fonts in `public/` folder, reference with `staticFile()`:

```tsx
import { staticFile, Img, Audio } from 'remotion';

<Img src={staticFile('logo.png')} />
<Audio src={staticFile('bgm.mp3')} />
```

### 4. Render the Final Video

```bash
# MP4 (default)
npx remotion render src/Root.tsx MyScene output.mp4

# WebM
npx remotion render src/Root.tsx MyScene output.webm --codec=vp8

# GIF
npx remotion render src/Root.tsx MyScene output.gif

# Still image (specific frame)
npx remotion still src/Root.tsx MyScene output.png --frame=150
```

## Common Patterns

### Text Animation

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

const frame = useCurrentFrame();
const y = interpolate(frame, [0, 30], [100, 0], {
  extrapolateRight: 'clamp',
});
// Easing: add { easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
```

### Image with Fade

```tsx
const opacity = interpolate(frame, [0, 15], [0, 1]);
```

### Sequence (Scene Timeline)

```tsx
import { Sequence } from 'remotion';

<Sequence from={0} durationInFrames={90}>
  <Intro />
</Sequence>
<Sequence from={90} durationInFrames={180}>
  <MainContent />
</Sequence>
<Sequence from={270} durationInFrames={60}>
  <Outro />
</Sequence>
```

### Spring Physics

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const { fps } = useVideoConfig();
const scale = spring({
  frame,
  fps,
  config: { damping: 10, stiffness: 100 },
});
```

## Configuration

Edit `remotion.config.ts` for render defaults:

```ts
import { Config } from 'remotion';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);  // CPU cores to use
```

## Render Options

```bash
# Change quality (crf 0-51, lower = better)
npx remotion render ... --crf=18

# Change resolution (half quality for preview)
npx remotion render ... --scale=0.5

# Use GPU (if available)
npx remotion render ... --codec=h264 --hardware-acceleration=cuda

# Parallel renders
npx remotion render ... --concurrency=8
```

## Scripts

- `scripts/init-project.sh` — Bootstrap a new Remotion project with common setup
- `scripts/render.sh` — Render with sensible defaults

## References

- `references/api-patterns.md` — Common animation patterns and helpers
- `references/troubleshooting.md` — Common errors and fixes
