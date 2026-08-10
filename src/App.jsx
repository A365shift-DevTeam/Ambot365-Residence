import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Menu, X } from 'lucide-react';
import HeroSection from './components/furniture/HeroSection';
import CraftsmanshipSection from './components/furniture/CraftsmanshipSection';
import { TOTAL_FRAMES, getFrameSrc } from './utils/frames';

const GALLERY_FRAMES = [48, 120, 156, 192];

const Ambot365 = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedFrame(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || selectedFrame) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, selectedFrame]);

  useEffect(() => {
    const updateNav = () => {
      const heroEl = document.querySelector('.scroll-sequence');
      if (!heroEl) {
        setNavSolid(true);
        return;
      }
      const rect = heroEl.getBoundingClientRect();
      // Solid once the sequence is mostly past the viewport
      const pastHero = rect.bottom < window.innerHeight * 0.55 || heroProgress > 0.92;
      setNavSolid(pastHero);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    return () => {
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, [heroProgress]);

  const bookVisit = () => {
    setMobileMenuOpen(false);
    window.alert('Thank you — a private tour representative will contact you shortly.');
  };

  return (
    <div className="page">
      <nav
        className={`main-navbar${navSolid ? ' is-solid' : ' is-hero'}`}
        aria-label="Primary"
      >
        <a href="#" className="main-navbar-logo" aria-label="AmBot 365 home">
          <img src="/AmBot 365-Logo.png" alt="AmBot 365" />
        </a>

        <div className="main-navbar-links">
          <a href="#craftsmanship">Craftsmanship</a>
          <a href="#gallery">Gallery</a>
        </div>

        <button type="button" className="main-navbar-cta" onClick={bookVisit}>
          Book a visit
        </button>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <a href="#craftsmanship" onClick={() => setMobileMenuOpen(false)}>
            Craftsmanship
          </a>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
            Gallery
          </a>
          <button type="button" className="btn btn-light" onClick={bookVisit}>
            Book a visit
          </button>
        </div>
      )}

      <HeroSection onProgressChange={setHeroProgress}>
        <section className="intro-strip">
          <div className="intro-strip-inner">
            <span className="eyebrow">A private collection</span>
            <p>
              Each residence is documented in {TOTAL_FRAMES} frames — material, joinery, and silhouette revealed as you scroll.
            </p>
          </div>
        </section>

        <CraftsmanshipSection />

        <section id="gallery" className="section gallery-section">
          <div className="section-inner">
            <header className="section-header">
              <span className="eyebrow">Captured sequence</span>
              <h2 className="section-title">Gallery</h2>
              <p className="section-lead">
                Selected stills from the walkthrough — approach, threshold, and living space.
              </p>
            </header>

            <div className="gallery-grid">
              {GALLERY_FRAMES.map((frame) => (
                <button
                  key={frame}
                  type="button"
                  className="gallery-item"
                  onClick={() => setSelectedFrame(frame)}
                  aria-label={`Open gallery frame ${frame}`}
                >
                  <img
                    src={getFrameSrc(frame)}
                    alt={`Residence frame ${frame}`}
                    loading="lazy"
                  />
                  <span className="gallery-item-meta">
                    Frame {String(frame).padStart(3, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <img src="/AmBot 365-Logo.png" alt="AmBot 365" />
              <p>Curated living spaces documented in interactive sequence.</p>
            </div>

            <nav className="site-footer-nav" aria-label="Footer">
              <a href="#craftsmanship">Craftsmanship</a>
              <a href="#gallery">Gallery</a>
              <button type="button" className="site-footer-link-btn" onClick={bookVisit}>
                Book a visit
              </button>
            </nav>

            <div className="site-footer-meta">
              <span>© AmBot 365 — {new Date().getFullYear()}</span>
              <span>Curated living</span>
            </div>
          </div>
        </footer>
      </HeroSection>

      {selectedFrame != null && (
        <div
          className="gallery-modal"
          onClick={() => setSelectedFrame(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
        >
          <div className="gallery-modal-panel" onClick={(e) => e.stopPropagation()}>
            <img
              src={getFrameSrc(selectedFrame)}
              alt={`Frame ${selectedFrame}`}
            />
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setSelectedFrame(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="gallery-modal-caption">
              Frame {String(selectedFrame).padStart(3, '0')} · {TOTAL_FRAMES} total
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ambot365;
