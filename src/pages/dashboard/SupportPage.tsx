
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, FileText, HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: "How do I set up my AI receptionist?",
    answer: "After signing up and completing onboarding, go to the AI Settings page to configure your AI receptionist's voice, tone, and script."
  },
  {
    question: "Can I customize how the AI handles calls?",
    answer: "Yes, you can customize the greeting, questions asked, and responses through the AI Settings page."
  },
  {
    question: "How do I view my call history?",
    answer: "All calls handled by your AI receptionist can be found in the Call History section of your dashboard."
  },
  {
    question: "How are appointments scheduled?",
    answer: "When a caller wants to book an appointment, the AI will check your availability and schedule it in your calendar. You can view and manage all appointments in the Appointments section."
  },
  {
    question: "What happens if the AI can't answer a question?",
    answer: "The AI will politely inform the caller that it will need to check with you and will send you a notification with the caller's question and contact details."
  }
];

const SupportPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Help & Support</h1>
        <p className="text-gray-300">Get assistance, browse FAQs, or contact our team</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
              <MessageSquare className="text-blue-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Live Chat</h3>
            <p className="text-gray-300 mb-4">Chat with our support team in real-time</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
              <Phone className="text-purple-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Phone Support</h3>
            <p className="text-gray-300 mb-4">Call us at (555) 123-4567</p>
            <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-900/20">
              Call Now
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
              <FileText className="text-green-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Documentation</h3>
            <p className="text-gray-300 mb-4">Browse our detailed guides and docs</p>
            <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-900/20">
              View Docs
            </Button>
          </div>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
          <HelpCircle size={24} className="text-brand-purple" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4 mb-6">
          {faqItems.map((item, index) => (
            <Card key={index} className="p-4 bg-gray-800 border-gray-700">
              <h3 className="font-medium text-lg mb-2 text-white">{item.question}</h3>
              <p className="text-gray-300">{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
