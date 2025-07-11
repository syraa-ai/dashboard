import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Calendar, User, Phone, Clock, Loader2, Edit, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Tables<'appointment_details'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Tables<'appointment_details'> | null>(null);
  const [newDateTime, setNewDateTime] = useState<Date | undefined>(undefined);
  const subscriptionRef = useRef<any>(null);

  const isValidDate = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      return !isNaN(date.getTime());
    } catch (e) {
      return false;
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.error('No authenticated user found');
        return;
      }
      
      const { data, error } = await supabase
        .from('appointment_details')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error('Unexpected error while fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.error('Cannot set up subscription: No authenticated user');
        return;
      }
      
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      
      subscriptionRef.current = supabase
        .channel('appointments_changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'appointment_details',
            filter: `user_id=eq.${userId}`
          }, 
          (payload) => {
            fetchAppointments();
          }
        )
        .subscribe();
    };
    
    setupSubscription();
    
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [fetchAppointments]);

  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(app => 
    app.appointment_date && isValidDate(app.appointment_date) && isToday(parseISO(app.appointment_date))
  ).length;
  
  const upcomingAppointments = appointments.filter(app => 
    app.appointment_date && isValidDate(app.appointment_date) && !isPast(parseISO(app.appointment_date))
  ).length;
  
  const handleRescheduleClick = (appointment: Tables<'appointment_details'>) => {
    setSelectedAppointment(appointment);
    
    if (appointment.appointment_date && isValidDate(appointment.appointment_date)) {
      let initialDate;
      if (appointment.appointment_time) {
        initialDate = parseISO(`${appointment.appointment_date}T${appointment.appointment_time}`);
      } else {
        initialDate = parseISO(appointment.appointment_date);
      }
      setNewDateTime(initialDate);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewDateTime(tomorrow);
    }
    
    setDialogOpen(true);
  };
  
  const handleUpdateAppointment = async () => {
    if (!selectedAppointment || !newDateTime) {
      return;
    }
    
    try {
      setUpdating(true);
      
      const dateString = format(newDateTime, "yyyy-MM-dd");
      const timeString = format(newDateTime, "HH:mm:ss");
      
      const { error } = await supabase
        .from('appointment_details')
        .update({
          appointment_date: dateString,
          appointment_time: timeString,
        })
        .eq('row_id', selectedAppointment.row_id);
      
      if (error) throw error;
      
      toast({
        title: "Appointment Updated",
        description: `The appointment for ${selectedAppointment.patient_name} has been rescheduled.`,
        duration: 5000,
      });

      setDialogOpen(false);
      setSelectedAppointment(null);
      setNewDateTime(undefined);
      
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the appointment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Appointments</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-4">
            <p className="text-gray-300 mb-1">Total Appointments</p>
            <h3 className="text-3xl font-bold text-white">{totalAppointments}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-4">
            <p className="text-gray-300 mb-1">Today's Appointments</p>
            <h3 className="text-3xl font-bold text-white">{todayAppointments}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-4">
            <p className="text-gray-300 mb-1">Upcoming Appointments</p>
            <h3 className="text-3xl font-bold text-white">{upcomingAppointments}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Appointment List</CardTitle>
          <CardDescription className="text-gray-300">
            All appointments from patient calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple mr-2" />
              <span className="text-gray-300">Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-6">
              <Calendar size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-300">No appointments found</p>
              <p className="text-sm text-gray-400 mt-1">
                Appointments will appear here once patients schedule them
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-2 text-gray-300 font-semibold">Appointment Date & Time</th>
                    <th className="p-2 text-gray-300 font-semibold">Patient Name</th>
                    <th className="p-2 text-gray-300 font-semibold">Reason</th>
                    <th className="p-2 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.row_id} className="border-t border-slate-700 hover:bg-gray-700/30 transition">
                      <td className="p-2 text-gray-200">
                        {appt.appointment_date && isValidDate(appt.appointment_date) && (
                          <span>
                            {format(parseISO(appt.appointment_date), 'MMM dd, yyyy')}
                          </span>
                        )}
                        {appt.appointment_time && (
                          <span className="ml-2">{appt.appointment_time}</span>
                        )}
                      </td>
                      <td className="p-2 text-white font-semibold">{appt.patient_name}</td>
                      <td className="p-2 text-gray-200">{appt.appointment_reason}</td>
                      <td className="p-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-500/50 hover:bg-blue-500/20 text-blue-300"
                          onClick={() => handleRescheduleClick(appt)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modify
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Reschedule Appointment</DialogTitle>
            <DialogDescription asChild>
              <div className="text-gray-300">
                {selectedAppointment && (
                  <div className="my-2">
                    <p className="mt-2">
                      <span className="font-medium">Patient:</span> {selectedAppointment.patient_name}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Current date:</span>{" "}
                      {selectedAppointment.appointment_date && isValidDate(selectedAppointment.appointment_date)
                        ? format(parseISO(selectedAppointment.appointment_date), "MMM dd, yyyy")
                        : "Not scheduled"}
                      {selectedAppointment.appointment_time && (
                        <span className="ml-1">{selectedAppointment.appointment_time}</span>
                      )}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Reason:</span> {selectedAppointment.appointment_reason}
                    </p>
                  </div>
                )}
                <p className="mt-4 text-sm">
                  Select a new date and time for this appointment. The patient will be notified.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <DateTimePicker
              date={newDateTime}
              setDate={setNewDateTime}
              className="text-white"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedAppointment(null);
                setNewDateTime(undefined);
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAppointment}
              disabled={updating || !newDateTime}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Appointment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
