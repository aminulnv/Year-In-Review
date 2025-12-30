// Updated Google Apps Script - Survey Response Handler
// Version: 2.0 - Supports Quick Picks and Actionable status

function doPost(e) {
  try {
    console.log('=== INCOMING REQUEST ===');
    console.log('Content Type:', e.parameter ? 'form-encoded' : 'json');
    console.log('Request method:', e.parameter ? 'POST (form)' : 'POST (json)');
    
    // Parse data from either JSON or form-encoded
    let data;
    if (e.postData && e.postData.contents) {
      // JSON payload
      data = JSON.parse(e.postData.contents);
      console.log('Parsed JSON data keys:', Object.keys(data));
    } else if (e.parameter) {
      // Form-encoded payload
      data = e.parameter;
      console.log('Form data keys:', Object.keys(data));
    } else {
      throw new Error('No data received');
    }
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Prepare row data in exact order matching our schema
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.sessionId || `session-${Date.now()}`,
      data.submissionId || `qpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data.characterSelected || '',
      data.completionPercentage || 100,
      data.winsText || '',
      data.winsPrivacy || 'public',
      data.learningTeammates || '',
      data.teachingTeammates || '',
      data.quickPicks || '', // NEW: Quick Picks column
      data.blockerText || '',
      data.blockerTags || '',
      data.inventionText || '',
      data.criticality || 'medium',
      data.blockersPrivacy || 'public',
      data.signalVsNoise || '',
      data.guidanceRating || '',
      data.teamRespect || '',
      data.burnoutLevel || '',
      data.joyRating || '',
      data.growthPace || '',
      data.decisionsClarity || '',
      data.strongestValue || '',
      data.weakestValue || '',
      data.actionText || '',
      data.culturePrivacy || 'public',
      data.selectedTeammates || '',
      data.impactTagsByTeammate || '',
      data.shoutoutNotes || '',
      data.shoutoutsPrivacy || 'public',
      data.anonymous || false,
      data.psychSafety || '',
      data.fairness || '',
      data.coaching || '',
      data.meetingHygiene || '',
      data.velocity || '',
      data.clarity || '',
      data.humility || '',
      data.focusAreas || '',
      data.whatWentWell || '',
      data.whatToImprove || '',
      data.stopASAP || '',
      data.actionable || false, // NEW: Actionable status column
      data.feedbackPrivacy || 'public',
      data.peopleBlockerText || '',
      data.blockedByTeammates || '',
      data.teammateSpecificFeedback || '',
      data.selectedBlockerTagsByTeammate || '',
      data.learningFollowUp || false,
      data.teachingFollowUp || false
    ];
    
    console.log('Adding row with', rowData.length, 'columns');
    
    // Add the row
    sheet.appendRow(rowData);
    
    // Log success
    console.log('✅ Data successfully written to sheet');
    console.log('Row data preview:', rowData.slice(0, 5));
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data successfully submitted with Quick Picks and Actionable status!',
        columns: rowData.length,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Error processing request:', error.toString());
    console.error('Error stack:', error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Failed to process survey submission'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Survey Handler Active',
      version: '2.0',
      message: 'POST requests accepted for survey submissions',
      features: ['Quick Picks tracking', 'Actionable status', '50-column schema']
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const SHEET_NAME = 'Survey Responses';
  
  try {
    let sheet = SpreadsheetApp.getActiveSheet();
    
    // Rename to our expected name if different
    if (sheet.getName() !== SHEET_NAME) {
      sheet.setName(SHEET_NAME);
    }
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const HEADERS = [
        'Timestamp',
        'Session ID', 
        'Submission ID',
        'Character Selected',
        'Completion %',
        'Wins Text',
        'Wins Privacy',
        'Learning Teammates',
        'Teaching Teammates', 
        'Quick Picks', // Column 10
        'Blocker Text',
        'Blocker Tags',
        'Invention Text',
        'Criticality',
        'Blockers Privacy',
        'Signal vs Noise',
        'Guidance Rating',
        'Team Respect',
        'Burnout Level',
        'Joy Rating', // Column 20
        'Growth Pace',
        'Decisions Clarity',
        'Strongest Value',
        'Weakest Value',
        'Action Text',
        'Culture Privacy',
        'Selected Teammates',
        'Impact Tags by Teammate',
        'Shoutout Notes',
        'Shoutouts Privacy', // Column 30
        'Anonymous',
        'Psych Safety',
        'Fairness',
        'Coaching',
        'Meeting Hygiene',
        'Velocity',
        'Clarity',
        'Humility',
        'Focus Areas',
        'What Went Well', // Column 40
        'What To Improve',
        'Stop ASAP',
        'Actionable', // Column 43
        'Feedback Privacy',
        'People Blocker Text',
        'Blocked By Teammates',
        'Teammate Specific Feedback',
        'Selected Blocker Tags by Teammate',
        'Learning Follow Up',
        'Teaching Follow Up' // Column 50
      ];
      
      sheet.appendRow(HEADERS);
      console.log('✅ Added headers to sheet (' + HEADERS.length + ' columns)');
    }
    
    return sheet;
    
  } catch (error) {
    console.error('Error accessing/creating sheet:', error);
    throw new Error('Unable to access Google Sheet: ' + error.toString());
  }
}

function setup() {
  console.log('🚀 Setting up Survey Response Handler v2.0...');
  
  try {
    const sheet = getOrCreateSheet();
    console.log('✅ Sheet setup complete');
    console.log('Sheet name:', sheet.getName());
    console.log('Current rows:', sheet.getLastRow());
    console.log('Current columns:', sheet.getLastColumn());
    
    console.log('🎯 Ready to receive survey submissions with Quick Picks and Actionable tracking!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}