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
  const [imgAspect, setImgAspect] = useState(1.6);
  const [mobileScrollTrack, setMobileScrollTrack] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && stickyWrapperRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setMobileScrollTrack(entry.contentRect.height);
        }
      });
      observer.observe(stickyWrapperRef.current);
      return () => observer.disconnect();
    }
  }, [isMobile]);

  const drawFrame = useCallback((frameIndexValue, imgsOverride) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgs = imgsOverride || imagesRef.current;
    if (!imgs || imgs.length === 0) return;

    let idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(frameIndexValue)));
    let img = imgs[idx];

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

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.drawImage(img, 0, 0);
    currentFrameRef.current = idx;

    const nextProgress = idx / (TOTAL_FRAMES - 1);
    setProgress(nextProgress);
    if (onProgressChange) {
      onProgressChange(nextProgress);
    }
  }, [onProgressChange]);

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

    const drawFirstFrame = (firstImg) => {
      const canvas = canvasRef.current;
      if (!canvas || !firstImg.naturalWidth) return;
      setImgAspect(firstImg.naturalWidth / firstImg.naturalHeight);
      canvas.width = firstImg.naturalWidth;
      canvas.height = firstImg.naturalHeight;
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      if (ctx) {
        ctx.drawImage(firstImg, 0, 0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = i < 8 ? 'high' : 'low';
      img.src = getFrameSrcByIndex(i);
      img.onload = () => {
        loaded++;
        if (i === 0) drawFirstFrame(img);
        checkDone();
      };
      img.onerror = () => {
        loaded++;
        checkDone();
      };
      imgs[i] = img;
    }

    imagesRef.current = imgs;

    return () => {
      imgs.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, []);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    let ticking = false;
    let lastFrame = -1;

    const updateFrame = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      let next = 0;

      if (isMobile) {
        const scrollDistance = viewportHeight * 3;
        const scrolledPast = -rect.top;
        if (scrolledPast < 0) next = 0;
        else if (scrolledPast > scrollDistance) next = 1;
        else next = scrolledPast / scrollDistance;
      } else {
        const stickyWrapperHeight = stickyWrapperRef.current
          ? stickyWrapperRef.current.clientHeight
          : viewportHeight;
        const scrollDistance = rect.height - stickyWrapperHeight;
        const scrolledPast = -rect.top;
        if (scrolledPast < 0) next = 0;
        else if (scrollDistance > 0) next = Math.min(1, Math.max(0, scrolledPast / scrollDistance));
        else next = 1;
      }

      const targetFrame = next * (TOTAL_FRAMES - 1);
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

    requestAnimationFrame(updateFrame);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [drawFrame, isMobile]);

  const handlePointerScrub = (e) => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const rect = scrollContainer.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const y = e.clientY - rect.top;
    const scrubProgress = Math.max(0, Math.min(1, y / viewportH));
    const frame = scrubProgress * (TOTAL_FRAMES - 1);
    drawFrame(frame);

    const totalScrub = scrollContainer.offsetHeight - viewportH;
    const targetScroll = scrollContainer.offsetTop + scrubProgress * totalScrub;
    window.scrollTo({ top: targetScroll, behavior: 'auto' });
  };

  const veilOpacity = Math.max(0.35, 1 - progress * 0.55);

  return (
    <>
      <div
        ref={containerRef}
        className="scroll-sequence"
        style={{
          height: isMobile ? `calc(300vh + ${mobileScrollTrack}px)` : '240vh',
        }}
      >
        <div
          ref={stickyWrapperRef}
          className="scroll-sticky"
          style={{
            height: isMobile ? 'max-content' : '100dvh',
            overflow: isMobile ? 'visible' : 'hidden',
          }}
        >
          <div
            className="canvas-stage"
            style={{
              position: isMobile ? 'relative' : 'absolute',
              height: isMobile ? `calc(100vw / ${imgAspect})` : '100%',
              inset: isMobile ? 'auto' : 0,
            }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerScrub}
              onPointerMove={(e) => {
                if (e.buttons > 0) handlePointerScrub(e);
              }}
              aria-label="Interactive residence walkthrough — scroll or drag to explore frames"
            />

            <div className="canvas-veil" style={{ opacity: veilOpacity }} />

            {!ready && loadProgress < 100 && (
              <div className="loading-pill" role="status" aria-live="polite">
                Loading frames · {loadProgress}%
              </div>
            )}
          </div>

          {isMobile && children}
        </div>
      </div>

      {!isMobile && children}
    </>
  );
}
