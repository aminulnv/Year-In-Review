// Data Transformation Service
// Transforms form data into readable, Google Sheets-friendly format
// Ensures ALL form data is collected and properly formatted

import { teammates } from "@/data/teammates";
import { leaders } from "@/data/leaders";

// Quick picks mapping
const QUICK_PICKS_MAP: Record<string, string> = {
  "learning": "Learned something new",
  "helped": "Helped someone else level up",
  "simplified": "Simplified or improved how we work",
  "decision": "Made or backed a tough call",
  "impact": "Delivered real impact",
  "other": "Something else entirely"
};

// Blocker tags mapping
const BLOCKER_TAGS_MAP: Record<string, string> = {
  "process": "Process",
  "tools": "Tools or access",
  "dependencies": "Dependencies on others",
  "decisions": "Slow or unclear decisions",
  "scope": "Scope changing mid-stream",
  "other": "Other"
};

// Blocker feedback tags mapping (for teammate-specific feedback)
const BLOCKER_FEEDBACK_TAGS_MAP: Record<string, string> = {
  "ownership": "Ownership & accountability",
  "reliability": "Reliability & follow-through",
  "responsiveness": "Responsiveness & availability",
  "communication": "Communication clarity & tone",
  "context": "Context & documentation",
  "handoffs": "Handoffs & collaboration",
  "meetings": "Meeting hygiene",
  "process": "Process discipline",
  "skills": "Skill & knowledge readiness",
  "respect": "Respect, credit & psychological safety"
};

// Impact tags mapping (for shoutouts)
const IMPACT_TAGS_MAP: Record<string, string> = {
  "unblocked": "Unblocked me",
  "context": "Shared context",
  "clarity": "Gave clarity",
  "ownership": "Took ownership",
  "forward": "Moved things forward",
  "standard": "Set the standard",
  "bar": "Raised the bar",
  "example": "Led by example"
};

// Culture Pulse question mapping
const CULTURE_PULSE_QUESTIONS_MAP: Record<string, string> = {
  "focus": "Focused on What Matters",
  "clarity": "Clarity & Guidance",
  "safety": "Psychological Safety",
  "sustainability": "Pace & Sustainability",
  "energy": "Energy & Enjoyment",
  "growth": "Growth",
  "transparency": "Decision Transparency",
  "motivation": "Shared Motivation",
  "trust": "Trust Within the Team",
  "confidence": "Confidence Going Forward",
  "joy": "Joy from Work"
};

// Leadership feedback questions mapping
const LEADERSHIP_QUESTIONS_MAP: Record<string, string> = {
  "clarity": "Clarity of Expectations",
  "decision": "Decision-Making & Follow-Through",
  "fairness": "Fairness in Evaluation",
  "bias": "Bias Awareness",
  "feedback": "Quality of Feedback",
  "coaching": "Coaching & Growth Support",
  "availability": "Availability & Responsiveness",
  "safety": "Psychological Safety",
  "consistency": "Consistency & Reliability",
  "example": "Leading by Example"
};

/**
 * Convert teammate IDs to names
 */
export const getTeammateName = (id: string): string => {
  const teammate = teammates.find(t => t.id === id);
  return teammate ? teammate.name : id;
};

export const getTeammateNames = (ids: string[]): string[] => {
  return ids.map(id => getTeammateName(id));
};

/**
 * Convert leader IDs to names with roles
 */
export const getLeaderName = (id: string): string => {
  const leader = leaders.find(l => l.id === id);
  return leader ? leader.name : id;
};

export const getLeaderNameWithRole = (id: string): string => {
  const leader = leaders.find(l => l.id === id);
  return leader ? `${leader.name} (${leader.role || 'Leader'})` : id;
};

/**
 * Format array of IDs to readable names
 */
export const formatIdsToNames = (ids: string[], map?: Record<string, string>): string => {
  if (!ids || ids.length === 0) return '';
  if (map) {
    return ids.map(id => map[id] || id).join(', ');
  }
  return ids.join(', ');
};

/**
 * Format teammate-specific data (feedback, tags, etc.)
 */
export const formatTeammateSpecificData = (
  data: Record<string, any>,
  formatValue: (value: any) => string
): string => {
  const entries = Object.entries(data);
  if (entries.length === 0) return '';
  
  return entries
    .map(([teammateId, value]) => {
      const name = getTeammateName(teammateId);
      const formattedValue = formatValue(value);
      // Only include if there's actual content
      if (!formattedValue || formattedValue.trim() === '' || formattedValue === '(no feedback)') {
        return null;
      }
      return `${name}: ${formattedValue}`;
    })
    .filter(Boolean)
    .join(' | ');
};

