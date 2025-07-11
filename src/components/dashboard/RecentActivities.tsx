import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, XCircle } from 'lucide-react';
import { PatientRecord } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivitiesProps {
  patientRecords: PatientRecord[];
  loading?: boolean;
}

const RecentActivities = ({ patientRecords, loading = false }: RecentActivitiesProps) => {
  const navigate = useNavigate();
  
  // Activity item skeleton for loading state
  const ActivitySkeleton = () => (
    <div className="flex items-center justify-between p-2 rounded-lg">
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="ml-3">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-200 hover:bg-gray-700"
            onClick={() => navigate('/dashboard/call-history')}
            disabled={loading}
          >
            View All
          </Button>
        </div>
        
        {loading ? (
          // Show skeletons while loading
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <ActivitySkeleton key={index} />
            ))}
          </div>
        ) : patientRecords.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-300">No records yet</p>
            <p className="text-sm text-gray-400 mt-2">Recent activity handled by Syraa AI will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patientRecords.slice(0, 5).map((record) => {
              const isCall = !!record.call_start_date;
              const isAppointment = !!record.appointment_date;
              
              return (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between hover:bg-gray-700/50 p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/patient-records/${record.id}`)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAppointment ? 'bg-purple-500/20' : 
                      record.status === 'completed' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {isAppointment ? (
                        <Calendar size={20} className="text-purple-400" />
                      ) : record.status === 'completed' ? (
                        <Check size={20} className="text-green-400" />
                      ) : (
                        <XCircle size={20} className="text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-white">{record.patient_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-400">
                        {isAppointment 
                          ? `Appointment: ${new Date(record.appointment_date!).toLocaleDateString()}`
                          : isCall 
                            ? `Call: ${new Date(record.call_start_date!).toLocaleString()}` 
                            : new Date(record.created_at!).toLocaleString()
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    {isAppointment ? (
                      <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-400 text-sm">
                        Appointment
                      </div>
                    ) : (
                      <div className="bg-blue-500/20 px-3 py-1 rounded text-blue-400 text-sm">
                        {record.duration ? `${record.duration} seconds` : 'Call'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
