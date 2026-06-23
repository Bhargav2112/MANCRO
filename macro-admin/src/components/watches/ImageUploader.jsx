import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, Loader2 } from 'lucide-react';

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const newImages = [...images];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newImages.push(file_url);
    }
    onChange(newImages);
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Product Images</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square">
            <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {idx > 0 && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-primary" onClick={() => moveImage(idx, idx - 1)}>
                  <GripVertical className="w-4 h-4 rotate-90" />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-destructive" onClick={() => removeImage(idx)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {idx === 0 && (
              <span className="absolute top-1 left-1 text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                Main
              </span>
            )}
          </div>
        ))}

        <label className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground">Upload</span>
            </>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}