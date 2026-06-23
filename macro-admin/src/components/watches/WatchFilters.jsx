import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

const categories = ["All", "Luxury", "Sport", "Classic", "Dress", "Dive", "Chronograph", "Smart", "Limited Edition"];
const stockStatuses = ["All", "In Stock", "Out of Stock"];

export default function WatchFilters({ search, onSearchChange, category, onCategoryChange, stockStatus, onStockStatusChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-44 bg-card border-border">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={stockStatus} onValueChange={onStockStatusChange}>
        <SelectTrigger className="w-full sm:w-44 bg-card border-border">
          <SelectValue placeholder="Stock Status" />
        </SelectTrigger>
        <SelectContent>
          {stockStatuses.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}