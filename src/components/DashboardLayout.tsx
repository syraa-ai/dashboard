import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { supabase, getProfileWithEmail } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/client';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<(Profile & { email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure dark mode is applied only for the dashboard
    document.documentElement.classList.add('dark');
    
    // Cleanup function to remove dark mode when component unmounts
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);
  
  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userProfile = await getProfileWithEmail(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // If still loading profile data, show a loading indicator with brand colors
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0c1017] to-[#131b2c]">
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin mb-4"></div>
        <div className="text-white text-lg font-medium animate-pulse">Loading Syraa AI Dashboard</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0c1017] to-[#131b2c] flex">
      {/* Mobile sidebar - overlay style */}
      <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-[#171f30] backdrop-blur-md bg-opacity-90 shadow-2xl animate-slide-right">
          <DashboardSidebar 
            setSidebarOpen={setSidebarOpen} 
            collapsed={false}
            toggleCollapse={toggleCollapse}
            profile={profile}
          />
        </div>
      </div>

      {/* Desktop sidebar - fixed position with glass effect */}
      <div className={`hidden md:block z-30 h-screen ${collapsed ? 'w-[80px]' : 'w-72'} transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-700/40`}>
        <DashboardSidebar 
          setSidebarOpen={setSidebarOpen} 
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          profile={profile}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader 
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          profile={profile}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 relative bg-[#0c1116]">
          {/* Simple top border instead of decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-px bg-slate-800"></div>
          
          {/* Pass the profile to Outlet context - no additional wrapper */}
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
