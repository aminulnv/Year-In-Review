import { useState, useEffect } from 'react';

interface FormData {
  // Wins
  winsText: string;
  quickPicks: string[]; // Track which quick picks were selected
  selectedLearningTeammateIds: string[];
  selectedTeachingTeammateIds: string[];
  learningFollowUp: boolean;
  teachingFollowUp: boolean;
  
  // Blockers
  blockerText: string;
  selectedTags: string[];
  inventText: string;
  peopleBlockerText: string;
  selectedTeammates: string[];
  teammateSpecificFeedback: Record<string, string>;
  selectedBlockerTagsByTeammate: Record<string, string[]>;
  
  // Culture Pulse
  ratings: Record<string, number>;
  strongestValue: string;
  weakestValue: string;
  
  // Shoutouts
  shoutoutSelectedTeammates: string[];
  selectedImpactByTeammate: Record<string, string[]>;
  noteText: string;
  
  // Feedback (Yearly Feedback for Leaders)
  feedbackSelectedLeaders: string[]; // leader IDs (HOD + Leads)
  feedbackLeaderRatings: Record<string, Record<string, number>>; // leader ID -> question ID -> rating (1-10)
  feedbackLeaderFeedback: Record<string, string>; // leader ID -> optional feedback text
  feedbackLeaderStopKeepStart: Record<string, { stop: string; keep: string; start: string }>; // leader ID -> stop/keep/start
  // Legacy fields (kept for backward compatibility)
  feedbackAnonymous: boolean;
  feedbackRatings: Record<string, number>;
  feedbackFocusAreas: string[];
  feedbackStopFeedback: string;
  feedbackKeepDoingFeedback: string;
  feedbackStartFeedback: string;
  actionable: boolean;
  
  // Culture Protection
  cultureText: string;
  
  // Year in Review
  yearInReviewWinsText: string;
  yearInReviewQuickPicks: string[];
  yearInReviewBlockerText: string;
  yearInReviewBlockerTags: string[];
  yearInReviewWishMoreOf: string;
  yearInReviewPulseRatings: Record<string, number>; // 7 questions
  yearInReviewPeopleWhoHelped: string[]; // teammate IDs
  yearInReviewPeopleHelpReasons: Record<string, string[]>; // teammate ID -> help reasons
  yearInReviewSelectedLeaders: string[]; // leader IDs
  yearInReviewLeaderRatings: Record<string, Record<string, number>>; // leader ID -> question ID -> rating
  yearInReviewLeaderFeedback: Record<string, string>; // leader ID -> feedback text
  yearInReviewLeaderStopKeepStart: Record<string, { stop: string; keep: string; start: string }>; // leader ID -> stop/keep/start
  yearInReviewLeaderNextYear: Record<string, string>; // leader ID -> next year focus
}

const defaultFormData: FormData = {
  winsText: '',
  quickPicks: [],
  selectedLearningTeammateIds: [],
  selectedTeachingTeammateIds: [],
  learningFollowUp: false,
  teachingFollowUp: false,
  blockerText: '',
  selectedTags: [],
  inventText: '',
  peopleBlockerText: '',
  selectedTeammates: [],
  teammateSpecificFeedback: {},
  selectedBlockerTagsByTeammate: {},
  ratings: {},
  strongestValue: '',
  weakestValue: '',
  shoutoutSelectedTeammates: [],
  selectedImpactByTeammate: {},
  noteText: '',
  feedbackSelectedLeaders: [],
  feedbackLeaderRatings: {},
  feedbackLeaderFeedback: {},
  feedbackLeaderStopKeepStart: {},
  feedbackAnonymous: false,
  feedbackRatings: {},
  feedbackFocusAreas: [],
  feedbackStopFeedback: '',
  feedbackKeepDoingFeedback: '',
  feedbackStartFeedback: '',
  actionable: false,
  cultureText: '',
  yearInReviewWinsText: '',
  yearInReviewQuickPicks: [],
  yearInReviewBlockerText: '',
  yearInReviewBlockerTags: [],
  yearInReviewWishMoreOf: '',
  yearInReviewPulseRatings: {},
  yearInReviewPeopleWhoHelped: [],
  yearInReviewPeopleHelpReasons: {},
  yearInReviewSelectedLeaders: [],
  yearInReviewLeaderRatings: {},
  yearInReviewLeaderFeedback: {},
  yearInReviewLeaderStopKeepStart: {},
  yearInReviewLeaderNextYear: {}
};

export const useFormPersistence = () => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Load data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qpt-form-data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setFormData({ ...defaultFormData, ...parsedData });
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('qpt-form-data', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const clearFormData = () => {
    setFormData(defaultFormData);
    localStorage.removeItem('qpt-form-data');
  };

  return { formData, updateFormData, clearFormData };
};