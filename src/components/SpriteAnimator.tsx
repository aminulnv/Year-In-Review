import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";


export type SpriteManifest = {
  slug: string;
  cell: string; // e.g. "128x128"
  cols: number;
  padding?: number; // optional gutter/padding in px between frames (and outer border)
  sequences: Record<string, number[]>;
};

export type SpriteAnimatorProps = {
  spriteSrc: string;
  manifest: SpriteManifest;
  sequence?: keyof SpriteManifest["sequences"] | string;
  loop?: boolean;
  className?: string;
  blendMode?: React.CSSProperties["mixBlendMode"];
  
  alt?: string; // used for role="img" aria-label
  fallbackSrc?: string; // static image for reduced motion or load failure
  onSequenceEnd?: () => void;
  // Sizing and layout
  size?: number; // desired rendered size in px (square). If provided, wrapper will be this size.
  paddingPx?: number; // gutter between frames and outer border (overrides manifest.padding)
  respectReducedMotion?: boolean; // when false, animations ignore prefers-reduced-motion
  // Optional timing overrides (ms). If not provided, sensible defaults are used.
  idleMsPerFrame?: number; // default 600ms per frame
  walkMsPerFrame?: number; // default 220ms per frame
  signatureTotalMs?: number; // default 1000ms total for sequence
  emoteTotalMs?: number; // default 700ms total for sequence
};

function parseCell(cell: string) {
  const [w, h] = cell.split("x").map((v) => parseInt(v, 10));
  return { w: isNaN(w) ? 128 : w, h: isNaN(h) ? 128 : h };
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  spriteSrc,
  manifest,
  sequence = "idle",
  loop = true,
  className,
  blendMode,
  alt,
  fallbackSrc,
  onSequenceEnd,
  size,
  paddingPx: paddingPxProp,
  respectReducedMotion = true,
  idleMsPerFrame = 600,
  walkMsPerFrame = 220,
  signatureTotalMs = 1000,
  emoteTotalMs = 700,
}) => {
  const reduce = respectReducedMotion ? prefersReducedMotion() : false;
  const { w: cellW, h: cellH } = parseCell(manifest.cell);
  const frames = useMemo(() => manifest.sequences[String(sequence)] ?? [], [manifest, sequence]);
  const totalFrames = frames.length || 1;
  const cols = manifest.cols || 8;
  const padding = useMemo(() => (paddingPxProp ?? manifest.padding ?? 0), [paddingPxProp, manifest]);

  // Timing: derive per-frame duration based on sequence type
  const perFrameMs = useMemo(() => {
    const seq = String(sequence).toLowerCase();
    if (seq.startsWith("walk")) return walkMsPerFrame;
    if (seq === "idle") return idleMsPerFrame;
    if (seq === "signature") return Math.max(100, Math.round(signatureTotalMs / Math.max(totalFrames, 1)));
    if (seq === "emote" || seq === "emotion") return Math.max(80, Math.round(emoteTotalMs / Math.max(totalFrames, 1)));
    // fallback
    return 200;
  }, [sequence, walkMsPerFrame, idleMsPerFrame, signatureTotalMs, emoteTotalMs, totalFrames]);

  // Wrapper sizing and scaling
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (size && cellW) {
      setScale(size / cellW);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const sx = rect.width / cellW;
      const sy = rect.height / cellH;
      setScale(Math.min(sx, sy));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cellW, cellH, size]);

  // Animation state
  const [frameIdx, setFrameIdx] = useState(0);
  

  // Reset frame on sequence change
  useEffect(() => {
    setFrameIdx(0);
  }, [sequence]);


  useEffect(() => {
    if (reduce) return; // show static
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;

      if (acc >= perFrameMs) {
        acc = 0;
        setFrameIdx((prev) => {
          const next = prev + 1;
          if (next >= totalFrames) {
            if (loop) return 0;
            // stop at last frame and signal end
            onSequenceEnd?.();
            return totalFrames - 1;
          }
          return next;
        });
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [perFrameMs, totalFrames, loop, onSequenceEnd, reduce]);

  // Compute background position for current frame
  const { x, y } = useMemo(() => {
    const globalIndex = frames[frameIdx] ?? 0;
    const col = globalIndex % cols;
    const row = Math.floor(globalIndex / cols);
    const strideX = cellW + padding;
    const strideY = cellH + padding;
    // Assume equal outer padding on top/left equal to padding value
    return { x: -(col * strideX + padding), y: -(row * strideY + padding) };
  }, [frames, frameIdx, cols, cellW, cellH, padding]);

  if (reduce && fallbackSrc) {
    return (
      <div
        ref={wrapperRef}
        className={className}
        aria-label={alt}
        role="img"
        style={{ position: "relative", overflow: "visible", display: "inline-block" }}
      >
        <img
          src={fallbackSrc}
          alt={alt}
          loading="lazy"
          style={{
            width: `${cellW}px`,
            height: `${cellH}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            imageRendering: "pixelated",
            mixBlendMode: blendMode,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      aria-label={alt}
      role="img"
      style={{ position: "relative", overflow: "visible", display: "inline-block" }}
    >
      {/* Inner frame area at native cell size, scaled to fit wrapper */}
      <div
        style={{
          width: `${cellW}px`,
          height: `${cellH}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          imageRendering: "pixelated",
          mixBlendMode: blendMode,
          backgroundImage: `url(${spriteSrc})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${x}px ${y}px`,
        }}
      />
    </div>
  );
};

export default SpriteAnimator;
