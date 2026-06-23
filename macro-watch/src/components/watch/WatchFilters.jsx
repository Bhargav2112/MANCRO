import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function WatchFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mb-10 grid gap-4 rounded-[2rem] border border-border bg-card/70 p-4 backdrop-blur-xl md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder="Search the vault" className="h-12 rounded-full border-border bg-background pl-11" />
      </div>
      <Select value={filters.category} onValueChange={(value) => update('category', value)}>
        <SelectTrigger className="h-12 rounded-full bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Heritage">Heritage</SelectItem>
          <SelectItem value="Sport">Sport</SelectItem>
          <SelectItem value="Dress">Dress</SelectItem>
          <SelectItem value="Skeleton">Skeleton</SelectItem>
          <SelectItem value="Limited">Limited</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.price} onValueChange={(value) => update('price', value)}>
        <SelectTrigger className="h-12 rounded-full bg-background"><SelectValue placeholder="Price" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="under5000">Under $5,000</SelectItem>
          <SelectItem value="5000to10000">$5,000 — $10,000</SelectItem>
          <SelectItem value="over10000">Above $10,000</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.sort} onValueChange={(value) => update('sort', value)}>
        <SelectTrigger className="h-12 rounded-full bg-background"><SelectValue placeholder="Sort by" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="newest">New Arrivals</SelectItem>
          <SelectItem value="priceAsc">Price Low to High</SelectItem>
          <SelectItem value="priceDesc">Price High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}