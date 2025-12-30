/**
 * Google Apps Script for Year in Review Form Submissions
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Apps Script: https://script.google.com
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Save the project
 * 5. Deploy > New Deployment > Type: Web App
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Click Deploy
 * 9. Copy the Web App URL
 * 10. Update GOOGLE_APPS_SCRIPT_URL in src/services/googleSheetsService.ts
 * 
 * GOOGLE SHEET SETUP:
 * 1. Create a new Google Sheet
 * 2. Name it "Year in Review Submissions" (or your preferred name)
 * 3. Copy the Sheet ID from the URL (between /d/ and /edit)
 * 4. Update SPREADSHEET_ID below with your Sheet ID
 */

// ========== CONFIGURATION ==========
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Submissions'; // Name of the sheet tab

// ========== MAIN HANDLER ==========
function doPost(e) {
  try {
    // Parse incoming data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      // Try form-encoded data
      const params = e.parameter;
      data = {};
      Object.keys(params).forEach(key => {
        try {
          data[key] = JSON.parse(params[key]);
        } catch {
          data[key] = params[key];
        }
      });
    }
    
    console.log('Received submission:', data.submissionId);
    
    // Get or create the spreadsheet and sheet
    const sheet = getOrCreateSheet();
    
    // Get headers (create if first row)
    const headers = getHeaders(sheet);
    
    // Prepare row data matching headers (this will also add dynamic columns if needed)
    const rowData = prepareRowData(data, headers, sheet);
    
    // Get headers again in case new columns were added
    const finalHeaders = getHeaders(sheet);
    
    // Ensure rowData matches final header count
    while (rowData.length < finalHeaders.length) {
      rowData.push('');
    }
    
    // Append the row
    sheet.appendRow(rowData);
    
    console.log('✅ Submission saved:', data.submissionId);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Submission saved successfully',
      submissionId: data.submissionId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('❌ Error processing submission:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== GET OR CREATE SHEET ==========
function getOrCreateSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('Created new sheet:', SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    throw new Error('Failed to access spreadsheet. Please check SPREADSHEET_ID: ' + error.toString());
  }
}

// ========== GET HEADERS ==========
function getHeaders(sheet) {
  const lastRow = sheet.getLastRow();
  
  // If sheet is empty, create headers
  if (lastRow === 0) {
    const headers = [
      // Metadata
      'submissionId',
      'timestamp',
      'sessionId',
      'completionPercentage',
      
      // Wins Section
      'winsText',
      'quickPicks',
      'learningTeammates',
      'teachingTeammates',
      'learningFollowUp',
      'teachingFollowUp',
      
      // Blockers Section
      'blockerText',
      'blockerTags',
      'inventText',
      'peopleBlockerText',
      'blockedByTeammates',
      'teammateSpecificFeedback',
      'blockerTagsByTeammate',
      
      // Culture Pulse Section (11 questions)
      'culturePulse_focus',
      'culturePulse_clarity',
      'culturePulse_safety',
      'culturePulse_sustainability',
      'culturePulse_energy',
      'culturePulse_growth',
      'culturePulse_transparency',
      'culturePulse_motivation',
      'culturePulse_trust',
      'culturePulse_confidence',
      'culturePulse_joy',
      'strongestValue',
      'weakestValue',
      
      // Shoutouts Section
      'shoutoutTeammates',
      'impactTagsByTeammate',
      'shoutoutNotes',
      
      // Feedback Section - Base columns
      'feedbackLeaders',
      'leaderFeedback',
      'leaderStop',
      'leaderKeep',
      'leaderStart',
      
      // Culture Protection Section
      'cultureText'
    ];
    
    // Add dynamic leader rating columns
    // We'll add these as data comes in, but for now we'll create base structure
    // Leader-specific columns will be added dynamically when needed
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    console.log('Created headers:', headers.length);
    return headers;
  }
  
  // Get existing headers
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const headers = headerRange.getValues()[0];
  return headers;
}

// ========== PREPARE ROW DATA ==========
function prepareRowData(data, headers, sheet) {
  // First, check for any new dynamic columns (leader ratings) that aren't in headers
  const newColumns = [];
  Object.keys(data).forEach(key => {
    if (key.startsWith('feedback_') && key.includes('_') && !headers.includes(key)) {
      // This is a new leader rating column - add it
      newColumns.push(key);
    }
  });
  
  // Add new columns if any
  if (newColumns.length > 0) {
    const lastCol = sheet.getLastColumn();
    newColumns.forEach((colHeader, index) => {
      const colIndex = lastCol + index + 1;
      sheet.getRange(1, colIndex).setValue(colHeader);
      sheet.getRange(1, colIndex).setFontWeight('bold');
      sheet.getRange(1, colIndex).setBackground('#4285f4');
      sheet.getRange(1, colIndex).setFontColor('#ffffff');
      headers.push(colHeader);
    });
    console.log('Added', newColumns.length, 'new dynamic columns:', newColumns);
  }
  
  // Now prepare row data with updated headers
  const rowData = new Array(headers.length).fill('');
  
  // Map data to header positions
  headers.forEach((header, index) => {
    if (data.hasOwnProperty(header)) {
      const value = data[header];
      
      // Convert boolean to string
      if (typeof value === 'boolean') {
        rowData[index] = value ? 'Yes' : 'No';
      }
      // Convert arrays/objects to readable strings
      else if (Array.isArray(value)) {
        rowData[index] = value.join(', ');
      }
      else if (typeof value === 'object' && value !== null) {
        rowData[index] = JSON.stringify(value);
      }
      // Regular values
      else {
        rowData[index] = value || '';
      }
    }
    // Handle dynamic leader rating columns (should now be in headers after adding above)
    else if (header.startsWith('feedback_') && header.includes('_')) {
      // This should already be in data if it's a new column we just added
      if (data.hasOwnProperty(header)) {
        rowData[index] = data[header] || '';
      }
    }
  });
  
  return rowData;
}

// ========== ADD DYNAMIC COLUMNS ==========
function addDynamicColumns(sheet, headers, data) {
  const newColumns = [];
  
  // Check for leader rating columns that don't exist in headers
  Object.keys(data).forEach(key => {
    if (key.startsWith('feedback_') && key.includes('_') && !headers.includes(key)) {
      // Extract leader name and question
      const parts = key.replace('feedback_', '').split('_');
      if (parts.length >= 2) {
        newColumns.push({
          header: key,
          position: headers.length + newColumns.length + 1
        });
      }
    }
  });
  
  // Add new columns if any
  if (newColumns.length > 0) {
    const lastCol = sheet.getLastColumn();
    newColumns.forEach((col, index) => {
      const colIndex = lastCol + index + 1;
      sheet.getRange(1, colIndex).setValue(col.header);
      sheet.getRange(1, colIndex).setFontWeight('bold');
      sheet.getRange(1, colIndex).setBackground('#4285f4');
      sheet.getRange(1, colIndex).setFontColor('#ffffff');
    });
    
    // Update frozen columns if needed
    sheet.setFrozenRows(1);
    
    console.log('Added', newColumns.length, 'new dynamic columns');
  }
  
  return newColumns.map(col => col.header);
}

// ========== TEST FUNCTION ==========
function testSubmission() {
  const testData = {
    submissionId: 'test-' + Date.now(),
    timestamp: new Date().toISOString(),
    sessionId: 'test-session',
    completionPercentage: 100,
    winsText: 'Test wins text',
    quickPicks: 'Learned something new, Helped someone else level up',
    learningTeammates: 'Ali, Fahim',
    teachingTeammates: 'Tashfeen',
    learningFollowUp: true,
    teachingFollowUp: false,
    blockerText: 'Test blocker',
    blockerTags: 'Process, Tools or access',
    inventText: 'Test invention',
    peopleBlockerText: 'Test people blocker',
    blockedByTeammates: 'Saif, Abhi',
    teammateSpecificFeedback: 'Ali: Great work | Fahim: Needs improvement',
    blockerTagsByTeammate: 'Ali: Ownership & accountability, Reliability & follow-through',
    culturePulse_focus: '8/10',
    culturePulse_clarity: '7/10',
    culturePulse_safety: '9/10',
    culturePulse_sustainability: '6/10',
    culturePulse_energy: '8/10',
    culturePulse_growth: '7/10',
    culturePulse_transparency: '8/10',
    culturePulse_motivation: '9/10',
    culturePulse_trust: '8/10',
    culturePulse_confidence: '7/10',
    culturePulse_joy: '9/10',
    strongestValue: 'Move Fast, Chase Excellence',
    weakestValue: 'Debate Openly, Commit Fully',
    shoutoutTeammates: 'Maheem, Vicky',
    impactTagsByTeammate: 'Maheem: Unblocked me, Gave clarity | Vicky: Set the standard',
    shoutoutNotes: 'Great teamwork this year!',
    feedbackLeaders: 'Fahim (HOD), Tashfeen (Lead)',
    feedback_Fahim_clarity: '9/10',
    feedback_Fahim_decision: '8/10',
    feedback_Fahim_fairness: '9/10',
    feedback_Fahim_bias: '10/10',
    feedback_Fahim_feedback: '8/10',
    feedback_Fahim_coaching: '9/10',
    feedback_Fahim_availability: '8/10',
    feedback_Fahim_safety: '9/10',
    feedback_Fahim_consistency: '9/10',
    feedback_Fahim_example: '10/10',
    feedback_Tashfeen_clarity: '8/10',
    feedback_Tashfeen_decision: '7/10',
    feedback_Tashfeen_fairness: '8/10',
    feedback_Tashfeen_bias: '9/10',
    feedback_Tashfeen_feedback: '8/10',
    feedback_Tashfeen_coaching: '8/10',
    feedback_Tashfeen_availability: '9/10',
    feedback_Tashfeen_safety: '8/10',
    feedback_Tashfeen_consistency: '8/10',
    feedback_Tashfeen_example: '9/10',
    leaderFeedback: 'Fahim (HOD): Great leadership | Tashfeen (Lead): Very supportive',
    leaderStop: 'Fahim (HOD): None | Tashfeen (Lead): None',
    leaderKeep: 'Fahim (HOD): Keep the transparency | Tashfeen (Lead): Keep the support',
    leaderStart: 'Fahim (HOD): More team building | Tashfeen (Lead): More feedback sessions',
    cultureText: 'Our collaborative spirit and commitment to excellence'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    },
    parameter: {}
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result:', result.getContent());
}

// ========== GET FUNCTION (for testing/debugging) ==========
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Year in Review Form Submission Handler',
    status: 'active',
    timestamp: new Date().toISOString(),
    instructions: 'Send POST requests with form data to submit responses'
  })).setMimeType(ContentService.MimeType.JSON);
}

