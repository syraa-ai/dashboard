
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardProps {
  callsTotal: number;
  callsAnswered: number;
  callsMissed: number;
  appointmentsTotal: number;
}

const StatsCard = ({
  callsTotal,
  callsAnswered,
  callsMissed,
  appointmentsTotal
}: StatsCardProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <Tabs defaultValue="calls">
          <div className="border-b px-6 py-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="calls">Call Statistics</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="calls" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Phone size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Calls</p>
                  <p className="text-2xl font-semibold">{callsTotal}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Answered</p>
                  <p className="text-2xl font-semibold">{callsAnswered}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Missed</p>
                  <p className="text-2xl font-semibold">{callsMissed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">
                {callsTotal > 0 
                  ? `${Math.round((callsAnswered / callsTotal) * 100)}% call answer rate` 
                  : 'No calls recorded yet'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar size={24} className="text-brand-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-2xl font-semibold">{appointmentsTotal}</p>
                </div>
              </div>
              
              <div className="col-span-2 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-semibold">
                    {callsTotal > 0 
                      ? `${Math.round((appointmentsTotal / callsTotal) * 100)}%` 
                      : '0%'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    of calls converted to appointments
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
