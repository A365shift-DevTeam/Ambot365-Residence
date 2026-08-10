import React, { useState } from 'react';
import { Shield, Sparkles, VolumeX, SunMedium } from 'lucide-react';

const MATERIALS = [
  {
    icon: Sparkles,
    title: 'Calacatta gold marble',
    subtitle: 'Tuscan quarries',
    desc: 'Book-matched slabs with delicate golden veining, hand-selected in Carrara and precision-honed for kitchen islands and master baths.',
    tag: 'Natural stone',
  },
  {
    icon: Shield,
    title: 'Smoked Italian oak',
    subtitle: 'Milan artisan joinery',
    desc: 'Solid European oak panelling finished with organic oils — deep grain texture with lifelong durability across walls and millwork.',
    tag: 'Sustainable timber',
  },
  {
    icon: VolumeX,
    title: 'Acoustic glazing',
    subtitle: 'Triple-layer insulation',
    desc: 'Floor-to-ceiling glass assemblies engineered to damp exterior sound down to 25 dB for absolute urban quiet.',
    tag: 'Sound isolation',
  },
  {
    icon: SunMedium,
    title: 'Bio-adaptive lighting',
    subtitle: 'Circadian control',
    desc: 'Integrated home systems calibrate ambient color temperature through the day to match your natural rhythm.',
    tag: 'Intelligent tech',
  },
];

const METRICS = [
  { value: '< 25 dB', label: 'Acoustic isolation' },
  { value: '100%', label: 'Hand-finished joinery' },
  { value: 'A++', label: 'Energy performance' },
  { value: '50+', label: 'Artisan craftsmen' },
];

export default function CraftsmanshipSection() {
  const [activeMaterial, setActiveMaterial] = useState(0);

  return (
    <section id="craftsmanship" className="section" style={{ background: 'var(--plaster)' }}>
      <div className="section-inner">
        <header className="section-header">
          <span className="eyebrow">Exceptional artisanry</span>
          <h2 className="section-title">Craftsmanship & materials</h2>
          <p className="section-lead">
            Every surface, angle, and join is chosen for purity of material and architectural endurance.
          </p>
        </header>

        <div className="materials-grid">
          {MATERIALS.map((mat, index) => {
            const Icon = mat.icon;
            const isActive = activeMaterial === index;

            return (
              <article
                key={mat.title}
                className={`material-card${isActive ? ' is-active' : ''}`}
                onClick={() => setActiveMaterial(index)}
                onMouseEnter={() => setActiveMaterial(index)}
                onFocus={() => setActiveMaterial(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveMaterial(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
              >
                <div className="material-card-body">
                  <div className="material-card-top">
                    <div className="material-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <span className="material-tag">{mat.tag}</span>
                  </div>
                  <h3>{mat.title}</h3>
                  <div className="material-subtitle">{mat.subtitle}</div>
                  <p>{mat.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="metrics-bar">
          {METRICS.map((stat) => (
            <div key={stat.label}>
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
