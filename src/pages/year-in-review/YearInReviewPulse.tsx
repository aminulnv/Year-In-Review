import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Zap, Shield, Lightbulb, Heart, Users, Building } from "lucide-react";
import RatingPills from "@/components/survey/RatingPills";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import Seo from "@/components/Seo";

const YearInReviewPulse = () => {
  const { formData, updateFormData } = useFormPersistence();
  const { yearInReviewPulseRatings } = formData;

  type Question = {
    id: string;
    text: string;
    definition: string;
    icon: any;
    levelDescriptions: string[];
    leftLabel: string;
    rightLabel: string;
  };

  const questions: Question[] = [
    {
      id: "focus",
      text: "Focused on What Matters",
      definition: "Over the year, how often were we focused on the work that truly mattered?",
      icon: Lightbulb,
      leftLabel: "Pulled in too many directions",
      rightLabel: "Strongly focused on the right priorities",
      levelDescriptions: [
        "Pulled in too many directions",
        "Often distracted from priorities",
        "Sometimes focused, sometimes not",
        "Mostly focused on priorities",
        "Strongly focused on the right priorities"
      ]
    },
    {
      id: "clarity",
      text: "Clarity and Guidance",
      definition: "Did you usually have the clarity and guidance needed to move work forward?",
      icon: Shield,
      leftLabel: "Often unclear or guessing",
      rightLabel: "Clear and well supported",
      levelDescriptions: [
        "Often unclear or guessing",
        "Sometimes had guidance",
        "Adequate clarity most times",
        "Usually clear on direction",
        "Clear and well supported"
      ]
    },
    {
      id: "safety",
      text: "Psychological Safety",
      definition: "Did you feel respected and valued by the team overall?",
      icon: Users,
      leftLabel: "Rarely",
      rightLabel: "Consistently",
      levelDescriptions: [
        "Rarely",
        "Sometimes felt valued",
        "Neutral experience",
        "Usually felt respected",
        "Consistently"
      ]
    },
    {
      id: "sustainability",
      text: "Pace and Sustainability",
      definition: "Looking back, how sustainable did your pace of work feel this year?",
      icon: Clock,
      leftLabel: "Not sustainable",
      rightLabel: "Very sustainable",
      levelDescriptions: [
        "Not sustainable",
        "Mostly unsustainable",
        "Mixed sustainability",
        "Mostly sustainable",
        "Very sustainable"
      ]
    },
    {
      id: "energy",
      text: "Energy and Enjoyment",
      definition: "Did your work mostly drain you or give you energy this year?",
      icon: Heart,
      leftLabel: "Mostly draining",
      rightLabel: "Mostly energizing",
      levelDescriptions: [
        "Mostly draining",
        "Often draining",
        "Balanced",
        "Often energizing",
        "Mostly energizing"
      ]
    },
    {
      id: "growth",
      text: "Growth",
      definition: "Did you grow at the pace you expected this year?",
      icon: Zap,
      leftLabel: "Much slower than expected",
      rightLabel: "Faster than expected",
      levelDescriptions: [
        "Much slower than expected",
        "Slower than expected",
        "About as expected",
        "Faster than expected",
        "Much faster than expected"
      ]
    },
    {
      id: "transparency",
      text: "Decision Transparency",
      definition: "When decisions affected your work, was the reasoning usually clear?",
      icon: Building,
      leftLabel: "Often confusing",
      rightLabel: "Clear and transparent",
      levelDescriptions: [
        "Often confusing",
        "Sometimes unclear",
        "Neutral",
        "Usually clear",
        "Clear and transparent"
      ]
    }
  ];

  const handleRatingChange = (questionId: string, value: number) => {
    updateFormData({
      yearInReviewPulseRatings: {
        ...yearInReviewPulseRatings,
        [questionId]: value
      }
    });
  };

  const isFormValid = () => {
    return questions.every(question => 
      yearInReviewPulseRatings[question.id] !== undefined && 
      yearInReviewPulseRatings[question.id] >= 1 && 
      yearInReviewPulseRatings[question.id] <= 5
    );
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="Work Experience Pulse | Year in Review" 
        description="Rate your work experience this year" 
        canonicalPath="/year-in-review/pulse" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">The Work Experience Pulse</h1>
            <p className="text-lg text-muted-foreground">
              Looking Back — All questions use a 1–5 scale. There are no right answers. Just your experience.
            </p>
          </div>

          {/* Ratings */}
          <div className="space-y-6 mb-8">
            {questions.map((question, index) => {
              const IconComponent = question.icon;
              const rating = yearInReviewPulseRatings[question.id];
              return (
                <Card key={question.id} className="card-premium animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{question.text}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{question.definition}</p>
                      <RatingPills 
                        value={rating} 
                        onChange={val => handleRatingChange(question.id, val)} 
                        count={5} 
                        levelDescriptions={question.levelDescriptions} 
                        leftLabel={question.leftLabel} 
                        rightLabel={question.rightLabel} 
                        leftTone="destructive" 
                        rightTone="positive" 
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <Link to="/year-in-review/wish-more">
              <Button variant="outline" className="btn-ghost">
                ← Back
              </Button>
            </Link>
            {isFormValid() ? (
              <Link to="/year-in-review/people">
                <Button className="btn-hero">
                  Continue → People Who Made a Difference
                </Button>
              </Link>
            ) : (
              <Button className="btn-hero" disabled>
                Continue → People Who Made a Difference
                <span className="ml-2 text-xs">(Complete all ratings)</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewPulse;

