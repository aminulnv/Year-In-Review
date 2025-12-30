import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Sparkles } from "lucide-react";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { teammates } from "@/data/teammates";
import { leaders } from "@/data/leaders";
import Seo from "@/components/Seo";
import { useToast } from "@/hooks/use-toast";

const YearInReviewReview = () => {
  const [submitting, setSubmitting] = useState(false);
  const { formData } = useFormPersistence();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate completion status
  const completedSections = [
    formData.yearInReviewWinsText.trim().length > 0 || formData.yearInReviewQuickPicks.length > 0,
    formData.yearInReviewBlockerText.trim().length > 0 || formData.yearInReviewBlockerTags.length > 0,
    formData.yearInReviewWishMoreOf.trim().length > 0,
    Object.keys(formData.yearInReviewPulseRatings).length === 7,
    formData.yearInReviewPeopleWhoHelped.length === 0 || 
      formData.yearInReviewPeopleWhoHelped.every(id => 
        (formData.yearInReviewPeopleHelpReasons[id]?.length || 0) > 0
      ),
    formData.yearInReviewSelectedLeaders.length === 0 ||
      formData.yearInReviewSelectedLeaders.every(leaderId => {
        const ratings = formData.yearInReviewLeaderRatings[leaderId] || {};
        return Object.keys(ratings).length === 10;
      })
  ].filter(Boolean).length;
  
  const totalSections = 6;
  const completionPercentage = (completedSections / totalSections) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // TODO: Implement submission to Google Sheets
      // For now, just store completion
      localStorage.setItem('year-in-review-completed', 'true');
      localStorage.setItem('year-in-review-completion-date', new Date().toISOString());
      
      toast({
        title: "Success! 🎉",
        description: "Your Year in Review has been submitted successfully!",
        duration: 3000,
      });
      
      navigate('/year-in-review/success');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = (ratings: Record<string, number>) => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="Review & Submit | Year in Review" 
        description="Review your Year in Review responses and submit" 
        canonicalPath="/year-in-review/review" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">Review & Submit</h1>
            <p className="text-lg text-muted-foreground">
              Review your responses before submitting your Year in Review
            </p>
          </div>

          {/* Completion status */}
          <div className="card-premium mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Completion Status</h3>
              <Badge variant="secondary" className="text-sm">
                {completedSections}/{totalSections} sections
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(completionPercentage)}% complete
            </p>
          </div>

          {/* Summary by section */}
          <div className="space-y-6 mb-8">
            {/* Section 1: Wins */}
            <Link to="/year-in-review/wins">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.yearInReviewWinsText.trim().length > 0 || formData.yearInReviewQuickPicks.length > 0
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">The Good Stuff</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.yearInReviewWinsText.trim() ? 
                          formData.yearInReviewWinsText.substring(0, 80) + (formData.yearInReviewWinsText.length > 80 ? '...' : '') :
                          formData.yearInReviewQuickPicks.length > 0 ? 
                            `${formData.yearInReviewQuickPicks.length} quick pick(s) selected` :
                            'Not completed yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Section 2: Blockers */}
            <Link to="/year-in-review/blockers">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.yearInReviewBlockerText.trim().length > 0 || formData.yearInReviewBlockerTags.length > 0
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Blockers & Fixes</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.yearInReviewBlockerText.trim() ? 
                          formData.yearInReviewBlockerText.substring(0, 80) + (formData.yearInReviewBlockerText.length > 80 ? '...' : '') :
                          formData.yearInReviewBlockerTags.length > 0 ?
                            `${formData.yearInReviewBlockerTags.length} tag(s) selected` :
                            'Not completed yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Section 3: Wish More Of */}
            <Link to="/year-in-review/wish-more">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.yearInReviewWishMoreOf.trim().length > 0
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">What We Need More Of</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.yearInReviewWishMoreOf.trim() ? 
                          formData.yearInReviewWishMoreOf.substring(0, 80) + (formData.yearInReviewWishMoreOf.length > 80 ? '...' : '') :
                          'Not completed yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Section 4: Pulse */}
            <Link to="/year-in-review/pulse">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      Object.keys(formData.yearInReviewPulseRatings).length === 7
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Work Experience Pulse</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.keys(formData.yearInReviewPulseRatings).length > 0 ? (
                          <>
                            {Object.keys(formData.yearInReviewPulseRatings).length}/7 metrics rated
                            {Object.keys(formData.yearInReviewPulseRatings).length === 7 && (
                              <> • Avg score: {getAverageRating(formData.yearInReviewPulseRatings)}/5</>
                            )}
                          </>
                        ) : 'Not completed yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Section 5: People */}
            <Link to="/year-in-review/people">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.yearInReviewPeopleWhoHelped.length === 0 || 
                      formData.yearInReviewPeopleWhoHelped.every(id => 
                        (formData.yearInReviewPeopleHelpReasons[id]?.length || 0) > 0
                      )
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">People Who Made a Difference</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.yearInReviewPeopleWhoHelped.length > 0 ? (
                          <>Recognized {formData.yearInReviewPeopleWhoHelped.length} teammate(s)</>
                        ) : 'Skipped'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Section 6: Leadership */}
            <Link to="/year-in-review/leadership">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.yearInReviewSelectedLeaders.length === 0 ||
                      formData.yearInReviewSelectedLeaders.every(leaderId => {
                        const ratings = formData.yearInReviewLeaderRatings[leaderId] || {};
                        return Object.keys(ratings).length === 10;
                      })
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">How Leadership Showed Up</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.yearInReviewSelectedLeaders.length > 0 ? (
                          <>Feedback for {formData.yearInReviewSelectedLeaders.length} leader(s)</>
                        ) : 'Skipped'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Submit button */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <Button 
              className="btn-hero px-12 py-4 text-lg"
              disabled={submitting || completionPercentage < 100}
              onClick={handleSubmit}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Submit Year in Review
                </div>
              )}
            </Button>
            {completionPercentage < 100 && (
              <p className="text-sm text-destructive mt-4">
                Please complete all sections before submitting ({completedSections}/{totalSections} completed)
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Link to="/year-in-review/leadership">
              <Button variant="outline" className="btn-ghost">
                ← Back to Leadership
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewReview;

