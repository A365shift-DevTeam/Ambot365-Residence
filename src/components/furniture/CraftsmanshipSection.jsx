import React, { useState } from 'react';
import { getFrameSrc } from '../../utils/frames';
import { Shield, Sparkles, VolumeX, SunMedium } from 'lucide-react';

const MATERIALS = [
  {
    icon: Sparkles,
    title: 'CALACATTA GOLD MARBLE',
    subtitle: 'Tuscan Quarries',
    desc: 'Book-matched marble slabs with delicate golden veining, hand-selected in Carrara and precision-honed for kitchen islands and master bath suites.',
    frame: 22,
    tag: 'NATURAL STONE'
  },
  {
    icon: Shield,
    title: 'SMOKED ITALIAN OAK',
    subtitle: 'Milan Artisan Joinery',
    desc: 'Solid European oak architectural panelling finished with organic natural oils, revealing deep grain textures while providing lifelong durability.',
    frame: 65,
    tag: 'SUSTAINABLE TIMBER'
  },
  {
    icon: VolumeX,
    title: 'ACOUSTIC GLAZING',
    subtitle: 'Triple-Layer Insulation',
    desc: 'Custom floor-to-ceiling glass assemblies engineered to damp sound down to 25dB, offering absolute tranquility against urban surroundings.',
    frame: 110,
    tag: 'SOUND ISOLATION'
  },
  {
    icon: SunMedium,
    title: 'BIO-ADAPTIVE LIGHTING',
    subtitle: 'Circadian Control',
    desc: 'Integrated Lutron Homeworks system automatically calibrates ambient color temperature to synchronize with your natural biological clock.',
    frame: 150,
    tag: 'INTELLIGENT TECH'
  }
];

export default function CraftsmanshipSection() {
  const [activeMaterial, setActiveMaterial] = useState(0);

  return (
    <section id="craftsmanship" style={{ padding: '5.5rem 2.5rem 6.5rem', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 4rem' }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.85rem',
            letterSpacing: '0.28em',
            color: '#6B8E78',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}>
            EXCEPTIONAL ARTISANRY
          </div>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(2.1rem, 5.2vw, 3.1rem)',
            color: '#fff',
            letterSpacing: '0.04em',
            margin: '0 0 1.25rem 0',
            lineHeight: 1.15
          }}>
            CRAFTSMANSHIP & MATERIALS
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            margin: 0
          }}>
            Every surface, angle, and joinery component is selected for raw purity and architectural endurance.
          </p>
        </div>

        {/* Interactive Material Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4.5rem'
        }}>
          {MATERIALS.map((mat, index) => {
            const Icon = mat.icon;
            const isActive = activeMaterial === index;

            return (
              <div
                key={index}
                onClick={() => setActiveMaterial(index)}
                onMouseEnter={() => setActiveMaterial(index)}
                style={{
                  background: isActive ? '#0d0e12' : '#08080a',
                  borderRadius: 8,
                  padding: '2rem 1.75rem',
                  border: isActive ? '1px solid rgba(107, 142, 120, 0.45)' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isActive ? '0 12px 30px -10px rgba(0,0,0,0.6)' : 'none'
                }}
              >
                {/* Background Frame Accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url('${getFrameSrc(mat.frame)}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isActive ? 0.15 : 0.05,
                  transition: 'opacity 0.4s ease',
                  filter: 'grayscale(0.5)',
                  pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      background: isActive ? 'rgba(107, 142, 120, 0.2)' : 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#6B8E78' : 'rgba(255,255,255,0.6)',
                      transition: 'all 0.3s ease'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      color: '#6B8E78',
                      border: '1px solid rgba(107, 142, 120, 0.3)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 3,
                      textTransform: 'uppercase'
                    }}>
                      {mat.tag}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.1rem',
                    color: '#fff',
                    letterSpacing: '0.06em',
                    margin: '0 0 0.4rem 0'
                  }}>
                    {mat.title}
                  </h3>

                  <div style={{
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}>
                    {mat.subtitle}
                  </div>

                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.55,
                    margin: 0
                  }}>
                    {mat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metrics Counter Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          padding: '2.5rem 2rem',
          background: 'rgba(255,255,255,0.015)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center'
        }}>
          {[
            { value: '< 25 dB', label: 'ACOUSTIC NOISE ISOLATION' },
            { value: '100%', label: 'HAND-FINISHED JOINERY' },
            { value: 'A++', label: 'ECO-SUSTAINABLE ENERGY' },
            { value: '50+', label: 'ARTISAN CRAFTSMEN' }
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '2.2rem',
                color: '#6B8E78',
                letterSpacing: '0.04em',
                marginBottom: '0.4rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
