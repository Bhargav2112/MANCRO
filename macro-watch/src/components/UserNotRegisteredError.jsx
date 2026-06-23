import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function UserNotRegisteredError() {
  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = '/login';
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_40%)]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-destructive/30 bg-card text-destructive shadow-lg shadow-black/40">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
        </div>
        
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-destructive">Access Restricted</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">Unregistered Account</h1>
        
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Your email address has not been registered in the MANCRO collector database. Registration is restricted to invited clientele.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={handleLogout} size="lg" variant="outline" className="rounded-full border-primary/50 text-primary px-8">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
