
import { validationService } from '../src/services/answerProcessors/validationService.js';
import { VocabularyManager } from '../src/utils/vocabularyManager.js';

console.log('--- Testing Synonym Lookup ---');

// Test validationService (used in production)
console.log('\nTesting validationService.getSynonyms("doctor"):');
const synonymsVS = validationService.getSynonyms("doctor");
console.log(`Found ${synonymsVS.length} synonyms:`, synonymsVS.map(s => s.german));

const foundArzt = synonymsVS.some(s => s.german.includes("Arzt"));
const foundDoktor = synonymsVS.some(s => s.german.includes("Doktor"));

if (foundArzt && foundDoktor) {
    console.log("✅ ValidationService found both Arzt and Doktor.");
} else {
    console.log("❌ ValidationService MISSING synonyms.");
}

// Test VocabularyManager
console.log('\nTesting VocabularyManager.getSynonyms("doctor"):');
const vocabManager = new VocabularyManager();
const synonymsVM = vocabManager.getSynonyms("doctor");
console.log(`Found ${synonymsVM.length} synonyms:`, synonymsVM.map(s => s.german));

const foundArztVM = synonymsVM.some(s => s.german.includes("Arzt"));
const foundDoktorVM = synonymsVM.some(s => s.german.includes("Doktor"));

if (foundArztVM && foundDoktorVM) {
    console.log("✅ VocabularyManager found both Arzt and Doktor.");
} else {
    console.log("❌ VocabularyManager MISSING synonyms.");
}

// Test Validation Logic
console.log('\nTesting Validation Logic:');
const exercise = {
    type: 'vocabulary', // This is what Step 2 uses
    english: 'doctor',
    answer: 'der Arzt' // Expecting Arzt
};

const userAnswer = 'der Doktor'; // User gives synonym
const isCorrect = validationService.validateAnswer(userAnswer, exercise.answer, exercise.type, exercise);
console.log(`User answer: "${userAnswer}", Correct: "${exercise.answer}", Result: ${isCorrect}`);

if (isCorrect) {
    console.log("✅ Validation accepted synonym.");
} else {
    console.log("❌ Validation REJECTED synonym.");
}
