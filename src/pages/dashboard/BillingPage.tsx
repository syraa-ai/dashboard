
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Download, Clock, ArrowRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/sonner";
import { Tables } from '@/integrations/supabase/types';

const plans = {
  doctor: {
    name: 'Doctor Plan',
    price: '₹16,000',
    features: [
      'Virtual AI receptionist',
      'Appointment scheduling',
      'Call transcription',
      'Basic analytics'
    ]
  },
  clinic: {
    name: 'Clinic Plan',
    price: '₹20,000',
    features: [
      'All Doctor Plan features',
      'Multiple doctor support',
      'Advanced analytics',
      'Patient follow-ups'
    ]
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: '₹40,000',
    features: [
      'All Clinic Plan features',
      'Custom AI voice training',
      'API integrations',
      'Dedicated support'
    ]
  }
};

const BillingPage = () => {
  const { profile } = useOutletContext<{ profile: Tables<'profiles'> }>();
  const [userSettings, setUserSettings] = useState<Tables<'user_settings'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBillingData = async () => {
      if (!profile) return;
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        if (error) throw error;

        setUserSettings(data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBillingData();
  }, [profile]);
  
  const handleChangePlan = () => {
    toast.info('Contact support to change your plan');
  };
  
  const handleCancelSubscription = () => {
    toast.info('Contact our support team to cancel your subscription');
  };
  
  const handleDownloadInvoice = (id: string) => {
    toast.success(`Invoice ${id} downloaded successfully`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800 border-gray-700 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-800/50">
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-gray-300">Your subscription details</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Current Plan</h3>
                </div>
                <Badge className="bg-green-900 text-green-300">Active</Badge>
              </div>
              
              <div className="space-y-4">
                
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Payment method</span>
                    <span className="flex items-center text-gray-200 font-medium">
                      <CreditCard size={16} className="mr-2" />
                      On file
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-700 bg-gray-800/50">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-gray-600 text-gray-200 hover:bg-gray-700"
                onClick={handleChangePlan}
              >
                Change Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-gray-600 text-gray-200 hover:bg-gray-700"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
          

        </div>
        

      </div>
    </div>
  );
};

export default BillingPage;
