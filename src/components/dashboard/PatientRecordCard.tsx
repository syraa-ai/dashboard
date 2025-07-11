import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  User, Calendar, Clock, Phone, MapPin, FileText, DollarSign, 
  Stethoscope, ArrowLeft, CheckCircle, XCircle, Activity,
  MessageCircle, Printer, Download, Clipboard, Volume2, Tag
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientRecordDetailProps {
  record: Tables<'call_history'>;
}

const PatientRecordDetail = ({ record }: PatientRecordDetailProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <CheckCircle size={14} className="mr-1" /> Completed
          </Badge>
        );
      case 'missed':
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            <XCircle size={14} className="mr-1" /> Missed
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
            <Calendar size={14} className="mr-1" /> Scheduled
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
            <CheckCircle size={14} className="mr-1" /> Confirmed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400">
            <XCircle size={14} className="mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400">
            Unknown
          </Badge>
        );
    }
  };

  const getCallStatusBadge = (status?: string | null) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-800/30 text-green-400">
            <CheckCircle size={14} className="mr-1" /> Answered
          </Badge>
        );
      case 'missed':
        return (
          <Badge className="bg-red-800/30 text-red-400">
            <XCircle size={14} className="mr-1" /> Missed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-700/50 text-gray-200">
            <Activity size={14} className="mr-1" /> {status || "Unknown"}
          </Badge>
        );
    }
  };

  const isCall = !!record.call_start;
  
  const formatDuration = (duration?: string | null) => {
    if (!duration) return "N/A";
    return duration;
  };

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    const summaryText = record.call_summary || 'No summary available';
    navigator.clipboard.writeText(summaryText);
    alert('Summary copied to clipboard');
  };

  return (
    <Card className="shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 print:shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard/call-history">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600 dark:text-gray-300 print:hidden">
              <ArrowLeft size={16} className="mr-1" />
              Back to Call History
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            {isCall && getCallStatusBadge(record.call_status)}
            <Button variant="ghost" size="sm" className="print:hidden" onClick={handlePrint}>
              <Printer size={16} className="mr-1" />
              Print
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-2xl font-semibold mt-4 flex items-center text-gray-900 dark:text-white">
          <User size={20} className="mr-2 text-brand-purple" />
          {record.caller_number || 'Unknown Patient'}
          {record.call_id && (
            <Badge variant="outline" className="ml-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Call ID: {record.call_id}
            </Badge>
          )}
        </CardTitle>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {record.created_at && (
            <CardDescription className="text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar size={14} className="mr-1" /> 
              Created {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="summary" className="print:hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="summary" onClick={() => setActiveTab("summary")}>Summary</TabsTrigger>
            <TabsTrigger value="details" onClick={() => setActiveTab("details")}>Call Details</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4">
            {record.call_summary ? (
              <div className="relative">
                <div className="absolute right-2 top-2 flex gap-2 print:hidden">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Clipboard size={14} className="mr-1" /> Copy
                  </Button>
                </div>
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                      <FileText size={18} className="mr-2 text-brand-purple" />
                      Call Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] md:h-auto md:max-h-[450px] pr-4">
                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {record.call_summary}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No summary available for this call</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="py-2 space-y-2">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{record.caller_number || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
              
              {isCall && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Call Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 space-y-2">
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {record.call_start ? format(new Date(record.call_start), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      
                      <span className="text-gray-500 dark:text-gray-400">Time:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {record.call_start ? format(new Date(record.call_start), 'h:mm a') : 'N/A'}
                      </span>
                      
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {formatDuration(record.call_duration)}
                      </span>
                      
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {record.call_status || 'Unknown'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatientRecordDetail;