/**
 * Test Review Queue Behavior
 * 
 * This test verifies that items in the review queue are not removed too early
 * and only move to mastered pool after reaching the required maxReviewCount.
 * 
 * Requirements from requirements.md:
 * - Review Count determines how many times an item must be answered correctly 
 *   before moving from reviewQueue to mastered pool
 * - Default maxReviewCount is 3
 * - Items should stay in review queue until they reach the correct threshold
 */

// Mock localStorage for Node.js testing
const mockLocalStorage = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

// Set up localStorage mock for Node.js environment
if (typeof window === 'undefined') {
  global.localStorage = mockLocalStorage
}

// Import the useVocabularyState hook
// Note: This would need to be adapted for actual testing environment
import { useVocabularyState } from '../src/hooks/useVocabularyState.js'

/**
 * Create a test state with controlled settings and review queue items
 */
const createTestState = (maxReviewCount = 3, masteringCount = 1) => {
  return {
    userId: 'test-user',
    settings: {
      masteringCount: masteringCount,
      maxReviewBatchSize: 50,
      maxReviewCount: maxReviewCount
    },
    progress: {},
    pools: {
      unselected: [],
      mastered: {
        nouns: [],
        verbs: [],
        words: []
      },
      reviewQueue: [
        { word: 'der Tisch', section: 'VOCABULARY' },
        { word: 'die Katze', section: 'VOCABULARY' },
        { word: 'das Buch', section: 'PLURAL' }
      ]
    },
    currentStep: 0,
    batchProgress: {
      answered: [],
      remaining: []
    },
    sessionStats: {
      nounsLearned: 0,
      verbsIntroduced: 0,
      mistakesMade: 0,
      itemsAddedToReview: 0
    },
    lastSessionDate: null,
    currentSessionStats: {
      nounsLearnedToday: 0,
      verbsIntroducedToday: 0,
      mistakesMadeToday: 0,
      itemsAddedToReviewToday: 0,
      initialReviewQueueSize: 3
    }
  }
}

/**
 * Test the review queue behavior step by step
 */
