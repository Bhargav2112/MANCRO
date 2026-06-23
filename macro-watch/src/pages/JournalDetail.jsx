import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Calendar, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/layout/PageShell';
import { setSeo } from '@/lib/seo';

export default function JournalDetail() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['public-post-detail', slug],
    queryFn: () => base44.entities.Post.getBySlug(slug),
  });

  useEffect(() => {
    if (post) {
      setSeo({
        title: `${post.title} | MANCRO Journal`,
        description: post.content?.substring(0, 150) || 'MANCRO editorial article'
      });
    }
  }, [post]);

  if (isLoading) {
    return (
      <PageShell>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs uppercase font-mono tracking-widest text-muted-foreground/60">Opening Archive...</p>
        </div>
      </PageShell>
    );
  }

  if (error || !post) {
    return (
      <PageShell>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
          <BookOpen className="h-10 w-10 text-destructive mb-4" />
          <h2 className="font-display text-2xl font-light uppercase tracking-wider text-foreground">Article Not Found</h2>
          <p className="mt-4 text-muted-foreground max-w-sm text-sm font-light leading-7">
            The article you are looking for does not exist or has been archived by the atelier.
          </p>
          <Link to="/journal" className="mt-8 inline-flex items-center text-xs tracking-[0.2em] uppercase text-primary font-mono">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="min-h-screen bg-black pt-32 pb-24 px-6">
        <article className="mx-auto max-w-3xl">
          {/* Back Navigation */}
          <div className="mb-12">
            <Link 
              to="/journal" 
              className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
            </Link>
          </div>

          {/* Cover Image */}
          {post.image && (
            <div className="aspect-[16/9] w-full overflow-hidden border border-border/30 bg-zinc-950 mb-12">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-primary font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.1] tracking-wide">
              {post.title}
            </h1>
            
            <div className="h-px bg-gradient-to-r from-primary/30 via-border/20 to-transparent pt-4" />
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none font-sans text-sm leading-8 tracking-wide font-light text-muted-foreground/90 space-y-6">
            <ReactMarkdown 
              components={{
                h2: ({node, ...props}) => <h2 className="font-display text-2xl font-light text-foreground uppercase tracking-widest mt-12 mb-6" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-display text-xl font-light text-foreground uppercase tracking-widest mt-8 mb-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-6 leading-8 font-light" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 font-light" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 font-light" {...props} />,
                li: ({node, ...props}) => <li className="leading-7" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-2 border-primary pl-6 my-8 italic text-foreground bg-zinc-950/40 p-4 font-display text-lg" {...props} />
                ),
                strong: ({node, ...props}) => <strong className="text-foreground font-semibold" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
