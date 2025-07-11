import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getProfileById } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

// This is a simple redirect component that will either redirect to the Dashboard Layout
// or to the onboarding page if the profile is incomplete
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current session with JWT token
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session exists, redirect to auth page
        if (!session) {
          console.log("No active session found, redirecting to auth page");
          navigate('/app/auth?redirect=dashboard');
          return;
        }

        console.log("Active session found with token expiry:", new Date(session.expires_at! * 1000).toLocaleString());
        
        // Check if the user has completed the onboarding process
        const profileData = await getProfileById(session.user.id);
          
        if (!profileData) {
          console.log("No profile found, redirecting to home");
          navigate('/');
          return;
        }
        
        // Navigate to dashboard home using replace to prevent history buildup
        console.log("Profile exists, navigating to dashboard home");
        navigate('/dashboard/home', { replace: true });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load your profile. Please try again.');
        navigate('/app/auth?redirect=dashboard');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1A1F2C]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-white">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
