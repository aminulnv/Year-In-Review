// Google Sheets Service
// Submits form data to Google Sheets via Google Apps Script

import { transformFormDataForSheets } from "./dataTransformationService";

export interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// TODO: Replace with your Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpW-GbLMqojth0o3NE75DQsPAfxzvdXvP1TBr60PllbmiWW6oS9S4SozzJGlvURMJOQg/exec';

/**
 * Submit form data to Google Sheets
 */
export const submitToGoogleSheets = async (formData: any): Promise<GoogleSheetsResponse> => {
  try {
    // Transform form data into readable, Google Sheets-friendly format
    const transformedData = transformFormDataForSheets(formData);
    
    console.log('=== GOOGLE SHEETS SUBMISSION ===');
    console.log('Endpoint:', GOOGLE_APPS_SCRIPT_URL);
    console.log('Transformed Data Keys:', Object.keys(transformedData));
    console.log('Sample Data:', {
      submissionId: transformedData.submissionId,
      timestamp: transformedData.timestamp,
      winsText: transformedData.winsText?.substring(0, 50) + '...',
      feedbackLeaders: transformedData.feedbackLeaders
    });
    
    // Try JSON submission first
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
      mode: 'no-cors'
    });

    // With no-cors mode, we can't read the response, so we assume success
    console.log('✅ JSON submission completed (no-cors mode)');
    
    return {
      success: true,
      message: 'Form submitted successfully to Google Sheets!'
    };
  } catch (error) {
    console.error('❌ JSON submission failed:', error);
    
    // Try with form-encoded fallback
    try {
      console.log('🔄 Attempting form-encoded fallback...');
      
      const formBody = new URLSearchParams();
      const transformedData = transformFormDataForSheets(formData);
      
      Object.entries(transformedData).forEach(([key, value]) => {
        formBody.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
        mode: 'no-cors'
      });

      console.log('✅ Form-encoded fallback completed');
      
      return {
        success: true,
        message: 'Form submitted successfully via fallback method!'
      };
    } catch (alternativeError) {
      console.error('❌ All submission methods failed:', alternativeError);
      return {
        success: false,
        error: 'Unable to submit to Google Sheets. Please verify the endpoint is accessible.'
      };
    }
  }
};

