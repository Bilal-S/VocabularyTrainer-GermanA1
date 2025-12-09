/**
 * Integration test for mastered item filtering functionality
 * This test verifies the actual implementation with real data
 */

import { VocabularyManager } from '../src/utils/vocabularyManager.js'

// Create a test state with some mastered items
const createTestState = (progress = {}) => {
  return {
    settings: {
      masteringCount: 3,
      maxReviewCount: 3,
      maxVocabularyQuestions: 5, // Use smaller batches for testing
      maxPluralQuestions: 5,
      maxArticlesQuestions: 9,
      maxTranslationsQuestions: 9,
      maxVerbsQuestions: 5
    },
    progress,
    pools: {
      mastered: {
        nouns: [],
        verbs: [],
        words: []
      },
      reviewQueue: [],
      unselected: []
    }
  }
}

/**
 * Test that the filtering methods work correctly
 */
export const testMasteryFilteringMethods = () => {
  console.log('🧪 Testing Mastery Filtering Methods')
  
  const vocabManager = new VocabularyManager()
  
  // Test Case 1: No mastered items
  console.log('\n📝 Test Case 1: No mastered items')
  const state1 = createTestState()
  
  // Test singular mastery checking
  const isSingularMastered1 = vocabManager.isSingularFormMastered('der Tisch', state1)
  console.log('isSingularFormMastered("der Tisch"):', isSingularMastered1)
  
  // Test plural mastery checking
  const isPluralMastered1 = vocabManager.isPluralFormMastered('der Tisch', state1)
  console.log('isPluralFormMastered("der Tisch"):', isPluralMastered1)
  
  // Test exercise mastery checking
  const isExerciseMastered1 = vocabManager.isExerciseMastered('___ ist da.', state1)
  console.log('isExerciseMastered("___ ist da."):', isExerciseMastered1)
  
  const test1Passed = !isSingularMastered1 && !isPluralMastered1 && !isExerciseMastered1
  
  // Test Case 2: Some mastered items
  console.log('\n📝 Test Case 2: Some mastered items')
  const progress2 = {
    'der Tisch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 1, incorrectCount: 0 },
      section: 'VOCABULARY'
    },
    '___ ist da.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    }
  }
  const state2 = createTestState(progress2)
  
  // Test singular mastery checking
  const isSingularMastered2 = vocabManager.isSingularFormMastered('der Tisch', state2)
  console.log('isSingularFormMastered("der Tisch"):', isSingularMastered2)
  
  // Test plural mastery checking
  const isPluralMastered2 = vocabManager.isPluralFormMastered('der Tisch', state2)
  console.log('isPluralFormMastered("der Tisch"):', isPluralMastered2)
  
  // Test exercise mastery checking
  const isExerciseMastered2 = vocabManager.isExerciseMastered('___ ist da.', state2)
  console.log('isExerciseMastered("___ ist da."):', isExerciseMastered2)
  
  const test2Passed = isSingularMastered2 && !isPluralMastered2 && isExerciseMastered2
  
  // Test Case 3: All mastered items
  console.log('\n📝 Test Case 3: All mastered items')
  const progress3 = {
    'der Tisch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'VOCABULARY'
    },
    '___ ist da.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    }
  }
  const state3 = createTestState(progress3)
  
  // Test singular mastery checking
  const isSingularMastered3 = vocabManager.isSingularFormMastered('der Tisch', state3)
  console.log('isSingularFormMastered("der Tisch"):', isSingularMastered3)
  
  // Test plural mastery checking
  const isPluralMastered3 = vocabManager.isPluralFormMastered('der Tisch', state3)
  console.log('isPluralFormMastered("der Tisch"):', isPluralMastered3)
  
  // Test exercise mastery checking
  const isExerciseMastered3 = vocabManager.isExerciseMastered('___ ist da.', state3)
  console.log('isExerciseMastered("___ ist da."):', isExerciseMastered3)
  
  const test3Passed = isSingularMastered3 && isPluralMastered3 && isExerciseMastered3
  
  return {
    test1: { passed: test1Passed, details: 'No items should be mastered' },
    test2: { passed: test2Passed, details: 'Only singular and exercise should be mastered' },
    test3: { passed: test3Passed, details: 'All items should be mastered' }
  }
}

/**
 * Test vocabulary batch generation with filtering
 */
