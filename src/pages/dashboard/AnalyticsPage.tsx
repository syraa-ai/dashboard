
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, PhoneCall, Calendar, Clock, CheckCircle2, XCircle, Loader2, BarChart2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { subDays, format } from 'date-fns';

const COLORS = ['#8884d8', '#ff5252', '#82ca9d', '#ffc658'];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [callData, setCallData] = useState<Tables<'call_history'>[]>([]);
  const [appointmentData, setAppointmentData] = useState<Tables<'appointment_details'>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);

      const fromDate = subDays(new Date(), 30).toISOString();

      const { data: calls, error: callsError } = await supabase
        .from('call_history')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', fromDate);
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointment_details')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', fromDate);

      if (callsError || appointmentsError) {
        console.error(callsError || appointmentsError);
        setLoading(false);
        return;
      }

      setCallData(calls || []);
      setAppointmentData(appointments || []);
      setLoading(false);
    };

    fetchData();
  }, [navigate, timeRange]);

  const processChartData = () => {
    const dailyData: { [key: string]: { calls: number, appointments: number } } = {};

    callData.forEach(call => {
      const day = format(new Date(call.created_at), 'yyyy-MM-dd');
      if (!dailyData[day]) dailyData[day] = { calls: 0, appointments: 0 };
      dailyData[day].calls++;
    });

    appointmentData.forEach(appointment => {
      const day = format(new Date(appointment.created_at), 'yyyy-MM-dd');
      if (!dailyData[day]) dailyData[day] = { calls: 0, appointments: 0 };
      dailyData[day].appointments++;
    });

    return Object.keys(dailyData).map(day => ({
      name: format(new Date(day), 'MMM d'),
      calls: dailyData[day].calls,
      appointments: dailyData[day].appointments,
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };

  const chartData = processChartData();
  const totalCalls = callData.length;
  const totalAppointments = appointmentData.length;
  const conversionRate = totalCalls > 0 ? Math.round((totalAppointments / totalCalls) * 100) : 0;
  
  const callStatusData = callData.reduce((acc, call) => {
    const status = call.call_status || 'Unknown';
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string, value: number }[]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-16 h-16 border-4 border-t-brand-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your calls, appointments, and performance metrics
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Calls</p>
                <h4 className="text-3xl font-bold mt-1">{totalCalls}</h4>
              </div>
              <div className="bg-brand-purple/10 p-3 rounded-full">
                <PhoneCall className="h-6 w-6 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Appointments</p>
                <h4 className="text-3xl font-bold mt-1">{totalAppointments}</h4>
              </div>
              <div className="bg-blue-400/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h4 className="text-3xl font-bold mt-1">{conversionRate}%</h4>
              </div>
              <div className="bg-green-400/10 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Call Duration</p>
                <h4 className="text-3xl font-bold mt-1">N/A</h4>
              </div>
              <div className="bg-amber-400/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full mt-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Call & Appointment Trends</CardTitle>
                <CardDescription>Overview of daily call and appointment volumes</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="calls" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="appointments" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Call Status Distribution</CardTitle>
                <CardDescription>Breakdown of call outcomes</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={callStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {callStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="calls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Call Volume by Day</CardTitle>
                <CardDescription>Number of calls received per day</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calls" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Call Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Call Duration Distribution</CardTitle>
                <CardDescription>Breakdown of call durations</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80 flex items-center justify-center">
                  <p>Data not available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Day</CardTitle>
                <CardDescription>Number of appointments scheduled per day</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Conversion Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Call to Appointment Conversion</CardTitle>
                <CardDescription>Percentage of calls resulting in appointments</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center justify-center h-80">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-brand-purple">{conversionRate}%</div>
                  </div>
                  <div className="h-full w-full rounded-full border-8 border-brand-purple/30">
                    <div 
                      className="h-full w-full rounded-full border-8 border-t-brand-purple border-r-brand-purple border-b-transparent border-l-transparent"
                      style={{ transform: `rotate(${45 + (conversionRate/100) * 360}deg)` }}
                    ></div>
                  </div>
                </div>
                <p className="mt-6 text-gray-600 text-center">
                  {conversionRate}% of your calls result in scheduled appointments.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
