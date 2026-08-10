import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import HeroSection from './components/furniture/HeroSection';
import CraftsmanshipSection from './components/furniture/CraftsmanshipSection';
import AmenitiesSection from './components/furniture/AmenitiesSection';
import { TOTAL_FRAMES, getFrameSrc } from './utils/frames';

const Ambot365 = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Gallery modal state
  const [selectedFrame, setSelectedFrame] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedFrame(null);
    };
    if (selectedFrame) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedFrame]);

  const openFrame = (frame) => setSelectedFrame(frame);
  const closeModal = () => setSelectedFrame(null);

  // Hero frame scrub progress (0 = first frame, 1 = last frame)
  const [heroProgress, setHeroProgress] = useState(0);
  const [hideNav, setHideNav] = useState(true);

  useEffect(() => {
    const checkHeroVisibility = () => {
      const heroEl = document.querySelector('.scroll-sequence');
      if (!heroEl) {
        setHideNav(false);
        return;
      }

      const rect = heroEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const heroIsActive = rect.top <= 80 && rect.bottom > viewportHeight * 0.4;
      const progressBased = heroProgress < 0.99;

      setHideNav(heroIsActive || progressBased);
    };

    checkHeroVisibility();

    const onScroll = () => {
      checkHeroVisibility();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkHeroVisibility);

    const progressTimer = setTimeout(checkHeroVisibility, 50);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkHeroVisibility);
      clearTimeout(progressTimer);
    };
  }, [heroProgress]);

  return (
    <div className="furniture-page min-h-screen" style={{ background: '#050505', color: 'rgba(255,255,255,0.9)' }}>
      {/* Fixed Navigation - Completely Transparent & Compact (No Frame Interruption) */}
      <nav
        className="main-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0.6rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
          transition: 'all 0.25s ease',
        }}
      >
        <div className="main-navbar-logo" style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', letterSpacing: '0.14em', textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}>Ambot365</div>

        <div className="main-navbar-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}>
          <a href="#craftsmanship">CRAFTSMANSHIP</a>
          <a href="#amenities">AMENITIES</a>
          <a href="#gallery">GALLERY</a>
        </div>

        <button
          className="main-navbar-cta"
          style={{
            background: 'rgba(255,255,255,0.95)',
            color: '#111',
            padding: '0.4rem 1.25rem',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            borderRadius: 2,
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#6B8E78')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.95)')}
        >
          BOOK A VISIT
        </button>
      </nav>

      {/* Hero with scrolling 3D frame animation */}
      <HeroSection onProgressChange={setHeroProgress}>
        <section style={{ padding: '1.5rem 1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.95rem', letterSpacing: '0.26em', color: '#6B8E78', marginBottom: '0.9rem' }}>
              A PRIVATE COLLECTION
            </div>
            <p style={{ fontSize: '1.18rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.82)' }}>
              Each piece is documented in {TOTAL_FRAMES} frames — revealing material, joinery and silhouette from every angle as you scroll.
            </p>
          </div>
        </section>

        {/* New Section 1: Craftsmanship & Materials */}
        <CraftsmanshipSection />

        {/* New Section 2: Bespoke Amenities & Hospitality */}
        <AmenitiesSection />

        {/* Gallery */}
        <section id="gallery" style={{ padding: '4.5rem 2.5rem 7rem', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.1rem, 5.2vw, 3.1rem)',
              textAlign: 'center',
              letterSpacing: '0.06em',
              marginBottom: '3rem',
              color: '#fff'
            }}>
              GALLERY
            </h2>

            <div className="gallery-grid">
              {[
                '012', '048', '084', '120', '156', '192'
              ].map((frame, index) => (
                <div
                  key={index}
                  onClick={() => openFrame(frame)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    background: '#0a0a0c',
                    aspectRatio: index === 0 ? '16 / 10' : '4 / 3',
                  }}
                >
                  <img
                    src={getFrameSrc(Number(frame))}
                    alt={`Gallery ${frame}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.6s ease, filter 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.filter = 'brightness(1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience The Residence - CTA section */}
        <section style={{
          padding: '5.5rem 2rem 6rem',
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle background treatment */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${getFrameSrc(80)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            filter: 'grayscale(0.3)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.75), rgba(5,5,5,0.92))',
          }} />

          <div style={{
            position: 'relative',
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'center',
            zIndex: 1,
          }}>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2rem, 5.5vw, 3.05rem)',
              color: '#fff',
              letterSpacing: '0.03em',
              marginBottom: '1rem',
              lineHeight: 1.05,
            }}>
              EXPERIENCE THE RESIDENCE
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1.02rem',
              marginBottom: '2.2rem',
              letterSpacing: '0.01em',
            }}>
              Schedule your private tour today.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => alert('Thank you! A private tour representative will contact you shortly.')}
                style={{
                  background: '#fff',
                  color: '#050505',
                  padding: '0.85rem 2.1rem',
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#6B8E78'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                BOOK A TOUR
              </button>

              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  padding: '0.85rem 2.1rem',
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)';
                }}
              >
                VIEW FLOOR PLANS
              </button>
            </div>
          </div>
        </section>

        <footer style={{ padding: '3.25rem 3.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>
          © AMBOT365 — {new Date().getFullYear()} &nbsp;•&nbsp; CURATED LIVING
        </footer>

      </HeroSection>

      {/* Gallery Image Modal */}
      {selectedFrame && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '88vh',
            }}
          >
            <img
              src={getFrameSrc(Number(selectedFrame))}
              alt={`Frame ${selectedFrame}`}
              style={{
                maxWidth: '100%',
                maxHeight: '88vh',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 30px 80px -10px rgba(0,0,0,0.8)',
              }}
            />

            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: -12,
                right: -12,
                width: 42,
                height: 42,
                borderRadius: '999px',
                background: '#111',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: 22,
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '12px',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.5)',
            }}>
              FRAME {selectedFrame} &nbsp;•&nbsp; {TOTAL_FRAMES} TOTAL
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ambot365;