import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, DollarSign, Loader2 } from 'lucide-react';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';

export interface Appointment {
  id: string;
  patient_name: string;
  mobile_number: string;
  appointment_date: string;
  appointment_time: string;
  amount_paid: number;
  disease?: string;
  call_id: string;
  appointment_status?: string;
}

interface AppointmentCardProps {
  appointments: Appointment[];
  loading: boolean;
}

const AppointmentCard = ({ appointments, loading }: AppointmentCardProps) => {
  const getAppointmentStatus = (appointment: Appointment) => {
    // If appointment_status is available, use that
    if (appointment.appointment_status) {
      const status = appointment.appointment_status.toLowerCase();
      
      if (status === 'completed') {
        return { label: "Completed", variant: "secondary", color: "bg-green-100 text-green-800" };
      } else if (status === 'confirmed') {
        return { label: "Confirmed", variant: "default", color: "bg-blue-100 text-blue-800" };
      } else if (status === 'scheduled') {
        return { label: "Scheduled", variant: "outline", color: "bg-purple-100 text-purple-800" };
      } else if (status === 'cancelled') {
        return { label: "Cancelled", variant: "destructive", color: "bg-red-100 text-red-800" };
      }
    }
    
    // Fall back to date-based status if appointment_status is not available
    const appointmentDate = new Date(appointment.appointment_date);
    
    if (isToday(appointmentDate)) {
      return { label: "Today", variant: "default", color: "bg-brand-purple-light/20 text-brand-purple" };
    } else if (isTomorrow(appointmentDate)) {
      return { label: "Tomorrow", variant: "outline", color: "bg-blue-100 text-blue-800" };
    } else if (isPast(appointmentDate)) {
      return { label: "Completed", variant: "secondary", color: "bg-green-100 text-green-800" };
    } else {
      return { label: "Upcoming", variant: "outline", color: "bg-purple-100 text-purple-800" };
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Upcoming Appointments</CardTitle>
          <CardDescription>
            Patient appointments scheduled by Syraa AI
          </CardDescription>
        </div>
        <Link to="/dashboard/appointments">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            <span className="ml-2 text-gray-500">Loading appointments...</span>
          </div>
        ) : appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                const status = getAppointmentStatus(appointment);
                
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <User size={14} className="mr-1 text-gray-500" />
                          <span className="font-medium">{appointment.patient_name}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Phone size={12} className="mr-1" />
                          {appointment.mobile_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm">
                          <Calendar size={14} className="mr-1 text-gray-500" />
                          {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock size={12} className="mr-1" />
                          {appointment.appointment_time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1 text-gray-500" />
                        {appointment.amount_paid || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/appointments/${appointment.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No appointments scheduled yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Appointments booked through Syraa AI will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