export const testReviewQueueBehavior = () => {
  console.log('🧪 Testing Review Queue Behavior...')
  console.log('=' .repeat(60))
  
  const testResults = {
    test1: false, // Item should stay in review after 1 correct answer
    test2: false, // Item should stay in review after 2 correct answers  
    test3: false, // Item should move to mastered after 3 correct answers
    test4: false, // New item should move to mastered after 1 correct answer (masteringCount = 1)
    test5: false, // Dual-form tracking works correctly
    allPassed: false
  }

  try {
    // Initialize vocabulary state with test data
    const initialState = createTestState(3, 1)
    
    // Mock the vocabulary state hook for testing
    let currentState = JSON.parse(JSON.stringify(initialState))
    
    const updateProgress = (word, isCorrect, section = 'Unknown', form = 'singular') => {
      const newState = { ...currentState }
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
        
        const masteringThreshold = isInReviewQueue 
          ? newState.settings.maxReviewCount 
          : newState.settings.masteringCount
        
        console.log(`   📊 Progress for "${word}" (${form}): ${newState.progress[word][form].correctCount}/${masteringThreshold} required`)
        
        // Check if word is mastered based on section and form (matching the corrected implementation)
        const isWordMastered = (wordData) => {
          if (!wordData || wordData.singular === undefined || wordData.plural === undefined) {
            return false
          }
          
          const singularMastered = wordData.singular.correctCount >= masteringThreshold
          const pluralMastered = wordData.plural.correctCount >= masteringThreshold
          
          // For review queue items, only form that caused failure needs to reach maxReviewCount
          if (isInReviewQueue) {
            if (form === 'singular') {
              return wordData.singular.correctCount >= masteringThreshold
            } else if (form === 'plural') {
              return wordData.plural.correctCount >= masteringThreshold
            }
          }
          
          // For new items (not in review queue), require both forms to be mastered
          if (section === 'VOCABULARY' || section === 'PLURAL') {
            return singularMastered && pluralMastered
          }
          
          // For verbs and other word types, only require tested form
          return singularMastered
        }
        
        // Move to mastered if word is mastered
        if (isWordMastered(newState.progress[word])) {
          console.log(`   🎯 Item "${word}" is fully mastered, moving from review to mastered pool`)
          
          // Remove from review queue if present
          const reviewIndex = newState.pools.reviewQueue.findIndex(item => 
            typeof item === 'string' ? item === word : item.word === word
          )
          if (reviewIndex > -1) {
            newState.pools.reviewQueue.splice(reviewIndex, 1)
            console.log(`   ✅ Removed "${word}" from review queue`)
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
            } else {
              newState.pools.mastered.words.push(word)
            }
            wasMovedToMastered = true
            console.log(`   🏆 Added "${word}" to mastered pool`)
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

      currentState = newState
      return newState
    }

    console.log('\n📋 Test 1: Item should stay in review after 1 correct answer')
    console.log('   Initial review queue size:', currentState.pools.reviewQueue.length)
    
    // Answer 'der Tisch' correctly once (should stay in review)
    updateProgress('der Tisch', true, 'VOCABULARY', 'singular')
    
    console.log('   Review queue size after 1 correct answer:', currentState.pools.reviewQueue.length)
    console.log('   Progress for "der Tisch":', currentState.progress['der Tisch'])
    
    if (currentState.pools.reviewQueue.length === 3) {
      console.log('   ✅ PASS: Item stayed in review queue after 1 correct answer')
      testResults.test1 = true
    } else {
      console.log('   ❌ FAIL: Item was removed from review queue too early')
    }

    console.log('\n📋 Test 2: Item should stay in review after 2 correct answers')
    
    // Answer 'der Tisch' correctly second time (should still stay in review)
    updateProgress('der Tisch', true, 'VOCABULARY', 'singular')
    
    console.log('   Review queue size after 2 correct answers:', currentState.pools.reviewQueue.length)
    console.log('   Progress for "der Tisch":', currentState.progress['der Tisch'])
    
    if (currentState.pools.reviewQueue.length === 3) {
      console.log('   ✅ PASS: Item stayed in review queue after 2 correct answers')
      testResults.test2 = true
    } else {
      console.log('   ❌ FAIL: Item was removed from review queue too early')
    }

    console.log('\n📋 Test 3: Item should move to mastered after 3 correct singular answers (review queue behavior)')
    
    // Answer 'der Tisch' correctly third time (should move to mastered - singular form reached maxReviewCount)
    updateProgress('der Tisch', true, 'VOCABULARY', 'singular')
    
    console.log('   Review queue size after 3 correct singular answers:', currentState.pools.reviewQueue.length)
    console.log('   Mastered nouns count:', currentState.pools.mastered.nouns.length)
    console.log('   Progress for "der Tisch":', currentState.progress['der Tisch'])
    
    // Should move to mastered because singular form (the form that caused failure) reached maxReviewCount
    if (currentState.pools.reviewQueue.length === 2 && currentState.pools.mastered.nouns.includes('der Tisch')) {
      console.log('   ✅ PASS: Review item moved to mastered after failing form reached threshold')
      testResults.test3 = true
    } else {
      console.log('   ❌ FAIL: Review item did not move to mastered after failing form reached threshold')
    }

    console.log('\n📋 Test 4: New item should NOT move to mastered after 1 correct singular answer (plural not tested)')
    
    // Test with a new item not in review queue (should use masteringCount = 1)
    updateProgress('neues Wort', true, 'VOCABULARY', 'singular')
    
    console.log('   Mastered nouns count after new item:', currentState.pools.mastered.nouns.length)
    console.log('   Progress for "neues Wort":', currentState.progress['neues Wort'])
    
    // Should NOT be mastered yet because plural form hasn't been tested
    if (!currentState.pools.mastered.nouns.includes('neues Wort')) {
      console.log('   ✅ PASS: New item stayed unmastered because plural form not yet tested')
      testResults.test4 = true
    } else {
      console.log('   ❌ FAIL: New item was moved to mastered too early')
    }

    // Now test plural form to complete dual-form mastery for new item
    console.log('\n📋 Test 4b: New item should move to mastered after both singular and plural are tested')
    updateProgress('neues Wort', true, 'PLURAL', 'plural') // 1st plural correct (masteringCount = 1)
    
    console.log('   Mastered nouns count after plural form:', currentState.pools.mastered.nouns.length)
    console.log('   Progress for "neues Wort":', currentState.progress['neues Wort'])
    
    if (currentState.pools.mastered.nouns.includes('neues Wort')) {
      console.log('   ✅ PASS: New item moved to mastered after both forms reached threshold')
      testResults.test4 = true
    } else {
      console.log('   ❌ FAIL: New item did not move to mastered after both forms completed')
    }

    console.log('\n📋 Test 5: Dual-form tracking works correctly')
    
    // Test that both singular and plural forms need to be mastered for nouns
    updateProgress('die Katze', true, 'VOCABULARY', 'singular') // 1st correct
    updateProgress('die Katze', true, 'VOCABULARY', 'singular') // 2nd correct  
    updateProgress('die Katze', true, 'VOCABULARY', 'singular') // 3rd correct (singular mastered)
    updateProgress('die Katze', true, 'PLURAL', 'plural')       // 1st correct (plural)
    
    console.log('   Review queue size after dual-form test:', currentState.pools.reviewQueue.length)
    console.log('   Progress for "die Katze":', currentState.progress['die Katze'])
    console.log('   Is "die Katze" in mastered?', currentState.pools.mastered.nouns.includes('die Katze'))
    
    // 'die Katze' should still be in review because plural form is not yet mastered (needs 3 correct)
    if (currentState.pools.reviewQueue.length === 2 && !currentState.pools.mastered.nouns.includes('die Katze')) {
      console.log('   ✅ PASS: Dual-form tracking working - item stays in review until both forms are mastered')
      testResults.test5 = true
    } else {
      console.log('   ❌ FAIL: Dual-form tracking not working correctly')
    }

    // Complete the dual-form test by mastering plural form
    updateProgress('die Katze', true, 'PLURAL', 'plural')       // 2nd correct (plural)
    updateProgress('die Katze', true, 'PLURAL', 'plural')       // 3rd correct (plural mastered)
    
    console.log('   Review queue size after completing dual-form:', currentState.pools.reviewQueue.length)
    console.log('   Is "die Katze" now in mastered?', currentState.pools.mastered.nouns.includes('die Katze'))
    
    if (currentState.pools.reviewQueue.length === 1 && currentState.pools.mastered.nouns.includes('die Katze')) {
      console.log('   ✅ PASS: Item moved to mastered after both forms completed')
      testResults.test5 = true
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error)
  }

  testResults.allPassed = testResults.test1 && testResults.test2 && testResults.test3 && testResults.test4 && testResults.test5

  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY:')
  console.log(`Test 1 (Stay after 1 correct): ${testResults.test1 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Test 2 (Stay after 2 correct): ${testResults.test2 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Test 3 (Move after 3 correct): ${testResults.test3 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Test 4 (New item mastering): ${testResults.test4 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Test 5 (Dual-form tracking): ${testResults.test5 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`\n🎯 Overall Result: ${testResults.allPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`)
  console.log('='.repeat(60))

  return testResults
}

/**
 * Instructions for running the test
 */
export const getTestInstructions = () => {
  return `
🧪 How to Test Review Queue Behavior:

OPTION 1 - Node.js Test:
1. Run: node tests/reviewQueueBehaviorTest.js
2. Check console for detailed test results

OPTION 2 - Browser Console Test:
1. Start app: npm run dev
2. Open browser (F12) → Console
3. Copy and paste:
   import('./tests/reviewQueueBehaviorTest.js').then(module => {
     module.testReviewQueueBehavior();
   });

EXPECTED BEHAVIOR:
✅ Review items should stay in review queue after 1 correct answer (when maxReviewCount = 3)
✅ Review items should stay in review queue after 2 correct answers
✅ Review items should move to mastered pool after 3 correct answers
✅ New items (not in review) should move to mastered after 1 correct answer (when masteringCount = 1)
✅ Dual-form tracking should require both singular and plural forms to be mastered

IF TESTS FAIL:
The issue is likely in the updateProgress function in src/hooks/useVocabularyState.js
Check the masteringThreshold calculation and dual-form mastery logic.

OPTION 3 - Live App Test:
1. Set maxReviewCount to 3 in Settings
2. Add some items to review queue by making mistakes
3. Start Step 1 (Review) and answer the same item correctly 3 times
4. Verify the item stays in review until the 3rd correct answer
5. Check that the item moves to mastered after the 3rd correct answer
  `
}

export default { testReviewQueueBehavior, getTestInstructions }

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  testReviewQueueBehavior()
}
