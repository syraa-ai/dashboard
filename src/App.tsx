import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, getProfileById } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/client';

// Page imports
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage.tsx"; // Explicit .tsx extension

// Dashboard Components
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CallHistoryPage from "./pages/dashboard/CallHistoryPage";
import PatientRecordDetailView from "./pages/dashboard/PatientRecordDetailView";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";

// Layout Components
import AppLayout from "./components/layouts/AppLayout";

// Create a new query client instance
const queryClient = new QueryClient();

// ScrollToTop component to handle scroll position on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Helper component for the legacy redirect
const PatientRecordRedirect = () => {
  const { id } = useParams<{ id: string }>();
  // Basic check in case id is somehow undefined
  const targetPath = id ? `/app/dashboard/call-history/${id}` : '/app/dashboard';
  return <Navigate to={targetPath} replace />;
};


const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const location = useLocation();

  // Force dark mode for entire application
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {};
  }, []);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          getProfileById(currentSession.user.id).then(profile => {
            setUserProfile(profile);
            if (!profile) {
              console.log("App.tsx: Profile not found for session user, setting onboardingRequired to true.");
              setOnboardingRequired(true);
            } else {
              setOnboardingRequired(false);
            }
          });
        } else {
          setUserProfile(null);
          setOnboardingRequired(false);
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log("App.tsx: Checking for existing session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("App.tsx: Initial session check result:", currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("App.tsx: Session user found, fetching profile...");
          const profile = await getProfileById(currentSession.user.id);
          setUserProfile(profile);
          console.log("App.tsx: User profile fetched:", profile);
          if (!profile) {
            console.log("App.tsx: Profile not found for initial session user, setting onboardingRequired to true.");
            setOnboardingRequired(true);
          } else {
            setOnboardingRequired(false);
          }
        } else {
          console.log("App.tsx: No session user found.");
          setOnboardingRequired(false);
        }
      } catch (error) {
        console.error("App.tsx: Error checking session:", error);
      } finally {
        console.log("App.tsx: Setting loading to false after session check.");
        setLoading(false);
      }
    };
    
    checkSession();

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, []);

  // Protected route component that enforces the user flow
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) {
      console.log("ProtectedRoute: Still loading, showing spinner.");
      return (
        <div className="flex items-center justify-center h-screen bg-slate-900">
          <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!session) {
      console.log("ProtectedRoute: No session found, redirecting to auth.");
      return <Navigate to="/app/auth?redirect=dashboard" />;
    }

    if (session && onboardingRequired) {
      console.log("ProtectedRoute: Session found but onboarding required, redirecting to onboarding.");
      return <Navigate to="/app/onboarding" />;
    }
    
    console.log("ProtectedRoute: Session found and no onboarding required, rendering children.");
    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes>
          {/* Root redirects to auth or onboarding */}
          <Route path="/" element={
            !session ? <Navigate to="/auth" /> : 
            (onboardingRequired ? <Navigate to="/app/onboarding" /> : <Navigate to="/app/dashboard" />)
          } />

          {/* Direct auth routes at root level */}
          <Route path="/auth" element={
            !session ? <Auth /> : <Navigate to="/app/dashboard" />
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Application Pages */}
          <Route path="/app" element={<AppLayout />}>
            {/* Authentication */}
            <Route path="auth" element={
              !session ? <Auth /> : <Navigate to="/app/dashboard" />
            } />
            <Route path="auth/callback" element={<AuthCallback />} />

            {/* Onboarding Route */}
            <Route path="onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Pages with Dashboard Layout */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="home" element={<DashboardHome />} />
              <Route path="call-history" element={<CallHistoryPage />} />
              <Route path="call-history/:id" element={<PatientRecordDetailView />} />
              <Route path="appointments" element={<AppointmentsPage />} />
            </Route>
            
          </Route>
          
          {/* Auth Callback routes */}
          <Route path="/auth/v1/callback" element={<AuthCallback />} />
          
          {/* Legacy Routes Redirects */}
          <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard/patient-records/:id" element={<PatientRecordRedirect />} />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
