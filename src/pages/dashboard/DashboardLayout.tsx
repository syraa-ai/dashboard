
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { supabase, getProfileById, Profile } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('dashboard-theme') || 'dark';
    setTheme(storedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!session) {
          console.log("No active session in dashboard layout, redirecting to auth");
          navigate('/auth?redirect=dashboard');
          return;
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (event === 'SIGNED_OUT') {
              navigate('/auth?redirect=dashboard');
            } else if (!currentSession) {
              navigate('/auth?redirect=dashboard');
            }
          }
        );
        
        try {
          const profileData = await getProfileById(session.user.id);
            
          if (!profileData) {
            throw new Error('Profile not found');
          }
          

          
          setProfile(profileData);
        } catch (error: any) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load your profile. Please try again.');
          navigate('/auth?redirect=dashboard');
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Authentication error. Please log in again.');
        navigate('/auth?redirect=dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121620]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121620]">
      <DashboardHeader
        profile={profile as any}
        setSidebarOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
      />
      
      <div className="flex-grow flex h-[calc(100vh-64px)] overflow-hidden">
        <div
          className={`fixed inset-0 bg-black/50 z-30 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className={`fixed md:static top-0 left-0 z-40 h-full transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
          <DashboardSidebar
            setSidebarOpen={setSidebarOpen}
            collapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebarCollapse}
            profile={profile as any}
            // theme and setTheme props were here but are not defined in DashboardSidebarProps, removing them.
            // If theme functionality is needed in sidebar, DashboardSidebarProps needs to be updated.
          />
        </div>
        <main className={`flex-grow overflow-auto transition-all duration-300 bg-white dark:bg-[#121620]`}>
          <div className="h-full">
            <Outlet context={{ profile: profile as any }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
