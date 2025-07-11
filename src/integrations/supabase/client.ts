import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from './types';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  'https://yerlropclkwmpkxiofut.supabase.co', // Use actual Supabase project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllcmxyb3BjbGt3bXBreGlvZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTQ2OTksImV4cCI6MjA2NzEzMDY5OX0.4VNGlGfWJmLAhX_wHGpYOHhzOKjA8rJGQQQQQQQQQQQ',
  {
    auth: {
      storage: sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  }
);

export type Profile = Tables<'profiles'>;

// Helper functions for CRUD operations
export const getProfileById = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const getProfileWithEmail = async (userId: string): Promise<(Profile & { email?: string }) | null> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return profileData;
    }
    
    return {
      ...profileData,
      email: user.email
    };
  } catch (error) {
    console.error('Error in getProfileWithEmail:', error);
    return null;
  }
};
export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
};