/**
 * Format leader-specific data
 */
export const formatLeaderSpecificData = (
  data: Record<string, any>,
  formatValue: (value: any) => string
): string => {
  const entries = Object.entries(data);
  if (entries.length === 0) return '';
  
  return entries
    .map(([leaderId, value]) => {
      const name = getLeaderNameWithRole(leaderId);
      const formattedValue = formatValue(value);
      // Only include if there's actual content
      if (!formattedValue || formattedValue.trim() === '' || formattedValue === '(none)' || formattedValue === '(no additional feedback)') {
        return null;
      }
      return `${name}: ${formattedValue}`;
    })
    .filter(Boolean)
    .join(' | ');
};

/**
 * Transform form data into Google Sheets-friendly format
 * This ensures ALL data is collected and properly formatted
 */
export const transformFormDataForSheets = (formData: any) => {
  console.log('=== TRANSFORMING FORM DATA ===');
  console.log('Raw formData keys:', Object.keys(formData));
  
  // Helper to safely get values
  const safeGet = (key: string, defaultValue: any = '') => {
    const value = formData[key];
    if (value === undefined || value === null) {
      return defaultValue;
    }
    // Log if we're getting empty arrays/objects when we expect data
    if (Array.isArray(value) && value.length === 0 && defaultValue !== '') {
      console.warn(`⚠️ Empty array for ${key}`);
    }
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0 && defaultValue !== '') {
      console.warn(`⚠️ Empty object for ${key}`);
    }
    return value;
  };

  // ========== METADATA ==========
  const submissionId = `qpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  const sessionId = `session-${Date.now()}`;

  // ========== WINS SECTION ==========
  const winsText = safeGet('winsText', '');
  const quickPicks = safeGet('quickPicks', []);
  const quickPicksFormatted = formatIdsToNames(quickPicks, QUICK_PICKS_MAP);
  
  const selectedLearningTeammateIds = safeGet('selectedLearningTeammateIds', []);
  const learningTeammates = selectedLearningTeammateIds.length > 0 
    ? getTeammateNames(selectedLearningTeammateIds).join(', ')
    : '';
  
  const selectedTeachingTeammateIds = safeGet('selectedTeachingTeammateIds', []);
  const teachingTeammates = selectedTeachingTeammateIds.length > 0
    ? getTeammateNames(selectedTeachingTeammateIds).join(', ')
    : '';
  
  const learningFollowUp = safeGet('learningFollowUp', false);
  const teachingFollowUp = safeGet('teachingFollowUp', false);
  
  console.log('Wins data:', {
    winsText: winsText ? '✓' : '✗',
    quickPicks: quickPicks.length,
    learningTeammates,
    teachingTeammates,
    learningFollowUp,
    teachingFollowUp
  });

  // ========== BLOCKERS SECTION ==========
  const blockerText = safeGet('blockerText', '');
  const selectedTags = safeGet('selectedTags', []);
  const blockerTags = formatIdsToNames(selectedTags, BLOCKER_TAGS_MAP);
  
  const inventText = safeGet('inventText', '');
  const peopleBlockerText = safeGet('peopleBlockerText', '');
  
  const selectedTeammates = safeGet('selectedTeammates', []);
  const blockedByTeammates = selectedTeammates.length > 0
    ? getTeammateNames(selectedTeammates).join(', ')
    : '';
  
  const teammateSpecificFeedback = safeGet('teammateSpecificFeedback', {});
  const teammateSpecificFeedbackFormatted = formatTeammateSpecificData(
    teammateSpecificFeedback,
    (feedback) => {
      if (!feedback || typeof feedback !== 'string') return '';
      return feedback.trim();
    }
  );
  
  const selectedBlockerTagsByTeammate = safeGet('selectedBlockerTagsByTeammate', {});
  const blockerTagsByTeammateFormatted = formatTeammateSpecificData(
    selectedBlockerTagsByTeammate,
    (tags) => {
      if (!Array.isArray(tags) || tags.length === 0) return '';
      return formatIdsToNames(tags, BLOCKER_FEEDBACK_TAGS_MAP);
    }
  );
  
  console.log('Blockers data:', {
    blockerText: blockerText ? '✓' : '✗',
    blockerTags,
    inventText: inventText ? '✓' : '✗',
    peopleBlockerText: peopleBlockerText ? '✓' : '✗',
    blockedByTeammates,
    teammateSpecificFeedback: Object.keys(teammateSpecificFeedback).length,
    blockerTagsByTeammate: Object.keys(selectedBlockerTagsByTeammate).length
  });

  // ========== CULTURE PULSE SECTION ==========
  const ratings = safeGet('ratings', {});
  
  // Format all 11 Culture Pulse ratings
  const culturePulseRatings: Record<string, string> = {};
  Object.entries(CULTURE_PULSE_QUESTIONS_MAP).forEach(([id, label]) => {
    const rating = ratings[id];
    culturePulseRatings[`culturePulse_${id}`] = rating !== undefined && rating !== null ? `${rating}/10` : '';
  });
  
  const strongestValue = safeGet('strongestValue', '');
  const weakestValue = safeGet('weakestValue', '');
  
  console.log('Culture Pulse data:', {
    ratingsCount: Object.keys(ratings).length,
    ratings: Object.keys(ratings),
    strongestValue,
    weakestValue
  });

  // ========== SHOUTOUTS SECTION ==========
  const shoutoutSelectedTeammates = safeGet('shoutoutSelectedTeammates', []);
  const shoutoutTeammates = shoutoutSelectedTeammates.length > 0
    ? getTeammateNames(shoutoutSelectedTeammates).join(', ')
    : '';
  
  const selectedImpactByTeammate = safeGet('selectedImpactByTeammate', {});
  const impactTagsByTeammateFormatted = formatTeammateSpecificData(
    selectedImpactByTeammate,
    (tags) => {
      if (!Array.isArray(tags) || tags.length === 0) return '';
      return formatIdsToNames(tags, IMPACT_TAGS_MAP);
    }
  );
  
  const noteText = safeGet('noteText', '');
  
  console.log('Shoutouts data:', {
    shoutoutTeammates,
    impactTagsByTeammate: Object.keys(selectedImpactByTeammate).length,
    noteText: noteText ? '✓' : '✗'
  });

  // ========== FEEDBACK SECTION (Yearly Feedback for Leaders) ==========
  const feedbackSelectedLeaders = safeGet('feedbackSelectedLeaders', []);
  const feedbackLeaders = feedbackSelectedLeaders.length > 0
    ? feedbackSelectedLeaders.map(id => getLeaderNameWithRole(id)).join(', ')
    : '';
  
  const feedbackLeaderRatings = safeGet('feedbackLeaderRatings', {});
  
  // Format leader ratings - create columns for each leader and question combination
  const leaderRatingsFormatted: Record<string, string> = {};
  feedbackSelectedLeaders.forEach(leaderId => {
    const leader = leaders.find(l => l.id === leaderId);
    const leaderName = leader ? leader.name : leaderId;
    const ratings = feedbackLeaderRatings[leaderId] || {};
    
    console.log(`Processing ratings for ${leaderName}:`, ratings);
    
    Object.entries(LEADERSHIP_QUESTIONS_MAP).forEach(([questionId, questionLabel]) => {
      const rating = ratings[questionId];
      const columnKey = `feedback_${leaderName}_${questionId}`;
      leaderRatingsFormatted[columnKey] = rating !== undefined && rating !== null ? `${rating}/10` : '';
    });
  });
  
  const feedbackLeaderFeedback = safeGet('feedbackLeaderFeedback', {});
  const leaderFeedbackFormatted = formatLeaderSpecificData(
    feedbackLeaderFeedback,
    (feedback) => {
      if (!feedback || typeof feedback !== 'string') return '';
      return feedback.trim();
    }
  );
  
  const feedbackLeaderStopKeepStart = safeGet('feedbackLeaderStopKeepStart', {});
  
  // Format Stop/Keep/Start for each leader
  const leaderStopFormatted = formatLeaderSpecificData(
    feedbackLeaderStopKeepStart,
    (data) => {
      if (!data || typeof data !== 'object') return '';
      return (data.stop || '').trim();
    }
  );
  
  const leaderKeepFormatted = formatLeaderSpecificData(
    feedbackLeaderStopKeepStart,
    (data) => {
      if (!data || typeof data !== 'object') return '';
      return (data.keep || '').trim();
    }
  );
  
  const leaderStartFormatted = formatLeaderSpecificData(
    feedbackLeaderStopKeepStart,
    (data) => {
      if (!data || typeof data !== 'object') return '';
      return (data.start || '').trim();
    }
  );
  
  console.log('Feedback data:', {
    feedbackSelectedLeaders: feedbackSelectedLeaders.length,
    feedbackLeaders,
    leaderRatingsCount: Object.keys(leaderRatingsFormatted).length,
    leaderRatings: Object.keys(leaderRatingsFormatted),
    leaderFeedback: Object.keys(feedbackLeaderFeedback).length,
    leaderStopKeepStart: Object.keys(feedbackLeaderStopKeepStart).length
  });

  // ========== CULTURE PROTECTION SECTION ==========
  const cultureText = safeGet('cultureText', '');

  // ========== ASSEMBLE FINAL DATA OBJECT ==========
  const transformedData = {
    // Metadata
    submissionId,
    timestamp,
    sessionId,
    completionPercentage: 100,
    
    // Wins Section
    winsText,
    quickPicks: quickPicksFormatted,
    learningTeammates,
    teachingTeammates,
    learningFollowUp: learningFollowUp ? 'Yes' : 'No',
    teachingFollowUp: teachingFollowUp ? 'Yes' : 'No',
    
    // Blockers Section
    blockerText,
    blockerTags,
    inventText,
    peopleBlockerText,
    blockedByTeammates,
    teammateSpecificFeedback: teammateSpecificFeedbackFormatted,
    blockerTagsByTeammate: blockerTagsByTeammateFormatted,
    
    // Culture Pulse Section
    ...culturePulseRatings,
    strongestValue,
    weakestValue,
    
    // Shoutouts Section
    shoutoutTeammates,
    impactTagsByTeammate: impactTagsByTeammateFormatted,
    shoutoutNotes: noteText,
    
    // Feedback Section (Yearly Feedback for Leaders)
    feedbackLeaders,
    ...leaderRatingsFormatted,
    leaderFeedback: leaderFeedbackFormatted,
    leaderStop: leaderStopFormatted,
    leaderKeep: leaderKeepFormatted,
    leaderStart: leaderStartFormatted,
    
    // Culture Protection Section
    cultureText,
  };
  
  console.log('=== TRANSFORMATION COMPLETE ===');
  console.log('Total columns:', Object.keys(transformedData).length);
  console.log('Leader rating columns:', Object.keys(transformedData).filter(k => k.startsWith('feedback_') && k.includes('_')).length);
  console.log('Sample transformed data:', {
    submissionId: transformedData.submissionId,
    teachingTeammates: transformedData.teachingTeammates,
    teammateSpecificFeedback: transformedData.teammateSpecificFeedback,
    feedbackLeaders: transformedData.feedbackLeaders,
    leaderRatingColumns: Object.keys(transformedData).filter(k => k.startsWith('feedback_') && k.includes('_'))
  });
  
  return transformedData;
};

/**
 * Get all column headers for Google Sheets
 * This ensures we know all possible columns
 */
export const getSheetColumns = () => {
  const baseColumns = [
    // Metadata
    'submissionId',
    'timestamp',
    'sessionId',
    'completionPercentage',
    
    // Wins
    'winsText',
    'quickPicks',
    'learningTeammates',
    'teachingTeammates',
    'learningFollowUp',
    'teachingFollowUp',
    
    // Blockers
    'blockerText',
    'blockerTags',
    'inventText',
    'peopleBlockerText',
    'blockedByTeammates',
    'teammateSpecificFeedback',
    'blockerTagsByTeammate',
    
    // Culture Pulse (11 questions)
    ...Object.keys(CULTURE_PULSE_QUESTIONS_MAP).map(id => `culturePulse_${id}`),
    'strongestValue',
    'weakestValue',
    
    // Shoutouts
    'shoutoutTeammates',
    'impactTagsByTeammate',
    'shoutoutNotes',
    
    // Feedback - Leaders (dynamic based on leaders)
    'feedbackLeaders',
    // Leader ratings will be dynamic: feedback_{LeaderName}_{questionId}
    // Leader feedback sections
    'leaderFeedback',
    'leaderStop',
    'leaderKeep',
    'leaderStart',
    
    // Culture Protection
    'cultureText',
  ];
  
  return baseColumns;
};
