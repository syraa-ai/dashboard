import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Clock, CheckCircle, XCircle, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export interface Call {
  id: string;
  call_date: string;
  duration: string;
  status: string;
  call_status?: string;
  voice_used: string;
  has_appointment?: boolean;
  patient_name?: string;
  name?: string;
  appointment_status?: string;
}

interface CallHistoryCardProps {
  calls: Call[];
  loading: boolean;
}

const CallHistoryCard = ({ calls, loading }: CallHistoryCardProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Recent Calls</CardTitle>
          <CardDescription>
            Recent patient calls handled by Syraa AI
          </CardDescription>
        </div>
        <Link to="/dashboard/calls">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            <span className="ml-2 text-gray-500">Loading calls...</span>
          </div>
        ) : calls.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Appointment</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => {
                // Use call_status if available, otherwise fallback to status
                const displayStatus = call.call_status || call.status;
                
                return (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User size={14} className="mr-2 text-gray-500" />
                      {call.patient_name || call.name || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="flex items-center text-sm">
                        <Calendar size={14} className="mr-1 text-gray-500" /> 
                        {format(new Date(call.call_date), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" /> 
                        {format(new Date(call.call_date), 'hh:mm a')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {displayStatus === 'completed' || displayStatus === 'answered' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        <CheckCircle size={12} className="mr-1" /> Completed
                      </Badge>
                    ) : displayStatus === 'missed' ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        <XCircle size={12} className="mr-1" /> Missed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        <Phone size={12} className="mr-1" /> {displayStatus || 'Unknown'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    {call.has_appointment ? (
                      <Badge className={
                        call.appointment_status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.appointment_status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        call.appointment_status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                        call.appointment_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-brand-purple-light/20 text-brand-purple hover:bg-brand-purple-light/30'
                      }>
                        {call.appointment_status ? 
                          call.appointment_status.charAt(0).toUpperCase() + call.appointment_status.slice(1) :
                          'Booked'
                        }
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/calls/${call.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Phone size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No calls recorded yet</p>
            <p className="text-sm text-gray-400 mt-1">
              When patients call your practice, they will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallHistoryCard;
