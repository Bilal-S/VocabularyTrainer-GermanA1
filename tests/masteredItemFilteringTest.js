/**
 * Test suite for mastered item filtering functionality
 * This test verifies that already mastered items are not shown in exercises
 */

import { VocabularyManager } from '../src/utils/vocabularyManager.js'

// Mock state for testing
const createMockState = (progress = {}, masteredWords = [], reviewQueue = []) => {
  return {
    settings: {
      masteringCount: 3,
      maxReviewCount: 3,
      maxVocabularyQuestions: 20,
      maxPluralQuestions: 20,
      maxArticlesQuestions: 30,
      maxTranslationsQuestions: 30,
      maxVerbsQuestions: 30
    },
    progress,
    pools: {
      mastered: {
        nouns: masteredWords,
        verbs: [],
        words: []
      },
      reviewQueue,
      unselected: []
    }
  }
}

// Test data setup
const testNouns = [
  { german: 'der Tisch', english: 'table', plural: 'die Tische', gender: 'masculine' },
  { german: 'die Lampe', english: 'lamp', plural: 'die Lampen', gender: 'feminine' },
  { german: 'das Buch', english: 'book', plural: 'die Bücher', gender: 'neuter' }
]

const testArticles = [
  { german: '___ ist da.', english: 'is there', caseType: 'nominative' },
  { german: '___ sehe ich.', english: 'I see', caseType: 'accusative' },
  { german: '___ helfe ich.', english: 'I help', caseType: 'dative' }
]

const testTranslations = [
  { german: 'Ich komme aus Deutschland.', english: 'I come from Germany', caseType: 'nominative' },
  { german: 'Er liest ein Buch.', english: 'He reads a book', caseType: 'accusative' },
  { german: 'Sie gibt mir das Buch.', english: 'She gives me the book', caseType: 'dative' }
]

/**
 * Test Step 2: Vocabulary - should filter out mastered singular forms
 */
export const testVocabularyFiltering = () => {
  console.log('🧪 Testing Step 2: Vocabulary Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Mock getAllNounsFromAllLetters to return our test data
  const originalGetAllNouns = vocabManager.constructor.prototype.getAllNounsFromAllLetters
  vocabManager.constructor.prototype.getAllNounsFromAllLetters = function(exclude = []) {
    return testNouns.filter(noun => !exclude.includes(noun.german))
  }
  
  // Test Case 1: No mastered items - should return all nouns
  console.log('\n📝 Test Case 1: No mastered items')
  const state1 = createMockState()
  const batch1 = vocabManager.generateVocabularyBatch([], 20, state1)
  
  console.log('Results:', {
    batchSize: batch1.length,
    expectedCount: 3, // All test nouns should be available
    actualCount: batch1.length,
    passed: batch1.length === 3
  })
  
  // Test Case 2: Some mastered singular forms
  console.log('\n📝 Test Case 2: Some mastered singular forms')
  const progress2 = {
    'der Tisch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: 'VOCABULARY'
    }
  }
  const state2 = createMockState(progress2, ['der Tisch'])
  const batch2 = vocabManager.generateVocabularyBatch([], 20, state2)
  
  console.log('Results:', {
    masteredSingular: ['der Tisch'],
    excludedNouns: ['der Tisch'],
    expectedCount: 2, // Should exclude mastered singular form
    actualCount: batch2.length,
    passed: batch2.length === 2 && !batch2.some(item => item.german === 'der Tisch')
  })
  
  // Test Case 3: All singular forms mastered
  console.log('\n📝 Test Case 3: All singular forms mastered')
  const progress3 = {
    'der Tisch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: 'VOCABULARY'
    },
    'die Lampe': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: 'VOCABULARY'
    },
    'das Buch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: 'VOCABULARY'
    }
  }
  const state3 = createMockState(progress3, ['der Tisch', 'die Lampe', 'das Buch'])
  const batch3 = vocabManager.generateVocabularyBatch([], 20, state3)
  
  console.log('Results:', {
    allMasteredSingular: ['der Tisch', 'die Lampe', 'das Buch'],
    expectedCount: 0, // Should exclude all since all mastered
    actualCount: batch3.length,
    passed: batch3.length === 0
  })
  
  // Restore original method
  vocabManager.constructor.prototype.getAllNounsFromAllLetters = originalGetAllNouns
  
  return {
    test1: { passed: batch1.length === 3, details: 'All nouns should be available' },
    test2: { passed: batch2.length === 2 && !batch2.some(item => item.german === 'der Tisch'), details: 'Should exclude mastered singular form' },
    test3: { passed: batch3.length === 0, details: 'Should exclude all when all mastered' }
  }
}

/**
 * Test Step 3: Plural - should filter out mastered plural forms
 */
