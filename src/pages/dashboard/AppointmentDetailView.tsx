
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PatientDetailCard from '@/components/dashboard/PatientDetailCard';
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

const AppointmentDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Tables<'appointment_details'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!id) {
          navigate('/dashboard/appointments');
          return;
        }
        
        // Fetch appointment details
        const { data, error } = await supabase
          .from('appointment_details')
          .select('*')
          .eq('row_id', id)
          .single();
          
        if (error) throw error;
        
        setAppointment(data);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        navigate('/dashboard/appointments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        <span className="ml-2 text-gray-500">Loading appointment details...</span>
      </div>
    );
  }

  return (
    <div>
      {appointment && <PatientDetailCard appointment={appointment as any} />}
    </div>
  );
};

export default AppointmentDetailView;
