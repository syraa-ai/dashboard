
import React from 'react';
import { 
  Mic, 
  Settings, 
  AlertCircle, 
  VolumeX, 
  Globe, 
  MessageSquare,
  Database,
  Sparkles,
  Speaker,
  Volume2
} from 'lucide-react';

const features = [
  {
    icon: <Settings className="h-6 w-6 text-brand-purple" />,
    title: "Function Calling",
    description: "Seamlessly trigger backend operations through voice commands, automating routine tasks."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-brand-purple" />,
    title: "Fine-tunable",
    description: "Customize the AI's behavior to suit the specific needs and protocols of your practice."
  },
  {
    icon: <AlertCircle className="h-6 w-6 text-brand-purple" />,
    title: "Handles Interruptions",
    description: "Manages interruptions gracefully with natural conversational flows for realistic interactions."
  },
  {
    icon: <Mic className="h-6 w-6 text-brand-purple" />,
    title: "Custom Voices",
    description: "Deploy custom voice profiles aligned with your brand's personality and tone."
  },
  {
    icon: <Volume2 className="h-6 w-6 text-brand-purple" />,
    title: "Voice Cloning",
    description: "Ability to replicate existing voices for authenticity and consistent patient experience."
  },
  {
    icon: <Database className="h-6 w-6 text-brand-purple" />,
    title: "RAG Support",
    description: "Integrates retrieval-augmented generation for better contextual and knowledge-based responses."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-brand-purple" />,
    title: "Text Prompt Compatible",
    description: "Works with existing text-based prompts, allowing seamless integration with current systems."
  },
  {
    icon: <Globe className="h-6 w-6 text-brand-purple" />,
    title: "Multi-lingual",
    description: "Supports multiple languages to cater to diverse patient populations."
  },
  {
    icon: <Speaker className="h-6 w-6 text-brand-purple" />,
    title: "High-quality Speech",
    description: "Ensures clear, natural, and engaging audio quality for optimal patient experience."
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced <span className="gradient-text">AI Features</span> for Healthcare
          </h2>
          <p className="text-lg text-gray-600">
            Our AI front desk agent comes equipped with powerful capabilities designed specifically for medical practices and clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-full bg-brand-purple-light flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
