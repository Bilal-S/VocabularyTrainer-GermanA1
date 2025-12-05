import { validationService } from '../src/services/answerProcessors/validationService.js'

/**
 * Test synonym validation functionality
 * Run this to verify the synonym fix is working
 */
export const testSynonymValidation = () => {
  console.log('🧪 Testing synonym validation...')
  
  // Test case 1: "das Ticket" should be accepted for "ticket"
  const testCase1 = {
    userAnswer: 'das Ticket',
    correctAnswer: 'die Fahrkarte',
    type: 'noun',
    exercise: {
      english: 'ticket',
      type: 'noun'
    }
  }
  
  const result1 = validationService.validateAnswer(
    testCase1.userAnswer,
    testCase1.correctAnswer,
    testCase1.type,
    testCase1.exercise
  )
  
  console.log(`Test 1 - "das Ticket" for "ticket": ${result1 ? '✅ PASS' : '❌ FAIL'}`)
  
  // Test case 2: "die Fahrkarte" should be accepted for "ticket"
  const testCase2 = {
    userAnswer: 'die Fahrkarte',
    correctAnswer: 'das Ticket',
    type: 'noun',
    exercise: {
      english: 'ticket',
      type: 'noun'
    }
  }
  
  const result2 = validationService.validateAnswer(
    testCase2.userAnswer,
    testCase2.correctAnswer,
    testCase2.type,
    testCase2.exercise
  )
  
  console.log(`Test 2 - "die Fahrkarte" for "ticket": ${result2 ? '✅ PASS' : '❌ FAIL'}`)
  
  // Test case 3: Test synonym lookup directly
  const synonyms = validationService.getSynonyms('ticket')
  console.log(`Synonyms for "ticket":`, synonyms.map(s => s.german))
  
  // Test case 4: Check if two words are synonyms
  const areSynonyms = validationService.areSynonyms('das Ticket', 'die Fahrkarte', 'ticket')
  console.log(`Are "das Ticket" and "die Fahrkarte" synonyms for "ticket": ${areSynonyms ? '✅ YES' : '❌ NO'}`)
  
  // Test case 5: Test exact match still works
  const test5 = validationService.validateAnswer(
    'das Ticket',
    'das Ticket',
    'noun',
    { english: 'ticket', type: 'noun' }
  )
  console.log(`Test 5 - Exact match "das Ticket": ${test5 ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = result1 && result2 && areSynonyms && test5
  
  console.log(`\n📊 Summary: ${allPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`)
  
  return {
    test1: result1,
    test2: result2,
    synonyms: synonyms,
    areSynonyms: areSynonyms,
    test5: test5,
    allPassed: allPassed
  }
}

/**
 * Instructions for running the test
 */
export const getTestInstructions = () => {
  return `
🧪 How to Test Synonym Validation Fix:

OPTION 1 - Node.js Test:
1. Run: node tests/validationTest.js
2. Check console for test results

OPTION 2 - Browser Console Test:
1. Start app: npm run dev
2. Open browser (F12) → Console
3. Copy and paste:
   import('./tests/validationTest.js').then(module => {
     module.testSynonymValidation();
   });

EXPECTED RESULTS:
✅ "das Ticket" should be accepted when system expects "die Fahrkarte"
✅ "die Fahrkarte" should be accepted when system expects "das Ticket"
✅ Both words should appear in synonyms list for "ticket"
✅ Cross-synonym validation should return true
✅ Exact matching should still work

OPTION 3 - Live App Test:
1. Go to Step 2 (Vocabulary practice)
2. When asked for translation of "ticket", answer "das Ticket"
3. Should be marked as correct even if system expected "die Fahrkarte"
  `
}

export default { testSynonymValidation, getTestInstructions }

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  testSynonymValidation()
}
