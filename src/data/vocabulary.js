// Sample A1 German vocabulary data
// This would normally be parsed from A1_SD1_Wortliste_02.pdf

export const vocabularyData = {
  nouns: [
    {
      german: 'das Buch',
      english: 'book',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Bücher',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Tisch',
      english: 'table',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Tische',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Tür',
      english: 'door',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Türen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Auto',
      english: 'car',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Autos',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Mann',
      english: 'man',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Männer',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Frau',
      english: 'woman',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Frauen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Kind',
      english: 'child',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Kinder',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Hund',
      english: 'dog',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Hunde',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Katze',
      english: 'cat',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Katzen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Haus',
      english: 'house',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Häuser',
      article: 'das',
      pluralArticle: 'die'
    }
  ],
  verbs: [
    {
      german: 'sein',
      english: 'to be',
      type: 'verb',
      conjugations: {
        ich: 'bin',
        du: 'bist',
        er: 'ist',
        sie: 'ist',
        es: 'ist',
        wir: 'sind',
        ihr: 'seid',
        sie: 'sind',
        Sie: 'sind'
      }
    },
    {
      german: 'haben',
      english: 'to have',
      type: 'verb',
      conjugations: {
        ich: 'habe',
        du: 'hast',
        er: 'hat',
        sie: 'hat',
        es: 'hat',
        wir: 'haben',
        ihr: 'habt',
        sie: 'haben',
        Sie: 'haben'
      }
    },
    {
      german: 'gehen',
      english: 'to go',
      type: 'verb',
      conjugations: {
        ich: 'gehe',
        du: 'gehst',
        er: 'geht',
        sie: 'geht',
        es: 'geht',
        wir: 'gehen',
        ihr: 'geht',
        sie: 'gehen',
        Sie: 'gehen'
      }
    },
    {
      german: 'kommen',
      english: 'to come',
      type: 'verb',
      conjugations: {
        ich: 'komme',
        du: 'kommst',
        er: 'kommt',
        sie: 'kommt',
        es: 'kommt',
        wir: 'kommen',
        ihr: 'kommt',
        sie: 'kommen',
        Sie: 'kommen'
      }
    },
    {
      german: 'sprechen',
      english: 'to speak',
      type: 'verb',
      conjugations: {
        ich: 'spreche',
        du: 'sprichst',
        er: 'spricht',
        sie: 'spricht',
        es: 'spricht',
        wir: 'sprechen',
        ihr: 'sprecht',
        sie: 'sprechen',
        Sie: 'sprechen'
      }
    }
  ],
  sentences: {
    nominative: [
      {
        german: '___ Mann ist groß.',
        english: 'The man is tall.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Frau arbeitet hier.',
        english: 'The woman works here.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Kind spielt im Garten.',
        english: 'The child plays in the garden.',
        answer: 'Das',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Mann.',
        english: 'I see the man.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er liest ___ Buch.',
        english: 'He reads the book.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Frau.',
        english: 'She visits the woman.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich gebe ___ Mann das Buch.',
        english: 'I give the book to the man.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er hilft ___ Frau.',
        english: 'He helps the woman.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Ich danke ___ Kind.',
        english: 'I thank the child.',
        answer: 'dem',
        case: 'dative'
      }
    ]
  }
}

// Helper functions to get random items
export const getRandomNouns = (count, exclude = []) => {
  const available = vocabularyData.nouns.filter(noun => 
    !exclude.includes(noun.german)
  )
  
  const shuffled = [...available].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomVerbs = (count, exclude = []) => {
  const available = vocabularyData.verbs.filter(verb => 
    !exclude.includes(verb.german)
  )
  
  const shuffled = [...available].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getSentencesByCase = (caseType, count) => {
  const sentences = vocabularyData.sentences[caseType] || []
  const shuffled = [...sentences].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Initialize vocabulary pools
export const initializeVocabularyPools = () => {
  const allWords = [
    ...vocabularyData.nouns.map(n => n.german),
    ...vocabularyData.verbs.map(v => v.german)
  ]
  
  return {
    unselected: allWords,
    mastered: [],
    reviewQueue: []
  }
}
