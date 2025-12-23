// Mock data file for review testing
// Contains 3 randomly selected items from each category from a.js through z.js
// Maintains the same structure as the original vocabulary files

export const reviewBaseData = {
  nouns: [
    {"evening": ["Abend", "Abende", "der", "die", "m"]},
    {"answer": ["Antwort", "Antworten", "die", "die", "f"]},
    {"bank/bench": ["Bank", "Banken", "die", "die", "f"]}
  ],
  verbs: [
    {"to work": ["arbeiten", "arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeitet", "arbeiten", "arbeitet", "arbeiten", "arbeiten"]},
    {"to begin": ["beginnen", "beginne", "beginnst", "beginnt", "beginnt", "beginnt", "beginnen", "beginnt", "beginnen", "beginnen"]},
    {"to need": ["brauchen", "brauche", "brauchst", "braucht", "braucht", "braucht", "brauchen", "braucht", "brauchen", "brauchen"]}
  ],
  examples: {
    nominative: [
      { german: "___ Abend ist schön.", english: "The evening is beautiful.", answer: "Der" },
      { german: "___ Auto ist neu.", english: "The car is new.", answer: "Das" },
      { german: "___ Apfel schmeckt gut.", english: "The apple tastes good.", answer: "Der" }
    ],
    accusative: [
      { german: "Ich sehe ___ Abend.", english: "I see the evening.", answer: "den" },
      { german: "Er braucht ___ Antwort.", english: "He needs the answer.", answer: "die" },
      { german: "Sie liest ___ Buch.", english: "She reads the book.", answer: "das" }
    ],
    dative: [
      { german: "Sie dankt ___ Abend.", english: "She thanks for the evening.", answer: "dem" },
      { german: "Ich helfe ___ Arzt.", english: "I help the doctor.", answer: "dem" },
      { german: "Sie geht zu ___ Bank.", english: "She goes to the bank.", answer: "der" }
    ],
    translations: [
      { english: "The evening is beautiful.", german: "Der Abend ist schön." },
      { english: "The doctor works here.", german: "Der Arzt arbeitet hier." },
      { english: "They sit on the bench.", german: "Sie sitzen auf der Bank." }
    ]
  }
}

/**
 * Transform reviewBaseData into review queue items for steps 2-6
 */
export function createReviewQueueFromBaseData() {
  const reviewQueue = []
  
  // Step 2: Vocabulary items (singular form)
  reviewBaseData.nouns.forEach(noun => {
    const english = Object.keys(noun)[0]
    const [german, plural, article, pluralArticle, gender] = noun[english]
    reviewQueue.push({
      word: `${article} ${german}`,
      section: 'VOCABULARY',
      form: 'singular',
      english
    })
  })
  
  // Step 3: Plural items (plural form)
  reviewBaseData.nouns.forEach(noun => {
    const english = Object.keys(noun)[0]
    const [german, plural, article, pluralArticle, gender] = noun[english]
    reviewQueue.push({
      word: `${article} ${german}`,
      section: 'PLURAL',
      form: 'plural',
      english
    })
  })
  
  // Step 4: Articles items (nominative, accusative, dative)
  reviewBaseData.examples.nominative.forEach(example => {
    reviewQueue.push({
      word: example.german,
      section: 'ARTICLES',
      form: 'singular',
      question: example.german
    })
  })
  
  reviewBaseData.examples.accusative.forEach(example => {
    reviewQueue.push({
      word: example.german,
      section: 'ARTICLES',
      form: 'singular',
      question: example.german
    })
  })
  
  reviewBaseData.examples.dative.forEach(example => {
    reviewQueue.push({
      word: example.german,
      section: 'ARTICLES',
      form: 'singular',
      question: example.german
    })
  })
  
  // Step 5: Translations items
  reviewBaseData.examples.translations.forEach(example => {
    reviewQueue.push({
      word: example.english,
      section: 'TRANSLATIONS',
      form: 'singular',
      answer: example.german
    })
  })
  
  // Step 6: Verb items (conjugations with subject)
  reviewBaseData.verbs.forEach(verb => {
    const english = Object.keys(verb)[0]
    const [infinitive, ich, du, er, sie, es, wir, ihr, sieThey, Sie] = verb[english]
    // Add one conjugation per verb (using 'du' as example)
    reviewQueue.push({
      word: `${infinitive}|du`,
      section: 'VERBS',
      form: 'singular',
      english
    })
  })
  
  return reviewQueue
}
