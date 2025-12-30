# Google Apps Script Setup Instructions

## Step-by-Step Setup Guide

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Year in Review Submissions" (or your preferred name)
4. Copy the **Sheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - The Sheet ID is the long string between `/d/` and `/edit`

### 2. Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. Delete the default `myFunction` code
4. Copy the entire contents of `google-apps-script.js` and paste it into the editor
5. **IMPORTANT**: Update line 18 with your Sheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
   ```
6. Click **Save** (or Ctrl+S / Cmd+S)
7. Name your project (e.g., "Year in Review Form Handler")

### 3. Deploy as Web App
1. Click **Deploy** > **New Deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure:
   - **Description**: "Year in Review Form Submission Handler"
   - **Execute as**: **Me** (your account)
   - **Who has access**: **Anyone** (important for form submissions)
5. Click **Deploy**
6. **Authorize** the script when prompted:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)" (if shown)
   - Click "Allow"
7. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### 4. Update Your Application
1. Open `src/services/googleSheetsService.ts`
2. Find line 8:
   ```typescript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace with your Web App URL from step 3
4. Save the file

### 5. Test the Setup
1. Run the test function in Apps Script:
   - In the Apps Script editor, select `testSubmission` from the function dropdown
   - Click **Run** ▶️
   - Authorize if prompted
   - Check the execution log for success
2. Check your Google Sheet:
   - Open your Google Sheet
   - You should see:
     - Headers in the first row (blue background)
     - A test row with sample data
3. Test from your application:
   - Fill out the form in your app
   - Submit it
   - Check the Google Sheet for the new row

## Troubleshooting

### Issue: "Failed to access spreadsheet"
- **Solution**: Double-check that `SPREADSHEET_ID` is correct
- Make sure the Sheet ID is between quotes: `'YOUR_ID_HERE'`
- The Sheet ID is the long string in the URL, not the entire URL

### Issue: "Script not authorized"
- **Solution**: 
  1. Go to Apps Script
  2. Click **Deploy** > **Manage Deployments**
  3. Click the edit icon (pencil) on your deployment
  4. Click **Install** or re-authorize

### Issue: "CORS error" or "Network error"
- **Solution**: 
  - Make sure "Who has access" is set to **"Anyone"**
  - The Web App URL should end with `/exec` (not `/dev`)

### Issue: Data not appearing in sheet
- **Solution**:
  1. Check Apps Script execution log (View > Execution log)
  2. Check for errors in the log
  3. Verify the sheet name matches `SHEET_NAME` in the script (default: "Submissions")
  4. Make sure the sheet tab exists (it will be created automatically)

### Issue: Missing columns for leader feedback
- **Solution**: The script handles dynamic columns. If a leader's ratings don't appear:
   - The columns will be added automatically when that leader's data is submitted
   - You can manually add columns if needed using the header format: `feedback_{LeaderName}_{questionId}`

## Column Structure

The script automatically creates these columns:

### Base Columns (34)
- Metadata (4): submissionId, timestamp, sessionId, completionPercentage
- Wins (6): winsText, quickPicks, learningTeammates, teachingTeammates, learningFollowUp, teachingFollowUp
- Blockers (7): blockerText, blockerTags, inventText, peopleBlockerText, blockedByTeammates, teammateSpecificFeedback, blockerTagsByTeammate
- Culture Pulse (13): 11 rating columns + strongestValue + weakestValue
- Shoutouts (3): shoutoutTeammates, impactTagsByTeammate, shoutoutNotes
- Feedback Base (5): feedbackLeaders, leaderFeedback, leaderStop, leaderKeep, leaderStart
- Culture Protection (1): cultureText

### Dynamic Columns
- Leader Rating Columns: `feedback_{LeaderName}_{questionId}`
  - Example: `feedback_Fahim_clarity`, `feedback_Tashfeen_decision`
  - These are added automatically when data is submitted

## Security Notes

- The Web App URL is public but only accepts POST requests
- Each submission includes a unique `submissionId` for tracking
- The script validates data before writing to the sheet
- Consider adding rate limiting if you expect high volume

## Maintenance

- **View Logs**: Apps Script > Executions (to see submission history)
- **Update Script**: Edit the code and click "Deploy" > "Manage Deployments" > Edit > "New Version"
- **Backup Sheet**: Regularly export your Google Sheet as backup

