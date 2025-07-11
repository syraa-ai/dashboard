
import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
}

interface PricingSectionProps {
  onSelectPlan?: (planId: string) => void;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'doctor',
    title: 'For Individual Doctors',
    price: 16000,
    description: 'Perfect for solo practitioners who need flexibility.',
    features: [
      'AI voice agent for a single number',
      'Up to 300 calls per month',
      'Basic appointment scheduling',
      'Email summaries',
      'Business hours support'
    ],
    isPopular: false,
    buttonText: 'Get Started'
  },
  {
    id: 'clinic',
    title: 'For Clinics',
    price: 20000,
    description: 'Ideal for multi-doctor clinics and group practices.',
    features: [
      'AI voice agent for multiple numbers',
      'Up to 1000 calls per month',
      'Advanced appointment scheduling',
      'Email and SMS summaries',
      'Integration with popular EMRs',
      'Priority support',
      'Custom voice options'
    ],
    isPopular: true,
    buttonText: 'Most Popular'
  },
  {
    id: 'enterprise',
    title: 'For Enterprise Hospitals',
    price: 40000,
    description: 'For large hospitals with multiple branches and departments.',
    features: [
      'Multiple AI voice agents',
      'Unlimited calls',
      'Complete EMR integration',
      'Department-specific customization',
      'Advanced analytics and reporting',
      'Voice cloning capabilities',
      '24/7 dedicated support',
      'Custom workflows'
    ],
    isPopular: false,
    buttonText: 'Contact Sales'
  }
];

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-brand-purple-light/30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that best fits your practice size and needs. All plans include our core AI voice agent technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card rounded-xl overflow-hidden ${
                plan.isPopular 
                  ? 'pricing-popular border-2 relative shadow-xl' 
                  : 'border border-gray-200 shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-brand-purple text-white py-1 px-4 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <Button 
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full mb-6 ${
                    plan.isPopular 
                      ? 'gradient-button text-white' 
                      : 'bg-white text-brand-purple border border-brand-purple hover:bg-brand-purple-light/20'
                  }`}
                >
                  {plan.buttonText} <ArrowRight size={16} className="ml-2" />
                </Button>
                
                <div className="space-y-3">
                  <p className="font-medium">Features include:</p>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-brand-purple mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
