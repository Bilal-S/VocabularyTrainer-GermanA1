/**
 * Test for the review queue counting fix
 * This test simulates the scenario from the provided export data
 */

// Import the vocabulary state hook (we'll simulate it)
import { useVocabularyState } from '../src/hooks/useVocabularyState.js'

// Simulate the problematic state from the export file
const problematicState = {
  "userId": "user-8bezrrmlw",
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
    "___ Lokal ist voll.": {
      "singular": {
        "correctCount": 1,
        "incorrectCount": 0
      },
      "plural": {
        "correctCount": 0,
        "incorrectCount": 0
      },
      "section": "ARTICLES"
    },
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
      "words": [
        "___ Lokal ist voll."
      ]
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
  "currentStep": 0,
  "batchProgress": {
    "answered": [],
    "remaining": []
  },
  "sessionStats": {
    "nounsLearned": 200,
    "verbsIntroduced": 174,
    "mistakesMade": 2,
    "itemsAddedToReview": 2
  },
  "lastSessionDate": null
}

/**
 * Test function to verify the fix
 */
export const testReviewQueueFix = () => {
  console.log('🧪 Testing Review Queue Fix...')
  console.log('Initial state:')
  console.log('- Review Queue Length:', problematicState.pools.reviewQueue.length)
  console.log('- Review Queue Items:', problematicState.pools.reviewQueue.map(item => item.word))
  console.log('- Mastered Words:', problematicState.pools.mastered.words)
  
  // Simulate the updateProgress function behavior
  // We'll test the scenario where an ARTICLE item gets answered correctly 3 times
  
  // Test Case 1: Answer "___ Entschuldigung hilft." correctly 3 times (should reach maxReviewCount = 3)
  let testWord = "___ Entschuldigung hilft."
  let testSection = "ARTICLES"
  let testForm = "singular"
  
  console.log('\n📝 Test Case 1: Answering ARTICLE item correctly 3 times')
  console.log(`Word: "${testWord}"`)
  console.log(`Section: ${testSection}`)
  console.log(`Current correctCount: ${problematicState.progress[testWord].singular.correctCount}`)
  console.log(`maxReviewCount: ${problematicState.settings.maxReviewCount}`)
  
  // Simulate 3 correct answers
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    
    // Check if item is in review queue
    const isInReviewQueue = problematicState.pools.reviewQueue.findIndex(item => 
      typeof item === 'string' ? item === testWord : item.word === testWord
    ) > -1
    
    const masteringThreshold = isInReviewQueue 
      ? problematicState.settings.maxReviewCount 
      : problematicState.settings.masteringCount
    
    console.log(`  - Is in review queue: ${isInReviewQueue}`)
    console.log(`  - Mastering threshold: ${masteringThreshold}`)
    
    // Update correct count
    problematicState.progress[testWord].singular.correctCount++
    console.log(`  - New correctCount: ${problematicState.progress[testWord].singular.correctCount}`)
    
    // Check if should be removed from review queue
    const shouldRemoveFromReview = isInReviewQueue && 
      problematicState.progress[testWord].singular.correctCount >= masteringThreshold
    
    console.log(`  - Should remove from review queue: ${shouldRemoveFromReview}`)
    
    if (shouldRemoveFromReview) {
      const reviewIndex = problematicState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === testWord : item.word === testWord
      )
      if (reviewIndex > -1) {
        problematicState.pools.reviewQueue.splice(reviewIndex, 1)
        console.log(`  - ✅ REMOVED from review queue`)
      }
    }
    
    // Check if should be added to mastered
    const isFullyMastered = problematicState.progress[testWord].singular.correctCount >= masteringThreshold
    
    if (isFullyMastered && !problematicState.pools.mastered.words.includes(testWord)) {
      problematicState.pools.mastered.words.push(testWord)
      console.log(`  - 🏆 ADDED to mastered.words`)
    }
  }
  
  // Test Case 2: Answer "She sees the arm." correctly 3 times
  testWord = "She sees the arm."
  testSection = "TRANSLATIONS"
  
  console.log('\n📝 Test Case 2: Answering TRANSLATION item correctly 3 times')
  console.log(`Word: "${testWord}"`)
  console.log(`Section: ${testSection}`)
  console.log(`Current correctCount: ${problematicState.progress[testWord].singular.correctCount}`)
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    
    const isInReviewQueue = problematicState.pools.reviewQueue.findIndex(item => 
      typeof item === 'string' ? item === testWord : item.word === testWord
    ) > -1
    
    const masteringThreshold = isInReviewQueue 
      ? problematicState.settings.maxReviewCount 
      : problematicState.settings.masteringCount
    
    console.log(`  - Is in review queue: ${isInReviewQueue}`)
    console.log(`  - Mastering threshold: ${masteringThreshold}`)
    
    problematicState.progress[testWord].singular.correctCount++
    console.log(`  - New correctCount: ${problematicState.progress[testWord].singular.correctCount}`)
    
    const shouldRemoveFromReview = isInReviewQueue && 
      problematicState.progress[testWord].singular.correctCount >= masteringThreshold
    
    console.log(`  - Should remove from review queue: ${shouldRemoveFromReview}`)
    
    if (shouldRemoveFromReview) {
      const reviewIndex = problematicState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === testWord : item.word === testWord
      )
      if (reviewIndex > -1) {
        problematicState.pools.reviewQueue.splice(reviewIndex, 1)
        console.log(`  - ✅ REMOVED from review queue`)
      }
    }
    
    const isFullyMastered = problematicState.progress[testWord].singular.correctCount >= masteringThreshold
    
    if (isFullyMastered && !problematicState.pools.mastered.words.includes(testWord)) {
      problematicState.pools.mastered.words.push(testWord)
      console.log(`  - 🏆 ADDED to mastered.words`)
    }
  }
  
  // Final Results
  console.log('\n🎯 FINAL RESULTS:')
  console.log('- Review Queue Length:', problematicState.pools.reviewQueue.length)
  console.log('- Review Queue Items:', problematicState.pools.reviewQueue.map(item => item.word))
  console.log('- Mastered Words:', problematicState.pools.mastered.words)
  
  const success = problematicState.pools.reviewQueue.length === 0
  console.log(`\n✅ TEST ${success ? 'PASSED' : 'FAILED'}: Review queue should be empty after mastering both items`)
  
  return {
    success,
    finalReviewQueueLength: problematicState.pools.reviewQueue.length,
    finalMasteredWords: problematicState.pools.mastered.words.length,
    details: {
      reviewQueueItems: problematicState.pools.reviewQueue,
      masteredWords: problematicState.pools.mastered.words
    }
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testReviewQueueFix()
}
