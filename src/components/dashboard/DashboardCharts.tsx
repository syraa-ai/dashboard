import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { CallHistoryRecord } from '@/integrations/supabase/types';

interface DashboardChartsProps {
  callHistory: CallHistoryRecord[];
  loading: boolean;
}

// Helper to create gradient for chart
const GradientColors = ({ id, colors }: { id: string, colors: string[] }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      {colors.map((color, index) => (
        <stop
          key={`${id}-${index}`}
          offset={`${(index / (colors.length - 1)) * 100}%`}
          stopColor={color}
          stopOpacity={index === 0 ? 0.8 : 0.2}
        />
      ))}
    </linearGradient>
  </defs>
);

const DashboardCharts = ({ callHistory, loading }: DashboardChartsProps) => {
  // Process call data for time series charts
  const processCallsOverTime = () => {
    if (!callHistory.length) return [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const callsByDay = last7Days.map(day => {
      // Calls on this day
      const callsOnDay = callHistory.filter(call => {
        if (!call.call_start) return false;
        const callDate = new Date(call.call_start);
        return callDate.toISOString().split('T')[0] === day;
      });

      // Get answered/missed call counts
      const answeredCalls = callsOnDay.filter(call => call.call_status === 'answered').length;
      const missedCalls = callsOnDay.filter(call => call.call_status === 'missed').length;
      
      // Get appointments for this day
      const appointmentsOnDay = callHistory.filter(call => {
        if (!call.appointment_date) return false;
        const appointmentDate = new Date(call.appointment_date);
        return appointmentDate.toISOString().split('T')[0] === day;
      }).length;

      // Format date more nicely for display
      const formattedDate = new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        date: formattedDate,
        short: formattedDate.split(' ')[1], // Just the day number for mobile
        answered: answeredCalls,
        missed: missedCalls,
        total: answeredCalls + missedCalls,
        appointments: appointmentsOnDay,
        // Simulated metrics for visual appeal
        aiUtilization: Math.round(70 + Math.random() * 25), // 70-95% range
      };
    });

    return callsByDay;
  };

  // Process calls by time of day for bar chart
  const processCallsByTime = () => {
    if (!callHistory.length) return [];
    
    // Group calls by hour of the day
    const hourData: Record<string, { hour: string; display: string; calls: number; answered: number; missed: number }> = {};
    
    // Initialize hours to ensure all hours appear
    for (let i = 0; i < 24; i++) {
      const hour = i;
      const hourKey = `${hour}`;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      
      hourData[hourKey] = { 
        hour: hourKey, 
        display: `${displayHour} ${amPm}`,
        calls: 0,
        answered: 0,
        missed: 0
      };
    }
    
    // Populate with actual data
    callHistory.forEach(call => {
      if (!call.call_start) return;
      
      const callDate = new Date(call.call_start);
      const hour = callDate.getHours();
      const hourKey = `${hour}`;
      
      hourData[hourKey].calls += 1;
      
      // Track call status
      if (call.call_status === 'answered') {
        hourData[hourKey].answered += 1;
      } else if (call.call_status === 'missed') {
        hourData[hourKey].missed += 1;
      }
    });
    
    // Filter to only active hours (where calls > 0) to keep chart clean
    const activeHours = Object.values(hourData)
      .filter(item => item.calls > 0)
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    
    // If no active hours (no calls), return a few sample hours
    if (activeHours.length === 0) {
      return [
        { hour: '9', display: '9 AM', calls: 0, answered: 0, missed: 0 },
        { hour: '12', display: '12 PM', calls: 0, answered: 0, missed: 0 },
        { hour: '15', display: '3 PM', calls: 0, answered: 0, missed: 0 },
      ];
    }
    
    return activeHours;
  };

  // Process call statuses for pie chart
  const processCallStatus = () => {
    if (!callHistory.length) return [];
    
    // Count call statuses
    const answeredCalls = callHistory.filter(call => call.call_status === 'answered').length;
    const missedCalls = callHistory.filter(call => call.call_status === 'missed').length;
    const totalCalls = answeredCalls + missedCalls;
    
    // If no calls, return template data
    if (totalCalls === 0) {
      return [
        { name: 'Answered', value: 0, color: '#22c55e' },
        { name: 'Missed', value: 0, color: '#ef4444' }
      ];
    }
    
    return [
      { name: 'Answered', value: answeredCalls, color: '#22c55e' },
      { name: 'Missed', value: missedCalls, color: '#ef4444' }
    ];
  };

  const timeSeriesData = processCallsOverTime();
  const callsByTimeData = processCallsByTime();
  const callStatusData = processCallStatus();

  // Custom tooltip styles
  const customTooltipStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    borderRadius: '6px',
    padding: '10px 14px',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
  };

  // Formatter for pie chart labels
  const pieChartLabelFormatter = (entry: any) => {
    const totalCalls = callStatusData.reduce((sum, item) => sum + item.value, 0);
    if (totalCalls === 0) return '0%';
    return `${Math.round((entry.value / totalCalls) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Call Volume Area Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timeSeriesData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <GradientColors id="colorAnswered" colors={['#8b5cf6', '#4338ca']} />
            <GradientColors id="colorMissed" colors={['#ef4444', '#7f1d1d']} />
            <GradientColors id="colorAppointments" colors={['#06b6d4', '#0e7490']} />
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip 
              contentStyle={customTooltipStyle}
              labelStyle={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold', marginBottom: '5px' }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 15 }}
              iconType="circle"
              formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="answered" 
              name="Answered Calls"
              stroke="#8b5cf6" 
              fillOpacity={1}
              fill="url(#colorAnswered)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="missed" 
              name="Missed Calls"
              stroke="#ef4444" 
              fillOpacity={0.8}
              fill="url(#colorMissed)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="appointments" 
              name="Appointments"
              stroke="#06b6d4" 
              fillOpacity={0.5}
              fill="url(#colorAppointments)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Two-chart layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Call by Time of Day */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={callsByTimeData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              barGap={0}
              barCategoryGap="10%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="display" 
                stroke="rgba(255,255,255,0.3)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={customTooltipStyle}
                formatter={(value, name) => {
                  const formattedName = name === 'answered' ? 'Answered Calls' : 
                                       name === 'missed' ? 'Missed Calls' : name;
                  return [`${value}`, formattedName];
                }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 15 }}
                iconType="circle"
                formatter={(value) => {
                  const displayName = value === 'answered' ? 'Answered' : 
                                     value === 'missed' ? 'Missed' : value;
                  return <span style={{ color: 'rgba(255,255,255,0.8)' }}>{displayName}</span>;
                }}
              />
              <Bar dataKey="answered" name="answered" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missed" name="missed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Call Status Distribution */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={callStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
                label={pieChartLabelFormatter}
              >
                {callStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={customTooltipStyle}
                formatter={(value, name, props) => {
                  const totalCalls = callStatusData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = totalCalls ? Math.round((Number(value) / totalCalls) * 100) : 0;
                  return [`${value} calls (${percentage}%)`, name];
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value} Calls</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;