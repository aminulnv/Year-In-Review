import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, GraduationCap, Wrench, Gavel, Eraser, Stars } from "lucide-react";
import Seo from "@/components/Seo";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useMemo } from "react";

const YearInReviewWins = () => {
  const { formData, updateFormData } = useFormPersistence();
  
  const {
    yearInReviewWinsText,
    yearInReviewQuickPicks
  } = formData;

  const validationRules = useMemo(() => ({
    yearInReviewWinsText: {
      required: false // Optional based on PRD
    }
  }), []);

  const { errors, isValid } = useFormValidation(formData, validationRules);

  const quickPicks = [
    { id: "learning", text: "Learned something new", icon: Lightbulb },
    { id: "helped", text: "Helped someone else level up", icon: GraduationCap },
    { id: "simplified", text: "Simplified or improved how we work", icon: Wrench },
    { id: "decision", text: "Made or backed a tough call", icon: Gavel },
    { id: "impact", text: "Delivered real impact", icon: Stars },
    { id: "other", text: "Something else entirely", icon: Eraser }
  ];

  const handleQuickPick = (pick: { id: string; text: string }) => {
    const newQuickPicks = yearInReviewQuickPicks.includes(pick.id)
      ? yearInReviewQuickPicks.filter(id => id !== pick.id)
      : [...yearInReviewQuickPicks, pick.id];
    
    updateFormData({ yearInReviewQuickPicks: newQuickPicks });
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="The Good Stuff | Year in Review" 
        description="What's a win from this year that actually mattered to you?" 
        canonicalPath="/year-in-review/wins" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">The Good Stuff</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              What's a win from this year that actually mattered to you?
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid lg:grid-cols-[1fr,400px] gap-6">
              {/* Left: Free text input */}
              <div className="card-premium animate-slide-up">
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Stars className="w-5 h-5 text-primary" />
                  Share your win
                </h3>
                <Textarea 
                  value={yearInReviewWinsText} 
                  onChange={e => updateFormData({ yearInReviewWinsText: e.target.value })} 
                  placeholder="Share your breakthrough moments, great collaborations, problems solved, or any wins that made this year special..." 
                  className={`min-h-[300px] resize-none text-base ${errors.yearInReviewWinsText ? 'border-destructive focus:border-destructive' : 'focus:border-primary'} transition-colors`} 
                />
                {errors.yearInReviewWinsText && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.yearInReviewWinsText}
                  </p>
                )}
              </div>

              {/* Right: Quick picks */}
              <div className="card-premium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Quick picks
                </h3>
                <div className="space-y-3">
                  {quickPicks.map(pick => {
                    const IconComponent = pick.icon;
                    const isSelected = yearInReviewQuickPicks.includes(pick.id);
                    return (
                      <Button 
                        key={pick.id} 
                        variant="outline" 
                        className={`w-full justify-start h-auto p-4 text-left transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-md' 
                            : 'hover:bg-primary/5 border-border hover:border-primary/50 hover:shadow-md'
                        }`} 
                        onClick={() => handleQuickPick(pick)}
                      >
                        <IconComponent className={`w-4 h-4 mr-3 flex-shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                        <span className="text-sm font-medium">{pick.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-border/50 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/year-in-review">
              <Button variant="outline" className="btn-ghost">
                ← Back to Start
              </Button>
            </Link>
            
            <Link to="/year-in-review/blockers">
              <Button className="btn-hero">
                Continue → Blockers & Fixes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewWins;