export const testPluralFiltering = () => {
  console.log('\n🧪 Testing Step 3: Plural Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Mock getAllNounsFromAllLetters to return our test data
  const originalGetAllNouns = vocabManager.constructor.prototype.getAllNounsFromAllLetters
  vocabManager.constructor.prototype.getAllNounsFromAllLetters = function(exclude = []) {
    return testNouns.filter(noun => !exclude.includes(noun.german))
  }
  
  // Test Case 1: No mastered items - should return all nouns
  console.log('\n📝 Test Case 1: No mastered items')
  const state1 = createMockState()
  const batch1 = vocabManager.generatePluralBatch([], 20, state1)
  
  console.log('Results:', {
    batchSize: batch1.length,
    expectedCount: 3,
    actualCount: batch1.length,
    passed: batch1.length === 3
  })
  
  // Test Case 2: Some mastered plural forms
  console.log('\n📝 Test Case 2: Some mastered plural forms')
  const progress2 = {
    'der Tisch': {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'PLURAL'
    }
  }
  const state2 = createMockState(progress2, ['der Tisch'])
  const batch2 = vocabManager.generatePluralBatch([], 20, state2)
  
  console.log('Results:', {
    masteredPlural: ['der Tisch'],
    expectedCount: 2, // Should exclude mastered plural form
    actualCount: batch2.length,
    passed: batch2.length === 2 && !batch2.some(item => item.singular === 'der Tisch')
  })
  
  // Test Case 3: All plural forms mastered
  console.log('\n📝 Test Case 3: All plural forms mastered')
  const progress3 = {
    'der Tisch': {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'PLURAL'
    },
    'die Lampe': {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'PLURAL'
    },
    'das Buch': {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'PLURAL'
    }
  }
  const state3 = createMockState(progress3, ['der Tisch', 'die Lampe', 'das Buch'])
  const batch3 = vocabManager.generatePluralBatch([], 20, state3)
  
  console.log('Results:', {
    allMasteredPlural: ['der Tisch', 'die Lampe', 'das Buch'],
    expectedCount: 0, // Should exclude all since all mastered
    actualCount: batch3.length,
    passed: batch3.length === 0
  })
  
  // Restore original method
  vocabManager.constructor.prototype.getAllNounsFromAllLetters = originalGetAllNouns
  
  return {
    test1: { passed: batch1.length === 3, details: 'All nouns should be available' },
    test2: { passed: batch2.length === 2 && !batch2.some(item => item.singular === 'der Tisch'), details: 'Should exclude mastered plural form' },
    test3: { passed: batch3.length === 0, details: 'Should exclude all when all mastered' }
  }
}

/**
 * Test Step 4: Articles - should filter out mastered exercises
 */
export const testArticlesFiltering = () => {
  console.log('\n🧪 Testing Step 4: Articles Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Mock getAllExamplesFromAllLetters for articles
  const originalGetAllExamples = vocabManager.constructor.prototype.getAllExamplesFromAllLetters
  
  // Temporarily replace the method to return our test data
  vocabManager.constructor.prototype.getAllExamplesFromAllLetters = function(type) {
    if (type === 'nominative' || type === 'accusative' || type === 'dative') {
      return testArticles.filter(article => article.caseType === type)
    }
    return []
  }
  
  // Test Case 1: No mastered exercises
  console.log('\n📝 Test Case 1: No mastered exercises')
  const state1 = createMockState()
  const batch1 = vocabManager.generateArticlesBatch(30, state1)
  
  console.log('Results:', {
    batchSize: batch1.length,
    expectedCount: 3,
    actualCount: batch1.length,
    passed: batch1.length === 3
  })
  
  // Test Case 2: Some mastered exercises
  console.log('\n📝 Test Case 2: Some mastered exercises')
  const progress2 = {
    '___ ist da.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    }
  }
  const state2 = createMockState(progress2, [], ['___ ist da.'])
  const batch2 = vocabManager.generateArticlesBatch(30, state2)
  
  console.log('Results:', {
    masteredExercises: ['___ ist da.'],
    expectedCount: 2, // Should exclude mastered exercise
    actualCount: batch2.length,
    passed: batch2.length === 2 && !batch2.some(item => item.german === '___ ist da.')
  })
  
  // Test Case 3: All exercises mastered
  console.log('\n📝 Test Case 3: All exercises mastered')
  const progress3 = {
    '___ ist da.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    },
    '___ sehe ich.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    },
    '___ helfe ich.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    }
  }
  const state3 = createMockState(progress3, [], ['___ ist da.', '___ sehe ich.', '___ helfe ich.'])
  const batch3 = vocabManager.generateArticlesBatch(30, state3)
  
  console.log('Results:', {
    allMasteredExercises: ['___ ist da.', '___ sehe ich.', '___ helfe ich.'],
    expectedCount: 0, // Should exclude all since all mastered
    actualCount: batch3.length,
    passed: batch3.length === 0
  })
  
  // Restore original method
  vocabManager.constructor.prototype.getAllExamplesFromAllLetters = originalGetAllExamples
  
  return {
    test1: { passed: batch1.length === 3, details: 'All exercises should be available' },
    test2: { passed: batch2.length === 2 && !batch2.some(item => item.german === '___ ist da.'), details: 'Should exclude mastered exercise' },
    test3: { passed: batch3.length === 0, details: 'Should exclude all when all mastered' }
  }
}

/**
 * Test Step 5: Translations - should filter out mastered exercises
 */
export const testTranslationsFiltering = () => {
  console.log('\n🧪 Testing Step 5: Translations Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Mock getAllExamplesFromAllLetters for translations
  const originalGetAllExamples = vocabManager.constructor.prototype.getAllExamplesFromAllLetters
  
  // Temporarily replace the method to return our test data
  vocabManager.constructor.prototype.getAllExamplesFromAllLetters = function(type) {
    if (type === 'translations') {
      return testTranslations
    }
    return []
  }
  
  // Test Case 1: No mastered exercises
  console.log('\n📝 Test Case 1: No mastered exercises')
  const state1 = createMockState()
  const batch1 = vocabManager.generateTranslationBatch(30, state1)
  
  console.log('Results:', {
    batchSize: batch1.length,
    expectedCount: 3,
    actualCount: batch1.length,
    passed: batch1.length === 3
  })
  
  // Test Case 2: Some mastered exercises
  console.log('\n📝 Test Case 2: Some mastered exercises')
  const progress2 = {
    'Ich komme aus Deutschland.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'TRANSLATIONS'
    }
  }
  const state2 = createMockState(progress2, [], ['Ich komme aus Deutschland.'])
  const batch2 = vocabManager.generateTranslationBatch(30, state2)
  
  console.log('Results:', {
    masteredExercises: ['Ich komme aus Deutschland.'],
    expectedCount: 2, // Should exclude mastered exercise
    actualCount: batch2.length,
    passed: batch2.length === 2 && !batch2.some(item => item.english === 'Ich komme aus Deutschland.')
  })
  
  // Test Case 3: All exercises mastered
  console.log('\n📝 Test Case 3: All exercises mastered')
  const progress3 = {
    'Ich komme aus Deutschland.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'TRANSLATIONS'
    },
    'Er liest ein Buch.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'TRANSLATIONS'
    },
    'Sie gibt mir das Buch.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'TRANSLATIONS'
    }
  }
  const state3 = createMockState(progress3, [], ['Ich komme aus Deutschland.', 'Er liest ein Buch.', 'Sie gibt mir das Buch.'])
  const batch3 = vocabManager.generateTranslationBatch(30, state3)
  
  console.log('Results:', {
    allMasteredExercises: ['Ich komme aus Deutschland.', 'Er liest ein Buch.', 'Sie gibt mir das Buch.'],
    expectedCount: 0, // Should exclude all since all mastered
    actualCount: batch3.length,
    passed: batch3.length === 0
  })
  
  // Restore original method
  vocabManager.constructor.prototype.getAllExamplesFromAllLetters = originalGetAllExamples
  
  return {
    test1: { passed: batch1.length === 3, details: 'All exercises should be available' },
    test2: { passed: batch2.length === 2 && !batch2.some(item => item.english === 'Ich komme aus Deutschland.'), details: 'Should exclude mastered exercise' },
    test3: { passed: batch3.length === 0, details: 'Should exclude all when all mastered' }
  }
}

/**
 * Run all tests
 */
export const runAllFilteringTests = () => {
  console.log('🚀 Running Mastery Filtering Test Suite')
  console.log('=' .repeat(50))
  
  const vocabResults = testVocabularyFiltering()
  const pluralResults = testPluralFiltering()
  const articlesResults = testArticlesFiltering()
  const translationsResults = testTranslationsFiltering()
  
  const allResults = {
    vocabulary: vocabResults,
    plural: pluralResults,
    articles: articlesResults,
    translations: translationsResults
  }
  
  const totalTests = Object.keys(allResults).length * 3 // 3 tests per step
  const passedTests = Object.values(allResults).reduce((count, stepResults) => {
    return count + Object.values(stepResults).filter(test => test.passed).length
  }, 0)
  
  console.log('\n📊 Test Summary:')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests}`)
  console.log(`Failed: ${totalTests - passedTests}`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  
  console.log('\n📋 Detailed Results:')
  Object.entries(allResults).forEach(([step, results]) => {
    console.log(`\n${step}:`)
    Object.entries(results).forEach(([testCase, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL'
      console.log(`  ${testCase}: ${status} - ${result.details}`)
    })
  })
  
  return {
    allResults,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(1)
    }
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllFilteringTests()
}
