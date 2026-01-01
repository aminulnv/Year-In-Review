import React, { useState } from "react";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, X, ChevronDown, ChevronUp } from "lucide-react";
import RatingPills from "@/components/survey/RatingPills";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import NavigationBar from "@/components/NavigationBar";
import { leaders } from "@/data/leaders";
import { Teammate } from "@/data/teammates";
import SpriteCarousel from "@/components/SpriteCarousel";

const Feedback: React.FC = () => {
  const { formData, updateFormData } = useFormPersistence();
  const [expandedLeaders, setExpandedLeaders] = useState<Set<string>>(new Set());

  const {
    feedbackSelectedLeaders,
    feedbackLeaderRatings,
    feedbackLeaderFeedback,
    feedbackLeaderStopKeepStart
  } = formData;

  const leadershipQuestions = [
    {
      id: "clarity",
      text: "Clarity of Expectations",
      definition: "I understood what was expected of me and why.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "decision",
      text: "Decision-Making & Follow-Through",
      definition: "Decisions were made correctly, fairly, and followed through.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "fairness",
      text: "Fairness in Evaluation",
      definition: "Performance and outcomes were evaluated fairly.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "bias",
      text: "Bias Awareness",
      definition: "I did not experience favoritism or bias in decisions or evaluations.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "feedback",
      text: "Quality of Feedback",
      definition: "Feedback helped me improve or think better about my work.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "coaching",
      text: "Coaching & Growth Support",
      definition: "They invested in my growth, not just my output.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "availability",
      text: "Availability & Responsiveness",
      definition: "They were accessible when alignment or decisions were needed.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "safety",
      text: "Psychological Safety",
      definition: "I felt safe to ask questions, disagree, or raise concerns.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "consistency",
      text: "Consistency & Reliability",
      definition: "Their actions were consistent and predictable over time.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    },
    {
      id: "example",
      text: "Leading by Example",
      definition: "Their way of working set a strong example for the team.",
      leftLabel: "Strongly disagree",
      rightLabel: "Strongly agree"
    }
  ];

  // Generate level descriptions for 1-10 scale
  const generateLevelDescriptions = () => {
    return [
      "Strongly disagree",
      "Disagree",
      "Somewhat disagree",
      "Slightly disagree",
      "Neutral",
      "Slightly agree",
      "Somewhat agree",
      "Agree",
      "Strongly agree",
      "Completely agree"
    ];
  };

  const levelDescriptions = generateLevelDescriptions();

  const addLeader = (leaderId: string) => {
    if (!feedbackSelectedLeaders.includes(leaderId)) {
      updateFormData({
        feedbackSelectedLeaders: [...feedbackSelectedLeaders, leaderId]
      });
      // Auto-expand newly added leader
      setExpandedLeaders(prev => new Set([...prev, leaderId]));
    }
  };

  const removeLeader = (leaderId: string) => {
    const newLeaders = feedbackSelectedLeaders.filter(id => id !== leaderId);
    const newRatings = { ...feedbackLeaderRatings };
    const newFeedback = { ...feedbackLeaderFeedback };
    const newStopKeepStart = { ...feedbackLeaderStopKeepStart };
    
    delete newRatings[leaderId];
    delete newFeedback[leaderId];
    delete newStopKeepStart[leaderId];
    
    updateFormData({
      feedbackSelectedLeaders: newLeaders,
      feedbackLeaderRatings: newRatings,
      feedbackLeaderFeedback: newFeedback,
      feedbackLeaderStopKeepStart: newStopKeepStart
    });
    
    // Remove from expanded set
    setExpandedLeaders(prev => {
      const next = new Set(prev);
      next.delete(leaderId);
      return next;
    });
  };

  const toggleLeaderExpansion = (leaderId: string) => {
    setExpandedLeaders(prev => {
      const next = new Set(prev);
      if (next.has(leaderId)) {
        next.delete(leaderId);
      } else {
        next.add(leaderId);
      }
      return next;
    });
  };

  const updateLeaderRating = (leaderId: string, questionId: string, rating: number) => {
    updateFormData({
      feedbackLeaderRatings: {
        ...feedbackLeaderRatings,
        [leaderId]: {
          ...(feedbackLeaderRatings[leaderId] || {}),
          [questionId]: rating
        }
      }
    });
  };

  const updateLeaderFeedback = (leaderId: string, feedback: string) => {
    updateFormData({
      feedbackLeaderFeedback: {
        ...feedbackLeaderFeedback,
        [leaderId]: feedback
      }
    });
  };

  const updateStopKeepStart = (leaderId: string, field: 'stop' | 'keep' | 'start', value: string) => {
    updateFormData({
      feedbackLeaderStopKeepStart: {
        ...feedbackLeaderStopKeepStart,
        [leaderId]: {
          ...(feedbackLeaderStopKeepStart[leaderId] || { stop: '', keep: '', start: '' }),
          [field]: value
        }
      }
    });
  };

  const getLeaderCompletion = (leaderId: string) => {
    const ratings = feedbackLeaderRatings[leaderId] || {};
    return Object.keys(ratings).length;
  };

  const isFormValid = () => {
    if (feedbackSelectedLeaders.length === 0) return false;
    return feedbackSelectedLeaders.every(leaderId => {
      const ratings = feedbackLeaderRatings[leaderId] || {};
      return Object.keys(ratings).length === leadershipQuestions.length;
    });
  };

  return (
    <div className="min-h-screen">
      <Seo 
        title="How Leadership Showed Up — Yearly Feedback" 
        description="Leadership shapes how work feels day to day, often in small, repeatable ways. Reflect on how the leads and senior members you worked with showed up over the year." 
        canonicalPath="/feedback" 
      />
      
      <NavigationBar currentStep="feedback" />
      
      {/* Version badge */}
      <div className="absolute top-20 right-6 z-10 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <main className="container mx-auto px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            How Leadership Showed Up
          </h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
            Leadership shapes how work feels day to day, often in small, repeatable ways.
            <br />
            This section is about reflecting on how the leads and senior members you worked with showed up over the year. What made things clearer. What felt fair. What helped you do your best work.
          </p>
        </header>

                  {/* Anonymity Banner */}
        <div className="mb-8 p-4 rounded-lg bg-positive/10 border border-positive/20 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-positive">
                      <Shield className="w-5 h-5" />
            <span className="font-semibold">🔒 Your feedback is anonymous.</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
            Individual responses are never shared. Scores and themes are combined before being reviewed.
                    </p>
                  </div>

        <div className="max-w-4xl mx-auto">
          {/* Leader Selection */}
          <div className="card-premium mb-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4">Select HOD and Lead(s) to Provide Feedback</h3>
            <div className="mb-4">
              <SpriteCarousel
                teammates={leaders.map(l => ({ id: l.id, name: l.name, sprite: l.sprite })) as Teammate[]}
                multiple
                selectedIds={feedbackSelectedLeaders}
                onChange={(ids) => {
                  // Add new leaders
                  ids.forEach(id => {
                    if (!feedbackSelectedLeaders.includes(id)) {
                      addLeader(id);
                    }
                  });
                  // Remove deselected leaders
                  feedbackSelectedLeaders.forEach(id => {
                    if (!ids.includes(id)) {
                      removeLeader(id);
                    }
                  });
                }}
              />
            </div>
            {feedbackSelectedLeaders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Select one or more leaders from above to provide feedback
              </p>
            )}
          </div>

          {/* Leader Feedback Sections */}
          {feedbackSelectedLeaders.length > 0 && (
            <div className="space-y-6 mb-8">
              {feedbackSelectedLeaders.map(leaderId => {
                const leader = leaders.find(l => l.id === leaderId);
                if (!leader) return null;
                
                const ratings = feedbackLeaderRatings[leaderId] || {};
                const feedback = feedbackLeaderFeedback[leaderId] || '';
                const stopKeepStart = feedbackLeaderStopKeepStart[leaderId] || { stop: '', keep: '', start: '' };
                const isExpanded = expandedLeaders.has(leaderId);
                const completion = getLeaderCompletion(leaderId);

                return (
                  <Card key={leaderId} className="card-premium">
                    <div className="flex items-start justify-between mb-4">
                      <button
                        onClick={() => toggleLeaderExpansion(leaderId)}
                        className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={leader.sprite} alt={leader.name} />
                          <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                  <div>
                          <h3 className="font-semibold text-lg">{leader.name}</h3>
                          {leader.role && <p className="text-sm text-muted-foreground">{leader.role}</p>}
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {completion}/10 questions
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLeaderExpansion(leaderId)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
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
                          <h4 className="font-semibold mb-4">Rate on a scale of 1-10 (1 = Strongly disagree, 10 = Strongly agree)</h4>
                          <div className="space-y-4">
                            {leadershipQuestions.map((question) => {
                              const rating = ratings[question.id];
                              return (
                                <div key={question.id} className="border-b border-border/50 pb-4 last:border-0">
                                  <p className="font-medium mb-1">{question.text}</p>
                                  <p className="text-sm text-muted-foreground mb-2">"{question.definition}"</p>
                                  <RatingPills
                                    value={rating}
                                    onChange={(val) => updateLeaderRating(leaderId, question.id, val)}
                                    count={10}
                                    levelDescriptions={levelDescriptions}
                                    leftLabel={question.leftLabel}
                                    rightLabel={question.rightLabel}
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
                          <h4 className="font-semibold mb-2">Optional: Anything that would help this feedback be better understood?</h4>
                          <Textarea
                            value={feedback}
                            onChange={(e) => updateLeaderFeedback(leaderId, e.target.value)}
                            placeholder="Additional context or examples..."
                            className="min-h-[120px] resize-none"
                          />
                  </div>

                        {/* Stop Keep Start (optional) */}
                        <div>
                          <h4 className="font-semibold mb-2">Stop / Keep Doing / Start (Not required)</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block text-destructive">Stop</label>
                              <Textarea 
                                value={stopKeepStart.stop}
                                onChange={(e) => updateStopKeepStart(leaderId, 'stop', e.target.value)}
                                placeholder="What should stop... (optional)"
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block text-positive">Keep Doing</label>
                              <Textarea 
                                value={stopKeepStart.keep}
                                onChange={(e) => updateStopKeepStart(leaderId, 'keep', e.target.value)}
                                placeholder="What should continue... (optional)"
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block text-primary">Start</label>
                              <Textarea 
                                value={stopKeepStart.start}
                                onChange={(e) => updateStopKeepStart(leaderId, 'start', e.target.value)}
                                placeholder="What should begin... (optional)"
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                          </div>
                    </div>
                  </div>
                    )}
          </Card>
                   );
                 })}
            </div>
          )}

          {/* Navigation */}
        <div className="flex justify-between mt-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Link to="/shoutouts">
            <Button variant="outline" className="btn-ghost">
              ← Back to Shoutouts
            </Button>
          </Link>
           {isFormValid() ? (
             <Link to="/culture-protection">
               <Button className="btn-hero">
                 Continue → Culture Protection
               </Button>
             </Link>
           ) : (
             <Button className="btn-hero" disabled>
               Continue → Culture Protection
               <span className="ml-2 text-xs">(Complete required fields)</span>
             </Button>
           )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
