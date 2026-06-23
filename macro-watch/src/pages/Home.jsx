import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, Heart, Award, ShieldCheck, Play, Sparkles, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/layout/PageShell';
import { setSeo } from '@/lib/seo';
import { formatPrice } from '@/lib/whatsapp';

const defaultHeroImage = 'https://media.base44.com/images/public/6a2a59189c55413ea5d13639/d15dd6336_generated_042475bc.png';

// FAQ / Why Choose Us Accordion Item
function AccordionItem({ title, text, isOpenDefault }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className="border border-border/40 bg-zinc-950/40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left text-xs uppercase tracking-widest font-display font-light text-foreground border-b border-border/10 hover:text-primary transition-colors"
      >
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-5 font-sans text-xs text-muted-foreground/80 leading-7 font-light border-t border-border/5">
          {text}
        </div>
      )}
    </div>
  );
}

// Hero Slider
function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <motion.div
            key={slide.id || idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === current ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="w-full h-full object-cover animate-pulse-slow" 
              style={{ animationDuration: '20s' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06),transparent_50%)]" />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-10" />

      {/* Content Slider */}
      <div className="relative mx-auto w-full max-w-7xl py-12 z-20">
        <div className="max-w-2xl">
          {slides.map((slide, idx) => {
            if (idx !== current) return null;
            return (
              <motion.div
                key={slide.id || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {slide.subtitle && (
                  <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-primary">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="font-display text-5xl leading-[1.1] tracking-[0.08em] md:text-7xl lg:text-8xl font-light uppercase text-foreground">
                  {slide.title}
                </h1>
                <div className="mt-10">
                  <Button asChild size="lg" className="rounded-none px-10 active:scale-[0.98] border border-primary bg-primary text-black hover:bg-transparent hover:text-primary transition-all duration-300">
                    <Link to={slide.linkUrl || "/collection"}>
                      Enter the Vault <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 left-6 right-6 mx-auto max-w-7xl flex items-center justify-between z-30">
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === current ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
            className="flex h-10 w-10 items-center justify-center border border-border/60 bg-black/80 text-foreground hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 rounded-full font-mono text-sm"
          >
            ←
          </button>
          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="flex h-10 w-10 items-center justify-center border border-border/60 bg-black/80 text-foreground hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 rounded-full font-mono text-sm"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    setSeo({ 
      title: 'MANCRO | Luxury Precision Watch Store', 
      description: 'Discover premium timepieces, mechanical watchmaking mastery, and horological heritage at MANCRO.' 
    });
  }, []);

  const { data: watches = [], isLoading } = useQuery({ 
    queryKey: ['watches'], 
    queryFn: () => base44.entities.Watch.list('-created_date') 
  });

  const { data: settingsList = [] } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
  });
  const settings = settingsList[0] || {};

  const { data: slides = [] } = useQuery({
    queryKey: ['public-slides'],
    queryFn: () => base44.entities.Slide.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const featured = watches.filter((w) => w.is_featured).slice(0, 5);
  const arrivals = watches.filter((w) => w.is_new_arrival).slice(0, 3);
  const best = watches.filter((w) => w.is_best_seller).slice(0, 5);

  // Dynamic homepage section contents from Settings
  const aboutTitle = settings.about_title || 'Creating watches that blend innovation';
  const aboutDesc = settings.about_description || 'We are committed to creating watches that seamlessly blend modern innovation with timeless craftsmanship. By combining advanced technology, premium materials, and thoughtful design, each timepiece is built to deliver precision, durability, and a refined aesthetic.';
  
  const counter1Val = settings.counter1_val || '150+';
  const counter1Title = settings.counter1_title || 'Limited Edition Releases';
  const counter1Desc = settings.counter1_desc || 'Our limited edition releases are crafted in small quantities to ensure uniqueness.';
  
  const counter2Val = settings.counter2_val || '500+';
  const counter2Title = settings.counter2_title || 'Premium Watch Designs';
  const counter2Desc = settings.counter2_desc || 'Our premium watch designs are crafted to deliver a perfect balance of elegance.';
  
  const counter3Val = settings.counter3_val || '4.9/5';
  const counter3Title = settings.counter3_title || 'Average Customer Score';
  const counter3Desc = settings.counter3_desc || 'Our high average customer rating reflects the trust and satisfaction of our clients.';

  const forHimTitle = settings.for_him_title || 'For Him';
  const forHimDesc = settings.for_him_desc || 'Discover Our New Watch Collection and Elevate Your Everyday Look.';
  const forHimLink = settings.for_him_link || '/collection?category=Sport';
  const forHimImg = settings.for_him_image_url || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800';

  const forHerTitle = settings.for_her_title || 'For Her';
  const forHerDesc = settings.for_her_desc || 'Discover Our New Watch Collection and Elevate Your Everyday Look.';
  const forHerLink = settings.for_her_link || '/collection?category=Dress';
  const forHerImg = settings.for_her_image_url || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800';

  const col1Title = settings.col1_title || 'Sports Watches';
  const col1Tag = settings.col1_tag || 'Sport';
  const col1Image = settings.col1_image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600';
  const col1Desc = settings.col1_desc || 'Discover Our New Watch Collection and Elevate Your Everyday Look.';

  const col2Title = settings.col2_title || 'Luxury Watches';
  const col2Tag = settings.col2_tag || 'Heritage';
  const col2Image = settings.col2_image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600';
  const col2Desc = settings.col2_desc || 'Discover Our New Watch Collection and Elevate Your Everyday Look.';

  const col3Title = settings.col3_title || 'Chronograph Watches';
  const col3Tag = settings.col3_tag || 'Skeleton';
  const col3Image = settings.col3_image || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600';
  const col3Desc = settings.col3_desc || 'Discover Our New Watch Collection and Elevate Your Everyday Look.';

  const introVideoUrl = settings.intro_video_url || 'https://demo.awaikenthemes.com/assets/videos/lemora-intro-video.mp4';
  const introVideoTitle = settings.intro_video_title || 'witness the sanctuary of mechanical devotion';
  const introVideoSubtitle = settings.intro_video_subtitle || 'A Legacy of Precision';

  const whyChooseImg = settings.why_choose_image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800';
  const whyChooseTitle = settings.why_choose_title || 'Designed for quality built for everyday confidence';

  const whyAcc1Title = settings.why_acc1_title || 'High-Quality Materials';
  const whyAcc1Text = settings.why_acc1_text || 'We use premium materials like scratchproof sapphire crystals, surgical-grade stainless steel, and hand-stitched alligator leather straps.';
  
  const whyAcc2Title = settings.why_acc2_title || 'Precision Chronometers';
  const whyAcc2Text = settings.why_acc2_text || 'Our timepieces are powered by highly precise automatic and hand-wound movements adjusted for ultimate accuracy.';

  const whyAcc3Title = settings.why_acc3_title || '2-Year International Warranty';
  const whyAcc3Text = settings.why_acc3_text || 'Every reference acquired from the vault is covered under a 2-year warranty and backed by our master watchmaking services.';

  const whyAcc4Title = settings.why_acc4_title || 'Bespoke Atelier Consultation';
  const whyAcc4Text = settings.why_acc4_text || 'Direct access to horology specialists to assist you with bespoke commissions and secure delivery logistics.';

  const socialVideo1 = settings.social_video1_url || 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-1.mp4';
  const socialVideo2 = settings.social_video2_url || 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-2.mp4';
  const socialVideo3 = settings.social_video3_url || 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-3.mp4';
  const socialVideo4 = settings.social_video4_url || 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-4.mp4';

  const testimonial1Author = settings.testimonial1_author || 'Darlene Robertson';
  const testimonial1Review = settings.testimonial1_review || '“Absolutely premium watches! The level of hand-finishing, custom obsidional dials, and weight on the wrist exceeded all my expectations. Exceptional service!”';

  const testimonial2Author = settings.testimonial2_author || 'Dianne Russell';
  const testimonial2Review = settings.testimonial2_review || '“I love how elegant and minimalist the collection is. Standard micro-rotor calibers are thin, clean, and fit under a cuff perfectly. Customer support was incredibly responsive.”';

  return (
    <PageShell>
      {/* 1. Cinematic Hero Section or Slider */}
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06),transparent_50%),linear-gradient(to_bottom,black,#070707)]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] py-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-primary">Chronos Architectural Legacy</p>
              <h1 className="font-display text-5xl leading-[1.05] tracking-[0.12em] md:text-7xl lg:text-8xl font-light uppercase text-foreground">
                Precision<br/>from silence.
              </h1>
              <p className="mt-8 max-w-xl text-md leading-8 text-muted-foreground/80 font-light tracking-wide">
                MANCRO engineers modern heirlooms with the restraint of Swiss horology, the depth of obsidian, and the warmth of brushed gold.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-none px-10 active:scale-[0.98] border border-primary bg-primary text-black hover:bg-transparent hover:text-primary transition-all duration-300">
                  <Link to="/collection">Enter the Vault <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-border/80 px-10 text-foreground hover:bg-white hover:text-black transition-all duration-300">
                  <Link to="/about">Brand Story</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.5, ease: "easeOut" }} 
              className="relative flex justify-center"
            >
              <div className="absolute inset-10 rounded-full bg-primary/10 blur-3xl" />
              <img 
                src={settings.banner_url || defaultHeroImage} 
                alt="MANCRO luxury watch showcase" 
                className="relative mx-auto w-full max-w-[500px] object-cover filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] transition-transform duration-[3s] hover:scale-105" 
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* 2. About Us & Counters Section */}
      <section className="py-24 bg-black border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">About Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-wider text-foreground leading-tight">
                {aboutTitle}
              </h2>
            </div>
            <div>
              <p className="text-muted-foreground/80 leading-8 text-sm md:text-base font-light">
                {aboutDesc}
              </p>
            </div>
          </div>

          {/* Counters Grid */}
          <div className="grid gap-6 sm:grid-cols-3 mt-16 border-t border-border/20 pt-16">
            <div className="text-center p-8 bg-zinc-950/40 border border-border/30 hover:border-primary/40 transition-colors duration-500">
              <h3 className="font-display text-5xl font-light text-primary mb-2">{counter1Val}</h3>
              <p className="text-[10px] uppercase tracking-widest text-foreground font-semibold mb-2">{counter1Title}</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed font-light">{counter1Desc}</p>
            </div>
            <div className="text-center p-8 bg-zinc-950/40 border border-border/30 hover:border-primary/40 transition-colors duration-500">
              <h3 className="font-display text-5xl font-light text-primary mb-2">{counter2Val}</h3>
              <p className="text-[10px] uppercase tracking-widest text-foreground font-semibold mb-2">{counter2Title}</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed font-light">{counter2Desc}</p>
            </div>
            <div className="text-center p-8 bg-zinc-950/40 border border-border/30 hover:border-primary/40 transition-colors duration-500">
              <h3 className="font-display text-5xl font-light text-primary mb-2">{counter3Val}</h3>
              <p className="text-[10px] uppercase tracking-widest text-foreground font-semibold mb-2">{counter3Title}</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed font-light">{counter3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. For Him / For Her Category Banners */}
      <section className="py-12 bg-black border-t border-border/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Him */}
            <div className="group relative overflow-hidden block aspect-[4/3] border border-border/40 bg-zinc-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
              <img 
                src={forHimImg} 
                alt="For Him watch styling" 
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end gap-6">
                <div>
                  <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] mb-1">Watches</p>
                  <h3 className="font-display text-3xl font-light uppercase tracking-wider text-foreground">{forHimTitle}</h3>
                  <p className="text-xs text-muted-foreground/80 mt-2 font-light max-w-xs">{forHimDesc}</p>
                </div>
                <Button asChild className="rounded-none border border-primary bg-primary text-black hover:bg-transparent hover:text-primary transition-all shrink-0">
                  <Link to={forHimLink}>Shop Now</Link>
                </Button>
              </div>
            </div>

            {/* For Her */}
            <div className="group relative overflow-hidden block aspect-[4/3] border border-border/40 bg-zinc-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
              <img 
                src={forHerImg} 
                alt="For Her watch styling" 
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end gap-6">
                <div>
                  <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] mb-1">Watches</p>
                  <h3 className="font-display text-3xl font-light uppercase tracking-wider text-foreground">{forHerTitle}</h3>
                  <p className="text-xs text-muted-foreground/80 mt-2 font-light max-w-xs">{forHerDesc}</p>
                </div>
                <Button asChild className="rounded-none border border-primary bg-primary text-black hover:bg-transparent hover:text-primary transition-all shrink-0">
                  <Link to={forHerLink}>Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Collection Section */}
      <section className="py-24 bg-zinc-950/40 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block">Explore Our Collection</span>
            <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground">A perfect blend of innovation</h2>
            <p className="text-sm text-muted-foreground/60 font-light leading-relaxed">
              Discover a collection of watches designed with precision and elegance. Each timepiece reflects our commitment to quality, offering a seamless combination.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: col1Title, tag: col1Tag, image: col1Image, desc: col1Desc },
              { title: col2Title, tag: col2Tag, image: col2Image, desc: col2Desc },
              { title: col3Title, tag: col3Tag, image: col3Image, desc: col3Desc },
            ].map((col, idx) => (
              <div key={idx} className="group relative border border-border/30 bg-zinc-950 overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-all duration-500">
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-border/20 relative bg-zinc-900">
                  <img src={col.image} alt={col.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-display text-xl font-light uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">{col.title}</h3>
                  <p className="text-xs text-muted-foreground/75 leading-relaxed font-light">{col.desc}</p>
                  <div className="pt-4">
                    <Link to={`/collection?category=${col.tag}`} className="text-xs font-mono uppercase tracking-widest text-primary hover:text-foreground transition-colors inline-flex items-center gap-2">
                      Explore More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Best Products Carousel (Snap Scroll) */}
      <section className="py-24 bg-black border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">Best Products</span>
              <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground leading-tight">
                Timeless watches design for modern living
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-none border-border hover:bg-white hover:text-black shrink-0">
              <Link to="/collection">View All Products</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin">
              {best.map((w) => (
                <div key={w.id} className="min-w-[280px] md:min-w-[320px] snap-start border border-border/30 bg-zinc-950 p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-500 group">
                  <Link to={`/watch/${w.slug}`} className="aspect-square w-full bg-zinc-900 border border-border/20 overflow-hidden block mb-6 relative">
                    <img src={w.image_urls?.[0]} alt={w.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  </Link>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">{w.category}</p>
                      <h3 className="font-display text-lg font-light uppercase tracking-wider text-foreground mt-1 truncate">
                        <Link to={`/watch/${w.slug}`}>{w.name}</Link>
                      </h3>
                    </div>
                    {/* 5 Stars rating */}
                    <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                      <div className="flex gap-0.5 text-primary">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                      <span className="text-muted-foreground/60 text-[10px]">(4.9)</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/10">
                      <span className="font-mono text-base text-foreground font-semibold">{formatPrice(w.price, w.currency)}</span>
                      <Button asChild size="sm" variant="ghost" className="rounded-none hover:bg-primary hover:text-black text-xs font-mono uppercase tracking-widest">
                        <Link to={`/watch/${w.slug}`}>Enquire</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Intro Video Showcase Section */}
      <section className="relative w-full h-[65vh] min-h-[500px] overflow-hidden border-y border-border/20 group">
        <div className="absolute inset-0 bg-black/60 z-10 flex flex-col justify-center items-center px-6 text-center">
          <span className="text-xs font-mono tracking-[0.3em] text-primary uppercase font-bold mb-4">{introVideoSubtitle}</span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground max-w-4xl leading-tight">
            {introVideoTitle}
          </h2>
          <div className="mt-8 h-16 w-16 border border-primary rounded-full flex items-center justify-center bg-black/80 hover:bg-primary text-primary hover:text-black transition-all duration-500 cursor-pointer animate-pulse z-20">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        <video
          src={introVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s]"
        />
      </section>

      {/* 7. Shop By Brands Marquee */}
      <section className="py-20 bg-zinc-950 border-b border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block">Shop By Brands</span>
            <h2 className="font-display text-2xl font-light uppercase tracking-wider text-foreground">Trusted brand, timeless style</h2>
          </div>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-20">
              {["ROLEX", "PATEK PHILIPPE", "AUDEMARS PIGUET", "RICHARD MILLE", "OMEGA", "VACHERON CONSTANTIN", "A. LANGE & SÖHNE"].concat(["ROLEX", "PATEK PHILIPPE", "AUDEMARS PIGUET", "RICHARD MILLE", "OMEGA", "VACHERON CONSTANTIN", "A. LANGE & SÖHNE"]).map((b, idx) => (
                <span key={idx} className="text-2xl md:text-3xl font-display font-light tracking-[0.3em] text-muted-foreground/20 hover:text-primary transition-colors duration-300 select-none cursor-default">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. New Arrivals Section */}
      <section className="py-24 bg-black border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">New Arrivals</span>
              <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground leading-tight">
                Introducing new watches that redefine style
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-none border-border hover:bg-white hover:text-black shrink-0">
              <Link to="/collection">View All Arrivals</Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {arrivals.map((w) => (
              <div key={w.id} className="group border border-border/30 bg-zinc-950 overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col justify-between">
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-border/20 relative bg-zinc-900">
                  <img src={w.image_urls?.[0]} alt={w.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                </div>
                <div className="p-8 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">{w.category}</span>
                  <h3 className="font-display text-lg font-light uppercase tracking-wider text-foreground truncate">
                    <Link to={`/watch/${w.slug}`}>{w.name}</Link>
                  </h3>
                  <div className="flex justify-between items-center pt-4 border-t border-border/10">
                    <span className="font-mono text-sm text-muted-foreground/60">{formatPrice(w.price, w.currency)}</span>
                    <Link to={`/watch/${w.slug}`} className="text-xs font-mono uppercase tracking-widest text-primary hover:text-foreground transition-colors inline-flex items-center gap-1">
                      Explore Reference →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Social Updates Grid Loops */}
      <section className="py-24 bg-zinc-950/40 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block">Follow Us On Social</span>
            <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground">Explore our latest updates</h2>
            <p className="text-sm text-muted-foreground/60 font-light leading-relaxed">
              Stay up to date with our latest collections, exclusive offers, and style inspiration. Follow us to never miss what’s new and trending.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {[socialVideo1, socialVideo2, socialVideo3, socialVideo4].map((vid, idx) => (
              <div key={idx} className="relative overflow-hidden aspect-[9/16] border border-border/30 bg-zinc-950 hover:border-primary/50 transition-colors duration-500">
                <video
                  src={vid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Why Choose Us Section */}
      <section className="py-24 bg-black border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: Detail Image */}
            <div className="aspect-[4/3] w-full overflow-hidden border border-border/30 bg-zinc-950">
              <img 
                src={whyChooseImg} 
                alt="Watch craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Feature Accordions */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">Why Choose Us</span>
                <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground leading-tight">
                  {whyChooseTitle}
                </h2>
              </div>
              
              <div className="space-y-4">
                <AccordionItem 
                  title={whyAcc1Title} 
                  text={whyAcc1Text} 
                  isOpenDefault={true}
                />
                <AccordionItem 
                  title={whyAcc2Title} 
                  text={whyAcc2Text} 
                  isOpenDefault={false}
                />
                <AccordionItem 
                  title={whyAcc3Title} 
                  text={whyAcc3Text} 
                  isOpenDefault={false}
                />
                <AccordionItem 
                  title={whyAcc4Title} 
                  text={whyAcc4Text} 
                  isOpenDefault={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Testimonials Section */}
      <section className="py-24 bg-zinc-950/40 border-t border-border/20">
        <div className="mx-auto max-w-5xl text-center px-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">Our Testimonials</span>
          <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground mb-12">
            Real stories from customers
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { author: testimonial1Author, review: testimonial1Review },
              { author: testimonial2Author, review: testimonial2Review }
            ].map((item, idx) => (
              <div key={idx} className="p-8 border border-border/30 bg-zinc-950 text-left space-y-6">
                <div className="flex text-primary gap-0.5">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="font-display text-lg leading-relaxed font-light text-muted-foreground italic">
                  {item.review}
                </p>
                <div className="border-t border-border/10 pt-4">
                  <h4 className="font-display text-sm font-semibold text-foreground">{item.author}</h4>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/60 mt-1">Verified Collector</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Latest Blogs/Journal Section */}
      <section className="py-24 bg-black border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary block mb-3">Latest Journal</span>
              <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-wider text-foreground leading-tight">
                Fresh updates and stories from the studio
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-none border-border hover:bg-white hover:text-black shrink-0">
              <Link to="/journal">View All Articles</Link>
            </Button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm font-light">
              No articles published yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <article key={post.id} className="group border border-border/30 bg-zinc-950 flex flex-col justify-between hover:border-primary/50 transition-all duration-500">
                  <Link to={`/journal/${post.slug}`} className="aspect-[16/10] w-full overflow-hidden border-b border-border/20 block relative bg-zinc-900">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-lg tracking-[0.2em] text-muted-foreground/30 uppercase">
                        MANCRO
                      </div>
                    )}
                  </Link>
                  <div className="p-6 space-y-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-semibold">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <h3 className="font-display text-lg font-light text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                      <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <div className="pt-4 border-t border-border/10">
                      <Link to={`/journal/${post.slug}`} className="text-xs font-mono uppercase tracking-widest text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}