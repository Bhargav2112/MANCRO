import React from 'react';

export default function SectionHeader({ eyebrow, title, text, align = 'center' }) {
  return (
    <div className={`mx-auto mb-12 max-w-3xl ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl font-light uppercase tracking-[0.1em] text-foreground md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-sm leading-8 text-muted-foreground/80 md:text-base font-light tracking-wide">{text}</p>}
    </div>
  );
}