import React from 'react';
import ScrollSequence from './ScrollSequence';

export default function HeroSection({ onProgressChange, children }) {
  return (
    <section style={{ position: 'relative', background: '#050505' }}>
      <ScrollSequence onProgressChange={onProgressChange}>
        {children}
      </ScrollSequence>
    </section>
  );
}
