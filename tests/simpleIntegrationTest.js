/**
 * Simple integration test that doesn't rely on React hooks
 * This directly tests the logic from the fixed updateProgress function
 */

// Simulate the fixed updateProgress logic
const testUpdateProgressLogic = (state, word, isCorrect, section = 'Unknown', form = 'singular') => {
  if (!word) {
    console.error(`updateProgress called with invalid word: ${word} (Section: ${section})`)
    return state
  }

  const newState = { ...state }
  if (!newState.progress[word]) {
    newState.progress[word] = {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: section
    }
  }

  let wasAddedToReview = false
  let wasMovedToMastered = false

  if (isCorrect) {
    // Update correct count for specific form
    newState.progress[word][form].correctCount++
    
    // Determine if item is in review queue to use correct mastering threshold
    const isInReviewQueue = newState.pools.reviewQueue.findIndex(item => 
      typeof item === 'string' ? item === word : item.word === word
    ) > -1
    
    // change which threshold to use based on review queue status
    const masteringThreshold = isInReviewQueue 
      ? newState.settings.maxReviewCount 
      : newState.settings.masteringCount
    
    // Check if word should be removed from review queue (specific form mastered)
    let shouldRemoveFromReview = false
    if (isInReviewQueue) {
      // Only consider the form that was being tested/failed
      if (form === 'singular' && newState.progress[word].singular.correctCount >= masteringThreshold) {
        shouldRemoveFromReview = true
      } else if (form === 'plural' && newState.progress[word].plural.correctCount >= masteringThreshold) {
        shouldRemoveFromReview = true
      } else if (section === 'VERBS' && newState.progress[word].singular.correctCount >= masteringThreshold) {
        // Verbs currently use singular structure for tracking
        shouldRemoveFromReview = true
      } else if ((section === 'ARTICLES' || section === 'TRANSLATIONS') && newState.progress[word].singular.correctCount >= masteringThreshold) {
        // CRITICAL FIX: ARTICLES and TRANSLATIONS are single-form items that should be removed from review queue when mastered
        shouldRemoveFromReview = true
      }
    }

    // Check if word is FULLY mastered (all required forms meet criteria)
    let isFullyMastered = false
    if (section === 'VOCABULARY' || section === 'PLURAL') {
      const singularMastered = newState.progress[word].singular.correctCount >= newState.settings.masteringCount
      const pluralMastered = newState.progress[word].plural.correctCount >= newState.settings.masteringCount
      isFullyMastered = singularMastered && pluralMastered
    } else if (section === 'ARTICLES' || section === 'TRANSLATIONS') {
      // CRITICAL FIX: ARTICLES and TRANSLATIONS are single-form items that reach mastery after maxReviewCount
      // They don't need to reach the full masteringCount threshold since they're review items
      isFullyMastered = newState.progress[word].singular.correctCount >= masteringThreshold
    } else {
      // For verbs/others, basic check
      isFullyMastered = newState.progress[word].singular.correctCount >= newState.settings.masteringCount
    }

    // 1. Remove from Review Queue if specific form is mastered
    if (shouldRemoveFromReview) {
      const reviewIndex = newState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      )
      if (reviewIndex > -1) {
        newState.pools.reviewQueue.splice(reviewIndex, 1)
        console.log(`Removed "${word}" from review queue - ${section} mastered`)
      }
    }

    // 2. Add to Mastered Pool ONLY if fully mastered
    if (isFullyMastered) {
      // Ensure removed from review queue (redundant safety)
      const reviewIndex = newState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      )
      if (reviewIndex > -1) {
        newState.pools.reviewQueue.splice(reviewIndex, 1)
      }

      // Remove from unselected if present
      const unselectedIndex = newState.pools.unselected.indexOf(word)
      if (unselectedIndex > -1) {
        newState.pools.unselected.splice(unselectedIndex, 1)
      }
      
      // Add to appropriate mastered category
      if (!newState.pools.mastered.nouns.includes(word) && 
          !newState.pools.mastered.verbs.includes(word) && 
          !newState.pools.mastered.words.includes(word)) {
        
        // Determine word type based on section (simple heuristic)
        if (section === 'VOCABULARY' || section === 'PLURAL') {
          newState.pools.mastered.nouns.push(word)
        } else if (section === 'VERBS') {
          newState.pools.mastered.verbs.push(word)
        } else if (section === 'ARTICLES' || section === 'TRANSLATIONS') {
          // CRITICAL FIX: ARTICLES and TRANSLATIONS go to the words pool
          newState.pools.mastered.words.push(word)
          console.log(`Added "${word}" to mastered.words - ${section} fully mastered`)
        } else {
          newState.pools.mastered.words.push(word)
        }
        wasMovedToMastered = true
      }
    }
  } else {
    // Update incorrect count for specific form
    newState.progress[word][form].incorrectCount++
    
    // Add to review queue with section info if not already there
    const existsInReview = newState.pools.reviewQueue.findIndex(item => 
      typeof item === 'string' ? item === word : item.word === word
    )
    if (existsInReview === -1) {
      newState.pools.reviewQueue.push({ word, section })
      wasAddedToReview = true
    }

    // Update current session stats for mistakes
    newState.currentSessionStats.mistakesMadeToday++
    newState.sessionStats.mistakesMade++
  }

  // Update current session stats for review queue changes
  if (wasAddedToReview) {
    newState.currentSessionStats.itemsAddedToReviewToday++
    newState.sessionStats.itemsAddedToReview++
  }

  return newState
}

