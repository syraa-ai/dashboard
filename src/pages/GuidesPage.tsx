// src/pages/GuidesPage.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder data for guides - replace with actual healthcare content
const guides = [
  {
    title: "Best Practices for Patient Lead Qualification",
    description: "Implement proven strategies to qualify patient leads more effectively and increase your clinic's appointment conversion rate.",
    category: "Patient Acquisition",
    readTime: "6 min read",
    date: "July 27, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
  {
    title: "AI Intake Specialists — The New Secret Weapon of High-Growth Clinics",
    description: "See how cutting-edge clinics are using AI Intake Specialists to reduce administrative overhead, and create an unfair competitive advantage in patient acquisition.",
    category: "AI in Healthcare",
    readTime: "12 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
  {
    title: "AI Receptionist vs Human Receptionist – The Brutal Truth About Patient Needs",
    description: "Discover why AI receptionists are crushing traditional methods for high-volume clinics - and why it's not even close anymore.",
    category: "Practice Management",
    readTime: "12 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "Why Inbound & Outbound Calls are Your Clinic's Secret Growth Weapon (If Used Correctly)",
    description: "Discover how top-performing clinics are using inbound/outbound calls to supercharge patient acquisition and case values in today's competitive landscape.",
    category: "Business Development",
    readTime: "14 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
  {
    title: "Streamline Clinic Intake Costs by 70% (Without Sacrificing Quality)",
    description: "Discover the unconventional strategies top-performing clinics are using to dramatically reduce client acquisition costs while improving conversion rates.",
    category: "Business Operations",
    readTime: "10 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "Scale Your Clinic With AI — The Unfair Advantage Most Practices Miss",
    description: "How forward-thinking clinics are using AI to scale patient acquisition, case values, and outcompete larger rivals in today's healthcare marketplace.",
    category: "Legal Technology",
    readTime: "14 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
  // Add more guides based on the screenshot...
   {
    title: "7 Benefits of Using Virtual Receptionists for Healthcare Firms",
    description: "Discover how 24/7 virtual receptionists can transform your patient intake process and improve conversion rates.",
    category: "Law Firms",
    readTime: "9 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "Virtual Receptionists for Healthcare Providers: The Complete 2025 Implementation Guide",
    description: "Discover how top-performing clinics are using virtual receptionists to increase patient acquisition, case values, and gain a competitive edge in today's healthcare market.",
    category: "Practice Management",
    readTime: "14 min read",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "ChatGPT For Healthcare Providers: The Complete 2025 Implementation Guide (Not Just Another AI Hype Piece)",
    description: "Discover the practical applications of using ChatGPT and other AI tools to create automated workflows that improve patient acquisition, case management, and profitability.",
    category: "Legal Technology",
    readTime: "14 min read",
    date: "December 15, 2023",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "Convert More Leads With Virtual Receptionists — The Ultimate Client Acquisition Guide",
    description: "Learn how clinics are using specialized virtual receptionists to dramatically increase lead conversion rates and grow their practice without increasing marketing spend.",
    category: "Law Firms",
    readTime: "14 min read",
    date: "December 1, 2023",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
   {
    title: "Automated Client Follow-Up — The Untapped Gold Mine for Clinic Growth",
    description: "How top-performing clinics are using automated follow-up sequences to convert more leads, reactivate dormant clients, and significantly increase revenue with minimal effort.",
    category: "Law Firms",
    readTime: "14 min read",
    date: "November 17, 2023",
    imageUrl: "/placeholder.svg", // Replace with actual image path
  },
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Guides & Resources</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Explore our collection of guides, best practices, and insights to help optimize your
        patient intake process and grow your practice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, index) => (
          <Card key={index} className="flex flex-col">
            <img src={guide.imageUrl} alt={guide.title} className="w-full h-48 object-cover" />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary">{guide.category}</Badge>
                <span className="text-sm text-muted-foreground">{guide.readTime}</span>
              </div>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{guide.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">{guide.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

        {/* CTA Section - Replicated from screenshot */}
        <section className="bg-primary text-primary-foreground mt-20 py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your patient intake process?</h2>
                <p className="text-lg mb-8">
                    Our AI-powered receptionists and intake specialists work 24/7 to ensure you never miss a potential patient.
                </p>
                <a
                    href="https://forms.gle/1gzPVCFaK9wioX9Z8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-11 rounded-md px-8"
                >
                    Talk to Sales →
                </a>
            </div>
        </section>
    </div>
  );
}
