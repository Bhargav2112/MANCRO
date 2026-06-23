import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, Loader2, Upload, Globe, FileText, Layers, Video, Quote, Info } from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    store_name: 'MANCRO',
    topbar_text: '',
    store_email: '',
    store_phone: '',
    whatsapp_number: '',
    store_address: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    youtube_url: '',
    logo_url: '',
    banner_url: '',
    for_him_image_url: '',
    for_her_image_url: '',
    about_text: '',
    about_title: '',
    about_description: '',
    counter1_val: '',
    counter1_title: '',
    counter1_desc: '',
    counter2_val: '',
    counter2_title: '',
    counter2_desc: '',
    counter3_val: '',
    counter3_title: '',
    counter3_desc: '',
    for_him_title: '',
    for_him_desc: '',
    for_him_link: '',
    for_her_title: '',
    for_her_desc: '',
    for_her_link: '',
    col1_title: '',
    col1_tag: '',
    col1_image: '',
    col1_desc: '',
    col2_title: '',
    col2_tag: '',
    col2_image: '',
    col2_desc: '',
    col3_title: '',
    col3_tag: '',
    col3_image: '',
    col3_desc: '',
    intro_video_url: '',
    intro_video_title: '',
    intro_video_subtitle: '',
    why_choose_image: '',
    why_choose_title: '',
    why_acc1_title: '',
    why_acc1_text: '',
    why_acc2_title: '',
    why_acc2_text: '',
    why_acc3_title: '',
    why_acc3_text: '',
    why_acc4_title: '',
    why_acc4_text: '',
    social_video1_url: '',
    social_video2_url: '',
    social_video3_url: '',
    social_video4_url: '',
    testimonial1_author: '',
    testimonial1_review: '',
    testimonial2_author: '',
    testimonial2_review: '',
  });
  const [existingId, setExistingId] = useState(null);

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => base44.entities.StoreSettings.list(),
  });

  useEffect(() => {
    if (settingsList.length > 0) {
      const s = settingsList[0];
      setExistingId(s.id);
      setSettings({
        store_name: s.store_name || 'MANCRO',
        topbar_text: s.topbar_text || '',
        store_email: s.store_email || '',
        store_phone: s.store_phone || '',
        whatsapp_number: s.whatsapp_number || '',
        store_address: s.store_address || '',
        instagram_url: s.instagram_url || '',
        facebook_url: s.facebook_url || '',
        twitter_url: s.twitter_url || '',
        youtube_url: s.youtube_url || '',
        logo_url: s.logo_url || '',
        banner_url: s.banner_url || '',
        for_him_image_url: s.for_him_image_url || '',
        for_her_image_url: s.for_her_image_url || '',
        about_text: s.about_text || '',
        about_title: s.about_title || '',
        about_description: s.about_description || '',
        counter1_val: s.counter1_val || '',
        counter1_title: s.counter1_title || '',
        counter1_desc: s.counter1_desc || '',
        counter2_val: s.counter2_val || '',
        counter2_title: s.counter2_title || '',
        counter2_desc: s.counter2_desc || '',
        counter3_val: s.counter3_val || '',
        counter3_title: s.counter3_title || '',
        counter3_desc: s.counter3_desc || '',
        for_him_title: s.for_him_title || '',
        for_him_desc: s.for_him_desc || '',
        for_him_link: s.for_him_link || '',
        for_her_title: s.for_her_title || '',
        for_her_desc: s.for_her_desc || '',
        for_her_link: s.for_her_link || '',
        col1_title: s.col1_title || '',
        col1_tag: s.col1_tag || '',
        col1_image: s.col1_image || '',
        col1_desc: s.col1_desc || '',
        col2_title: s.col2_title || '',
        col2_tag: s.col2_tag || '',
        col2_image: s.col2_image || '',
        col2_desc: s.col2_desc || '',
        col3_title: s.col3_title || '',
        col3_tag: s.col3_tag || '',
        col3_image: s.col3_image || '',
        col3_desc: s.col3_desc || '',
        intro_video_url: s.intro_video_url || '',
        intro_video_title: s.intro_video_title || '',
        intro_video_subtitle: s.intro_video_subtitle || '',
        why_choose_image: s.why_choose_image || '',
        why_choose_title: s.why_choose_title || '',
        why_acc1_title: s.why_acc1_title || '',
        why_acc1_text: s.why_acc1_text || '',
        why_acc2_title: s.why_acc2_title || '',
        why_acc2_text: s.why_acc2_text || '',
        why_acc3_title: s.why_acc3_title || '',
        why_acc3_text: s.why_acc3_text || '',
        why_acc4_title: s.why_acc4_title || '',
        why_acc4_text: s.why_acc4_text || '',
        social_video1_url: s.social_video1_url || '',
        social_video2_url: s.social_video2_url || '',
        social_video3_url: s.social_video3_url || '',
        social_video4_url: s.social_video4_url || '',
        testimonial1_author: s.testimonial1_author || '',
        testimonial1_review: s.testimonial1_review || '',
        testimonial2_author: s.testimonial2_author || '',
        testimonial2_review: s.testimonial2_review || '',
      });
    }
  }, [settingsList]);

  const updateField = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleFileUpload = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateField(field, file_url);
    } catch (err) {
      console.error('File upload failed', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (existingId) {
        await base44.entities.StoreSettings.update(existingId, settings);
      } else {
        await base44.entities.StoreSettings.create(settings);
      }
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store information and homepage layout</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-muted border border-border p-1 rounded-lg mb-6">
          <TabsTrigger value="general" className="flex items-center gap-1.5 text-xs py-2.5">
            <Globe className="w-3.5 h-3.5" /> General Info
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1.5 text-xs py-2.5">
            <Info className="w-3.5 h-3.5" /> About & Stats
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1.5 text-xs py-2.5">
            <Layers className="w-3.5 h-3.5" /> Banners & Grid
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1.5 text-xs py-2.5">
            <Video className="w-3.5 h-3.5" /> Video & Choose Us
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-1.5 text-xs py-2.5">
            <Quote className="w-3.5 h-3.5" /> Testimonials
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General & Social */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Store Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input value={settings.store_name} onChange={(e) => updateField('store_name', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Store Address</Label>
                  <Input value={settings.store_address} onChange={(e) => updateField('store_address', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value={settings.store_email} onChange={(e) => updateField('store_email', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Hotline Phone Number</Label>
                  <Input value={settings.store_phone} onChange={(e) => updateField('store_phone', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>WhatsApp Number (Consulting & Enquiries)</Label>
                  <Input value={settings.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value)} placeholder="+1234567890" className="bg-secondary/50 border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Topbar Promotion Announcement Text</Label>
                <Input value={settings.topbar_text} onChange={(e) => updateField('topbar_text', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input value={settings.instagram_url} onChange={(e) => updateField('instagram_url', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input value={settings.facebook_url} onChange={(e) => updateField('facebook_url', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X URL</Label>
                <Input value={settings.twitter_url} onChange={(e) => updateField('twitter_url', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input value={settings.youtube_url} onChange={(e) => updateField('youtube_url', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Store Assets (Logo & Banner)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.logo_url && (
                    <img src={settings.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border bg-black" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors bg-secondary/20">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('logo_url', e)} />
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Store Banner (Fallback Hero)</Label>
                <div className="space-y-3">
                  {settings.banner_url && (
                    <img src={settings.banner_url} alt="Banner" className="w-full h-32 object-cover rounded-lg border border-border bg-black" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors w-fit bg-secondary/20">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Banner</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('banner_url', e)} />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: About & Stats */}
        <TabsContent value="about" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">About Us Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>About Us Title</Label>
                <Input value={settings.about_title} onChange={(e) => updateField('about_title', e.target.value)} className="bg-secondary/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label>About Us Description (Full Paragraph)</Label>
                <Textarea value={settings.about_description} onChange={(e) => updateField('about_description', e.target.value)} className="bg-secondary/50 border-border min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label>Footer Brief Brand Info</Label>
                <Textarea value={settings.about_text} onChange={(e) => updateField('about_text', e.target.value)} className="bg-secondary/50 border-border min-h-[80px]" placeholder="Brief brand description for the footer..." />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Homepage Live Stats Counters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Counter 1 */}
              <div className="border-b border-border/40 pb-4 space-y-4">
                <h4 className="text-sm font-semibold text-primary">Stat Counter 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Value (e.g. 150+)</Label>
                    <Input value={settings.counter1_val} onChange={(e) => updateField('counter1_val', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title (e.g. Limited Edition)</Label>
                    <Input value={settings.counter1_title} onChange={(e) => updateField('counter1_title', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subtext Description</Label>
                    <Input value={settings.counter1_desc} onChange={(e) => updateField('counter1_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
              </div>

              {/* Counter 2 */}
              <div className="border-b border-border/40 pb-4 space-y-4">
                <h4 className="text-sm font-semibold text-primary">Stat Counter 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Value (e.g. 500+)</Label>
                    <Input value={settings.counter2_val} onChange={(e) => updateField('counter2_val', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title (e.g. Premium Watch Designs)</Label>
                    <Input value={settings.counter2_title} onChange={(e) => updateField('counter2_title', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subtext Description</Label>
                    <Input value={settings.counter2_desc} onChange={(e) => updateField('counter2_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
              </div>

              {/* Counter 3 */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary">Stat Counter 3</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Value (e.g. 4.9/5)</Label>
                    <Input value={settings.counter3_val} onChange={(e) => updateField('counter3_val', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title (e.g. Average Score)</Label>
                    <Input value={settings.counter3_title} onChange={(e) => updateField('counter3_title', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subtext Description</Label>
                    <Input value={settings.counter3_desc} onChange={(e) => updateField('counter3_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Banners & Collections Grid */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">For Him & For Her Split Banners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border/40 pb-6">
                {/* For Him */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">"For Him" Banner</h4>
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.for_him_title} onChange={(e) => updateField('for_him_title', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description text</Label>
                    <Input value={settings.for_him_desc} onChange={(e) => updateField('for_him_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Action Link URL</Label>
                    <Input value={settings.for_him_link} onChange={(e) => updateField('for_him_link', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Banner Image</Label>
                    <div className="space-y-3">
                      {settings.for_him_image_url && (
                        <img src={settings.for_him_image_url} alt="For Him" className="w-full h-32 object-cover rounded-lg border border-border bg-black" />
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors w-fit bg-secondary/20">
                        <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('for_him_image_url', e)} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* For Her */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">"For Her" Banner</h4>
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.for_her_title} onChange={(e) => updateField('for_her_title', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description text</Label>
                    <Input value={settings.for_her_desc} onChange={(e) => updateField('for_her_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Action Link URL</Label>
                    <Input value={settings.for_her_link} onChange={(e) => updateField('for_her_link', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Banner Image</Label>
                    <div className="space-y-3">
                      {settings.for_her_image_url && (
                        <img src={settings.for_her_image_url} alt="For Her" className="w-full h-32 object-cover rounded-lg border border-border bg-black" />
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors w-fit bg-secondary/20">
                        <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('for_her_image_url', e)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Our Collection Categories (3-Grid Showcase)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Item 1 */}
              <div className="border-b border-border/40 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Collection Card 1</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input value={settings.col1_title} onChange={(e) => updateField('col1_title', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category Tag/Filter</Label>
                      <Input value={settings.col1_tag} onChange={(e) => updateField('col1_tag', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description text</Label>
                    <Input value={settings.col1_desc} onChange={(e) => updateField('col1_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs">Image Showcase</Label>
                  <div className="flex gap-4 items-center">
                    {settings.col1_image && (
                      <img src={settings.col1_image} alt="Col 1" className="w-24 h-16 object-cover rounded border border-border" />
                    )}
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 w-fit">
                      <Upload className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('col1_image', e)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="border-b border-border/40 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Collection Card 2</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input value={settings.col2_title} onChange={(e) => updateField('col2_title', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category Tag/Filter</Label>
                      <Input value={settings.col2_tag} onChange={(e) => updateField('col2_tag', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description text</Label>
                    <Input value={settings.col2_desc} onChange={(e) => updateField('col2_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs">Image Showcase</Label>
                  <div className="flex gap-4 items-center">
                    {settings.col2_image && (
                      <img src={settings.col2_image} alt="Col 2" className="w-24 h-16 object-cover rounded border border-border" />
                    )}
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 w-fit">
                      <Upload className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('col2_image', e)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Collection Card 3</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input value={settings.col3_title} onChange={(e) => updateField('col3_title', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category Tag/Filter</Label>
                      <Input value={settings.col3_tag} onChange={(e) => updateField('col3_tag', e.target.value)} className="bg-secondary/50 border-border" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description text</Label>
                    <Input value={settings.col3_desc} onChange={(e) => updateField('col3_desc', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="text-xs">Image Showcase</Label>
                  <div className="flex gap-4 items-center">
                    {settings.col3_image && (
                      <img src={settings.col3_image} alt="Col 3" className="w-24 h-16 object-cover rounded border border-border" />
                    )}
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 w-fit">
                      <Upload className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('col3_image', e)} />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Video & Features Accordion */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Atelier Craftsmanship Intro Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Video Main Title</Label>
                  <Input value={settings.intro_video_title} onChange={(e) => updateField('intro_video_title', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Video Subtitle / Tagline</Label>
                  <Input value={settings.intro_video_subtitle} onChange={(e) => updateField('intro_video_subtitle', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Video File URL (Direct mp4 link)</Label>
                <div className="flex gap-3">
                  <Input value={settings.intro_video_url} onChange={(e) => updateField('intro_video_url', e.target.value)} className="bg-secondary/50 border-border flex-1" />
                  <label className="flex items-center gap-2 px-4 py-2 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 w-fit shrink-0">
                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload MP4</span>
                    <input type="file" accept="video/mp4" className="hidden" onChange={(e) => handleFileUpload('intro_video_url', e)} />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40">
                <div className="space-y-2">
                  <Label>Section Main Title</Label>
                  <Input value={settings.why_choose_title} onChange={(e) => updateField('why_choose_title', e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label>Craftsmanship Banner Image (Left side)</Label>
                  <div className="flex gap-4 items-center">
                    {settings.why_choose_image && (
                      <img src={settings.why_choose_image} alt="Why Choose Us" className="w-24 h-16 object-cover rounded border border-border" />
                    )}
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 w-fit">
                      <Upload className="w-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('why_choose_image', e)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Accordion list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-secondary/20 border border-border/40 rounded">
                  <h4 className="text-xs font-bold text-primary uppercase">Feature Accordion 1</h4>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.why_acc1_title} onChange={(e) => updateField('why_acc1_title', e.target.value)} className="bg-secondary/50 border-border text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Body Text</Label>
                    <Textarea value={settings.why_acc1_text} onChange={(e) => updateField('why_acc1_text', e.target.value)} className="bg-secondary/50 border-border text-xs min-h-[60px]" />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-secondary/20 border border-border/40 rounded">
                  <h4 className="text-xs font-bold text-primary uppercase">Feature Accordion 2</h4>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.why_acc2_title} onChange={(e) => updateField('why_acc2_title', e.target.value)} className="bg-secondary/50 border-border text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Body Text</Label>
                    <Textarea value={settings.why_acc2_text} onChange={(e) => updateField('why_acc2_text', e.target.value)} className="bg-secondary/50 border-border text-xs min-h-[60px]" />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-secondary/20 border border-border/40 rounded">
                  <h4 className="text-xs font-bold text-primary uppercase">Feature Accordion 3</h4>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.why_acc3_title} onChange={(e) => updateField('why_acc3_title', e.target.value)} className="bg-secondary/50 border-border text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Body Text</Label>
                    <Textarea value={settings.why_acc3_text} onChange={(e) => updateField('why_acc3_text', e.target.value)} className="bg-secondary/50 border-border text-xs min-h-[60px]" />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-secondary/20 border border-border/40 rounded">
                  <h4 className="text-xs font-bold text-primary uppercase">Feature Accordion 4</h4>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input value={settings.why_acc4_title} onChange={(e) => updateField('why_acc4_title', e.target.value)} className="bg-secondary/50 border-border text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Body Text</Label>
                    <Textarea value={settings.why_acc4_text} onChange={(e) => updateField('why_acc4_text', e.target.value)} className="bg-secondary/50 border-border text-xs min-h-[60px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Social Updates Loop Videos (4 Grid Reels)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2 p-3 bg-secondary/10 border border-border/20 rounded">
                    <Label className="text-xs text-primary font-bold">Social Video Reel {num}</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={settings[`social_video${num}_url`] || ''} 
                        onChange={(e) => updateField(`social_video${num}_url`, e.target.value)} 
                        className="bg-secondary/50 border-border text-xs flex-1"
                        placeholder="Reel MP4 link..."
                      />
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-dashed border-border cursor-pointer hover:border-primary/50 bg-secondary/20 text-xs w-fit shrink-0 select-none">
                        <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs">Upload</span>
                        <input type="file" accept="video/mp4" className="hidden" onChange={(e) => handleFileUpload(`social_video${num}_url`, e)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Testimonials */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-heading">Customer Testimonials Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Testimonial 1 */}
              <div className="p-4 bg-secondary/20 border border-border/40 rounded space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase">Testimonial 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label>Author / Collector Name</Label>
                    <Input value={settings.testimonial1_author} onChange={(e) => updateField('testimonial1_author', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Review Text</Label>
                    <Textarea value={settings.testimonial1_review} onChange={(e) => updateField('testimonial1_review', e.target.value)} className="bg-secondary/50 border-border min-h-[60px]" />
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-4 bg-secondary/20 border border-border/40 rounded space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase">Testimonial 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label>Author / Collector Name</Label>
                    <Input value={settings.testimonial2_author} onChange={(e) => updateField('testimonial2_author', e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Review Text</Label>
                    <Textarea value={settings.testimonial2_review} onChange={(e) => updateField('testimonial2_review', e.target.value)} className="bg-secondary/50 border-border min-h-[60px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}