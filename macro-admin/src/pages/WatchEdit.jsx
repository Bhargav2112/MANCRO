import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import WatchForm from '@/components/watches/WatchForm';

export default function WatchEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split('/');
  const watchId = pathParts[pathParts.indexOf('watches') + 1];

  const { data: watches = [], isLoading } = useQuery({
    queryKey: ['watches'],
    queryFn: () => base44.entities.Watch.list(),
  });

  const watch = watches.find(w => w.id === watchId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!watch) {
    return <div className="text-center py-16 text-muted-foreground">Watch not found</div>;
  }

  return <WatchForm existingWatch={watch} />;
}