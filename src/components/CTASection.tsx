import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="glass-card rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Practice's Patient Experience
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of healthcare providers who have revolutionized their front desk operations with Syraa AI. 
                Never miss another patient call and ensure consistent, professional service around the clock.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="gradient-button text-white px-8 py-6" asChild>
                  <a href="https://forms.gle/1gzPVCFaK9wioX9Z8" target="_blank" rel="noopener noreferrer">
                    Talk to Sales <ArrowRight size={18} className="ml-2" />
                  </a>
                </Button>
                <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple-light/20 px-8 py-6" asChild>
                  <a href="https://forms.gle/1gzPVCFaK9wioX9Z8" target="_blank" rel="noopener noreferrer">
                    Schedule a Demo
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-brand-purple to-brand-blue rounded-r-xl hidden lg:block">
              <div className="h-full w-full flex items-center justify-center p-12">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to elevate your patient care?</h3>
                  <p className="text-lg mb-6 max-w-md">
                    Our AI agent is designed specifically for healthcare providers like you.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">99%</div>
                      <div className="text-sm">Call Answer Rate</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">85%</div>
                      <div className="text-sm">Patient Satisfaction</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">70%</div>
                      <div className="text-sm">Staff Time Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
