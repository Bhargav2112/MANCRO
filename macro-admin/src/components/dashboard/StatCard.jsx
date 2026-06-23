import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, accent }) {
  return (
    <Card className={cn(
      "relative overflow-hidden p-6 bg-card border-border",
      "hover:border-primary/30 transition-all duration-300"
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2.5 rounded-lg",
            accent ? "bg-primary/10" : "bg-secondary"
          )}>
            <Icon className={cn("w-4 h-4", accent ? "text-primary" : "text-muted-foreground")} />
          </div>
        </div>
        <p className="text-3xl font-heading font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">{title}</p>
      </div>
    </Card>
  );
}