export const testVocabularyBatchFiltering = () => {
  console.log('\n🧪 Testing Vocabulary Batch Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Test with no mastered items - should return full batch
  console.log('\n📝 Test Case 1: No mastered items')
  const state1 = createTestState()
  const batch1 = vocabManager.generateVocabularyBatch([], 5, state1)
  
  console.log('Batch size without mastered items:', batch1.length)
  
  // Test with some mastered items - should return smaller batch
  console.log('\n📝 Test Case 2: Some mastered items')
  const progress2 = {
    'der Tisch': {
      singular: { correctCount: 3, incorrectCount: 0 },
      plural: { correctCount: 0, incorrectCount: 0 },
      section: 'VOCABULARY'
    }
  }
  const state2 = createTestState(progress2)
  const batch2 = vocabManager.generateVocabularyBatch([], 5, state2)
  
  console.log('Batch size with some mastered items:', batch2.length)
  const containsMastered = batch2.some(item => item.german === 'der Tisch')
  console.log('Contains mastered item "der Tisch":', containsMastered)
  
  const test2Passed = batch2.length > 0 && !containsMastered
  
  return {
    test1: { passed: batch1.length === 5, details: 'Should return full batch when no items mastered' },
    test2: { passed: test2Passed, details: 'Should exclude mastered singular forms' }
  }
}

/**
 * Test plural batch generation with filtering
 */
export const testPluralBatchFiltering = () => {
  console.log('\n🧪 Testing Plural Batch Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Test with some mastered plural items
  console.log('\n📝 Test Case 1: Some mastered plural items')
  const progress1 = {
    'der Tisch': {
      singular: { correctCount: 0, incorrectCount: 0 },
      plural: { correctCount: 3, incorrectCount: 0 },
      section: 'PLURAL'
    }
  }
  const state1 = createTestState(progress1)
  const batch1 = vocabManager.generatePluralBatch([], 5, state1)
  
  console.log('Batch size with mastered plural items:', batch1.length)
  const containsMasteredPlural = batch1.some(item => item.singular === 'der Tisch')
  console.log('Contains mastered plural item "der Tisch":', containsMasteredPlural)
  
  const test1Passed = batch1.length > 0 && !containsMasteredPlural
  
  return {
    test1: { passed: test1Passed, details: 'Should exclude mastered plural forms' }
  }
}

/**
 * Test articles batch generation with filtering
 */
export const testArticlesBatchFiltering = () => {
  console.log('\n🧪 Testing Articles Batch Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Test with some mastered article exercises
  console.log('\n📝 Test Case 1: Some mastered article exercises')
  const progress1 = {
    '___ ist da.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'ARTICLES'
    }
  }
  const state1 = createTestState(progress1)
  const batch1 = vocabManager.generateArticlesBatch(9, state1)
  
  console.log('Batch size with mastered articles:', batch1.length)
  const containsMasteredArticle = batch1.some(item => item.german === '___ ist da.')
  console.log('Contains mastered article "___ ist da.":', containsMasteredArticle)
  
  const test1Passed = batch1.length > 0 && !containsMasteredArticle
  
  return {
    test1: { passed: test1Passed, details: 'Should exclude mastered article exercises' }
  }
}

/**
 * Test translations batch generation with filtering
 */
export const testTranslationsBatchFiltering = () => {
  console.log('\n🧪 Testing Translations Batch Filtering')
  
  const vocabManager = new VocabularyManager()
  
  // Test with some mastered translation exercises
  console.log('\n📝 Test Case 1: Some mastered translation exercises')
  const progress1 = {
    'Ich komme aus Deutschland.': {
      singular: { correctCount: 3, incorrectCount: 0 },
      section: 'TRANSLATIONS'
    }
  }
  const state1 = createTestState(progress1)
  const batch1 = vocabManager.generateTranslationBatch(9, state1)
  
  console.log('Batch size with mastered translations:', batch1.length)
  const containsMasteredTranslation = batch1.some(item => item.english === 'Ich komme aus Deutschland.')
  console.log('Contains mastered translation "Ich komme aus Deutschland.":', containsMasteredTranslation)
  
  const test1Passed = batch1.length > 0 && !containsMasteredTranslation
  
  return {
    test1: { passed: test1Passed, details: 'Should exclude mastered translation exercises' }
  }
}

/**
 * Run all integration tests
 */
export const runAllIntegrationTests = () => {
  console.log('🚀 Running Integration Test Suite for Mastery Filtering')
  console.log('=' .repeat(60))
  
  const methodResults = testMasteryFilteringMethods()
  const vocabResults = testVocabularyBatchFiltering()
  const pluralResults = testPluralBatchFiltering()
  const articlesResults = testArticlesBatchFiltering()
  const translationsResults = testTranslationsBatchFiltering()
  
  const allResults = {
    methods: methodResults,
    vocabulary: vocabResults,
    plural: pluralResults,
    articles: articlesResults,
    translations: translationsResults
  }
  
  const totalTests = Object.values(allResults).reduce((count, stepResults) => {
    return count + Object.keys(stepResults).length
  }, 0)
  
  const passedTests = Object.values(allResults).reduce((count, stepResults) => {
    return count + Object.values(stepResults).filter(test => test.passed).length
  }, 0)
  
  console.log('\n📊 Integration Test Summary:')
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
  runAllIntegrationTests()
}
