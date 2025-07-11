import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/app/dashboard');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Signed in successfully!');
      navigate('/app/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Could not sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Success! Please check your email for a confirmation link to complete registration.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Could not sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 flex flex-col dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <header className="py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-brand-purple flex items-center dark:text-gray-300"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </button>
            </div> */}
            <div>
              <h1 className="text-2xl font-bold gradient-text">Syraa AI</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="glass-card p-8 rounded-xl shadow-lg dark:bg-slate-800 dark:text-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                Welcome to Syraa AI
              </h1>
              <p className="text-gray-600 mt-2 dark:text-gray-300">
                Sign in to access your dashboard
              </p>
            </div>
            
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-6"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-brand-purple hover:underline ml-1 font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-brand-purple hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-brand-purple hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
