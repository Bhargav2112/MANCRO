import React, { useEffect } from 'react';
import { Gem, Target, Eye, Hammer } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { setSeo } from '@/lib/seo';

export default function About() {
  useEffect(() => setSeo({ title: 'About MANCRO | Luxury Craftsmanship', description: 'The story, mission and craftsmanship behind MANCRO luxury watches.' }), []);
  const cards = [
    ['Mission', Target, 'To create modern heirlooms that elevate timekeeping into a private ritual.'],
    ['Vision', Eye, 'To become a quiet authority in precision-led luxury design.'],
    ['Craftsmanship', Hammer, 'Every proportion, surface and marker is composed with mechanical restraint.'],
    ['Materials', Gem, 'Obsidian blacks, brushed gold accents and engineered metals define the MANCRO language.'],
  ];

  return (
    <PageShell>
      <main className="px-6 pb-24 pt-36">
        <section className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="About MANCRO" title="A sanctuary for precision." text="MANCRO exists at the meeting point of timeless heritage and futuristic clarity." />
          <div className="rounded-[3rem] border border-border bg-card/70 p-8 md:p-14">
            <p className="font-display text-4xl leading-tight md:text-7xl">We believe a watch should feel inevitable: balanced, silent, weighted, and impossible to rush.</p>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-muted-foreground">Inspired by Swiss horological discipline, MANCRO designs premium timepieces with architectural restraint. The brand strips away noise so craftsmanship can lead—through texture, proportion, contrast and precision.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {cards.map(([title, Icon, text]) => <article key={title} className="border border-border/30 bg-zinc-950/60 p-7"><Icon className="mb-8 h-8 w-8 text-primary"/><h2 className="font-display text-lg font-light uppercase tracking-[0.15em] text-foreground">{title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground/80 font-light">{text}</p></article>)}
          </div>
        </section>
      </main>
    </PageShell>
  );
}