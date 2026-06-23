import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/layout/PageShell';
import SectionHeader from '@/components/common/SectionHeader';
import WatchFilters from '@/components/watch/WatchFilters';
import WatchGrid from '@/components/watch/WatchGrid';
import { setSeo } from '@/lib/seo';

export default function Collection() {
  useEffect(() => setSeo({ title: 'MANCRO Collection | Luxury Watch Vault', description: 'Explore MANCRO luxury watches with dynamic search, filters and clean product URLs.' }), []);
  const [filters, setFilters] = useState({ search: '', category: 'all', price: 'all', sort: 'featured' });
  const { data: watches = [], isLoading } = useQuery({ queryKey: ['watches'], queryFn: () => base44.entities.Watch.list('-created_date') });

  const filtered = useMemo(() => {
    let next = watches.filter((watch) => {
      const text = `${watch.name} ${watch.description} ${watch.category}`.toLowerCase();
      const matchesSearch = text.includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || watch.category === filters.category;
      const matchesPrice = filters.price === 'all' ||
        (filters.price === 'under5000' && watch.price < 5000) ||
        (filters.price === '5000to10000' && watch.price >= 5000 && watch.price <= 10000) ||
        (filters.price === 'over10000' && watch.price > 10000);
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (filters.sort === 'priceAsc') next = [...next].sort((a, b) => a.price - b.price);
    if (filters.sort === 'priceDesc') next = [...next].sort((a, b) => b.price - a.price);
    if (filters.sort === 'newest') next = [...next].sort((a, b) => Number(!!b.is_new_arrival) - Number(!!a.is_new_arrival));
    if (filters.sort === 'featured') next = [...next].sort((a, b) => Number(!!b.is_featured) - Number(!!a.is_featured));
    return next;
  }, [watches, filters]);

  return (
    <PageShell>
      <main className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="The Vault Gallery" title="Collection" text="Search, filter and sort MANCRO references loaded dynamically from the product database." />
          <WatchFilters filters={filters} setFilters={setFilters} />
          <WatchGrid watches={filtered} isLoading={isLoading} />
        </div>
      </main>
    </PageShell>
  );
}