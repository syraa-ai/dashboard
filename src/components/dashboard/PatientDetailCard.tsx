
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { 
  User, Calendar, Clock, MapPin, Phone, Mail, Stethoscope, 
  FileText, DollarSign, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

interface PatientDetailCardProps {
  appointment: Tables<'appointment_details'>;
}

const PatientDetailCard = ({ appointment }: PatientDetailCardProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Appointments
            </Button>
          </Link>
          
          <Badge className="bg-brand-purple-light/20 text-brand-purple hover:bg-brand-purple-light/30">
            Appointment
          </Badge>
        </div>
        
        <CardTitle className="text-2xl font-semibold mt-4 flex items-center">
          <User size={20} className="mr-2 text-brand-purple" />
          {appointment.patient_name || "Unknown Patient"}
        </CardTitle>
        <CardDescription>
          Patient details and appointment information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Patient Information</h3>
            
            <div className="space-y-3">
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Appointment Details</h3>
            
            <div className="space-y-3">
              {appointment.appointment_date &&
                <div className="flex items-start">
                  <Calendar size={18} className="mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              }
              
              {appointment.appointment_time &&
                <div className="flex items-start">
                  <Clock size={18} className="mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {appointment.appointment_time}
                    </p>
                  </div>
                </div>
              }
              
              {appointment.appointment_reason &&
                <div className="flex items-start">
                  <Stethoscope size={18} className="mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{appointment.appointment_reason}</p>
                  </div>
                </div>
              }
              
              {appointment.call_id &&
                <div className="flex items-start">
                  <Link to={`/dashboard/calls/${appointment.call_id}`} className="text-brand-purple hover:underline flex items-center">
                    <Phone size={16} className="mr-1" />
                    View Original Call
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
        

        
        <div className="flex justify-end mt-6 space-x-3">
          <Button variant="outline">
            <Mail size={16} className="mr-1" />
            Email Details
          </Button>
          <Button className="gradient-button">
            <Calendar size={16} className="mr-1" />
            Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetailCard;
