import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, Share2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildWhatsAppInquiry, buildWhatsAppShare, formatPrice } from '@/lib/whatsapp';
import { setSeo } from '@/lib/seo';

export default function ProductDetail() {
  const { slug } = useParams();
  const [active, setActive] = useState(0);
  const { data: watch, isLoading } = useQuery({ 
    queryKey: ['watch', slug], 
    queryFn: () => base44.entities.Watch.getBySlug(slug) 
  });
  const images = useMemo(() => watch?.image_urls || [], [watch]);

  useEffect(() => {
    if (watch) setSeo({ title: `${watch.name} | MANCRO`, description: watch.description });
  }, [watch]);

  if (isLoading) {
    return (
      <PageShell>
        <main className="min-h-screen px-6 pt-40 bg-black">
          <div className="mx-auto max-w-7xl animate-pulse bg-zinc-900 h-[600px] border border-border/30" />
        </main>
      </PageShell>
    );
  }

  if (!watch) {
    return (
      <PageShell>
        <main className="min-h-screen px-6 pt-40 text-center bg-black">
          <h1 className="font-display text-5xl text-foreground font-light">Watch not found</h1>
          <Button asChild className="mt-8 rounded-none border border-primary px-8">
            <Link to="/collection">Return to Collection</Link>
          </Button>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="px-6 pb-28 pt-36 bg-black text-foreground">
        <div className="mx-auto max-w-7xl mb-8">
          <Link to="/collection" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Vault
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Gallery Section */}
          <section className="space-y-6">
            <div className="overflow-hidden border border-border/40 bg-zinc-950/80 relative aspect-[4/5] flex items-center justify-center">
              <img 
                src={images[active]} 
                alt={`${watch.name} gallery image ${active + 1}`} 
                className="h-full w-full object-cover cursor-crosshair transition-transform duration-1000 ease-out hover:scale-125" 
              />
              <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 border border-border/40 text-[9px] uppercase tracking-widest font-mono text-primary">
                Reference Frame {active + 1}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button 
                  key={image} 
                  onClick={() => setActive(index)} 
                  className={`overflow-hidden border transition-all ${active === index ? 'border-primary shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'border-border/40'} focus-visible:outline-none`}
                >
                  <img src={image} alt={`${watch.name} thumbnail ${index + 1}`} className="aspect-square w-full object-cover hover:opacity-80 transition-opacity" />
                </button>
              ))}
            </div>
          </section>

          {/* Details Section */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-border/40 bg-zinc-950 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary block mb-2">{watch.caliber_id || 'CALIBER SPECIFICATION'}</span>
                <h1 className="font-display text-4xl md:text-6xl font-light tracking-wide text-foreground leading-none">{watch.name}</h1>
                <p className="mt-5 font-mono text-2xl text-primary tracking-widest">{formatPrice(watch.price, watch.currency)}</p>
              </div>

              <p className="mt-8 text-muted-foreground/80 leading-8 text-sm md:text-base font-light tracking-wide">{watch.description}</p>
              
              <div className="mt-6">
                {watch.stock_quantity === 0 || watch.stock_status === 'Sold Out' ? (
                  <Badge variant="destructive" className="rounded-none bg-destructive/15 text-destructive border-destructive/20 font-mono text-[9px] tracking-widest px-3 py-1 uppercase" aria-live="polite">Out Of Stock</Badge>
                ) : (
                  <Badge className="rounded-none bg-primary/10 text-primary border-primary/20 font-mono text-[9px] tracking-widest px-3 py-1 uppercase" aria-live="polite">{watch.stock_status}</Badge>
                )}
              </div>

              {/* Consultation / Inquiries CTA Buttons */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {watch.stock_quantity === 0 || watch.stock_status === 'Sold Out' ? (
                  <Button disabled size="lg" className="rounded-none bg-zinc-900 text-muted-foreground border border-border cursor-not-allowed uppercase text-[11px] tracking-widest h-14">
                    <MessageCircle className="mr-2 h-4 w-4"/>Out of Stock
                  </Button>
                ) : (
                  <Button asChild size="lg" className="rounded-none bg-primary text-black hover:bg-transparent hover:text-primary border border-primary transition-all duration-300 uppercase text-[11px] tracking-widest h-14 font-semibold">
                    <a href={buildWhatsAppInquiry(watch)} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4"/>WhatsApp Inquiry
                    </a>
                  </Button>
                )}
                
                <Button asChild size="lg" variant="outline" className="rounded-none border-border/80 hover:bg-white hover:text-black transition-all duration-300 uppercase text-[11px] tracking-widest h-14">
                  <Link to={`/contact?watchId=${watch.id || watch._id}&watchName=${encodeURIComponent(watch.name)}`}>
                    <Mail className="mr-2 h-4 w-4"/>Contact Advisor
                  </Link>
                </Button>
                
                <Button asChild variant="ghost" className="rounded-none sm:col-span-2 text-muted-foreground hover:text-primary transition-colors text-[10px] uppercase tracking-widest h-10">
                  <a href={buildWhatsAppShare(watch)} target="_blank" rel="noreferrer">
                    <Share2 className="mr-2 h-4 w-4"/>Share Reference Link
                  </a>
                </Button>
              </div>

              {/* Technical Specifications */}
              <div className="mt-12 border-t border-border/30 pt-8">
                <h2 className="font-display text-[15px] font-light uppercase tracking-[0.12em] text-foreground">Technical Details</h2>
                <dl className="mt-6 grid gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                  {[
                    ['Movement', watch.movement], 
                    ['Case Size', watch.case_size], 
                    ['Material', watch.case_material], 
                    ['Water Resistance', watch.water_resistance], 
                    ['Power Reserve', watch.power_reserve]
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 border-b border-border/20 pb-3">
                      <dt className="text-primary/95">{label}</dt>
                      <dd className="text-right text-foreground font-semibold truncate max-w-[200px]">{value || 'N/A'}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Watch Features */}
              {watch.features && watch.features.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-[15px] font-light uppercase tracking-[0.12em] text-foreground">Signature Features</h2>
                  <ul className="mt-6 space-y-4 text-muted-foreground/85 text-xs md:text-sm font-light leading-relaxed">
                    {watch.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}