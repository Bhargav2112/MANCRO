import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import { setSeo } from '@/lib/seo';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Journal() {
  useEffect(() => {
    setSeo({ 
      title: 'Journal | MANCRO Horological Diaries', 
      description: 'Atelier notes, mechanical philosophies, and updates from the MANCRO watchmaker studio.' 
    });
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const getExcerpt = (content, limit = 120) => {
    // Simple regex to strip basic markdown for excerpt preview
    const cleanText = content
      ?.replace(/[#*`_\[\]()\-]/g, '')
      ?.trim();
    if (!cleanText) return '';
    return cleanText.length > limit ? cleanText.substring(0, limit) + '...' : cleanText;
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-20 text-center">
            <SectionHeader 
              eyebrow="Chronicle & Atelier" 
              title="The Journal" 
              text="Reflections on horological heritage, engineering philosophy, and studio updates."
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs uppercase font-mono tracking-widest text-muted-foreground/60">Retrieving Chronicle...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 border border-border/30 bg-zinc-950/40 backdrop-blur-md p-10 max-w-xl mx-auto">
              <BookOpen className="mx-auto h-8 w-8 text-primary/60 mb-4" />
              <h3 className="font-display text-xl font-light uppercase text-foreground tracking-wider">Silence in the Studio</h3>
              <p className="mt-3 text-sm text-muted-foreground/80 leading-7 font-light">
                No entries have been published to the journal yet. Check back soon for updates from our horologists.
              </p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <motion.article 
                  key={post.id}
                  variants={itemVariants}
                  className="group flex flex-col justify-between border border-border/30 bg-zinc-950/40 backdrop-blur-md overflow-hidden hover:border-primary/50 transition-all duration-500"
                >
                  <Link to={`/journal/${post.slug}`} className="block overflow-hidden aspect-[16/10] relative bg-zinc-900 border-b border-border/20">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-lg tracking-[0.2em] text-muted-foreground/30 uppercase font-light">
                        MANCRO
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </Link>

                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Date */}
                      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-primary font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-display text-2xl font-light text-foreground group-hover:text-primary transition-colors leading-tight">
                        <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-muted-foreground/80 text-sm leading-8 font-light">
                        {getExcerpt(post.content)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/10">
                      <Link 
                        to={`/journal/${post.slug}`} 
                        className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-foreground group-hover:text-primary transition-colors font-mono"
                      >
                        Read Article <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
