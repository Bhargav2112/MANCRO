import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Upload, MoveUp, MoveDown } from 'lucide-react';

export default function Slides() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '/collection',
    order: 0
  });

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['slides'],
    queryFn: () => base44.entities.Slide.list(),
  });

  const sortedSlides = useMemo(() => {
    return [...slides].sort((a, b) => a.order - b.order);
  }, [slides]);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '/collection',
      order: slides.length
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      linkUrl: slide.linkUrl,
      order: slide.order
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, imageUrl: file_url }));
    } catch (err) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      alert('Title and Image are required');
      return;
    }
    
    try {
      setLoading(true);
      if (editingSlide) {
        await base44.entities.Slide.update(editingSlide.id, form);
      } else {
        await base44.entities.Slide.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ['slides'] });
      setIsDialogOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      await base44.entities.Slide.delete(id);
      queryClient.invalidateQueries({ queryKey: ['slides'] });
    } catch (err) {
      alert(err.message || 'Failed to delete slide');
    }
  };

  const handleMove = async (slide, direction) => {
    const currentIndex = sortedSlides.findIndex(s => s.id === slide.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sortedSlides.length - 1) return;

    const swapTarget = direction === 'up' 
      ? sortedSlides[currentIndex - 1] 
      : sortedSlides[currentIndex + 1];

    try {
      setLoading(true);
      // Swap order values
      const currentOrder = slide.order;
      const targetOrder = swapTarget.order;

      // Update both slides
      await base44.entities.Slide.update(slide.id, { ...slide, order: targetOrder });
      await base44.entities.Slide.update(swapTarget.id, { ...swapTarget, order: currentOrder });

      queryClient.invalidateQueries({ queryKey: ['slides'] });
    } catch (err) {
      alert('Failed to reorder slides: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-heading font-bold tracking-tight">Hero Slider</h1>
          <p className="text-sm text-muted-foreground mt-1">{slides.length} slides configured on landing page</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Slide
        </Button>
      </div>

      {/* Slide list card */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead className="w-[120px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle / Eyebrow</TableHead>
                <TableHead>Button Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSlides.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No slides configured. The homepage will display the default static Cinematic Hero.
                  </TableCell>
                </TableRow>
              ) : (
                sortedSlides.map((slide, idx) => (
                  <TableRow key={slide.id} className="border-border hover:bg-secondary/20">
                    <TableCell className="font-mono text-sm text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1">
                        <span>{slide.order}</span>
                        <div className="flex flex-col gap-0.5 ml-2">
                          <button 
                            onClick={() => handleMove(slide, 'up')}
                            disabled={idx === 0 || loading}
                            className="p-0.5 hover:bg-secondary rounded disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3 h-3 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handleMove(slide, 'down')}
                            disabled={idx === sortedSlides.length - 1 || loading}
                            className="p-0.5 hover:bg-secondary rounded disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {slide.imageUrl ? (
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title} 
                          className="w-20 h-10 object-cover rounded-md border border-border bg-muted" 
                        />
                      ) : (
                        <div className="w-20 h-10 bg-secondary/80 rounded-md border border-border flex items-center justify-center text-[10px] text-muted-foreground uppercase font-mono">
                          No Pic
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{slide.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate text-sm">{slide.subtitle || '—'}</TableCell>
                    <TableCell className="font-mono text-xs text-primary">{slide.linkUrl || '—'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEdit(slide)} className="border-border hover:bg-secondary">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(slide.id)} className="border-border hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Slide Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading">
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slide-title">Slide Title</Label>
              <Input 
                id="slide-title"
                value={form.title} 
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="e.g. Precision from Silence" 
                className="bg-secondary/50 border-border"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slide-subtitle">Subtitle / Eyebrow Text</Label>
              <Input 
                id="slide-subtitle"
                value={form.subtitle} 
                onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))} 
                placeholder="e.g. Chronos Architectural Legacy" 
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slide-link">Button Link URL</Label>
                <Input 
                  id="slide-link"
                  value={form.linkUrl} 
                  onChange={(e) => setForm(prev => ({ ...prev, linkUrl: e.target.value }))} 
                  placeholder="e.g. /collection" 
                  className="bg-secondary/50 border-border font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-order">Sorting Order</Label>
                <Input 
                  id="slide-order"
                  type="number"
                  value={form.order} 
                  onChange={(e) => setForm(prev => ({ ...prev, order: Number(e.target.value) || 0 }))} 
                  className="bg-secondary/50 border-border font-mono text-xs"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slide Background Image</Label>
              <div className="flex items-center gap-4">
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Slide Preview" className="w-32 h-16 object-cover rounded-lg border border-border bg-muted" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload Background</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading} className="border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingSlide ? 'Save Slide' : 'Add Slide'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
