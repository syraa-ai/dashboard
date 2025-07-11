import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, getProfileById } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Extract code from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        // If we have a code, exchange it for a session
        if (code) {
          console.log("AuthCallback: Authorization code found, exchanging for session...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("AuthCallback: Error exchanging code for session:", exchangeError);
            throw exchangeError;
          }
          
          if (data.session) {
            console.log("AuthCallback: Session established via code exchange, navigating to dashboard.");
            navigate('/app/dashboard', { replace: true });
            return;
          } else {
            console.log("AuthCallback: No session returned after code exchange.");
          }
        }

        // Check for existing session (e.g., user refreshed the callback page)
        console.log("AuthCallback: Checking for existing session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthCallback: Existing session found, navigating to dashboard.");
          navigate('/app/dashboard', { replace: true });
          return;
        } else {
          console.log("AuthCallback: No existing session found.");
        }

        // If no code and no session, go back to auth
        console.log("AuthCallback: No code and no session, redirecting to auth page.");
        navigate('/app/auth');
      } catch (error: any) {
        console.error("AuthCallback: General authentication callback error:", error);
        setError(error.message);
      } finally {
        console.log("AuthCallback: Setting loading to false.");
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Logging in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto">❌</div>
          <p className="mt-4 text-red-600">Authentication error: {error}</p>
          <button 
            onClick={() => navigate('/app/auth')}
            className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-md"
          >
            Go back to login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;