import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, MessageCircle, Clock, Play } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [videoOpen, setVideoOpen] = useState(false);
  
  return (
    <div className="relative hero-gradient">
      <div className="absolute inset-0 bg-gradient-radial from-brand-purple-light/30 to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16 md:pb-24 md:pt-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <span className="bg-brand-purple-light text-brand-purple px-4 py-1.5 rounded-full font-medium text-sm">
                AI Voice Agent For Healthcare
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your AI <span className="gradient-text">Front Desk</span> Agent for Medical Practices
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Syraa AI answers calls, schedules appointments, and handles patient inquiries—all while delivering consistent, personalized service for your practice 24/7.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                className="gradient-button text-white px-8 py-6"
                asChild
              >
                <a href="https://forms.gle/1gzPVCFaK9wioX9Z8" target="_blank" rel="noopener noreferrer">
                  Talk to Sales <ArrowRight size={18} className="ml-2" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="border-brand-purple text-brand-purple hover:bg-brand-purple-light/20 px-8 py-6"
                onClick={() => setVideoOpen(true)}
              >
                <Play size={18} className="mr-2" /> Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone size={18} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-600">No missed calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageCircle size={18} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Detailed summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock size={18} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">24/7 availability</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="glass-card rounded-xl overflow-hidden shadow-xl animate-float relative z-20 border border-white/50">
              <div className="relative h-96 w-full">
                <img 
                  src="/public/lovable-uploads/syraa-ai.webp"
                  alt="Healthcare Front Desk" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-brand-purple flex items-center justify-center animate-pulse">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium">Syraa AI</p>
                      <p className="text-white/80 text-sm">Answering call from patient...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="glass-card absolute top-20 -right-10 p-4 rounded-lg hidden md:block animate-float border border-white/50 z-10" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Clock size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Appointment set</p>
                  <p className="text-xs text-gray-500">Dr. Smith, 2pm tomorrow</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card absolute -bottom-10 -left-10 p-4 rounded-lg hidden md:block animate-float border border-white/50 z-10" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Call Summary</p>
                  <p className="text-xs text-gray-500">Patient needs prescription refill</p>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-1/3 -right-20 h-40 w-40 rounded-full bg-brand-purple/20 blur-2xl"></div>
            <div className="absolute bottom-1/4 -left-16 h-32 w-32 rounded-full bg-brand-blue/20 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Syraa AI Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-2xl"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSection;
