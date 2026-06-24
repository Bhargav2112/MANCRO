import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Clock, Menu, X, Search, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Search Form State
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: settingsList = [] } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
  });
  const settings = settingsList[0] || {};

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory !== 'All') {
      params.append('category', searchCategory);
    }
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    navigate(`/collection?${params.toString()}`);
  };

  const links = [
    ['Collection', '/collection'],
    ['Journal', '/journal'],
    ['About', '/about'],
    ['Contact', '/contact'],
  ];

  const logoUrl = settings.logo_url || 'https://media.base44.com/images/public/user_6943e9bbf2f0c149cfad4c09/09139be0f_MANCROlogo.jpg';

  return (
    <header className="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
      {/* 1. Topbar */}
      <div className="bg-primary text-primary-foreground text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] py-2 px-6 flex items-center justify-center gap-2 border-b border-primary/20 z-50">
        <Clock className="h-3.5 w-3.5" />
        <span>{settings.topbar_text || "Get a Flat 10% Off on All Watches - Limited Time Only"}</span>
      </div>

      {/* 2. Main Header */}
      <div className={`transition-all duration-300 ${scrolled ? 'bg-black/95 border-b border-border/40 py-4 shadow-2xl backdrop-blur-md' : 'bg-black/80 border-b border-border/10 py-6'}`}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="MANCRO home">
            <img src={logoUrl} alt="MANCRO logo" className="h-9 w-9 rounded-full object-cover invert" />
            <span className="font-display text-2xl tracking-[0.25em] text-foreground font-semibold">MANCRO</span>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
            {links.map(([label, to]) => (
              <NavLink 
                key={to} 
                to={to} 
                className={({ isActive }) => `relative text-xs uppercase tracking-[0.25em] py-1 transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'} group`}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Hotline / Contact (Right) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5">
              <PhoneCall className="h-4 w-4 text-primary" />
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-left">
              <p className="text-muted-foreground/50">Get Support</p>
              <a href={`tel:${settings.store_phone || '+1 (800) 555-0190'}`} className="text-foreground font-semibold hover:text-primary transition-colors">
                {settings.store_phone || '+1 (800) 555-0190'}
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </Button>
        </div>
      </div>



      {/* Mobile Menu Drawer */}
      {open && (
        <div className="fixed inset-0 top-[110px] z-40 bg-black/95 backdrop-blur-2xl md:hidden flex flex-col justify-start gap-8 px-8 pt-12 overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setOpen(false); }} className="flex items-center bg-zinc-900 border border-border p-2">
            <input
              type="text"
              placeholder="Search timepieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm px-2 py-1"
            />
            <button type="submit" className="p-1 text-muted-foreground">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-col gap-6">
            {links.map(([label, to]) => (
              <Link 
                key={to} 
                to={to} 
                onClick={() => setOpen(false)} 
                className="text-md uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors border-b border-border/40 pb-3"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Hotline */}
          <div className="flex items-center gap-3 mt-4 pt-6 border-t border-border/40">
            <div className="h-10 w-10 border border-primary/30 rounded-full flex items-center justify-center bg-primary/5">
              <PhoneCall className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xs uppercase font-mono tracking-widest text-left">
              <p className="text-muted-foreground/50">Get Support</p>
              <a href={`tel:${settings.store_phone || '+1 (800) 555-0190'}`} className="text-foreground font-semibold hover:text-primary transition-colors">
                {settings.store_phone || '+1 (800) 555-0190'}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}