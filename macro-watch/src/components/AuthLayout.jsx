import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, icon: Icon, title, subtitle, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_40%)]" />
      
      {/* Vertical architectural layout line */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo and Icon */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="group flex items-center gap-2.5 font-display text-3xl tracking-[0.24em] text-foreground">
            MANCRO
          </Link>
          
          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-card text-primary shadow-lg shadow-black/40">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form Container */}
        <div className="mt-8 rounded-[2.5rem] border border-border bg-card/70 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          {children}
        </div>

        {/* Footer link */}
        {footer && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
