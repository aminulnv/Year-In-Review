import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Seo from "@/components/Seo";

const YearInReviewSuccess = () => {
  return (
    <div className="min-h-screen">
      <Seo 
        title="Success | Year in Review" 
        description="Year in Review submitted successfully" 
        canonicalPath="/year-in-review/success" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-premium animate-slide-up">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
                <p className="text-lg text-muted-foreground mb-2">
                  Your Year in Review has been submitted successfully.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your responses are anonymous and will be aggregated before review.
                </p>
              </div>
              <Link to="/">
                <Button className="btn-hero">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewSuccess;

