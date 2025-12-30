import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import { useFormPersistence } from "@/hooks/useFormPersistence";

const YearInReviewBlockers = () => {
  const { formData, updateFormData } = useFormPersistence();
  
  const {
    yearInReviewBlockerText,
    yearInReviewBlockerTags
  } = formData;

  const blockerTags = [
    { id: "process", text: "Process", color: "bg-blue-500" },
    { id: "tools", text: "Tools or access", color: "bg-green-500" },
    { id: "dependencies", text: "Dependencies on others", color: "bg-yellow-500" },
    { id: "decisions", text: "Slow or unclear decisions", color: "bg-orange-500" },
    { id: "scope", text: "Scope changing mid-stream", color: "bg-red-500" },
    { id: "other", text: "Other", color: "bg-purple-500" }
  ];

  const toggleTag = (tagId: string) => {
    const newTags = yearInReviewBlockerTags.includes(tagId)
      ? yearInReviewBlockerTags.filter(id => id !== tagId)
      : [...yearInReviewBlockerTags, tagId];
    updateFormData({ yearInReviewBlockerTags: newTags });
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="Blockers & Fixes | Year in Review" 
        description="What slowed you down this year?" 
        canonicalPath="/year-in-review/blockers" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">Blockers & Fixes</h1>
            <p className="text-lg text-muted-foreground">
              What slowed you down?
            </p>
          </div>

          {/* What slowed you down */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card-premium animate-slide-up">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                What slowed you down?
              </h3>
              <Textarea 
                value={yearInReviewBlockerText} 
                onChange={e => updateFormData({ yearInReviewBlockerText: e.target.value })} 
                placeholder="Describe the specific friction, blocker, or inefficiency you encountered this year..." 
                className="min-h-[300px] resize-none"
              />
            </div>

            <div className="card-premium animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h4 className="font-semibold mb-3">Quick tags</h4>
              <div className="space-y-2">
                {blockerTags.map(tag => (
                  <Button 
                    key={tag.id} 
                    variant={yearInReviewBlockerTags.includes(tag.id) ? "default" : "outline"} 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => toggleTag(tag.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${tag.color} mr-2`}></div>
                    {tag.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/year-in-review/wins">
              <Button variant="outline" className="btn-ghost">
                ← Back to Wins
              </Button>
            </Link>
            <Link to="/year-in-review/wish-more">
              <Button className="btn-hero">
                Continue → What We Need More Of
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewBlockers;

