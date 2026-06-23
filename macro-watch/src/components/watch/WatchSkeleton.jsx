import React from 'react';

export default function WatchSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-4">
      <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-gradient-to-br from-secondary via-muted to-secondary" />
      <div className="mt-5 h-4 w-20 rounded-full bg-muted" />
      <div className="mt-4 h-7 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-4 w-24 rounded bg-muted" />
    </div>
  );
}