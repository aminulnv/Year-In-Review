// Local Storage Service for Form Submissions
// Stores all form submissions locally with proper structure

export interface SubmissionData {
  // Metadata
  submissionId: string;
  timestamp: string;
  sessionId: string;
  completionPercentage: number;
  
  // Wins
  winsText: string;
  quickPicks: string[];
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
  feedbackSelectedLeaders: string[];
  feedbackLeaderRatings: Record<string, Record<string, number>>;
  feedbackLeaderFeedback: Record<string, string>;
  feedbackLeaderStopKeepStart: Record<string, { stop: string; keep: string; start: string }>;
  
  // Culture Protection
  cultureText: string;
}

export interface StorageResponse {
  success: boolean;
  message?: string;
  error?: string;
  submissionId?: string;
}

const STORAGE_KEY = 'qpt-submissions';
const MAX_SUBMISSIONS = 1000; // Limit to prevent storage bloat

/**
 * Get all stored submissions
 */
export const getAllSubmissions = (): SubmissionData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading submissions from storage:', error);
    return [];
  }
};

/**
 * Save a new submission
 */
export const saveSubmission = async (formData: any): Promise<StorageResponse> => {
  try {
    const submissions = getAllSubmissions();
    
    // Create submission data with metadata
    const submission: SubmissionData = {
      submissionId: `qpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      sessionId: `session-${Date.now()}`,
      completionPercentage: 100,
      
      // Wins
      winsText: formData.winsText || '',
      quickPicks: formData.quickPicks || [],
      selectedLearningTeammateIds: formData.selectedLearningTeammateIds || [],
      selectedTeachingTeammateIds: formData.selectedTeachingTeammateIds || [],
      learningFollowUp: formData.learningFollowUp || false,
      teachingFollowUp: formData.teachingFollowUp || false,
      
      // Blockers
      blockerText: formData.blockerText || '',
      selectedTags: formData.selectedTags || [],
      inventText: formData.inventText || '',
      peopleBlockerText: formData.peopleBlockerText || '',
      selectedTeammates: formData.selectedTeammates || [],
      teammateSpecificFeedback: formData.teammateSpecificFeedback || {},
      selectedBlockerTagsByTeammate: formData.selectedBlockerTagsByTeammate || {},
      
      // Culture Pulse
      ratings: formData.ratings || {},
      strongestValue: formData.strongestValue || '',
      weakestValue: formData.weakestValue || '',
      
      // Shoutouts
      shoutoutSelectedTeammates: formData.shoutoutSelectedTeammates || [],
      selectedImpactByTeammate: formData.selectedImpactByTeammate || {},
      noteText: formData.noteText || '',
      
      // Feedback (Yearly Feedback for Leaders)
      feedbackSelectedLeaders: formData.feedbackSelectedLeaders || [],
      feedbackLeaderRatings: formData.feedbackLeaderRatings || {},
      feedbackLeaderFeedback: formData.feedbackLeaderFeedback || {},
      feedbackLeaderStopKeepStart: formData.feedbackLeaderStopKeepStart || {},
      
      // Culture Protection
      cultureText: formData.cultureText || '',
    };
    
    // Add to submissions array (newest first)
    submissions.unshift(submission);
    
    // Limit the number of stored submissions
    if (submissions.length > MAX_SUBMISSIONS) {
      submissions.splice(MAX_SUBMISSIONS);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    
    console.log('✅ Submission saved locally:', {
      submissionId: submission.submissionId,
      timestamp: submission.timestamp,
      totalSubmissions: submissions.length
    });
    
    return {
      success: true,
      message: 'Form submitted successfully and saved locally!',
      submissionId: submission.submissionId
    };
  } catch (error) {
    console.error('❌ Error saving submission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save submission locally'
    };
  }
};

/**
 * Get a specific submission by ID
 */
export const getSubmission = (submissionId: string): SubmissionData | null => {
  try {
    const submissions = getAllSubmissions();
    return submissions.find(s => s.submissionId === submissionId) || null;
  } catch (error) {
    console.error('Error getting submission:', error);
    return null;
  }
};

/**
 * Delete a specific submission
 */
export const deleteSubmission = (submissionId: string): StorageResponse => {
  try {
    const submissions = getAllSubmissions();
    const filtered = submissions.filter(s => s.submissionId !== submissionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    return {
      success: true,
      message: 'Submission deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete submission'
    };
  }
};

/**
 * Clear all submissions
 */
export const clearAllSubmissions = (): StorageResponse => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return {
      success: true,
      message: 'All submissions cleared'
    };
  } catch (error) {
    console.error('Error clearing submissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear submissions'
    };
  }
};

/**
 * Export all submissions as JSON (for backup/download)
 */
export const exportSubmissions = (): string => {
  try {
    const submissions = getAllSubmissions();
    return JSON.stringify(submissions, null, 2);
  } catch (error) {
    console.error('Error exporting submissions:', error);
    return '[]';
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  try {
    const submissions = getAllSubmissions();
    const storageSize = new Blob([JSON.stringify(submissions)]).size;
    
    return {
      totalSubmissions: submissions.length,
      storageSize: storageSize,
      storageSizeKB: (storageSize / 1024).toFixed(2),
      storageSizeMB: (storageSize / (1024 * 1024)).toFixed(2),
      oldestSubmission: submissions.length > 0 ? submissions[submissions.length - 1]?.timestamp : null,
      newestSubmission: submissions.length > 0 ? submissions[0]?.timestamp : null
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalSubmissions: 0,
      storageSize: 0,
      storageSizeKB: '0',
      storageSizeMB: '0',
      oldestSubmission: null,
      newestSubmission: null
    };
  }
};

