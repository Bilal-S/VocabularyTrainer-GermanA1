import { validationService } from './validationService.js'

/**
 * Test synonym validation functionality
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
  
  return {
    test1: result1,
    test2: result2,
    synonyms: synonyms,
    areSynonyms: areSynonyms
  }
}

export default { testSynonymValidation }
