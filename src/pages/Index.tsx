import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // handleGetStarted function is kept in case it's needed by Navbar or future logic
  // const handleGetStarted = () => {
  //   if (isLoggedIn) {
  //     navigate('/dashboard');
  //   } else {
  //     navigate('/auth');
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <Navbar isLoggedIn={isLoggedIn} onDashboard={() => navigate('/dashboard')} />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white animate-pulse">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
          {/* Optional: Add a countdown timer or a subscription form here */}
          {/* Example Placeholder for future elements */}
          {/* <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
