import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import Seo from "@/components/Seo";

const YearInReview = () => {
  return (
    <div className="min-h-screen">
      <Seo 
        title="Year in Review | QPT Culture Pulse" 
        description="Annual work experience and leadership reflection form" 
        canonicalPath="/year-in-review" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Year in Review</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              An annual reflection tool designed to help you pause, zoom out, and capture how the year felt while work was happening.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated completion time: 8 to 12 minutes</span>
            </div>
          </div>

          {/* Description */}
          <div className="card-premium mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-base text-muted-foreground leading-relaxed">
              This form collects both qualitative and quantitative feedback across individual wins and learning, blockers and friction points, work experience pulse metrics, recognition of teammates who made a difference, and leadership feedback. Your responses are anonymous and will be aggregated before review.
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/year-in-review/wins">
              <Button className="btn-hero px-12 py-6 text-lg">
                Let's Look Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReview;

