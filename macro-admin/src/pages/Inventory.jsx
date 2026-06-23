import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Minus, Loader2, Search, Package } from 'lucide-react';

export default function Inventory() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [adjustments, setAdjustments] = useState({});

  const { data: watches = [], isLoading } = useQuery({
    queryKey: ['watches'],
    queryFn: () => base44.entities.Watch.list('-created_date'),
  });

  const filtered = watches.filter(w =>
    !search || w.name?.toLowerCase().includes(search.toLowerCase()) || w.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const updateStock = async (watchId, currentStock, change) => {
    const newQty = Math.max(0, currentStock + change);
    await base44.entities.Watch.update(watchId, { stock_quantity: newQty });
    queryClient.invalidateQueries({ queryKey: ['watches'] });
  };

  const setCustomStock = async (watchId, value) => {
    const newQty = Math.max(0, Number(value) || 0);
    await base44.entities.Watch.update(watchId, { stock_quantity: newQty });
    queryClient.invalidateQueries({ queryKey: ['watches'] });
    setAdjustments(prev => ({ ...prev, [watchId]: undefined }));
  };

  const totalStock = watches.reduce((sum, w) => sum + (w.stock_quantity || 0), 0);
  const outOfStock = watches.filter(w => w.stock_quantity === 0).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage stock levels</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{totalStock}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-destructive/10">
                <Package className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{outOfStock}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search watches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Product</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">SKU</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Stock</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((watch) => (
                <TableRow key={watch.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {watch.images?.[0] ? (
                          <img src={watch.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">IMG</div>
                        )}
                      </div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{watch.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{watch.sku}</TableCell>
                  <TableCell>
                    <span className="text-sm font-heading font-bold">{watch.stock_quantity}</span>
                  </TableCell>
                  <TableCell>
                    {watch.stock_quantity > 0 ? (
                      <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">In Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">Out of Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border"
                        onClick={() => updateStock(watch.id, watch.stock_quantity, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={adjustments[watch.id] ?? watch.stock_quantity}
                        onChange={(e) => setAdjustments(prev => ({ ...prev, [watch.id]: e.target.value }))}
                        onBlur={() => {
                          if (adjustments[watch.id] !== undefined) {
                            setCustomStock(watch.id, adjustments[watch.id]);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && adjustments[watch.id] !== undefined) {
                            setCustomStock(watch.id, adjustments[watch.id]);
                          }
                        }}
                        className="w-16 h-8 text-center bg-secondary/50 border-border text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border"
                        onClick={() => updateStock(watch.id, watch.stock_quantity, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No watches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}