import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Watch, Settings, Package, LogOut, Menu, X, MessageSquare, BookOpen, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";

const LOGO_URL = "https://media.base44.com/images/public/user_6943e9bbf2f0c149cfad4c09/0cf447929_MANCROlogo.jpg";

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Watches', path: '/watches', icon: Watch },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Inquiries', path: '/inquiries', icon: MessageSquare },
  { label: 'Blog Journal', path: '/posts', icon: BookOpen },
  { label: 'Hero Slides', path: '/slides', icon: Image },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onToggle} />
      )}

      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            <img src={LOGO_URL} alt="MANCRO" className="h-14 object-contain invert" />
          </div>
          <p className="text-[10px] tracking-[0.3em] text-center text-muted-foreground mt-2 uppercase">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle?.()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}