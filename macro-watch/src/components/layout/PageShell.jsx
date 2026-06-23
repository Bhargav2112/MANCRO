import React from 'react';
import SiteHeader from './SiteHeader';
import Footer from './Footer';

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <SiteHeader />
      {children}
      <Footer />
    </div>
  );
}
