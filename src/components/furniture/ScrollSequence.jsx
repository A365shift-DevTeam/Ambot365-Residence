import React, { useRef, useEffect, useState, useCallback } from 'react';

const TOTAL_FRAMES = 240;
const FRAME_BASE = '/furniture/frames/ezgif-frame-';

// Zoom factor for full-screen immersive hero (higher = more zoomed into the furniture)
const HERO_ZOOM = 1.42;

function getFrameSrc(index) {
  const num = String(index + 1).padStart(3, '0');
  return `${FRAME_BASE}${num}.webp`;
}

// Draws the frame zoomed + centered to fill the entire canvas (full-screen hero style)
function drawZoomedImage(ctx, img, canvasW, canvasH, zoom) {
  const srcW = img.naturalWidth / zoom;
  const srcH = img.naturalHeight / zoom;
  const srcX = (img.naturalWidth - srcW) / 2;
  const srcY = (img.naturalHeight - srcH) / 2;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(
    img,
    srcX, srcY, srcW, srcH,   // source rect (zoomed in)
    0, 0, canvasW, canvasH    // destination = full canvas
  );
}

export default function ScrollSequence({ onProgressChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    const imgs = new Array(TOTAL_FRAMES);
    let loaded = 0;

    const checkDone = () => {
      loadedCountRef.current = loaded;
      const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
      setLoadProgress(pct);
      if (loaded === TOTAL_FRAMES) {
        setReady(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameSrc(i);
      img.onload = () => {
        loaded++;
        checkDone();
      };
      img.onerror = () => {
        // Still count to avoid blocking forever
        loaded++;
        checkDone();
      };
      imgs[i] = img;
    }

    imagesRef.current = imgs;

    // Draw first frame as soon as it is ready (inline to avoid closure issues)
    const first = imgs[0];
    if (first) {
      const tryDrawFirst = () => {
        const canvas = canvasRef.current;
        if (!canvas || !first.complete || !first.naturalWidth) {
          setTimeout(tryDrawFirst, 60);
          return;
        }
        // Use native image resolution internally (high quality)
        canvas.width = first.naturalWidth;
        canvas.height = first.naturalHeight;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) {
          drawZoomedImage(ctx, first, canvas.width, canvas.height, HERO_ZOOM);
        }
      };
      tryDrawFirst();
    }

    return () => {
      imgs.forEach(img => { img.onload = null; img.onerror = null; });
    };
  }, []);

  const drawFrame = useCallback((frameIndex, imgsOverride) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgs = imgsOverride || imagesRef.current;
    if (!imgs || imgs.length === 0) return;

    let idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(frameIndex)));
    let img = imgs[idx];

    // Find nearest loaded frame if exact not ready yet
    if (!img || !img.complete || !img.naturalWidth) {
      let found = false;
      for (let offset = 0; offset < TOTAL_FRAMES; offset++) {
        const tryIdx = (idx + offset) % TOTAL_FRAMES;
        const candidate = imgs[tryIdx];
        if (candidate && candidate.complete && candidate.naturalWidth) {
          idx = tryIdx;
          img = candidate;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Set canvas internal resolution to the image's native size (high quality)
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    // Full-screen zoomed draw (center-cropped + scaled to fill hero)
    drawZoomedImage(ctx, img, canvas.width, canvas.height, HERO_ZOOM);

    currentFrameRef.current = idx;

    if (onProgressChange) {
      onProgressChange(idx / (TOTAL_FRAMES - 1));
    }
  }, [onProgressChange]);

  // Scroll-driven frame update
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    let ticking = false;
    let lastFrame = -1;

    const updateFrame = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollHeight = scrollContainer.offsetHeight;

      // Progress only advances while the sticky area is in view
      const startOffset = viewportHeight; // when top of container hits top of viewport
      const endOffset = scrollHeight;     // when bottom of container is at top of viewport

      let progress = 0;
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        // Inside the active scrub zone
        const scrolledPast = -rect.top;
        const totalScrubDistance = scrollHeight - viewportHeight;
        progress = totalScrubDistance > 0 ? Math.min(1, Math.max(0, scrolledPast / totalScrubDistance)) : 0;
      } else if (rect.top > 0) {
        progress = 0;
      } else {
        progress = 1;
      }

      const targetFrame = progress * (TOTAL_FRAMES - 1);

      // Only redraw if frame actually changed (saves perf)
      const newFrame = Math.floor(targetFrame);
      if (newFrame !== lastFrame) {
        lastFrame = newFrame;
        drawFrame(targetFrame);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateFrame);
      }
    };

    // Initial paint
    requestAnimationFrame(updateFrame);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [drawFrame]);

  // Also allow clicking / dragging on canvas to manually scrub (nice for demo)
  const handlePointerScrub = (e) => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const rect = scrollContainer.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const totalScrub = scrollContainer.offsetHeight - viewportH;

    // Map vertical pointer position inside the sticky viewport to progress
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / viewportH));

    const frame = progress * (TOTAL_FRAMES - 1);
    drawFrame(frame);

    // Optional: also scroll the page to match (sync)
    const targetScroll = scrollContainer.offsetTop + (progress * totalScrub);
    window.scrollTo({ top: targetScroll, behavior: 'auto' });
  };

  return (
    <div ref={containerRef} className="scroll-sequence" style={{ height: '260vh', position: 'relative' }}>
      {/* Sticky viewport layer - full screen hero like the reference */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: '#050505',
          overflow: 'hidden',
        }}
      >
        {/* Inner relative container - all hero layers live here (full bleed) */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Canvas - the 3D furniture frames, full-bleed + zoomed to fill the entire hero */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerScrub}
            onPointerMove={(e) => {
              if (e.buttons > 0) handlePointerScrub(e);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              background: '#0a0a0c',
              cursor: 'grab',
              touchAction: 'none',
              zIndex: 1,
            }}
          />

          {/* Very subtle full-bleed backdrop for depth */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.012) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Subtle vignette for premium photo-like treatment (text readability) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 38%, transparent 48%, rgba(5,5,5,0.28) 76%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Loading indicator (only while preloading) */}
          {!ready && loadProgress < 100 && (
            <div style={{
              position: 'absolute',
              bottom: '9%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              letterSpacing: '3.5px',
              color: 'rgba(255,255,255,0.5)',
              background: 'rgba(0,0,0,0.45)',
              padding: '5px 16px',
              borderRadius: 999,
              backdropFilter: 'blur(8px)',
              zIndex: 11,
            }}>
              LOADING FRAMES • {loadProgress}%
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
