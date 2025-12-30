import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Users } from "lucide-react";
import SpriteCarousel from "@/components/SpriteCarousel";
import { leaders } from "@/data/leaders";
import { Teammate } from "@/data/teammates";
import RatingPills from "@/components/survey/RatingPills";
import Seo from "@/components/Seo";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useState } from "react";

const YearInReviewLeadership = () => {
  const { formData, updateFormData } = useFormPersistence();
  const [expandedLeader, setExpandedLeader] = useState<string | null>(null);
  
  const {
    yearInReviewSelectedLeaders,
    yearInReviewLeaderRatings,
    yearInReviewLeaderFeedback,
    yearInReviewLeaderStopKeepStart,
    yearInReviewLeaderNextYear
  } = formData;

  const leadershipQuestions = [
    { id: "clarity", text: "Clarity of Expectations" },
    { id: "decision", text: "Decision Making and Follow Through" },
    { id: "fairness", text: "Fairness in Evaluation" },
    { id: "bias", text: "Bias Awareness" },
    { id: "feedback", text: "Quality of Feedback" },
    { id: "coaching", text: "Coaching and Growth Support" },
    { id: "availability", text: "Availability and Responsiveness" },
    { id: "safety", text: "Psychological Safety" },
    { id: "consistency", text: "Consistency and Reliability" },
    { id: "example", text: "Leading by Example" }
  ];

  const levelDescriptions = [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree"
  ];

  const addLeader = (leaderId: string) => {
    if (!yearInReviewSelectedLeaders.includes(leaderId)) {
      updateFormData({
        yearInReviewSelectedLeaders: [...yearInReviewSelectedLeaders, leaderId]
      });
      setExpandedLeader(leaderId);
    }
  };

  const removeLeader = (leaderId: string) => {
    const newLeaders = yearInReviewSelectedLeaders.filter(id => id !== leaderId);
    const newRatings = { ...yearInReviewLeaderRatings };
    const newFeedback = { ...yearInReviewLeaderFeedback };
    const newStopKeepStart = { ...yearInReviewLeaderStopKeepStart };
    const newNextYear = { ...yearInReviewLeaderNextYear };
    
    delete newRatings[leaderId];
    delete newFeedback[leaderId];
    delete newStopKeepStart[leaderId];
    delete newNextYear[leaderId];
    
    updateFormData({
      yearInReviewSelectedLeaders: newLeaders,
      yearInReviewLeaderRatings: newRatings,
      yearInReviewLeaderFeedback: newFeedback,
      yearInReviewLeaderStopKeepStart: newStopKeepStart,
      yearInReviewLeaderNextYear: newNextYear
    });
    
    if (expandedLeader === leaderId) {
      setExpandedLeader(null);
    }
  };

  const updateLeaderRating = (leaderId: string, questionId: string, rating: number) => {
    updateFormData({
      yearInReviewLeaderRatings: {
        ...yearInReviewLeaderRatings,
        [leaderId]: {
          ...(yearInReviewLeaderRatings[leaderId] || {}),
          [questionId]: rating
        }
      }
    });
  };

  const updateLeaderFeedback = (leaderId: string, feedback: string) => {
    updateFormData({
      yearInReviewLeaderFeedback: {
        ...yearInReviewLeaderFeedback,
        [leaderId]: feedback
      }
    });
  };

  const updateStopKeepStart = (leaderId: string, field: 'stop' | 'keep' | 'start', value: string) => {
    updateFormData({
      yearInReviewLeaderStopKeepStart: {
        ...yearInReviewLeaderStopKeepStart,
        [leaderId]: {
          ...(yearInReviewLeaderStopKeepStart[leaderId] || { stop: '', keep: '', start: '' }),
          [field]: value
        }
      }
    });
  };

  const updateNextYear = (leaderId: string, value: string) => {
    updateFormData({
      yearInReviewLeaderNextYear: {
        ...yearInReviewLeaderNextYear,
        [leaderId]: value
      }
    });
  };

  const getLeaderCompletion = (leaderId: string) => {
    const ratings = yearInReviewLeaderRatings[leaderId] || {};
    return Object.keys(ratings).length;
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="How Leadership Showed Up | Year in Review" 
        description="Feedback on how leads and senior members showed up this year" 
        canonicalPath="/year-in-review/leadership" 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              How Leadership Showed Up
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Leadership shapes how work feels day to day. This section reflects on how leads and senior members showed up. Your feedback is anonymous.
            </p>
            <p className="text-sm text-muted-foreground">
              You can provide feedback for multiple leaders. Select a leader below to begin.
            </p>
          </div>

          {/* Leader Selection */}
          <div className="card-premium mb-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4">Select Leader(s) to Provide Feedback</h3>
            <div className="mb-4">
              <SpriteCarousel
                teammates={leaders.map(l => ({ id: l.id, name: l.name, sprite: l.sprite })) as Teammate[]}
                multiple
                selectedIds={yearInReviewSelectedLeaders}
                onChange={(ids) => {
                  // Add new leaders
                  ids.forEach(id => {
                    if (!yearInReviewSelectedLeaders.includes(id)) {
                      addLeader(id);
                    }
                  });
                  // Remove deselected leaders
                  yearInReviewSelectedLeaders.forEach(id => {
                    if (!ids.includes(id)) {
                      removeLeader(id);
                    }
                  });
                }}
              />
            </div>
            {yearInReviewSelectedLeaders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Select one or more leaders from above to provide feedback
              </p>
            )}
          </div>

          {/* Leader Feedback Sections */}
          {yearInReviewSelectedLeaders.length > 0 && (
            <div className="space-y-6 mb-8">
              {yearInReviewSelectedLeaders.map((leaderId) => {
                const leader = leaders.find(l => l.id === leaderId);
                if (!leader) return null;
                
                const ratings = yearInReviewLeaderRatings[leaderId] || {};
                const feedback = yearInReviewLeaderFeedback[leaderId] || '';
                const stopKeepStart = yearInReviewLeaderStopKeepStart[leaderId] || { stop: '', keep: '', start: '' };
                const nextYear = yearInReviewLeaderNextYear[leaderId] || '';
                const isExpanded = expandedLeader === leaderId || expandedLeader === null;
                const completion = getLeaderCompletion(leaderId);

                return (
                  <Card key={leaderId} className="card-premium">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={leader.sprite} alt={leader.name} />
                          <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{leader.name}</h3>
                          {leader.role && <p className="text-sm text-muted-foreground">{leader.role}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {completion}/10 questions
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLeader(leaderId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-6">
                        {/* Rating Questions */}
                        <div>
                          <h4 className="font-semibold mb-4">Rate on a scale of 1-5 (1 = Strongly disagree, 5 = Strongly agree)</h4>
                          <div className="space-y-4">
                            {leadershipQuestions.map((question) => {
                              const rating = ratings[question.id];
                              return (
                                <div key={question.id} className="border-b border-border/50 pb-4 last:border-0">
                                  <p className="font-medium mb-2">{question.text}</p>
                                  <RatingPills
                                    value={rating}
                                    onChange={(val) => updateLeaderRating(leaderId, question.id, val)}
                                    count={5}
                                    levelDescriptions={levelDescriptions}
                                    leftLabel="Strongly disagree"
                                    rightLabel="Strongly agree"
                                    leftTone="destructive"
                                    rightTone="positive"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Optional Feedback Text */}
                        <div>
                          <h4 className="font-semibold mb-2">Anything that would help this feedback be better understood? (optional)</h4>
                          <Textarea
                            value={feedback}
                            onChange={(e) => updateLeaderFeedback(leaderId, e.target.value)}
                            placeholder="Additional context or examples..."
                            className="min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Stop Keep Start (optional) */}
                        <div>
                          <h4 className="font-semibold mb-2">Stop / Keep Doing / Start (optional)</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Stop</label>
                              <Textarea
                                value={stopKeepStart.stop}
                                onChange={(e) => updateStopKeepStart(leaderId, 'stop', e.target.value)}
                                placeholder="What should stop..."
                                className="min-h-[80px] resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Keep Doing</label>
                              <Textarea
                                value={stopKeepStart.keep}
                                onChange={(e) => updateStopKeepStart(leaderId, 'keep', e.target.value)}
                                placeholder="What should continue..."
                                className="min-h-[80px] resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Start</label>
                              <Textarea
                                value={stopKeepStart.start}
                                onChange={(e) => updateStopKeepStart(leaderId, 'start', e.target.value)}
                                placeholder="What should begin..."
                                className="min-h-[80px] resize-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Next Year Focus (optional) */}
                        <div>
                          <h4 className="font-semibold mb-2">Next year focus (optional)</h4>
                          <Textarea
                            value={nextYear}
                            onChange={(e) => updateNextYear(leaderId, e.target.value)}
                            placeholder="What should be the focus next year..."
                            className="min-h-[80px] resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add More Leaders Button */}
          {yearInReviewSelectedLeaders.length > 0 && (
            <div className="text-center mb-8">
              <Button
                variant="outline"
                onClick={() => setExpandedLeader(null)}
                className="mb-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Leader
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link to="/year-in-review/people">
              <Button variant="outline" className="btn-ghost">
                ← Back to People
              </Button>
            </Link>
            <Link to="/year-in-review/review">
              <Button className="btn-hero">
                Continue → Review & Submit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearInReviewLeadership;

