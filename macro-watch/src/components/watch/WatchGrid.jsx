import React from 'react';
import WatchCard from './WatchCard';
import WatchSkeleton from './WatchSkeleton';

export default function WatchGrid({ watches = [], isLoading }) {
  if (isLoading) {
    return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <WatchSkeleton key={i} />)}</div>;
  }

  if (!watches.length) {
    return <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">No watches match this selection.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {watches.map((watch) => <WatchCard key={watch.id} watch={watch} />)}
    </div>
  );
}