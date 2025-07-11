import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HomeIcon,
  FileText,
  Calendar,
  ChevronRight,
  X,
  LogOut,
  Menu,
  Settings,
  Users,
  Microscope,
  Sparkles,
  CreditCard,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Profile } from '@/integrations/supabase/client';

interface DashboardSidebarProps {
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  toggleCollapse: () => void;
  profile: Profile | null;
}

const DashboardSidebar = ({
  setSidebarOpen,
  collapsed,
  toggleCollapse,
  profile
}: DashboardSidebarProps) => {
  console.log("DashboardSidebar profile:", profile); // For debugging
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      // Show the toast before navigating away
      toast.success('Signing out...');
      
      // Clear auth data
      await supabase.auth.signOut();
      
      // Clear localStorage completely to ensure all session data is removed
      localStorage.clear();
      
      // Use a small timeout to ensure the signout completes
      setTimeout(() => {
        // Redirect to auth page with full page reload
        window.location.replace('/auth');
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const formatInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const userInitials = profile?.name
    ? formatInitials(profile.name)
    : 'U';

  const mainNavigation = [
    { name: 'Dashboard', href: '/app/dashboard/home', icon: HomeIcon },
    { name: 'Call History', href: '/app/dashboard/call-history', icon: PhoneCall },
    { name: 'Appointments', href: '/app/dashboard/appointments', icon: Calendar },
    { name: 'Analytics', href: '/app/dashboard/analytics', icon: BarChart },
    { name: 'AI Playground', href: '/app/dashboard/ai-playground', icon: Sparkles },
    { name: 'Settings', href: '/app/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/app/dashboard/billing', icon: CreditCard },
    { name: 'Support', href: '/app/dashboard/support', icon: HelpCircle },
  ];

  // Function to render a navigation item with conditional tooltip
  const renderNavItem = (item: any, section?: string) => {
    const content = (
      <div key={item.name} className={cn(
        item.disabled ? "opacity-40 pointer-events-none" : "",
        "relative"
      )}>
        <NavLink
          to={item.disabled ? "#" : item.href}
          onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          className={({ isActive }) =>
            cn(
              isActive && !item.disabled
                ? "bg-gradient-to-r from-brand-purple/90 to-indigo-600/90 text-white shadow-md" 
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
              "group flex items-center px-3 py-2.5 rounded-md",
              collapsed ? "justify-center" : "",
              item.disabled ? "cursor-not-allowed" : ""
            )
          }
          end={item.href === '/app/dashboard/home'}
        >
          <item.icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>{item.name}</span>
              {item.badge && (
                <Badge variant="outline" className="ml-2 bg-brand-purple/30 text-xs py-0 px-1 border-brand-purple/40 text-white">
                  {item.badge}
                </Badge>
              )}
              {item.disabled && (
                <Badge variant="outline" className="ml-2 bg-slate-800 text-xs py-0 px-1 border-slate-700 text-slate-400">
                  Soon
                </Badge>
              )}
            </div>
          )}
          {item.badge && collapsed && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-brand-purple"></span>
          )}
        </NavLink>
      </div>
    );
    
    // If collapsed and not disabled, wrap in tooltip
    if (collapsed && !item.disabled) {
      return (
        <TooltipProvider key={item.name} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 border-slate-700">
              <div className="flex items-center">
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="outline" className="ml-2 bg-brand-purple/30 text-xs py-0 px-1 border-brand-purple/40 text-white">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return content;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#171f30] to-[#111827] backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex h-16 items-center px-4 border-b border-slate-700/40 justify-between">
        {!collapsed && (
          <div className="flex items-center overflow-hidden">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-purple">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(139, 92, 246, 0.2)" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
            <span className="ml-2 font-bold text-lg text-white whitespace-nowrap">Syraa AI Dashboard</span>
          </div>
        )}
        
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-purple">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(139, 92, 246, 0.2)" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </div>
        )}
        
        <button 
          className="md:hidden ml-2 p-2"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-white" />
        </button>
        
        {/* Collapse button for desktop */}
        <button 
          onClick={toggleCollapse} 
          className="hidden md:flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-700/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-white" /> 
          ) : (
            <ChevronRight className="h-5 w-5 text-white rotate-180" />
          )}
        </button>
      </div>

      {/* User profile summary */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
            <Avatar className="h-10 w-10 border border-brand-purple/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-brand-purple/20 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.name || 'Welcome, User'}
              </p>
:start_line:219
-------
              {/* Removed profile.email as it's not in the Profile type */}
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 pt-3">
        <div className={cn("px-3", collapsed ? "space-y-4" : "space-y-6")}>
          <nav className="mt-2 space-y-1.5">
            {mainNavigation.map((item) => renderNavItem(item))}
          </nav>
        </div>
      </ScrollArea>

      {/* Sign out */}
      <div className="border-t border-slate-700/40 p-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "w-full text-red-400 hover:text-white hover:bg-slate-800/70 hover:shadow-md justify-start font-medium transition-all duration-200",
            collapsed ? "justify-center px-2" : ""
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("w-5 h-5", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
