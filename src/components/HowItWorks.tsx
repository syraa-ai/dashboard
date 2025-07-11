
import React from 'react';
import { PhoneCall, Headphones, MessageSquareText, ClipboardCheck } from 'lucide-react';

const steps = [
  {
    icon: <PhoneCall className="h-6 w-6 text-white" />,
    title: "Patient Calls Your Practice",
    description: "When a patient calls your office phone number, our AI agent automatically answers the call.",
    bgColor: "bg-brand-purple"
  },
  {
    icon: <Headphones className="h-6 w-6 text-white" />,
    title: "AI Agent Engages",
    description: "Syraa AI greets the caller, identifies itself, and begins a natural conversation to understand their needs.",
    bgColor: "bg-brand-blue"
  },
  {
    icon: <MessageSquareText className="h-6 w-6 text-white" />,
    title: "Information Collection",
    description: "The AI collects relevant details such as reason for call, contact information, and appointment preferences.",
    bgColor: "bg-indigo-500"
  },
  {
    icon: <ClipboardCheck className="h-6 w-6 text-white" />,
    title: "Summary Delivered",
    description: "A detailed call summary is instantly sent to your staff via email, allowing for appropriate follow-up.",
    bgColor: "bg-purple-600"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">Syraa AI</span> Works
          </h2>
          <p className="text-lg text-gray-600">
            From answering calls to delivering detailed summaries, our AI front desk agent
            streamlines your patient communication workflow.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mb-6 shadow-lg`}>
                {step.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block w-24 h-0.5 bg-gray-200 absolute left-[calc(50%+4rem)] top-8"></div>
              )}
            </div>
          ))}
        </div>

        <div className="relative mt-20 mx-auto max-w-4xl">
          <div className="glass-card rounded-xl overflow-hidden shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">See Syraa AI in Action</h3>
                <p className="text-gray-600 mb-6">
                  Experience firsthand how our AI front desk agent handles real patient calls
                  and provides comprehensive summaries for your staff.
                </p>
                <button className="gradient-button text-white px-6 py-3 rounded-lg">
                  Watch Demo
                </button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Demo Video</p>
                  <div className="h-16 w-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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

export default HowItWorks;
