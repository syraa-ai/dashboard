import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Search, Calendar, MoonStar, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/client';

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  profile: Profile | null;
}

const DashboardHeader = ({ setSidebarOpen, collapsed, profile }: DashboardHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  
  // Sample notifications - would be fetched from the database in a real app
  const notifications = [
    { id: 1, title: 'New appointment', message: 'You have a new appointment scheduled', time: '5 minutes ago', read: false },
    { id: 2, title: 'Call summary ready', message: 'A call summary is ready to review', time: '1 hour ago', read: true },
    { id: 3, title: 'System update', message: 'Syraa AI system has been updated', time: 'Yesterday', read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const formatInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const userInitials = profile?.name
    ? formatInitials(profile.name)
    : 'U';

  const displayName = profile?.name || 'User';
  
  // Handle sign out logic
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
  
  return (
    <div className="border-b bg-gradient-to-r from-slate-900/80 to-[#171f30]/80 backdrop-blur-sm border-slate-800/50 flex h-16 items-center px-4 sm:px-6 sticky top-0 z-10 w-full">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open main menu</span>
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Left section: Branding with logo */}
      {/* <div className="flex items-center">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-purple">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(139, 92, 246, 0.2)" />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
          </svg>
          <span className="ml-2 text-xl font-bold text-white hidden md:inline-block">Syraa AI</span>
        </div>
      </div> */}
      
      {/* Center + Left: Search bar - HIDDEN */}
      {/* <div className="hidden md:flex ml-6 mr-auto max-w-xl flex-1">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="search"
            className="bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-lg block w-full pl-10 p-2 focus:ring-brand-purple/30 focus:border-brand-purple/70 focus:outline-none focus:ring-2"
            placeholder="Search patients, appointments..."
          />
        </div>
      </div> */}
      
      {/* Right section: All icons aligned to the right */}
      <div className="flex items-center ml-auto space-x-1 sm:space-x-3">
        {/* <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800/70 rounded-full">
          <Calendar className="h-5 w-5" />
        </Button> */}
        
        {/* Notifications - HIDDEN */}
        {/* <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-300 hover:bg-slate-800/70 rounded-full">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-700/50 shadow-xl">
            <div className="p-4 border-b border-slate-800">
              <div className="font-medium text-white">Notifications</div>
              <div className="text-xs text-slate-400">You have {unreadCount} unread messages</div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer ${notification.read ? '' : 'bg-slate-800/20'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white flex items-center">
                        {notification.title}
                        {!notification.read && (
                          <Badge variant="outline" className="ml-2 bg-brand-purple/20 border-brand-purple/40 text-brand-purple">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-300">{notification.message}</div>
                      <div className="text-xs text-slate-400 mt-1">{notification.time}</div>
                    </div>
                    {!notification.read && (
                      <Button variant="ghost" size="icon" className="text-slate-400 h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-slate-800">
              <Button variant="ghost" size="sm" className="w-full justify-center text-slate-400 hover:text-white">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover> */}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full p-px">
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-brand-purple/30 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 bg-slate-900 border-slate-700/50 shadow-xl">
            <div className="p-3 border-b border-slate-800">
              <div className="font-medium text-white">{displayName}</div>
              <div className="text-xs text-slate-400 truncate">{profile?.email || 'user@example.com'}</div>
            </div>
            <div className="p-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => navigate('/dashboard/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => navigate('/dashboard/settings')}>
                <User className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            <Separator className="bg-slate-800" />
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                onClick={handleSignOut}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DashboardHeader;
