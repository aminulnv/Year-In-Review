import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, Lock, Sparkles } from "lucide-react";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { teammates } from "@/data/teammates";
import { leaders } from "@/data/leaders";
import NavigationBar from "@/components/NavigationBar";
import Seo from "@/components/Seo";
import { saveSubmission } from "@/services/localStorageService";
import { submitToGoogleSheets } from "@/services/googleSheetsService";
import { useToast } from "@/hooks/use-toast";

const Review = () => {
  const [submitting, setSubmitting] = useState(false);
  const { formData } = useFormPersistence();
  const { toast } = useToast();

  // Calculate completion status based on actual form data
  const completedSections = [
    // Wins: Must have winsText, and if learning/teaching follow-ups are active, must have teammates selected
    formData.winsText.trim().length > 0 &&
      (!formData.learningFollowUp || (formData.selectedLearningTeammateIds && formData.selectedLearningTeammateIds.length > 0)) &&
      (!formData.teachingFollowUp || (formData.selectedTeachingTeammateIds && formData.selectedTeachingTeammateIds.length > 0)),
    // Blockers: Must have all text fields + at least one tag + if teammates selected, each must have blocker tags
    formData.blockerText.trim().length > 0 && 
      formData.inventText.trim().length > 0 && 
      formData.peopleBlockerText.trim().length > 0 &&
      (formData.selectedTags?.length > 0) &&
      ((formData.selectedTeammates?.length === 0) || 
       (formData.selectedTeammates?.every(teammateId => 
         (formData.selectedBlockerTagsByTeammate?.[teammateId] || []).length > 0
       ))),
    // Culture Pulse: All 11 ratings + strongest/weakest values
    Object.keys(formData.ratings).length === 11 && formData.strongestValue && formData.weakestValue,
    // Shoutouts: Must have teammates selected + each must have impact tags
    formData.shoutoutSelectedTeammates.length > 0 && 
      formData.shoutoutSelectedTeammates.every(id => formData.selectedImpactByTeammate[id]?.length > 0),
    // Feedback: Must have at least one leader selected with all 10 ratings completed
    formData.feedbackSelectedLeaders.length > 0 && 
      formData.feedbackSelectedLeaders.every(leaderId => {
        const ratings = formData.feedbackLeaderRatings[leaderId] || {};
        return Object.keys(ratings).length === 10;
      }),
    // Culture Protection: Must have culture text
    formData.cultureText.trim().length > 0
  ].filter(Boolean).length;
  
  const totalSections = 6;
  const completionPercentage = (completedSections / totalSections) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Save submission locally first
      const localResult = await saveSubmission(formData);
      
      if (!localResult.success) {
        throw new Error(localResult.error || 'Local save failed');
      }
      
      // Then submit to Google Sheets
      const sheetsResult = await submitToGoogleSheets(formData);
      
        // Store completion status
        localStorage.setItem('qpt-pulse-completed', 'true');
        localStorage.setItem('qpt-pulse-completion-date', new Date().toISOString());
      if (localResult.submissionId) {
        localStorage.setItem('qpt-submission-id', localResult.submissionId);
      }
        
      if (sheetsResult.success) {
        toast({
          title: "Success! 🎉",
          description: "Your culture pulse has been saved and submitted successfully!",
          duration: 3000,
        });
      } else {
        // Local save succeeded but Google Sheets failed
        toast({
          title: "Partially Saved",
          description: "Saved locally, but Google Sheets submission failed. Data is safe in your browser.",
          variant: "default",
          duration: 5000,
        });
      }
      
      console.log("Form submitted successfully:", {
        local: localResult.submissionId,
        sheets: sheetsResult.success
      });
    } catch (error) {
      console.error('Submission error:', error);
      
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to save. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    return privacy === "public" ? 
      <Users className="w-4 h-4 text-green-500" /> : 
      <Lock className="w-4 h-4 text-blue-500" />;
  };

  const getPrivacyLabel = (privacy: string) => {
    return privacy === "public" ? "Public" : "Private";
  };

  return (
    <div className="min-h-screen">
      <Seo title="Review & Submit | QPT Culture Pulse" description="Review your responses and submit your culture pulse feedback." canonicalPath="/review" />
      
      <NavigationBar currentStep="review" />
      
      {/* Version badge and theme toggle */}
      <div className="absolute top-20 right-6 z-10 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">Review & Submit</h1>
            <p className="text-lg text-muted-foreground">
              Your culture pulse is ready to protect the spark
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
            {/* Wins */}
            <Link to="/wins">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.winsText.trim().length > 0 &&
                      (!formData.learningFollowUp || (formData.selectedLearningTeammateIds && formData.selectedLearningTeammateIds.length > 0)) &&
                      (!formData.teachingFollowUp || (formData.selectedTeachingTeammateIds && formData.selectedTeachingTeammateIds.length > 0))
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Wins & High-Fives</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.winsText.trim() ? 
                          formData.winsText.substring(0, 80) + (formData.winsText.length > 80 ? '...' : '') :
                          'Not completed yet'
                        }
                      </p>
                      {formData.selectedLearningTeammateIds.length > 0 && (
                        <Badge variant="outline" className="text-xs mt-2">
                          Learning from {formData.selectedLearningTeammateIds.length} teammate(s)
                        </Badge>
                      )}
                      {formData.selectedTeachingTeammateIds.length > 0 && (
                        <Badge variant="outline" className="text-xs mt-2 ml-2">
                          Teaching {formData.selectedTeachingTeammateIds.length} teammate(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Blockers */}
            <Link to="/blockers">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.blockerText.trim() && 
                      formData.inventText.trim() && 
                      formData.peopleBlockerText.trim() && 
                      (formData.selectedTags?.length > 0) &&
                      ((formData.selectedTeammates?.length === 0) || 
                       (formData.selectedTeammates?.every(teammateId => 
                         (formData.selectedBlockerTagsByTeammate?.[teammateId] || []).length > 0
                       )))
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Blockers & Fixes</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.blockerText.trim() ? 
                          formData.blockerText.substring(0, 80) + (formData.blockerText.length > 80 ? '...' : '') :
                          'Not completed yet'
                        }
                      </p>
                      {formData.selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.selectedTags.map((tagId) => (
                            <Badge key={tagId} variant="outline" className="text-xs">
                              {tagId}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Culture Pulse */}
            <Link to="/culture-pulse">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      Object.keys(formData.ratings).length === 7 && formData.strongestValue && formData.weakestValue
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Culture Pulse</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.keys(formData.ratings).length > 0 ? (
                          <>
                            {Object.keys(formData.ratings).length}/11 metrics rated
                            {Object.keys(formData.ratings).length === 11 && (
                              <> • Avg score: {(
                                Object.values(formData.ratings).reduce((a, b) => a + b, 0) / 
                                Object.values(formData.ratings).length
                              ).toFixed(1)}/10</>
                            )}
                          </>
                        ) : 'Not completed yet'}
                      </p>
                      {formData.strongestValue && (
                        <Badge variant="outline" className="text-xs mt-2">
                          Strongest: {formData.strongestValue}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Shoutouts */}
            <Link to="/shoutouts">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.shoutoutSelectedTeammates.length > 0 && 
                      formData.shoutoutSelectedTeammates.every(id => formData.selectedImpactByTeammate[id]?.length > 0)
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">Shoutouts</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.shoutoutSelectedTeammates.length > 0 ? (
                          <>
                            Recognized {formData.shoutoutSelectedTeammates.length} teammate(s)
                            {formData.shoutoutSelectedTeammates.length === 1 && (() => {
                              const teammate = teammates.find(t => t.id === formData.shoutoutSelectedTeammates[0]);
                              const impacts = formData.selectedImpactByTeammate[formData.shoutoutSelectedTeammates[0]] || [];
                              return teammate && impacts.length > 0 ? ` (${teammate.name} for ${impacts.join(', ')})` : '';
                            })()}
                          </>
                        ) : 'Not completed yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Feedback */}
            <Link to="/feedback">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <CheckCircle className={`w-6 h-6 ${
                      formData.feedbackSelectedLeaders.length > 0 && 
                      formData.feedbackSelectedLeaders.every(leaderId => {
                        const ratings = formData.feedbackLeaderRatings[leaderId] || {};
                        return Object.keys(ratings).length === 10;
                      })
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">How Leadership Showed Up</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.feedbackSelectedLeaders.length > 0 ? (
                          <>
                            Feedback for {formData.feedbackSelectedLeaders.length} leader(s)
                            {formData.feedbackSelectedLeaders.every(leaderId => {
                              const ratings = formData.feedbackLeaderRatings[leaderId] || {};
                              return Object.keys(ratings).length === 10;
                            }) && (
                              <> • All ratings complete</>
                            )}
                          </>
                        ) : 'Not completed yet'}
                      </p>
                      {formData.feedbackSelectedLeaders.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {formData.feedbackSelectedLeaders.map(leaderId => {
                            const leader = leaders.find(l => l.id === leaderId);
                            if (!leader) return null;
                            const ratings = formData.feedbackLeaderRatings[leaderId] || {};
                            const ratingCount = Object.keys(ratings).length;
                            const isComplete = ratingCount === 10;
                            const avgRating = ratingCount > 0 
                              ? (Object.values(ratings).reduce((a, b) => a + b, 0) / ratingCount).toFixed(1)
                              : null;
                            const hasOptionalFeedback = formData.feedbackLeaderFeedback[leaderId]?.trim() || 
                              formData.feedbackLeaderStopKeepStart[leaderId]?.stop?.trim() ||
                              formData.feedbackLeaderStopKeepStart[leaderId]?.keep?.trim() ||
                              formData.feedbackLeaderStopKeepStart[leaderId]?.start?.trim();
                            
                            return (
                              <div key={leaderId} className="flex items-center gap-2 text-xs">
                                <Badge 
                                  variant={isComplete ? "default" : "outline"} 
                                  className="text-xs"
                                >
                                  {leader.name} {leader.role && `(${leader.role})`}
                        </Badge>
                                <span className="text-muted-foreground">
                                  {ratingCount}/10 questions
                                  {avgRating && ` • Avg: ${avgRating}/10`}
                                  {hasOptionalFeedback && ` • + Optional feedback`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Culture Protection */}
            <Link to="/culture-protection">
              <Card className="card-premium animate-slide-up cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-6 h-6 ${formData.cultureText.trim() ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-semibold">Culture Protection</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.cultureText.trim() ? 
                          formData.cultureText.substring(0, 80) + (formData.cultureText.length > 80 ? '...' : '') :
                          'Not completed yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>


          {/* Submit button */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            {completionPercentage === 100 ? (
              <Link to="/success">
                <Button 
                  className="btn-hero px-12 py-4 text-lg"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Protecting the Spark...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Submit → Success
                    </div>
                  )}
                </Button>
              </Link>
            ) : (
              <div className="space-y-4">
                <Button 
                  className="btn-hero px-12 py-4 text-lg"
                  disabled
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Complete All Sections First
                  </div>
                </Button>
                <p className="text-sm text-destructive">
                  Please complete all required sections before submitting ({completedSections}/{totalSections} completed)
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Link to="/culture-protection">
              <Button variant="outline" className="btn-ghost">
                ← Back to Culture Protection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;