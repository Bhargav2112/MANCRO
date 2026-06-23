import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/whatsapp';

export default function WatchCard({ watch }) {
  const href = `/watch/${watch.slug}`;

  return (
    <Link to={href} className="group block focus-visible:outline focus-visible:outline-none">
      <article className="relative overflow-hidden border border-border/40 bg-zinc-950/80 p-5 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] active:scale-[0.99]">
        <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full" />
        
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <img 
            src={watch.image_urls?.[0]} 
            alt={watch.name} 
            className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
          
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/90 p-4 border-t border-border/40 transition-transform duration-500 ease-out group-hover:translate-y-0 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/80">
              <div className="border-b border-border/30 pb-1">
                <span className="text-[8px] text-primary">Movement</span>
                <p className="font-semibold text-foreground truncate">{watch.movement || 'Automatic'}</p>
              </div>
              <div className="border-b border-border/30 pb-1">
                <span className="text-[8px] text-primary">Power Reserve</span>
                <p className="font-semibold text-foreground truncate">{watch.power_reserve || '48 Hours'}</p>
              </div>
              <div className="border-b border-border/30 pb-1">
                <span className="text-[8px] text-primary">Resistance</span>
                <p className="font-semibold text-foreground truncate">{watch.water_resistance || '50m'}</p>
              </div>
              <div className="border-b border-border/30 pb-1">
                <span className="text-[8px] text-primary">Case Size</span>
                <p className="font-semibold text-foreground truncate">{watch.case_size || '40mm'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-primary font-semibold block mb-2">{watch.category}</span>
            <h3 className="font-display text-2xl font-medium tracking-wide text-foreground leading-tight group-hover:text-primary transition-colors">{watch.name}</h3>
            <p className="mt-2 font-mono text-xs text-muted-foreground tracking-widest">{formatPrice(watch.price, watch.currency)}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 group-hover:border-primary/80 group-hover:bg-primary/5 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}