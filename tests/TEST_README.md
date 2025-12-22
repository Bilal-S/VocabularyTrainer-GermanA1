# German A1 Coach - Full Flow Test

This test suite validates the complete functionality of the German A1 Coach application by simulating two consecutive days of learning and verifying all aspects of the application flow.

## Overview

The test simulates realistic user behavior across two days:
- **Day 1**: Fresh start with empty state, no review queue
- **Day 2**: Continues with review queue from previous mistakes

## Test Coverage

### ✅ Components Tested
1. **State Management**
   - Progress tracking for singular/plural forms
   - Pool management (unselected, mastered, reviewQueue)
   - Session statistics

2. **Daily Routine Flow**
   - 7-step daily routine progression
   - Batch and single question handling
   - Answer processing and feedback

3. **Vocabulary Management**
   - Exercise generation for each step
   - Answer validation
   - Mastery checking

4. **Progress Service**
   - Step completion detection
   - Progress calculation

### 🎯 Key Validation Points
- Progress tracking accuracy across days
- Review queue population and processing
- State persistence integrity
- Final progress summary numbers
- Mastery threshold behavior

## Running the Tests

### Prerequisites
- Node.js (version 14 or higher)
- No additional dependencies required (uses Node.js built-in `assert` module)

### Execute Test
```bash
# From project root directory
node tests/runDailyRoutineTest.js
```

### Alternative Execution
```bash
# Direct execution
node tests/dailyRoutineTest.js
```

## Test Structure

```
tests/
├── dailyRoutineTest.js         # Main test runner
├── runDailyRoutineTest.js      # Executable test script
├── mocks/                      # Browser API mocks
│   ├── localStorage.js         # localStorage mock
│   ├── document.js             # Document API mock
│   └── window.js               # Window API mock
└── TEST_README.md              # This file
```

## Test Scenarios

### Day 1: Fresh Start
- **Initial State**: Empty pools, no progress
- **Expected Behavior**: Skip Step 1 (empty review queue), start with Step 2
- **Expected Results**: 
  - 10 new nouns introduced
  - 5+ verbs introduced
  - 3-25 items added to review queue
  - 0 mastered items
  - 3-30 mistakes made

### Day 2: With Review Queue
- **Initial State**: Day 1 state with review queue
- **Expected Behavior**: Process Step 1 (review), then continue with new content
- **Expected Results**:
  - 10 additional nouns introduced (20 total)
  - 5+ additional verbs introduced (10+ total)
  - 0+ items mastered
  - Reduced review queue size
  - Cumulative 10-60 mistakes

## User Behavior Simulation

The test simulates realistic user behavior with:

### Answer Patterns
- **Vocabulary**: 70% correct rate
- **Review**: 60% correct rate
- **Plural**: 65% correct rate
- **Articles**: 70% correct rate
- **Translations**: 75% correct rate
- **Verbs**: 80% correct rate

### Error Patterns
- **Umlaut errors**: 15% chance
- **Article errors**: 10% chance
- **Spelling errors**: 5% chance

### Response Delays
- Simulates thinking time: 2-8 seconds per answer
- Realistic batch completion patterns

## Validation Rules

### Progress Tracking
- Correct answers increment `correctCount`
- Incorrect answers increment `incorrectCount` and add to review queue
- Both singular and plural forms tracked separately
- Mastery thresholds respected

### State Persistence
- State saved to localStorage after each action
- State loaded correctly on restart
- Session stats preserved between days
- Settings maintained across sessions

### Flow Validation
- Steps progress in correct order (1-7)
- Batch completion detected properly
- Automatic advancement when complete
- Review queue processed before new content

## Expected Output

### Success Case
```
🇩🇪 German A1 Coach - Two Day Flow Test
✅ All tests passed successfully!

📋 TEST REPORT
============================================================
📊 SUMMARY:
   ✅ Passed: 15
   ❌ Failed: 0
   📈 Success Rate: 100.0%

📈 DAY 1 RESULTS:
   Nouns learned: 10
   Verbs introduced: 5
   Items added to review: 7
   Mistakes made: 18
   Mastered items: 0

📈 DAY 2 RESULTS:
   Nouns learned: 10
   Verbs introduced: 5
   Items added to review: 4
   Mistakes made: 16
   Mastered items: 0
   Review queue size: 11

📈 CUMULATIVE RESULTS:
   Total nouns: 20
   Total verbs: 10
   Total mistakes: 34
   Final review queue: 11
   Final mastered: 0
============================================================
```

### Failure Case
If any test fails, the output will show:
- Which specific assertions failed
- Expected vs actual values
- Detailed error messages
- Success rate percentage

## Troubleshooting

### Common Issues
1. **Module Import Errors**: Ensure running from project root
2. **Vocabulary Data Missing**: Check `src/data/vocabulary/` files exist
3. **Test Timeouts**: Increase delays in user simulator
4. **Assertion Failures**: Review expected ranges in test scenarios

### Debug Mode
Add console logging to test files for detailed execution tracing:
```javascript
console.log('Debug:', { variable: value })
```

## Technical Notes

### Mock Implementation
- Uses lightweight browser API mocks
- localStorage simulated in memory
- Document/Window APIs stubbed for Node.js

### Test Isolation
- Each test run uses fresh state
- No interference between test scenarios
- Clean state management

### Performance
- Tests run in under 30 seconds
- Minimal memory footprint
- No external dependencies

## German Language Specific Tests

The test suite includes German-specific validations:
- Umlaut handling (ä, ö, ü, ß)
- Article system (der, die, das)
- Case system (Nominative, Accusative, Dative)
- Plural forms
- Verb conjugations

This comprehensive test suite ensures the German A1 Coach application works correctly across all major functionality areas and provides confidence in the reliability of progress tracking, state management, and user flow.
