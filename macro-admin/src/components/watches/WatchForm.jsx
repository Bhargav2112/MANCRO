import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

const categories = ["Luxury", "Sport", "Classic", "Dress", "Dive", "Chronograph", "Smart", "Limited Edition"];
const movements = ["Automatic", "Quartz", "Mechanical", "Solar", "Kinetic"];
const caseMaterials = ["Stainless Steel", "Titanium", "Gold", "Rose Gold", "Ceramic", "Carbon Fiber", "Platinum"];
const strapMaterials = ["Leather", "Stainless Steel", "Rubber", "NATO", "Mesh", "Ceramic", "Titanium"];

const defaultWatch = {
  name: '', model_number: '', brand: 'MANCRO', category: 'Luxury',
  price: '', discount_price: '', stock_quantity: 0, sku: '',
  description: '', features: '', specifications: '',
  movement_type: 'Automatic', case_material: 'Stainless Steel',
  strap_material: 'Leather', water_resistance: '', warranty: '',
  is_featured: false, is_new_arrival: false, is_best_seller: false,
  status: 'Active', images: []
};

export default function WatchForm({ existingWatch }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [watch, setWatch] = useState(existingWatch || defaultWatch);

  const updateField = (field, value) => setWatch(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...watch,
      price: Number(watch.price) || 0,
      discount_price: Number(watch.discount_price) || 0,
      stock_quantity: Number(watch.stock_quantity) || 0,
    };
    if (existingWatch) {
      await base44.entities.Watch.update(existingWatch.id, data);
    } else {
      await base44.entities.Watch.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['watches'] });
    setSaving(false);
    navigate('/watches');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/watches')} className="hover:bg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold">
            {existingWatch ? 'Edit Watch' : 'Add New Watch'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {existingWatch ? 'Update watch details' : 'Fill in the watch details below'}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {existingWatch ? 'Update' : 'Save'}
        </Button>
      </div>

      {/* Images */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <ImageUploader images={watch.images || []} onChange={(imgs) => updateField('images', imgs)} />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Watch Name *</Label>
              <Input value={watch.name} onChange={(e) => updateField('name', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Model Number</Label>
              <Input value={watch.model_number} onChange={(e) => updateField('model_number', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input value={watch.brand} onChange={(e) => updateField('brand', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input value={watch.sku} onChange={(e) => updateField('sku', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={watch.category} onValueChange={(v) => updateField('category', v)}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={watch.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={watch.description} onChange={(e) => updateField('description', e.target.value)} className="bg-secondary/50 border-border min-h-[100px]" />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Pricing & Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input type="number" value={watch.price} onChange={(e) => updateField('price', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Discount Price (₹)</Label>
              <Input type="number" value={watch.discount_price} onChange={(e) => updateField('discount_price', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity *</Label>
              <Input type="number" value={watch.stock_quantity} onChange={(e) => updateField('stock_quantity', e.target.value)} className="bg-secondary/50 border-border" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select value={watch.movement_type} onValueChange={(v) => updateField('movement_type', v)}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {movements.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Case Material</Label>
              <Select value={watch.case_material} onValueChange={(v) => updateField('case_material', v)}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {caseMaterials.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Strap Material</Label>
              <Select value={watch.strap_material} onValueChange={(v) => updateField('strap_material', v)}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {strapMaterials.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Water Resistance</Label>
              <Input value={watch.water_resistance} onChange={(e) => updateField('water_resistance', e.target.value)} placeholder="e.g., 100m" className="bg-secondary/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label>Warranty</Label>
              <Input value={watch.warranty} onChange={(e) => updateField('warranty', e.target.value)} placeholder="e.g., 2 Years" className="bg-secondary/50 border-border" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            <Textarea value={watch.features} onChange={(e) => updateField('features', e.target.value)} className="bg-secondary/50 border-border" placeholder="List watch features..." />
          </div>
          <div className="space-y-2">
            <Label>Specifications</Label>
            <Textarea value={watch.specifications} onChange={(e) => updateField('specifications', e.target.value)} className="bg-secondary/50 border-border" placeholder="Technical specifications..." />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Product Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <Label className="cursor-pointer">Featured Product</Label>
              <Switch checked={watch.is_featured} onCheckedChange={(v) => updateField('is_featured', v)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <Label className="cursor-pointer">New Arrival</Label>
              <Switch checked={watch.is_new_arrival} onCheckedChange={(v) => updateField('is_new_arrival', v)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <Label className="cursor-pointer">Best Seller</Label>
              <Switch checked={watch.is_best_seller} onCheckedChange={(v) => updateField('is_best_seller', v)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}