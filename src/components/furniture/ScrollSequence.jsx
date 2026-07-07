import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TOTAL_FRAMES, getFrameSrcByIndex } from '../../utils/frames';

export default function ScrollSequence({ onProgressChange, children }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const stickyWrapperRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imgAspect, setImgAspect] = useState(1.6); // Default fallback 16:10
  const [mobileScrollTrack, setMobileScrollTrack] = useState(0);

  useEffect(() => {
    if (isMobile && stickyWrapperRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setMobileScrollTrack(entry.contentRect.height);
        }
      });
      observer.observe(stickyWrapperRef.current);
      return () => observer.disconnect();
    }
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      img.src = getFrameSrcByIndex(i);
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

    // Draw first frame as soon as it is ready
    const first = imgs[0];
    if (first) {
      const tryDrawFirst = () => {
        const canvas = canvasRef.current;
        if (!canvas || !first.complete || !first.naturalWidth) {
          setTimeout(tryDrawFirst, 60);
          return;
        }
        
        // Calculate aspect ratio dynamically
        setImgAspect(first.naturalWidth / first.naturalHeight);
        
        // Use native image resolution internally (high quality)
        canvas.width = first.naturalWidth;
        canvas.height = first.naturalHeight;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(first, 0, 0);
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

    // Direct draw, full-frame layout handled by object-fit CSS now
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

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
      
      let progress = 0;

      if (isMobile) {
        // Mobile Animation Logic: animate exactly over the 300vh scroll track
        const scrollDistance = viewportHeight * 3; // 300vh
        const scrolledPast = -rect.top;
        if (scrolledPast < 0) {
          progress = 0;
        } else if (scrolledPast > scrollDistance) {
          progress = 1;
        } else {
          progress = scrolledPast / scrollDistance;
        }
      } else {
        // Desktop Animation Logic: animate over the height of the container minus the sticky element
        const stickyWrapperHeight = stickyWrapperRef.current ? stickyWrapperRef.current.clientHeight : viewportHeight;
        const scrollDistance = rect.height - stickyWrapperHeight;
        const scrolledPast = -rect.top;
        if (scrolledPast < 0) {
          progress = 0;
        } else if (scrollDistance > 0) {
          progress = Math.min(1, Math.max(0, scrolledPast / scrollDistance));
        } else {
          progress = 1;
        }
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
  }, [drawFrame, isMobile]);

  // Also allow clicking / dragging on canvas to manually scrub (nice for demo)
  const handlePointerScrub = (e) => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const rect = scrollContainer.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / viewportH));

    const frame = progress * (TOTAL_FRAMES - 1);
    drawFrame(frame);

    // Optional: also scroll the page to match (sync)
    const totalScrub = scrollContainer.offsetHeight - viewportH;
    const targetScroll = scrollContainer.offsetTop + (progress * totalScrub);
    window.scrollTo({ top: targetScroll, behavior: 'auto' });
  };

  return (
    <>
      <div 
        ref={containerRef} 
        className="scroll-sequence" 
        style={{ 
          height: isMobile ? `calc(300vh + ${mobileScrollTrack}px)` : '240vh', 
          position: 'relative' 
        }}
      >
        <div
          ref={stickyWrapperRef}
          style={{
            position: 'sticky',
            top: 0,
            height: isMobile ? 'max-content' : '100dvh',
            background: '#050505',
            overflow: isMobile ? 'visible' : 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Canvas Wrapper */}
          <div style={{ 
            position: isMobile ? 'relative' : 'absolute', 
            width: '100%', 
            height: isMobile ? `calc(100vw / ${imgAspect})` : '100%', 
            inset: isMobile ? 'auto' : 0 
          }}>
            {/* Canvas - the 3D furniture frames */}
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
                objectFit: 'cover' // ensures full bleed on desktop, perfectly contained on mobile matching aspect
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

          {/* Mobile: Next Section is rendered inside sticky wrapper directly below canvas */}
          {isMobile && children}

        </div>
      </div>

      {/* Desktop: Next Section is placed normally outside and after the 240vh Hero section */}
      {!isMobile && children}
    </>
  );
}
