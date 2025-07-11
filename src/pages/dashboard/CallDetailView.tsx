
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CallDetailCard from '@/components/dashboard/CallDetailCard';
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

const CallDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [call, setCall] = useState<Tables<'call_history'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCall = async () => {
      try {
        if (!id) {
          navigate('/dashboard/calls');
          return;
        }
        
        // Fetch call details
        const { data: callData, error: callError } = await supabase
          .from('call_history')
          .select('*')
          .eq('row_id', id)
          .single();
          
        if (callError) throw callError;
        
        setCall(callData);
      } catch (error) {
        console.error('Error fetching call details:', error);
        navigate('/dashboard/calls');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCall();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        <span className="ml-2 text-gray-500">Loading call details...</span>
      </div>
    );
  }

  return (
    <div>
      {call && <CallDetailCard call={call as any} />}
    </div>
  );
};

export default CallDetailView;
