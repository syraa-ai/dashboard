
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { 
  User, Lock, Mail, Bell, CreditCard, UserPlus, Users, LogOut, 
  GripVertical, Phone, HomeIcon, Globe, HeadphonesIcon, HelpCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [userSettings, setUserSettings] = useState<Tables<'user_settings'> | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState('');
  const [about, setAbout] = useState('');
  
  // Notification settings

  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUserId(session.user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setName(profileData.name);
      setPhone(profileData.phone || '');

      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (settingsError) {
        console.error(settingsError);
        setLoading(false);
        return;
      }
      
      setUserSettings(settingsData);
      setLocation(settingsData.location || '');
      setServices(settingsData.services || '');
      setAbout(settingsData.about || '');

      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleUpdateProfile = async () => {
    if (!userId || !profile || !userSettings) return;
    
    try {
      setSaving(true);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, phone })
        .eq('id', userId);

      if (profileError) throw profileError;

      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({ location, services, about })
        .eq('user_id', userId);

      if (settingsError) throw settingsError;

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordReset = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile?.email || '',
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to send password reset email');
      console.error('Error sending password reset:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid grid-cols-1 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your location"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="services">Services</Label>
                  <Input
                    id="services"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="Your services"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="about">About</Label>
                  <Input
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="About you"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpdateProfile}
                  className="gradient-button"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Manage your password and account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-sm text-gray-500">{profile?.email || 'No email set'}</p>
                  </div>
                  <Button variant="outline" disabled>Change Email</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handlePasswordReset}
                    disabled={saving}
                  >
                    Reset Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" disabled>Enable</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Sign Out */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-500">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </CardTitle>
                <CardDescription>
                  Sign out of your account on this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 gap-8">
            {/* AI Agent Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeadphonesIcon className="mr-2 h-5 w-5" />
                  AI Agent Settings
                </CardTitle>
                <CardDescription>
                  Customize your AI voice agent's name and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">

                  <p className="text-sm text-gray-500">
                    This name will be used when the AI introduces itself to callers
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>AI Voice Settings</Label>
                  <p className="text-sm text-gray-500">
                    AI voice configuration will be available in a future update
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpdateProfile}
                  className="gradient-button"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">

                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="grid grid-cols-1 gap-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your current subscription plan and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

              </CardContent>
              <CardFooter className="flex justify-end space-x-3">
                <Button variant="outline">Change Plan</Button>
              </CardFooter>
            </Card>
            

            

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
