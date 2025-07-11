import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from 'date-fns';
import { Phone, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, FileText, User, Copy, Printer, PlayCircle, Info, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

interface CallDetailCardProps {
  call: Tables<'call_history'>;
}

const CallDetailCard = ({ call }: CallDetailCardProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [appointment, setAppointment] = useState<Tables<'appointment_details'> | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!call.call_id) return;

      const { data, error } = await supabase
        .from('appointment_details')
        .select('*')
        .eq('call_id', call.row_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching appointment for call:', error);
        return;
      }

      setAppointment(data);
    };

    fetchAppointment();
  }, [call.call_id, call.row_id]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const displayStatus = call.call_status;

  return (
    <Card className="shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 print:shadow-none">
      <CardHeader className="pb-3 print:pb-1">
        <div className="flex items-center justify-between print:hidden">
          <Link to="/dashboard/call-history">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600 dark:text-gray-300">
              <ArrowLeft size={16} className="mr-1" />
              Back to Call History
            </Button>
          </Link>
          
          {displayStatus === 'completed' ? (
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <CheckCircle size={14} className="mr-1" /> Completed Call
            </Badge>
          ) : displayStatus === 'missed' ? (
            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <XCircle size={14} className="mr-1" /> Missed Call
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              <Phone size={14} className="mr-1" /> {displayStatus}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-start mt-2">
          <div>
            <CardTitle className="text-2xl font-semibold flex items-center text-gray-900 dark:text-white">
              <User size={20} className="mr-2 text-brand-purple" />
              {call.caller_number || 'Unknown Patient'}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
              {call.caller_number && (
                <span className="flex items-center">
                  <Phone size={14} className="mr-1" /> {call.caller_number}
                </span>
              )}
              {call.call_start &&
                <span className="flex items-center mt-1">
                  <Calendar size={14} className="mr-1" /> 
                  {format(new Date(call.call_start), 'MMMM d, yyyy • h:mm a')}
                </span>
              }
            </CardDescription>
          </div>
          
          <div className="flex space-x-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={14} className="mr-1" /> Print
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="summary" className="print:hidden" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="summary">
              <FileText size={16} className="mr-1" /> Summary
            </TabsTrigger>
            <TabsTrigger value="details">
              <Info size={16} className="mr-1" /> Call Details
            </TabsTrigger>
            <TabsTrigger value="appointment" disabled={!appointment}>
              <Calendar size={16} className="mr-1" /> Appointment
            </TabsTrigger>
            <TabsTrigger value="recording" disabled={true}>
              <PlayCircle size={16} className="mr-1" /> Recording
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            {call.call_summary ? (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                    <MessageSquare size={20} className="mr-2 text-brand-purple" /> Call Summary
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(call.call_summary || '')}>
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {call.call_summary}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-center">
                <AlertCircle size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No call summary available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <User size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Caller Information</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{call.caller_number || 'Unknown'}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <Calendar size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Date & Time</h3>
                </div>
                {call.call_start &&
                  <>
                    <p className="text-gray-700 dark:text-gray-300">{format(new Date(call.call_start), 'MMMM d, yyyy')}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {format(new Date(call.call_start), 'h:mm a')}
                      {call.call_end && ` - ${format(new Date(call.call_end), 'h:mm a')}`}
                    </p>
                  </>
                }
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <Clock size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Call Duration</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{call.call_duration}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <Phone size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Call Status</h3>
                </div>
                <div>
                  {displayStatus === 'completed' ? (
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      <CheckCircle size={14} className="mr-1" /> Completed
                    </Badge>
                  ) : displayStatus === 'missed' ? (
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                      <XCircle size={14} className="mr-1" /> Missed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                      <Phone size={14} className="mr-1" /> {displayStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <MessageSquare size={18} className="mr-2 text-brand-purple" /> Call Summary
                </h3>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                {call.call_summary ? (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{call.call_summary}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No call summary available</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appointment">
            {appointment && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-100 dark:border-gray-600">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center mb-4">
                  <Calendar size={20} className="mr-2 text-brand-purple" /> Appointment Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Patient Name</h4>
                    <p className="text-gray-900 dark:text-white text-lg font-medium">
                      {appointment.patient_name || 'Unknown Patient'}
                    </p>
                  </div>
                  
                  {appointment.appointment_date && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Appointment Date & Time</h4>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(appointment.appointment_date), 'MMMM d, yyyy')}
                        {appointment.appointment_time && ` at ${appointment.appointment_time}`}
                      </p>
                    </div>
                  )}
                  
                  {appointment.appointment_reason && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Appointment Reason</h4>
                      <p className="text-gray-700 dark:text-gray-300">{appointment.appointment_reason}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <Link to={`/dashboard/appointments/${appointment.row_id}`}>
                    <Button size="sm" className="gradient-button">
                      <Calendar size={16} className="mr-1" /> View Complete Appointment Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CallDetailCard;
