import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Loader2, Upload, ExternalLink } from 'lucide-react';

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function Posts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    status: 'Published'
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const filtered = useMemo(() => {
    return posts.filter(p => 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      content: '',
      image: '',
      status: 'Published'
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      image: post.image,
      status: post.status
    });
    setIsDialogOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setForm(prev => {
      const updated = { ...prev, title: val };
      // Auto-slugify only if we are creating a new post
      if (!editingPost) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, image: file_url }));
    } catch (err) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      alert('Title, Slug and Content are required');
      return;
    }
    
    try {
      setLoading(true);
      if (editingPost) {
        await base44.entities.Post.update(editingPost.id, form);
      } else {
        await base44.entities.Post.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDialogOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await base44.entities.Post.delete(id);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (err) {
      alert(err.message || 'Failed to delete post');
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
          <h1 className="text-2xl font-heading font-bold tracking-tight">Blog Journal</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} editorial articles</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Write Article
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles by title or content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border"
          />
        </div>
      </div>

      {/* Posts Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-[100px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No articles found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((post) => (
                  <TableRow key={post.id} className="border-border hover:bg-secondary/20">
                    <TableCell>
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-12 h-12 object-cover rounded-lg border border-border bg-muted" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-secondary/80 rounded-lg border border-border flex items-center justify-center text-[10px] text-muted-foreground uppercase font-mono">
                          No Pic
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[150px] truncate text-muted-foreground">{post.slug}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'Published' ? 'default' : 'secondary'} className={post.status === 'Published' ? 'bg-primary/20 text-primary border border-primary/30' : ''}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEdit(post)} className="border-border hover:bg-secondary">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(post.id)} className="border-border hover:bg-destructive/10">
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading">
              {editingPost ? 'Edit Article' : 'Write New Article'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={form.title} 
                  onChange={handleTitleChange} 
                  placeholder="Enter article title..." 
                  className="bg-secondary/50 border-border"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug"
                  value={form.slug} 
                  onChange={(e) => setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))} 
                  placeholder="slug-url-here" 
                  className="bg-secondary/50 border-border font-mono text-xs"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <img src={form.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-border bg-muted" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Publishing Status</Label>
                <Select 
                  value={form.status} 
                  onValueChange={(val) => setForm(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger id="status" className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea 
                id="content"
                value={form.content} 
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} 
                placeholder="Write your article content here..." 
                className="bg-secondary/50 border-border min-h-[250px] font-sans text-sm leading-relaxed"
                required 
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading} className="border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingPost ? 'Save Changes' : 'Publish Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
