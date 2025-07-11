import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, User, MapPin, CreditCard } from 'lucide-react';

const ProfilePage = () => {
  const { profile: contextProfile } = useOutletContext<{ profile: Tables<'profiles'> | null }>();
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(contextProfile);
  const [userSettings, setUserSettings] = useState<Tables<'user_settings'> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not found');
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError) throw settingsError;
        
        setProfile({ ...profileData, email: user.email });
        setUserSettings(settingsData);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error(error.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (!contextProfile) {
      fetchProfileData();
    } else {
      setProfile(contextProfile);
    }
  }, [contextProfile]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-t-brand-purple rounded-full animate-spin"></div>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-[#23263a] to-[#18192d] border-none shadow-lg max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
              <div className="rounded-full bg-brand-purple w-24 h-24 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                <User size={56} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center text-2xl font-semibold text-white">
                  {profile?.name || "Unknown"}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
                  <div className="flex items-center"><Mail className="mr-1" size={18} /> {profile?.email || "No email"}</div>
                  <div className="flex items-center"><Phone className="mr-1" size={18} /> {profile?.phone || "No mobile"}</div>
                  <div className="flex items-center"><MapPin className="mr-1" size={18} /> {userSettings?.location || "No address"}</div>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <div className="font-semibold">Created At</div>
                      <div>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Last Updated</div>
                      <div>{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
