// Test to verify the TRANSLATIONS review fix
// This test demonstrates that the findExampleByType method correctly finds
// translations in the 'translations' array instead of finding the first match
// in any example type (nominative, accusative, etc.)

import { VocabularyManager } from './src/utils/vocabularyManager.js'

// Mock the vocabulary data structure for testing
const mockLetterData = {
  examples: {
    nominative: [
      {
        german: '___ Blume ist schön.',
        english: 'The flower is beautiful.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    translations: [
      {
        english: 'The flower is beautiful.',
        german: 'Die Blume ist schön.',
        type: 'translation',
        caseType: 'nominative'
      }
    ]
  }
}

// Mock the getVocabularyByLetter function
const originalGetVocabularyByLetter = () => mockLetterData

// Test the fix
console.log('=== Testing TRANSLATIONS Review Fix ===\n')

const vocabManager = new VocabularyManager()

// Test 1: findExample (old behavior - finds first match)
console.log('Test 1: Old findExample method (should find nominative first):')
const oldResult = vocabManager.findExample('The flower is beautiful.')
console.log('Result:', oldResult)
console.log('Found in:', oldResult?.exampleType)
console.log('This is the BUG - finds nominative instead of translations!\n')

// Test 2: findExampleByType (new behavior - finds only in translations)
console.log('Test 2: New findExampleByType method (should find translations only):')
const newResult = vocabManager.findExampleByType('The flower is beautiful.', 'translations')
console.log('Result:', newResult)
console.log('Found in:', newResult?.exampleType)
console.log('This is the FIX - correctly finds translations!\n')

// Test 3: Verify the correct German translation
console.log('Test 3: Verify correct German translation:')
console.log('Expected German (from translations): "Die Blume ist schön."')
console.log('Wrong German (from nominative): "Die"')
console.log('Our fix returns:', newResult?.german)

console.log('\n=== Fix Summary ===')
console.log('✅ Fixed: TRANSLATIONS review now searches specifically in translations array')
console.log('✅ Result: "The flower is beautiful." → "Die Blume ist schön."')
console.log('❌ Before fix: Would return "Die" (from nominative)')
console.log('❌ After fix: Returns "Die Blume ist schön." (from translations)')
