import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Globe, MapPin, User, BuildingIcon, Award } from 'lucide-react';
import { supabase, updateProfile } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

interface ProfileCardProps {
  profile: (Profile & { email?: string }) | null;
  onUpdate: () => void;
}

const ProfileCard = ({ profile, onUpdate }: ProfileCardProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Profile & { email?: string }>(profile || {
    id: '',
    business_name: '',
    mobile_number: '',
    landline_number: '',
    website_url: '',
    address: '',
    doctor_id: '',
    number_of_doctors: 1,
    plan_type: 'doctor',
    ai_name: 'Syraa',
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');
      
      const updatedProfile: Partial<Profile> = {
        business_name: formData.business_name,
        mobile_number: formData.mobile_number,
        landline_number: formData.landline_number,
        website_url: formData.website_url,
        address: formData.address,
        doctor_id: formData.doctor_id,
        number_of_doctors: formData.number_of_doctors
      };
      
      await updateProfile(user.id, updatedProfile);
      
      toast.success('Profile updated successfully!');
      setEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatPlanType = (planType: string | null) => {
    if (!planType) return 'N/A';
    return planType.charAt(0).toUpperCase() + planType.slice(1);
  };

  if (!profile) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Loading profile data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-brand-purple rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (editing) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User size={20} className="mr-2 text-brand-purple" />
            Edit Profile
          </CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name" className="flex items-center">
                <BuildingIcon size={16} className="mr-2" />
                {profile.plan_type === 'doctor' ? 'Doctor Name' : 'Clinic/Hospital Name'}
              </Label>
              <Input
                id="business_name"
                name="business_name"
                value={formData.business_name || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile_number" className="flex items-center">
                <Phone size={16} className="mr-2" />
                Mobile Number
              </Label>
              <Input
                id="mobile_number"
                name="mobile_number"
                value={formData.mobile_number || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landline_number" className="flex items-center">
                <Phone size={16} className="mr-2" />
                Landline Number
              </Label>
              <Input
                id="landline_number"
                name="landline_number"
                value={formData.landline_number || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website_url" className="flex items-center">
                <Globe size={16} className="mr-2" />
                Website URL
              </Label>
              <Input
                id="website_url"
                name="website_url"
                value={formData.website_url || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin size={16} className="mr-2" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor_id" className="flex items-center">
                <Award size={16} className="mr-2" />
                Doctor ID / Registration Number
              </Label>
              <Input
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id || ''}
                onChange={handleChange}
              />
            </div>
            
            {(profile.plan_type === 'clinic' || profile.plan_type === 'enterprise') && (
              <div className="space-y-2">
                <Label htmlFor="number_of_doctors" className="flex items-center">
                  <User size={16} className="mr-2" />
                  Number of Doctors
                </Label>
                <Input
                  id="number_of_doctors"
                  name="number_of_doctors"
                  type="number"
                  min="1"
                  value={formData.number_of_doctors || 1}
                  onChange={handleChange}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
          <CardDescription>
            Your {profile.plan_type === 'doctor' ? 'doctor' : 'business'} details
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setEditing(true)}
          className="ml-2"
        >
          Edit Profile
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <BuildingIcon size={14} />
              {profile.plan_type === 'doctor' ? 'Doctor Name' : 'Clinic/Hospital Name'}
            </p>
            <p className="font-medium">{profile.business_name || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail size={14} />
              Email
            </p>
            <p className="font-medium">{profile.email || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone size={14} />
              Mobile Number
            </p>
            <p className="font-medium">{profile.mobile_number || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone size={14} />
              Landline Number
            </p>
            <p className="font-medium">{profile.landline_number || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Globe size={14} />
              Website
            </p>
            <p className="font-medium">
              {profile.website_url ? (
                <a 
                  href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline"
                >
                  {profile.website_url}
                </a>
              ) : (
                'Not set'
              )}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              Address
            </p>
            <p className="font-medium">{profile.address || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Award size={14} />
              Doctor ID / Reg. Number
            </p>
            <p className="font-medium">{profile.doctor_id || 'Not set'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Plan Type</p>
            <p className="font-medium">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple-light/20 text-brand-purple">
                {formatPlanType(profile.plan_type)}
              </span>
            </p>
          </div>
          
          {(profile.plan_type === 'clinic' || profile.plan_type === 'enterprise') && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User size={14} />
                Number of Doctors
              </p>
              <p className="font-medium">{profile.number_of_doctors || '1'}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">AI Assistant Name</p>
            <p className="font-medium">{profile.ai_name || 'Syraa'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
