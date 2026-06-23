import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function WatchTable({ watches }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) return;
    await base44.entities.Watch.delete(id);
    queryClient.invalidateQueries({ queryKey: ['watches'] });
  };

  const toggleStatus = async (watch) => {
    const newStatus = watch.status === 'Active' ? 'Hidden' : 'Active';
    await base44.entities.Watch.update(watch.id, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['watches'] });
  };

  if (watches.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-heading">No watches found</p>
        <p className="text-sm mt-1">Add your first watch to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Image</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Watch Name</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Price</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Stock</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watches.map((watch) => (
            <TableRow key={watch.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/watches/${watch.id}/edit`)}>
              <TableCell>
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {watch.images?.[0] ? (
                    <img src={watch.images[0]} alt={watch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-muted-foreground">No Image</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{watch.name}</p>
                  <p className="text-xs text-muted-foreground">{watch.sku}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">₹{watch.price?.toLocaleString()}</p>
                  {watch.discount_price > 0 && (
                    <p className="text-xs text-primary">₹{watch.discount_price?.toLocaleString()}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {watch.stock_quantity > 0 ? (
                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                    {watch.stock_quantity} in stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">
                    Out of stock
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className="border-primary/20 text-primary/80 text-xs">
                  {watch.category}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className={watch.status === 'Active'
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-muted text-muted-foreground border border-border"
                }>
                  {watch.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/watches/${watch.id}/edit`); }}>
                      <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleStatus(watch); }}>
                      {watch.status === 'Active' ? <EyeOff className="w-3.5 h-3.5 mr-2" /> : <Eye className="w-3.5 h-3.5 mr-2" />}
                      {watch.status === 'Active' ? 'Hide' : 'Show'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(watch.id); }}>
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}