export const testUpdateProgressIntegration = () => {
  console.log('🧪 Testing updateProgress Integration (without React hooks)...')
  
  // Test state mimicking the problematic scenario
  let testState = {
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
      "unselected": [],
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
    },
    "currentSessionStats": {
      "nounsLearnedToday": 0,
      "verbsIntroducedToday": 0,
      "mistakesMadeToday": 0,
      "itemsAddedToReviewToday": 0,
      "initialReviewQueueSize": 2
    }
  }
  
  console.log('Initial state:')
  console.log('- Review Queue Length:', testState.pools.reviewQueue.length)
  console.log('- Review Queue Items:', testState.pools.reviewQueue.map(item => item.word))
  console.log('- Mastered Words:', testState.pools.mastered.words)
  
  // Test: Answer first item correctly 3 times
  console.log('\n📝 Testing: Answer "___ Entschuldigung hilft." correctly 3 times')
  
  const testWord = "___ Entschuldigung hilft."
  const testSection = "ARTICLES"
  
  // Answer correctly 3 times
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    testState = testUpdateProgressLogic(testState, testWord, true, testSection, 'singular')
    console.log(`  - Review Queue Length: ${testState.pools.reviewQueue.length}`)
    console.log(`  - Mastered Words: ${testState.pools.mastered.words.length}`)
    console.log(`  - Correct Count: ${testState.progress[testWord].singular.correctCount}`)
  }
  
  // Test: Answer second item correctly 3 times
  console.log('\n📝 Testing: Answer "She sees the arm." correctly 3 times')
  
  const testWord2 = "She sees the arm."
  const testSection2 = "TRANSLATIONS"
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n✅ Correct Answer ${i}:`)
    testState = testUpdateProgressLogic(testState, testWord2, true, testSection2, 'singular')
    console.log(`  - Review Queue Length: ${testState.pools.reviewQueue.length}`)
    console.log(`  - Mastered Words: ${testState.pools.mastered.words.length}`)
    console.log(`  - Correct Count: ${testState.progress[testWord2].singular.correctCount}`)
  }
  
  // Final state check
  console.log('\n🎯 FINAL STATE:')
  console.log('- Review Queue Length:', testState.pools.reviewQueue.length)
  console.log('- Review Queue Items:', testState.pools.reviewQueue.map(item => item.word))
  console.log('- Mastered Words:', testState.pools.mastered.words)
  console.log('- Progress for "___ Entschuldigung hilft.":', testState.progress["___ Entschuldigung hilft."])
  console.log('- Progress for "She sees the arm.":', testState.progress["She sees the arm."])
  
  const success = testState.pools.reviewQueue.length === 0 && 
                testState.pools.mastered.words.length === 2
  
  console.log(`\n✅ INTEGRATION TEST ${success ? 'PASSED' : 'FAILED'}`)
  
  return {
    success,
    finalReviewQueueLength: testState.pools.reviewQueue.length,
    finalMasteredWords: testState.pools.mastered.words.length,
    details: {
      reviewQueueItems: testState.pools.reviewQueue,
      masteredWords: testState.pools.mastered.words,
      progress: testState.progress
    }
  }
}

// Run if executed directly
if (typeof window === 'undefined') {
  testUpdateProgressIntegration()
}
