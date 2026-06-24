import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setSeo } from '@/lib/seo';

export default function Contact() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialWatchId = queryParams.get('watchId') || '';
  const initialWatchName = queryParams.get('watchName') || '';

  const { data: settingsList = [] } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
  });
  const settings = settingsList[0] || {};

  useEffect(() => {
    setSeo({
      title: 'Contact the Atelier | MANCRO',
      description: 'Request a private viewing or speak with a MANCRO horology specialist.',
    });
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialWatchName ? `Inquiry for ${initialWatchName}` : 'Viewing Inquiry',
    message: '',
    watchId: initialWatchId,
    watchName: initialWatchName
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.entities.Inquiry.create({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        message: form.message,
        watchId: form.watchId || undefined,
        watchName: form.watchName || undefined
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="pb-20 pt-36">
        <section className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Direct Inquiry"
            title="Speak with the Atelier"
            text="Request a private viewing, ask about custom calibers, or speak with an horology advisor."
          />

          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            {/* Info panel */}
            <div className="space-y-10">
              <div className="border border-border/30 bg-zinc-950/60 p-8 backdrop-blur-xl">
                <h2 className="font-display text-xl font-light uppercase tracking-[0.12em] text-foreground">Private Services</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Our specialists are available for digital and physical consultations regarding collection references, custom bespoke commissions, and acquisition logistics.
                </p>

                <div className="mt-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Electronic Mail</p>
                      <a href={`mailto:${settings.store_email || 'atelier@mancro.com'}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {settings.store_email || 'atelier@mancro.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Direct Atelier Line</p>
                      <a href={`tel:${settings.store_phone || '+18005550190'}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {settings.store_phone || '+1 (800) 555-0190'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Atelier Location</p>
                      <span className="text-sm font-medium whitespace-pre-line">
                        {settings.store_address || '173, AR MALL, MOTA VARACHHA, SURAT\n173 AR MALL OPPSUITE PANVEL POINT , MOTA VARACHHA, Surat, Gujarat 394101'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-border/30 bg-zinc-950/40 p-8">
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-display text-sm font-light uppercase tracking-[0.12em] text-foreground">Consultation Hours</h3>
                    <p className="mt-3 text-xs leading-6 text-muted-foreground uppercase tracking-wider font-mono">
                      Monday – Friday<br />
                      09:00 – 18:00 CET
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="border border-border/30 bg-zinc-950 p-8 md:p-14 shadow-xl">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-primary shadow-lg">
                    <CheckCircle2 className="h-10 w-10 animate-pulse" />
                  </div>
                  <h2 className="font-display text-2xl font-light uppercase tracking-[0.12em] text-foreground">Message Received</h2>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                    Your transmission has been securely routed to our curators. An horology specialist will reply within one business day.
                  </p>
                  <Button 
                    onClick={() => {
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: initialWatchName ? `Inquiry for ${initialWatchName}` : 'Viewing Inquiry',
                        message: '',
                        watchId: initialWatchId,
                        watchName: initialWatchName
                      });
                      setSubmitted(false);
                    }} 
                    className="mt-10 rounded-full px-8"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        placeholder="Alexander Mercer"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="alexander@mercer.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Inquiry Subject</Label>
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>Viewing Inquiry</option>
                        <option>Bespoke Commission</option>
                        <option>Collection Acquisition</option>
                        <option>Press & Media</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="Please specify any specific references or timeframes you are inquiring about..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-medium active:scale-[0.98]">
                    {loading ? 'Transmitting...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Transmission
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Atelier Location Map */}
      <div className="w-full h-[600px] border-t border-b border-border/30 bg-zinc-950/60 overflow-hidden relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.9192737903513!2d72.8704574!3d21.2350495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f004fe7ca07%3A0x61c965e267fd5dca!2sAR+Mall!5e0!3m2!1sen!2sin!4v1624442654310!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(1) contrast(1.2)" }} 
          allowFullScreen="" 
          loading="lazy"
          title="MANCRO Atelier Location"
        ></iframe>
      </div>
    </PageShell>
  );
}