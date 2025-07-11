import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import PatientRecordDetail from '@/components/dashboard/PatientRecordCard';
import { Loader2 } from 'lucide-react';

const PatientRecordDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<Tables<'call_history'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (!id) {
          navigate('/app/dashboard/call-history');
          return;
        }
        
        // Fetch record details from call_history instead of patient_records
        const { data, error } = await supabase
          .from('call_history')
          .select('*')
          .eq('row_id', id)
          .single();
          
        if (error) throw error;
        
        setRecord(data);
      } catch (error) {
        console.error('Error fetching call history record:', error);
        navigate('/app/dashboard/call-history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        <span className="ml-2 text-gray-300">Loading record details...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {record && <PatientRecordDetail record={record as any} />}
    </div>
  );
};

export default PatientRecordDetailView;
