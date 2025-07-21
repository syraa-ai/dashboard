import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Enhanced appointment type with caller information
type AppointmentWithCaller = Tables<'appointment_details'> & {
  caller_name?: string;
};
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, subDays, startOfDay, endOfDay, isToday } from 'date-fns';
import { 
  Loader2, 
  Calendar, 
  CheckCircle, 
  BellRing, 
  UserPlus, 
  Clock, 
  PhoneCall,
  CreditCard,
  Activity
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";

const DashboardHome = () => {
  const { profile = {} } = useOutletContext<{ profile: any }>() || {};
  const [callRecords, setCallRecords] = useState<Tables<'call_history'>[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithCaller[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);
  
  // Initial data fetch and subscription setup
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.error('No authenticated user found');
          return;
        }
        
        // Fetch all records from the last 30 days for better data visualization
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: recordsData, error: recordsError } = await supabase
          .from('call_history')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });
        
        if (recordsError) throw recordsError;

        // Fetch appointments from appointment_details table
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointment_details')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
        }

        // For each appointment with a call_id, try to get the caller name from call_history
        const appointmentsWithCallers: AppointmentWithCaller[] = [];
        
        for (const appointment of appointmentsData || []) {
          let callerName = 'Unknown';
          
          if (appointment.call_id) {
            // Try to find matching call in call_history by call_id
            const { data: callData, error: callError } = await supabase
              .from('call_history')
              .select('caller_number')
              .eq('call_id', appointment.call_id.toString())
              .single();
            
            if (!callError && callData?.caller_number) {
              callerName = callData.caller_number;
            }
          }
          
          appointmentsWithCallers.push({
            ...appointment,
            caller_name: callerName
          });
        }
        
        if (isMounted) {
          console.log("Dashboard data:", recordsData);
          console.log("Appointments data:", appointmentsWithCallers);
          setCallRecords(recordsData || []);
          setAppointments(appointmentsWithCallers);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Set up real-time subscription
    const setupSubscription = () => {
      // First clean up any existing subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      
      // Create new subscription
      subscriptionRef.current = supabase
        .channel('call_history_changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'call_history'
          }, 
          async () => {
            // When data changes, refresh the records
            fetchData();
          }
        )
        .subscribe();
    };
    
    // Initial data fetch
    fetchData();
    // Setup subscription
    setupSubscription();
    
    // Handle visibility change to prevent unnecessary refreshes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Just refresh data when becoming visible again
        fetchData();
      }
    };
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up on unmount
    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Process data for display - using correct column names
  const callsWithRecordings = callRecords.filter(record => record.call_start);
  const appointmentRecords = callRecords.filter(record => record.appointment_status);
  
  const callsAnswered = callsWithRecordings.filter(record => record.call_status === 'answered').length;
  const callsMissed = callsWithRecordings.filter(record => record.call_status === 'missed').length;
  
  const todayCalls = callRecords.filter(record => 
    record.created_at && isToday(parseISO(record.created_at))
  ).length;
  
  const todayAppointments = appointments.filter(appointment => 
    appointment.appointment_date && isToday(parseISO(appointment.appointment_date))
  ).length;
  
  const totalRecords = callRecords.length;
  const lastRecordDate = callRecords[0]?.created_at ? format(parseISO(callRecords[0].created_at), 'MMMM dd, yyyy') : null;

  // Sorting for recent activities - combine calls and appointments by date for activity feed
  const recentActivities = [...callRecords]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Create upcoming appointments list from actual appointments table
  const upcomingAppointments = appointments
    .filter(appointment => {
      if (!appointment.appointment_date) return false;
      try {
        const appointmentDate = parseISO(appointment.appointment_date);
        return appointmentDate >= startOfDay(new Date());
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => {
      const dateA = a.appointment_date ? parseISO(a.appointment_date) : new Date(0);
      const dateB = b.appointment_date ? parseISO(b.appointment_date) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);
  
  // Format time for display to match AppointmentsPage style (MMM dd, yyyy, HH:mm:ss)
  const formatAppointmentTime = (dateStr: string | null, timeStr: string | null): string => {
    if (!dateStr) {
      return 'Date N/A';
    }

    let formattedDatePart = dateStr;
    try {
      // Format the date part to 'MMM dd, yyyy'
      formattedDatePart = format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      // If parsing dateStr fails, use it as is
      console.warn(`Could not parse date string for formatting: ${dateStr}`);
    }

    if (timeStr) {
      // Append the time string as is
      return `${formattedDatePart}, ${timeStr}`;
    } else {
      // If no time string, just return the formatted date part
      return formattedDatePart;
    }
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'canceled':
        return <Badge className="bg-red-600/20 text-red-400 border-red-500/30">Canceled</Badge>;
      case 'no-show':
        return <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30">No Show</Badge>;
      default:
        return <Badge className="bg-slate-600/20 text-slate-400 border-slate-500/30">{status}</Badge>;
    }
  };
  
  // Activity icon mapping
  const getActivityIcon = (record: Tables<'call_history'>) => {
    if (record.appointment_status) {
      return <Calendar className="h-5 w-5 text-blue-400" />;
    }
    if (record.call_start) {
      return record.call_status === 'completed' 
        ? <PhoneCall className="h-5 w-5 text-green-400" /> 
        : <PhoneCall className="h-5 w-5 text-red-400" />;
    }
    return <Activity className="h-5 w-5 text-purple-400" />;
  };
  
  // Activity title and description formatting
  const getActivityDetails = (record: Tables<'call_history'>) => {
    const callerName = record.caller_number || 'Unknown';
    
    if (record.appointment_status) {
      return {
        title: `Appointment ${record.appointment_status || 'scheduled'}`,
        desc: `Caller: ${callerName}`
      };
    }
    if (record.call_start) {
      return {
        title: `Call ${record.call_status}`,
        desc: `Caller: ${callerName} - ${record.call_duration || 'Unknown duration'}`
      };
    }
    return {
      title: 'Record created',
      desc: `Caller: ${callerName}`
    };
  };

  return (
    <div className="space-y-8 w-full">
      {/* Welcome Header - simplified without effects */}
      <div className="relative bg-slate-800/10 p-4 rounded-lg border border-slate-700/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
          <div className="py-2">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back, {profile?.business_name || 'Dr. User'}
            </h1>
            <p className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center mt-2 md:mt-0 px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-300 text-sm border border-slate-700/50">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating dashboard...
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Dashboard Stats Cards - Quick overview metrics */}
      <DashboardStats 
        totalRecords={totalRecords}
        todayCalls={todayCalls}
        todayAppointments={todayAppointments}
        lastRecordDate={lastRecordDate}
        loading={loading}
        callsAnswered={callsAnswered}
        callsMissed={callsMissed}
      />
      
      {/* Main Dashboard Content - Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <Card className="bg-slate-800/30 border-slate-700/30 shadow-md">
              <CardHeader>
                <div className="animate-pulse h-5 bg-slate-700 rounded w-1/3"></div>
              </CardHeader>
              <CardContent className="h-72">
                <div className="animate-pulse h-full bg-slate-700/30 rounded"></div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Call History Charts - HIDDEN */}
              {/* ... (hidden chart code remains here) ... */}

              {/* Recent Activity MOVED HERE */}
              {!loading && ( // Only show if not loading, similar to charts
                <Card className="bg-slate-800/30 border border-slate-700/30 shadow-md overflow-hidden">
                  <CardHeader className="border-b border-slate-700/30">
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="relative p-0">
                    {recentActivities.length > 0 ? (
                      <div className="divide-y divide-slate-700/30">
                        {recentActivities.map((activity, index) => {
                          const { title, desc } = getActivityDetails(activity);
                          const isNew = index === 0;
                          const isActivityToday = activity.created_at && isToday(parseISO(activity.created_at));
                          
                          return (
                            <div key={activity.row_id} className="flex p-4 hover:bg-slate-700/10 relative">
                              {isNew && (
                                <div className="absolute right-2 top-2">
                                  <Badge className="bg-brand-purple/30 text-xs py-0 px-1.5 border-brand-purple/40 text-brand-purple">
                                    New
                                  </Badge>
                                </div>
                              )}
                              <div className="mr-4 flex-shrink-0 mt-0.5">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/60">
                                  {getActivityIcon(activity)}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {title}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {desc}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {isActivityToday
                                    ? format(parseISO(activity.created_at), 'h:mm a')
                                    : format(parseISO(activity.created_at), 'MMM d, h:mm a')}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Activity className="h-10 w-10 text-slate-500 mb-2" />
                        <p className="text-slate-400 text-sm">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Right column: Upcoming Appointments ONLY */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card className="bg-slate-800/30 border border-slate-700/30 shadow-md overflow-hidden">
            <CardHeader className="border-b border-slate-700/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Upcoming Appointments</CardTitle>
                <Badge variant="outline" className="bg-brand-purple/20 text-brand-purple border-brand-purple/30">
                  {upcomingAppointments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative p-0">
              {loading ? (
                <div className="animate-pulse p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-14 bg-slate-700/30 rounded"></div>
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {upcomingAppointments.map((apt, index) => (
                    <div key={apt.row_id} className="flex items-center justify-between p-4 hover:bg-slate-700/10">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Avatar className="h-10 w-10 border border-slate-700/30">
                            <AvatarFallback className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 text-white">
                              {apt.patient_name?.substring(0, 2).toUpperCase() || 'PT'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {apt.patient_name || 'Unknown Patient'}
                          </div>
                          <div className="text-xs text-slate-400 mb-1">
                            Caller: {apt.caller_name || 'Unknown'}
                          </div>
                          <div className="flex items-center text-xs text-slate-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {apt.appointment_date && format(parseISO(apt.appointment_date), 'MMM d')}
                            {apt.appointment_time && `, ${apt.appointment_time}`}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Scheduled</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-10 w-10 text-slate-500 mb-2" />
                  <p className="text-slate-400 text-sm">No upcoming appointments</p>
                </div>
              )}
              
              <div className="p-3 bg-slate-800/30 border-t border-slate-700/30">
                <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white">
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
