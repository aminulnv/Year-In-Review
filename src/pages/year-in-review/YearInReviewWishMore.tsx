import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";
import Seo from "@/components/Seo";
import { useFormPersistence } from "@/hooks/useFormPersistence";

const YearInReviewWishMore = () => {
  const { formData, updateFormData } = useFormPersistence();
  
  const { yearInReviewWishMoreOf } = formData;

  return (
    <div className="min-h-screen">
      <Seo 
        title="What We Need More Of | Year in Review" 
        description="What do you wish we had more of?" 
        canonicalPath="/year-in-review/wish-more" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">What We Need More Of</h1>
            <p className="text-lg text-muted-foreground">
              What do you wish we had more of?
            </p>
          </div>

          <div className="card-premium mb-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Share your thoughts
            </h3>
            <Textarea 
              value={yearInReviewWishMoreOf} 
              onChange={e => updateFormData({ yearInReviewWishMoreOf: e.target.value })} 
              placeholder="Resources, support, clarity, tools, time, processes..." 
              className="resize-none min-h-[300px]"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Link to="/year-in-review/blockers">
              <Button variant="outline" className="btn-ghost">
                ← Back to Blockers
              </Button>
            </Link>
            <Link to="/year-in-review/pulse">
              <Button className="btn-hero">
                Continue → Work Experience Pulse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewWishMore;

