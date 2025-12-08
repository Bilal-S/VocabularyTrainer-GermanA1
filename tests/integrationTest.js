/**
 * Integration test to verify the actual updateProgress function works correctly
 */

import { useVocabularyState } from '../src/hooks/useVocabularyState.js'

// Test the actual hook function
export const testUpdateProgressIntegration = () => {
  console.log('🧪 Testing updateProgress Integration...')
  
  // Initialize the hook
  const { updateProgress, state } = useVocabularyState()
  
  // Import the problematic state
  const importData = {
    "userId": "user-test-123",
    "settings": {
      "masteringCount": 1,
      "maxReviewBatchSize": 50,
      "maxReviewCount": 3,
      "maxVocabularyQuestions": 20,
      "maxPluralQuestions": 20,
      "maxArticlesQuestions": 30,
      "maxTranslationsQuestions": 30,
      "maxVerbsQuestions": 30
    },
    "progress": {
      "___ Entschuldigung hilft.": {
        "singular": {
          "correctCount": 0,
          "incorrectCount": 1
        },
        "plural": {
          "correctCount": 0,
          "incorrectCount": 0
        },
        "section": "ARTICLES"
      },
      "She sees the arm.": {
        "singular": {
          "correctCount": 0,
          "incorrectCount": 1
        },
        "plural": {
          "correctCount": 0,
          "incorrectCount": 0
        },
        "section": "TRANSLATIONS"
      }
    },
    "pools": {
      "mastered": {
        "nouns": [],
        "verbs": [],
        "words": []
      },
      "reviewQueue": [
        {
          "word": "___ Entschuldigung hilft.",
          "section": "ARTICLES"
        },
        {
          "word": "She sees the arm.",
          "section": "TRANSLATIONS"
        }
      ]
    },
    "currentStep": 1,
    "batchProgress": {
      "answered": [],
      "remaining": []
    },
    "sessionStats": {
      "nounsLearned": 0,
      "verbsIntroduced": 0,
      "mistakesMade": 0,
      "itemsAddedToReview": 0
    }
  }
  
  console.log('Initial state:')
  console.log('- Review Queue Length:', importData.pools.reviewQueue.length)
  console.log('- Review Queue Items:', importData.pools.reviewQueue.map(item => item.word))
  
  // Test: Answer the first item correctly 3 times
  console.log('\n📝 Testing: Answer "___ Entschuldigung hilft." correctly 3 times')
  
  const testWord = "___ Entschuldigung hilft."
  const testSection = "ARTICLES"
  
  // Answer correctly 3 times
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    const newState = updateProgress(testWord, true, testSection, 'singular')
    console.log(`  - Review Queue Length: ${newState.pools.reviewQueue.length}`)
    console.log(`  - Mastered Words: ${newState.pools.mastered.words.length}`)
  }
  
  // Test: Answer the second item correctly 3 times
  console.log('\n📝 Testing: Answer "She sees the arm." correctly 3 times')
  
  const testWord2 = "She sees the arm."
  const testSection2 = "TRANSLATIONS"
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    const newState = updateProgress(testWord2, true, testSection2, 'singular')
    console.log(`  - Review Queue Length: ${newState.pools.reviewQueue.length}`)
    console.log(`  - Mastered Words: ${newState.pools.mastered.words.length}`)
  }
  
  // Final state check
  const finalState = state
  console.log('\n🎯 FINAL STATE:')
  console.log('- Review Queue Length:', finalState.pools.reviewQueue.length)
  console.log('- Review Queue Items:', finalState.pools.reviewQueue.map(item => item.word))
  console.log('- Mastered Words:', finalState.pools.mastered.words)
  
  const success = finalState.pools.reviewQueue.length === 0 && 
                finalState.pools.mastered.words.length === 2
  
  console.log(`\n✅ INTEGRATION TEST ${success ? 'PASSED' : 'FAILED'}`)
  
  return {
    success,
    finalReviewQueueLength: finalState.pools.reviewQueue.length,
    finalMasteredWords: finalState.pools.mastered.words.length,
    details: {
      reviewQueueItems: finalState.pools.reviewQueue,
      masteredWords: finalState.pools.mastered.words
    }
  }
}

// Run if executed directly
if (typeof window === 'undefined') {
  testUpdateProgressIntegration()
}
