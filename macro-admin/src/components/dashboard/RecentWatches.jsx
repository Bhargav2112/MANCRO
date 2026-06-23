import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export default function RecentWatches({ watches }) {
  const recent = [...watches]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading">Recently Added</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No watches added yet</p>
        )}
        {recent.map((watch) => (
          <div key={watch.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {watch.images?.[0] ? (
                <img src={watch.images[0]} alt={watch.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">IMG</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{watch.name}</p>
              <p className="text-xs text-muted-foreground">₹{watch.price?.toLocaleString()}</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary flex-shrink-0">
              {watch.category}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}