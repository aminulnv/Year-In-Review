# Data Collection Summary - Year in Review Form

This document provides a complete rundown of ALL data collected from the form and how it's stored.

## ✅ Complete Data Collection Checklist

### 1. WINS SECTION
- ✅ **winsText** (string) - Main wins description text
- ✅ **quickPicks** (string[]) - Array of selected quick pick IDs, converted to readable labels:
  - "learning" → "Learned something new"
  - "helped" → "Helped someone else level up"
  - "simplified" → "Simplified or improved how we work"
  - "decision" → "Made or backed a tough call"
  - "impact" → "Delivered real impact"
  - "other" → "Something else entirely"
- ✅ **selectedLearningTeammateIds** (string[]) - IDs converted to teammate names
- ✅ **selectedTeachingTeammateIds** (string[]) - IDs converted to teammate names
- ✅ **learningFollowUp** (boolean) - Whether learning follow-up was triggered
- ✅ **teachingFollowUp** (boolean) - Whether teaching follow-up was triggered

### 2. BLOCKERS SECTION
- ✅ **blockerText** (string) - Main blocker description text
- ✅ **selectedTags** (string[]) - Blocker tag IDs converted to readable labels:
  - "process" → "Process"
  - "tools" → "Tools or access"
  - "dependencies" → "Dependencies on others"
  - "decisions" → "Slow or unclear decisions"
  - "scope" → "Scope changing mid-stream"
  - "other" → "Other"
- ✅ **inventText** (string) - Invention/solution text
- ✅ **peopleBlockerText** (string) - People-centric blocker text
- ✅ **selectedTeammates** (string[]) - Teammate IDs converted to names
- ✅ **teammateSpecificFeedback** (Record<string, string>) - Format: "TeammateName: feedback text"
- ✅ **selectedBlockerTagsByTeammate** (Record<string, string[]>) - Format: "TeammateName: tag1, tag2, tag3"
  - Tags converted to readable labels (ownership, reliability, responsiveness, etc.)

### 3. CULTURE PULSE SECTION
- ✅ **ratings** (Record<string, number>) - All 11 ratings (1-10 scale):
  1. **focus** - "Focused on What Matters"
  2. **clarity** - "Clarity & Guidance"
  3. **safety** - "Psychological Safety"
  4. **sustainability** - "Pace & Sustainability"
  5. **energy** - "Energy & Enjoyment"
  6. **growth** - "Growth"
  7. **transparency** - "Decision Transparency"
  8. **motivation** - "Shared Motivation" ⭐ NEW
  9. **trust** - "Trust Within the Team" ⭐ NEW
  10. **confidence** - "Confidence Going Forward" ⭐ NEW
  11. **joy** - "Joy from Work" ⭐ NEW
- ✅ **strongestValue** (string) - Selected core value
- ✅ **weakestValue** (string) - Selected core value

### 4. SHOUTOUTS SECTION
- ✅ **shoutoutSelectedTeammates** (string[]) - Teammate IDs converted to names
- ✅ **selectedImpactByTeammate** (Record<string, string[]>) - Format: "TeammateName: impact1, impact2"
  - Impact tags converted to readable labels:
    - "unblocked" → "Unblocked me"
    - "context" → "Shared context"
    - "clarity" → "Gave clarity"
    - "ownership" → "Took ownership"
    - "forward" → "Moved things forward"
    - "standard" → "Set the standard"
    - "bar" → "Raised the bar"
    - "example" → "Led by example"
- ✅ **noteText** (string) - Additional shoutout notes

### 5. FEEDBACK SECTION (Yearly Feedback for Leaders)
- ✅ **feedbackSelectedLeaders** (string[]) - Leader IDs converted to "Name (Role)" format
- ✅ **feedbackLeaderRatings** (Record<string, Record<string, number>>) - Format: "feedback_{LeaderName}_{questionId}"
  - All 10 questions per leader (1-10 scale):
    1. **clarity** - "Clarity of Expectations"
    2. **decision** - "Decision-Making & Follow-Through"
    3. **fairness** - "Fairness in Evaluation"
    4. **bias** - "Bias Awareness"
    5. **feedback** - "Quality of Feedback"
    6. **coaching** - "Coaching & Growth Support"
    7. **availability** - "Availability & Responsiveness"
    8. **safety** - "Psychological Safety"
    9. **consistency** - "Consistency & Reliability"
    10. **example** - "Leading by Example"
- ✅ **feedbackLeaderFeedback** (Record<string, string>) - Format: "LeaderName (Role): feedback text"
- ✅ **feedbackLeaderStopKeepStart** (Record<string, {stop, keep, start}>) - Format:
  - **leaderStop**: "LeaderName (Role): stop text"
  - **leaderKeep**: "LeaderName (Role): keep text"
  - **leaderStart**: "LeaderName (Role): start text"

### 6. CULTURE PROTECTION SECTION
- ✅ **cultureText** (string) - Culture protection text

### 7. METADATA
- ✅ **submissionId** - Unique submission identifier
- ✅ **timestamp** - ISO timestamp of submission
- ✅ **sessionId** - Session identifier
- ✅ **completionPercentage** - Always 100% on submission

## Data Formatting Rules

### ID to Name Conversions
- **Teammates**: IDs → Names (e.g., "md-ali-chowdhury" → "Ali")
- **Leaders**: IDs → "Name (Role)" (e.g., "sheikh-mohammed-fahim" → "Fahim (HOD)")
- **Tags**: IDs → Readable labels (using mapping dictionaries)

### Nested Data Formatting
- **Teammate-specific data**: "TeammateName: value1, value2 | TeammateName2: value3"
- **Leader-specific data**: "LeaderName (Role): value1 | LeaderName2 (Role): value2"
- **Ratings**: Stored as "rating/10" format (e.g., "7/10")

### Arrays Formatting
- Arrays of IDs converted to comma-separated names
- Arrays of tags converted to comma-separated readable labels

## Google Sheets Column Structure

The data is transformed into flat columns suitable for Google Sheets:

1. **Metadata columns** (4)
2. **Wins columns** (6)
3. **Blockers columns** (7)
4. **Culture Pulse columns** (13: 11 ratings + 2 values)
5. **Shoutouts columns** (3)
6. **Feedback columns** (dynamic based on number of leaders):
   - Base: 5 columns (leaders list, feedback, stop, keep, start)
   - Per leader: 10 rating columns (one per question)
7. **Culture Protection columns** (1)

**Total base columns**: ~34
**Dynamic columns**: +10 per leader selected for feedback

## Verification Checklist

✅ All form sections covered
✅ All IDs converted to readable names
✅ All tags converted to readable labels
✅ All nested structures flattened for Google Sheets
✅ All ratings formatted consistently
✅ All optional fields handled gracefully
✅ Metadata included for tracking

## Next Steps

1. **Set up Google Apps Script**:
   - Create a new Google Apps Script project
   - Deploy as a Web App
   - Update `GOOGLE_APPS_SCRIPT_URL` in `src/services/googleSheetsService.ts`

2. **Google Sheets Setup**:
   - Create a Google Sheet
   - Set up columns based on the structure above
   - Configure the Apps Script to write to the sheet

3. **Test Submission**:
   - Fill out a complete form
   - Submit and verify data appears correctly in Google Sheets
   - Check all columns are populated correctly

