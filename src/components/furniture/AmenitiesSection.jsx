import React, { useState } from 'react';
import { getFrameSrc } from '../../utils/frames';
import { ConciergeBell, Waves, Wine, CarFront, ChevronRight } from 'lucide-react';

const AMENITIES = [
  {
    id: 'concierge',
    icon: ConciergeBell,
    title: '24/7 PRIVATE BUTLER & CONCIERGE',
    subtitle: 'WHITE-GLOVE PERSONALIZED SERVICE',
    desc: 'Dedicated residence managers handle white-glove requests 24 hours a day — from private jet charter logistics and Michelin-star in-residence dining to discrete security detail.',
    frame: 40,
    features: ['On-Demand Private Butler', 'In-Residence Chef Prep', 'Discrete Valet & Security', 'Worldwide Aviation Booking']
  },
  {
    id: 'wellness',
    icon: Waves,
    title: 'SKY WELLNESS SPA & INFINITY POOL',
    subtitle: 'PANORAMIC HEALTH SANCTUARY',
    desc: 'Unwind high above the city skyline in a climate-regulated infinity pool, hydrotherapy thermal baths, dry cedar saunas, and private treatment rooms.',
    frame: 100,
    features: ['Thermal Hydrotherapy Pool', 'Dry Cedar Sauna & Steam', 'Private Spa Treatment Suites', 'Technogym Fitness Studio']
  },
  {
    id: 'wine',
    icon: Wine,
    title: 'SOMMELIER WINE VAULT & LOUNGE',
    subtitle: 'CLIMATE-CONTROLLED VINTAGE CELLAR',
    desc: 'Personal temperature & humidity monitored cellar lockers for rare vintage collections, complemented by an intimate tasting lounge for hosting private soirees.',
    frame: 140,
    features: ['Biometric Cellar Access', 'Dual-Zone Temperature Control', 'Private Sommelier Consultations', 'Tasting Lounge Reservations']
  },
  {
    id: 'garage',
    icon: CarFront,
    title: 'AUTOMATED ROBOTIC EV GARAGE',
    subtitle: 'SUBTERRANEAN VEHICLE HANDLING',
    desc: 'State-of-the-art robotic parking system retrieves your automobile automatically within 90 seconds, equipped with ultra-fast 350kW EV charging ports.',
    frame: 180,
    features: ['90-Second Retrieval System', '350kW Ultra-Fast EV Chargers', 'Automated License Recognition', 'Detailing & Maintenance Service']
  }
];

export default function AmenitiesSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeAmenity = AMENITIES[selectedIdx];
  const IconComponent = activeAmenity.icon;

  return (
    <section id="amenities" style={{ padding: '6rem 2.5rem 7rem', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
            PRIVATE HOSPITALITY
          </div>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(2.1rem, 5.2vw, 3.1rem)',
            color: '#fff',
            letterSpacing: '0.04em',
            margin: '0 0 1.25rem 0',
            lineHeight: 1.15
          }}>
            BESPOKE AMENITIES
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            margin: 0
          }}>
            An uncompromising suite of services and private sanctuaries designed for effortless luxury.
          </p>
        </div>

        {/* Interactive Split View */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.35fr)',
          gap: '2.5rem',
          alignItems: 'stretch'
        }} className="amenities-container">

          {/* Left Navigation Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {AMENITIES.map((item, idx) => {
              const ItemIcon = item.icon;
              const isSelected = selectedIdx === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    padding: '1.4rem 1.6rem',
                    borderRadius: 6,
                    background: isSelected ? 'rgba(107, 142, 120, 0.12)' : '#08080a',
                    border: isSelected ? '1px solid #6B8E78' : '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{
                      color: isSelected ? '#6B8E78' : 'rgba(255,255,255,0.4)',
                      transition: 'color 0.3s ease'
                    }}>
                      <ItemIcon size={22} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '0.95rem',
                        letterSpacing: '0.06em',
                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.75)',
                        marginBottom: '0.2rem'
                      }}>
                        {item.title.split(' ')[0]} {item.title.split(' ')[1]}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase'
                      }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    style={{
                      color: isSelected ? '#6B8E78' : 'rgba(255,255,255,0.2)',
                      transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Display Feature Box */}
          <div style={{
            background: '#090a0d',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Image Banner */}
            <div style={{ height: 260, position: 'relative', overflow: 'hidden', background: '#000' }}>
              <img
                src={getFrameSrc(activeAmenity.frame)}
                alt={activeAmenity.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'opacity 0.4s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #090a0d 0%, transparent 80%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#6B8E78'
              }}>
                <IconComponent size={24} />
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.82rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase'
                }}>
                  RESIDENCY INCLUSION
                </span>
              </div>
            </div>

            {/* Feature Content */}
            <div style={{ padding: '2rem 2.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.35rem',
                  color: '#fff',
                  letterSpacing: '0.04em',
                  marginBottom: '0.75rem'
                }}>
                  {activeAmenity.title}
                </h3>
                <p style={{
                  fontSize: '0.98rem',
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}>
                  {activeAmenity.desc}
                </p>

                {/* Bullets */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.85rem',
                  marginBottom: '2rem'
                }}>
                  {activeAmenity.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B8E78' }} />
                      <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em' }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  INCLUDED IN RESIDENCE OWNERSHIP
                </span>
                <button
                  onClick={() => alert('Tour scheduling for ' + activeAmenity.title + ' is now open.')}
                  style={{
                    background: 'transparent',
                    color: '#6B8E78',
                    border: '1px solid rgba(107, 142, 120, 0.4)',
                    padding: '0.55rem 1.25rem',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#6B8E78';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B8E78';
                  }}
                >
                  INQUIRE DETAILS
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
