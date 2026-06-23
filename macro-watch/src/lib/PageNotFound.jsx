import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_40%)]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-lg shadow-black/40">
          <Clock className="h-10 w-10 animate-pulse" />
        </div>
        
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Lost in Time</h1>
        
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          The caliber page you are looking for does not exist or has been moved to another vault in the MANCRO collection.
        </p>

        <div className="mt-10">
          <Button asChild size="lg" className="rounded-full px-8 active:scale-[0.98]">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Vault
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
