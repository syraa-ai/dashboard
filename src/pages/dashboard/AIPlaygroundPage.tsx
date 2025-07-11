import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Save, Mic, Volume2, Bot, MessageSquare, Settings, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from "@/components/ui/sonner";

const AIPlaygroundPage = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<Partial<Tables<'user_settings'>>>({});

  // AI Behavior settings
  const [aiSettings, setAiSettings] = useState({
    name: 'Syraa',
    personality: 'Professional and friendly',
    greeting: 'Hello, this is Syraa, your virtual medical assistant. How may I help you today?',
    enableSmallTalk: true,
    enableHumor: false,
    enableDetailedResponses: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setUserSettings(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your preferences');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSettingChange = (key: keyof Tables<'user_settings'>, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAISettingChange = (key: string, value: any) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(userSettings)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const saveAISettings = async () => {
    // Placeholder for when backend supports AI settings storage
    toast.success('AI settings saved successfully');
  };

  const resetToDefaults = () => {
    setUserSettings({
        agent_voice: 'Aria',
        custom_greetings: 'Hello, this is Syraa, your virtual medical assistant. How may I help you today?',
        custom_endings: 'Thank you for calling. Have a great day!',
    });
    
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Settings</h1>
          <p className="text-gray-400">Customize how your AI assistant behaves and sounds</p>
        </div>
        <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="voice" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="voice" className="data-[state=active]:bg-brand-purple">
            <Volume2 size={16} className="mr-2" />
            Voice Settings
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-brand-purple">
            <Bot size={16} className="mr-2" />
            AI Behavior
          </TabsTrigger>
          <TabsTrigger value="responses" className="data-[state=active]:bg-brand-purple">
            <MessageSquare size={16} className="mr-2" />
            Response Templates
          </TabsTrigger>
        </TabsList>

        {/* Voice Settings Tab */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Volume2 size={20} className="mr-2 text-brand-purple" />
                Voice Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize how your AI assistant sounds when speaking to patients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agent-voice" className="text-gray-300">Agent Voice</Label>
                    <Select 
                      value={userSettings.agent_voice || ''}
                      onValueChange={(value) => handleSettingChange('agent_voice', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="Aria">Aria</SelectItem>
                        <SelectItem value="Sonia">Sonia</SelectItem>
                        <SelectItem value="Maya">Maya</SelectItem>
                        <SelectItem value="Priya">Priya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={saveSettings} 
                  disabled={loading}
                  className="bg-brand-purple hover:bg-brand-purple/90"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                  <Save size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mic size={20} className="mr-2 text-brand-purple" />
                Voice Preview
              </CardTitle>
              <CardDescription className="text-gray-400">
                Listen to how your AI assistant will sound with these settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-gray-300 mb-4">
                  "{userSettings.custom_greetings}"
                </p>
                <Button className="bg-brand-purple hover:bg-brand-purple/90">
                  <Volume2 size={16} className="mr-2" />
                  Play Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bot size={20} className="mr-2 text-brand-purple" />
                AI Personality
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure how your AI assistant behaves when interacting with patients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-greetings" className="text-gray-300">Greeting Message</Label>
                    <Textarea 
                      id="custom-greetings"
                      value={userSettings.custom_greetings || ''}
                      onChange={(e) => handleSettingChange('custom_greetings', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white h-32"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={saveSettings}
                  className="bg-brand-purple hover:bg-brand-purple/90"
                >
                  Save Settings
                  <Save size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Templates Tab */}
        <TabsContent value="responses" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare size={20} className="mr-2 text-brand-purple" />
                Response Templates
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize how your AI responds to common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-2 block">Ending Message</Label>
                  <Textarea 
                    className="bg-gray-700 border-gray-600 text-white h-24"
                    placeholder="Thank you for calling. Have a great day!"
                    value={userSettings.custom_endings || ''}
                    onChange={(e) => handleSettingChange('custom_endings', e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={saveSettings}
                    className="bg-brand-purple hover:bg-brand-purple/90"
                  >
                    Save Settings
                    <Save size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPlaygroundPage;
