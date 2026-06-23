import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Watch, Package, Star, AlertTriangle, Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentWatches from '@/components/dashboard/RecentWatches';
import CategoryChart from '@/components/dashboard/CategoryChart';

export default function Dashboard() {
  const { data: watches = [], isLoading } = useQuery({
    queryKey: ['watches'],
    queryFn: () => base44.entities.Watch.list('-created_date'),
  });

  const totalWatches = watches.length;
  const inStock = watches.filter(w => w.stock_quantity > 0).length;
  const outOfStock = watches.filter(w => w.stock_quantity === 0).length;
  const featured = watches.filter(w => w.is_featured).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back to MANCRO Admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Watches" value={totalWatches} icon={Watch} accent />
        <StatCard title="In Stock" value={inStock} icon={Package} />
        <StatCard title="Out of Stock" value={outOfStock} icon={AlertTriangle} />
        <StatCard title="Featured" value={featured} icon={Star} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentWatches watches={watches} />
        <CategoryChart watches={watches} />
      </div>
    </div>
  );
}