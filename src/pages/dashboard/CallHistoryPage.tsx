import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, Loader2, Search, Filter } from 'lucide-react';
import { format, isToday, parseISO, subDays, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const CallHistoryPage = () => {
  const [records, setRecords] = useState<Tables<'call_history'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel>>();
  
  const fetchRecords = useCallback(async () => {
    try {
      if (!supabase) {
        console.error('CallHistoryPage: Supabase client is not initialized.');
        return;
      }
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('CallHistoryPage: Error getting session:', sessionError);
        return;
      }
      const userId = session?.user?.id;
      console.log("CallHistoryPage: Fetching records for userId:", userId, "Session:", session);
      
      if (!userId) {
        console.error('CallHistoryPage: No authenticated user found, cannot fetch call history. Session is null or user ID is missing.');
        return;
      }
      
      const { data: recordsData, error: recordsError } = await supabase
        .from('call_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (recordsError) {
        console.error('CallHistoryPage: Error fetching call history:', recordsError.message, recordsError.details, recordsError.hint);
        throw recordsError;
      }
      
      console.log("CallHistoryPage: Fetched records data successfully. Count:", recordsData?.length, "Data:", recordsData);
      setRecords(recordsData || []);
    } catch (error) {
      console.error('CallHistoryPage: Uncaught error fetching call history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    
    const setupSubscription = async () => {
      if (!supabase) {
        console.error('CallHistoryPage: Supabase client is not initialized for subscription.');
        return;
      }
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('CallHistoryPage: Error getting session for subscription:', sessionError);
        return;
      }
      const userId = session?.user?.id;
      console.log("CallHistoryPage: Setting up real-time subscription for userId:", userId, "Session:", session);
      
      if (!userId) {
        console.error('CallHistoryPage: Cannot set up subscription: No authenticated user or user ID missing.');
        return;
      }
      
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      
      subscriptionRef.current = supabase
        .channel('call_history_changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'call_history',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            setRecords(prevRecords => {
              const updatedRecords = [...prevRecords];
            if (payload.eventType === 'INSERT') {
              updatedRecords.push(payload.new as Tables<'call_history'>);
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedRecords.findIndex(r => r.row_id === payload.new.row_id);
              if (index >= 0) {
                updatedRecords[index] = payload.new as Tables<'call_history'>;
              }
            } else if (payload.eventType === 'DELETE') {
              const index = updatedRecords.findIndex(r => r.row_id === (payload.old as any).row_id);
              if (index >= 0) {
                updatedRecords.splice(index, 1);
              }
              }
              // Sort records by date in descending order after any changes
              return updatedRecords.sort((a, b) => {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
              });
            });
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
  }, [fetchRecords]);

  const formatDuration = (duration: string | undefined) => {
    if (!duration) return '';
    // Expected format from Supabase interval type: "HH:MM:SS" or "X days HH:MM:SS"
    const parts = duration.split(' ');
    let days = 0;
    let timePart = duration;

    if (parts.length > 1 && parts[1].includes('day')) {
      days = parseInt(parts[0]);
      timePart = parts[2];
    } else if (parts.length > 1 && parts[0].includes('day')) {
      days = parseInt(parts[0].split(' ')[0]);
      timePart = parts[1];
    }

    const timeComponents = timePart.split(':').map(Number);
    let hours = 0, minutes = 0, seconds = 0;

    if (timeComponents.length === 3) {
      hours = timeComponents[0];
      minutes = timeComponents[1];
      seconds = timeComponents[2];
    } else if (timeComponents.length === 2) {
      minutes = timeComponents[0];
      seconds = timeComponents[1];
    } else if (timeComponents.length === 1) {
      seconds = timeComponents[0];
    }

    let formatted = '';
    if (days > 0) formatted += `${days}d `;
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0) formatted += `${minutes}m `;
    if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) formatted += `${seconds}s`;

    return formatted.trim();
  };

  const getDurationInSeconds = (duration: string | undefined) => {
    if (!duration) return 0;
    const parts = duration.split(' ');
    let days = 0;
    let timePart = duration;

    if (parts.length > 1 && parts[1].includes('day')) {
      days = parseInt(parts[0]);
      timePart = parts[2];
    } else if (parts.length > 1 && parts[0].includes('day')) {
      days = parseInt(parts[0].split(' ')[0]);
      timePart = parts[1];
    }

    const timeComponents = timePart.split(':').map(Number);
    let hours = 0, minutes = 0, seconds = 0;

    if (timeComponents.length === 3) {
      hours = timeComponents[0];
      minutes = timeComponents[1];
      seconds = timeComponents[2];
    } else if (timeComponents.length === 2) {
      minutes = timeComponents[0];
      seconds = timeComponents[1];
    } else if (timeComponents.length === 1) {
      seconds = timeComponents[0];
    }

    return (days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds;
  };

  const filteredRecords = records.filter(record => {
    let matchesSearch = true;
    let matchesStatus = true;
    let matchesDate = true;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      matchesSearch = (record.caller_number?.toLowerCase().includes(searchLower) || false);
    }

    if (statusFilter !== 'all') {
      matchesStatus = record.call_status?.toLowerCase() === statusFilter.toLowerCase();
    }

    if (dateFilter !== 'all' && record.created_at) {
      const recordDate = parseISO(record.created_at);
      const now = new Date();
      
      switch(dateFilter) {
        case 'today':
          matchesDate = isToday(recordDate);
          break;
        case 'week': {
          const weekAgo = subDays(now, 7);
          matchesDate = recordDate >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = subMonths(now, 1);
          matchesDate = recordDate >= monthAgo;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalCalls = filteredRecords.length;
  const todayCalls = filteredRecords.filter(r => {
    const dateToCheck = r.created_at;
    if (!dateToCheck) return false;
    try {
      return isToday(parseISO(dateToCheck));
    } catch (e) {
      return false;
    }
  }).length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Call History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 shadow-sm border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-300">Total Calls</p>
            <p className="text-2xl font-bold mt-1 text-white">{totalCalls}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 shadow-sm border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-400 flex items-center"><Phone size={16} className="mr-1" />Today's Calls</p>
            <p className="text-2xl font-bold mt-1 text-white">{todayCalls}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Call History</CardTitle>
              <CardDescription className="text-gray-300">
                All calls managed by your AI assistant
              </CardDescription>
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input 
                  placeholder="Search calls..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2"
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="not-sheduled">Not Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (<30s)</option>
                <option value="medium">Medium (30s-2m)</option>
                <option value="long">Long (>2m)</option>
              </select>
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-2"
              >
                <option value="all">All Reasons</option>
                <option value="general checkup">General Checkup</option>
                <option value="fever">Fever</option>
                <option value="consultation">Consultation</option>
                <option value="viral fever">Viral Fever</option>
              </select>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Patient</TableHead>
                    <TableHead className="text-gray-300">Date & Duration</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-right text-gray-300">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.row_id} className="border-gray-700">
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User size={14} className="mr-1 text-gray-400" />
                            <span className="font-medium text-gray-200">{record.caller_number || 'Unknown'}</span>
                          </div>
                          {record.caller_number && (
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <Phone size={12} className="mr-1" />
                              {record.caller_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center text-sm text-gray-200">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {record.created_at && format(parseISO(record.created_at), 'MMM dd, yyyy h:mm a')}
                          </span>
                          {record.call_duration && (
                            <span className="flex items-center text-xs text-gray-400 mt-1">
                              <Clock size={12} className="mr-1" />
                              {formatDuration(record.call_duration)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          record.call_status === "completed"
                            ? "bg-green-900/20 text-green-400 border-green-700"
                            : "bg-red-900/20 text-red-400 border-red-700"
                        }>
                          {record.call_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/app/dashboard/call-history/${record.row_id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                            Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Phone size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-300">No call history found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search criteria' : 'Calls will appear here as patients interact with your AI assistant'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallHistoryPage;
