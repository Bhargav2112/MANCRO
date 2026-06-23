import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Award, RotateCcw, Truck, Smartphone, AppWindow } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function Footer() {
  const { data: settingsList = [] } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
  });
  const settings = settingsList[0] || {};

  const logoUrl = settings.logo_url || 'https://media.base44.com/images/public/user_6943e9bbf2f0c149cfad4c09/09139be0f_MANCROlogo.jpg';

  return (
    <footer className="bg-black text-foreground">
      {/* 1. Benefits Row Section */}
      <div className="border-t border-b border-border/30 bg-zinc-950/60 py-12 px-6">
        <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5 shrink-0">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-light uppercase tracking-wider text-foreground">Safe & Secure Checkout</h3>
              <p className="text-muted-foreground/60 text-xs mt-1 leading-normal font-sans">100% encrypted payment gateways.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5 shrink-0">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-light uppercase tracking-wider text-foreground">Premium Quality</h3>
              <p className="text-muted-foreground/60 text-xs mt-1 leading-normal font-sans">Guaranteed authentic luxury watches.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5 shrink-0">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-light uppercase tracking-wider text-foreground">7-Day Easy Returns</h3>
              <p className="text-muted-foreground/60 text-xs mt-1 leading-normal font-sans">Hassle-free return policy.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5 shrink-0">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-light uppercase tracking-wider text-foreground">Reliable Delivery</h3>
              <p className="text-muted-foreground/60 text-xs mt-1 leading-normal font-sans">Insured express worldwide shipping.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] pb-16 border-b border-border/20">
          {/* Col 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoUrl} alt="MANCRO logo" className="h-9 w-9 rounded-full object-cover invert" />
              <span className="font-display text-2xl tracking-[0.25em] text-foreground font-semibold">MANCRO</span>
            </Link>
            <p className="font-sans text-sm leading-8 text-muted-foreground/80 max-w-sm font-light">
              We are dedicated to crafting premium watches that combine timeless design, chronometer-grade precision, and micro-mechanical purity.
            </p>
            {/* App Store Badges */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-primary">Download Our App</h4>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-2 px-3 py-2 border border-border/80 hover:border-primary/50 transition-colors bg-zinc-950 text-[10px] font-mono uppercase tracking-wider">
                  <Smartphone className="h-4 w-4 text-primary" /> App Store
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 border border-border/80 hover:border-primary/50 transition-colors bg-zinc-950 text-[10px] font-mono uppercase tracking-wider">
                  <AppWindow className="h-4 w-4 text-primary" /> Google Play
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary">Quick Links</h3>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground font-light">
              <li><Link className="hover:text-foreground transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/about">About Us</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/collection">Our Collection</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/journal">Blog Journal</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary">Our Collections</h3>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground font-light">
              <li><Link className="hover:text-foreground transition-colors" to="/collection?category=Heritage">Heritage Series</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/collection?category=Sport">Sports Chronos</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/collection?category=Dress">Elegant Dress</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/collection?category=Skeleton">Skeleton Openwork</Link></li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary">Atelier Services</h3>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground font-light">
              <li><Link className="hover:text-foreground transition-colors" to="/contact">Advisor Consultation</Link></li>
              <li><a className="hover:text-foreground transition-colors" href="https://wa.me/?text=I%20would%20like%20to%20request%20information%20about%20your%20services" target="_blank" rel="noreferrer">WhatsApp Chat</a></li>
              <li><a className="hover:text-foreground transition-colors" href="#">Shipping Policy</a></li>
              <li><a className="hover:text-foreground transition-colors" href="#">Returns & Exchanges</a></li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-muted-foreground/60">
          <p>Copyright © {new Date().getFullYear()} MANCRO. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}