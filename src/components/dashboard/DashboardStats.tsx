import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone, Calendar, Users, CheckCircle, XCircle, Sparkles, Headphones, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  totalRecords: number;
  todayCalls: number;
  todayAppointments: number;
  lastRecordDate: string | null;
  loading: boolean;
  callsAnswered?: number;
  callsMissed?: number;
}

// Helper components for more visual stats
const StatTrend = ({ value, positive = true }: { value: number, positive?: boolean }) => (
  <div className={cn(
    "flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
    positive ? "text-emerald-400 bg-emerald-950/30" : "text-rose-400 bg-rose-950/30"
  )}>
    {positive ? (
      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
    {value}%
  </div>
);

const DashboardStats = ({
  totalRecords,
  todayCalls,
  todayAppointments,
  lastRecordDate,
  loading,
  callsAnswered = 0,
  callsMissed = 0
}: DashboardStatsProps) => {
  // Define the stats cards to display
  const statCards = [
    {
      title: "Calls",
      value: totalRecords,
      highlight: "Total",
      increase: 12, // Dummy trending data
      icon: <Users className="h-6 w-6" />,
      description: lastRecordDate ? `Last updated on ${lastRecordDate}` : "No records yet",
      gradient: "from-violet-600/20 to-violet-800/30",
      iconGradient: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500/20",
      textColor: "text-violet-200"
    },
    {
      title: "Today's Calls",
      value: todayCalls,
      highlight: "Answered",
      increase: 8, // Dummy trending data
      icon: <Phone className="h-6 w-6" />,
      description: "Total calls today",
      gradient: "from-blue-600/20 to-blue-800/30",
      iconGradient: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-200"
    },
    {
      title: "Appointments",
      value: todayAppointments,
      highlight: "Today",
      increase: 5, // Dummy trending data
      icon: <Calendar className="h-6 w-6" />,
      description: "Scheduled for today",
      gradient: "from-emerald-600/20 to-emerald-800/30",
      iconGradient: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-500/20",
      textColor: "text-emerald-200"
    }
  ];

  // Additional extended stats for the bottom row
  const extendedStats = [
    {
      title: "Average Call Duration",
      value: "4:25",
      icon: <Clock className="h-5 w-5" />,
      change: "+0:13",
      positive: true,
      gradient: "from-cyan-900/20 to-cyan-800/10",
      iconColor: "text-cyan-400",
    },
    {
      title: "AI Response Time",
      value: "0.8s",
      icon: <Sparkles className="h-5 w-5" />,
      change: "-0.2s",
      positive: true,
      gradient: "from-purple-900/20 to-purple-800/10",
      iconColor: "text-purple-400",
    },
    {
      title: "Patient Satisfaction",
      value: "94%",
      icon: <CheckCircle className="h-5 w-5" />,
      change: "+2%",
      positive: true,
      gradient: "from-green-900/20 to-green-800/10",
      iconColor: "text-green-400",
    },
    {
      title: "Call Conversion",
      value: "76%",
      icon: <Headphones className="h-5 w-5" />,
      change: "+4%",
      positive: true,
      gradient: "from-amber-900/20 to-amber-800/10",
      iconColor: "text-amber-400",
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-slate-800/30 border-slate-700/30 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700/60 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-slate-700/60 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-slate-700/60 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse bg-slate-800/30 border border-slate-700/30 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className={`overflow-hidden border backdrop-blur-sm shadow-xl group ${stat.borderColor}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`}></div>
            
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className={`${stat.textColor} text-sm font-medium mb-1 flex items-center space-x-1`}>
                    <span>{stat.title}</span>
                    <StatTrend value={stat.increase} positive={true} />
                  </div>
                  <div className="flex items-baseline mb-1">
                    <h3 className="text-3xl font-bold text-white mr-2">
                      {stat.value}
                    </h3>
                    <span className="text-white/70 text-sm font-medium">{stat.highlight}</span>
                  </div>
                  <p className="text-xs text-white/50 mb-1">
                    {stat.description}
                  </p>
                </div>
                
                <div className={`relative p-3 rounded-full bg-gradient-to-br ${stat.iconGradient} shadow-lg text-white`}>
                  {stat.icon}
                  <div className="absolute inset-0 rounded-full bg-white opacity-30 blur-md -z-10"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Extended Stats - Small Cards - HIDDEN */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {extendedStats.map((stat, index) => (
          <div key={index} className={`flex items-center p-4 rounded-lg bg-gradient-to-br ${stat.gradient} border border-slate-700/30 shadow-md`}>
            <div className={`p-2 rounded-full mr-3 bg-slate-800/60 ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">{stat.title}</div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">{stat.value}</span>
                <span className={cn(
                  "ml-2 text-xs font-medium",
                  stat.positive ? "text-emerald-400" : "text-rose-400"
                )}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default DashboardStats;
