import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import WatchFilters from '@/components/watches/WatchFilters';
import WatchTable from '@/components/watches/WatchTable';

export default function Watches() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');

  const { data: watches = [], isLoading } = useQuery({
    queryKey: ['watches'],
    queryFn: () => base44.entities.Watch.list('-created_date'),
  });

  const filtered = useMemo(() => {
    return watches.filter(w => {
      const matchSearch = !search || 
        w.name?.toLowerCase().includes(search.toLowerCase()) ||
        w.sku?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || w.category === category;
      const matchStock = stockStatus === 'All' ||
        (stockStatus === 'In Stock' && w.stock_quantity > 0) ||
        (stockStatus === 'Out of Stock' && w.stock_quantity === 0);
      return matchSearch && matchCategory && matchStock;
    });
  }, [watches, search, category, stockStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">Watches</h1>
          <p className="text-sm text-muted-foreground mt-1">{watches.length} total products</p>
        </div>
        <Button onClick={() => navigate('/watches/new')} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Watch
        </Button>
      </div>

      <WatchFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        stockStatus={stockStatus}
        onStockStatusChange={setStockStatus}
      />

      <WatchTable watches={filtered} />
    </div>
  );
}