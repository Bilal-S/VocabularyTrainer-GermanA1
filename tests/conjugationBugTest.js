
import { VocabularyManager } from '../src/utils/vocabularyManager.js';
import { validationService } from '../src/services/answerProcessors/validationService.js';

// Mock dependencies if needed, or just use the classes directly if they are self-contained enough.
// Since we are testing validation logic which is pure logic, we can just instantiate them.

console.log('--- Testing Conjugation Validation Bug ---');

const vocabManager = new VocabularyManager();

const testCases = [
  {
    name: "Standard 2-word conjugation",
    userAnswer: "ich mache",
    correctAnswer: "ich mache",
    expected: true
  },
  {
    name: "Separable verb (3 words)",
    userAnswer: "es macht aus",
    correctAnswer: "es macht aus",
    expected: true
  },
  {
    name: "Separable verb with case difference in subject",
    userAnswer: "Es macht aus",
    correctAnswer: "es macht aus",
    expected: true
  },
  {
    name: "Wrong verb",
    userAnswer: "es macht an",
    correctAnswer: "es macht aus",
    expected: false
  },
  {
    name: "Wrong subject",
    userAnswer: "er macht aus",
    correctAnswer: "es macht aus",
    expected: false // Should be false because subject doesn't match expected "es"
  }
];

console.log('\nTesting src/utils/vocabularyManager.js:');
let failCountVM = 0;
testCases.forEach(tc => {
  const result = vocabManager.validateAnswer(tc.userAnswer, tc.correctAnswer, 'conjugation');
  const status = result === tc.expected ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${tc.name}: User="${tc.userAnswer}", Correct="${tc.correctAnswer}" -> Result=${result}`);
  if (result !== tc.expected) failCountVM++;
});

console.log('\nTesting src/services/answerProcessors/validationService.js:');
let failCountVS = 0;
testCases.forEach(tc => {
  const result = validationService.validateAnswer(tc.userAnswer, tc.correctAnswer, 'conjugation');
  const status = result === tc.expected ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${tc.name}: User="${tc.userAnswer}", Correct="${tc.correctAnswer}" -> Result=${result}`);
  if (result !== tc.expected) failCountVS++;
});

if (failCountVM > 0 || failCountVS > 0) {
    console.log(`\n❌ Validation Failed: VM Failures=${failCountVM}, VS Failures=${failCountVS}`);
    process.exit(1);
} else {
    console.log('\n✅ All Tests Passed');
}
