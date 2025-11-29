export const letterB = {
  nouns: [
    {"train station": ["Bahnhof", "Bahnhöfe", "der", "die", "m"]},
    {"bath": ["Bad", "Bäder", "das", "die", "n"]},
    {"tree": ["Baum", "Bäume", "der", "die", "m"]},
    {"example": ["Beispiel", "Beispiele", "das", "die", "n"]},
    {"mountain": ["Berg", "Berge", "der", "die", "m"]},
    {"flower": ["Blume", "Blumen", "die", "die", "f"]},
    {"book": ["Buch", "Bücher", "das", "die", "n"]},
    {"brother": ["Bruder", "Brüder", "der", "die", "m"]},
    {"bank; bench": ["Bank", "Banken", "die", "die", "f"]},
    {"profession": ["Beruf", "Berufe", "der", "die", "m"]}
  ],
  verbs: [
    {"to begin": ["beginnen", "beginne", "beginnst", "beginnt", "beginnt", "beginnt", "beginnen", "beginnt", "beginnen", "beginnen"]},
    {"to need": ["brauchen", "brauche", "brauchst", "braucht", "braucht", "braucht", "brauchen", "braucht", "brauchen", "brauchen"]},
    {"to visit": ["besuchen", "besuche", "besuchst", "besucht", "besucht", "besucht", "besuchen", "besucht", "besuchen", "besuchen"]},
    {"to get, to receive": ["bekommen", "bekomme", "bekommst", "bekommt", "bekommt", "bekommt", "bekommen", "bekommt", "bekommen", "bekommen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Bahnhof ist neu.',
        english: 'The train station is new.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Blume ist schön.',
        english: 'The flower is beautiful.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Buch ist interessant.',
        english: 'The book is interesting.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Berg ist hoch.',
        english: 'The mountain is high.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Beispiel ist klar.',
        english: 'The example is clear.',
        answer: 'Das',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Berg.',
        english: 'I see the mountain.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie liest ___ Buch.',
        english: 'She reads the book.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Beruf.',
        english: 'He needs the profession.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir besuchen ___ Bahnhof.',
        english: 'We visit the train station.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Blume.',
        english: 'You buy the flower.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Bruder.',
        english: 'I help the brother.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie geht zu ___ Bank.',
        english: 'She goes to the bank.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Er gibt ___ Kind ___ Buch.',
        english: 'He gives the child the book.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir sprechen mit ___ Beruf.',
        english: 'We speak about the profession.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du sitzt auf ___ Bank.',
        english: 'You sit on the bench.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The train station is new.',
        german: 'Der Bahnhof ist neu.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The flower is beautiful.',
        german: 'Die Blume ist schön.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She reads the book.',
        german: 'Sie liest das Buch.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the brother.',
        german: 'Ich helfe dem Bruder.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'They sit on the bench.',
        german: 'Sie sitzen auf der Bank.',
        type: 'translation',
        caseType: 'dative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to need" for "I"?',
        answer: 'brauche',
        verb: 'brauchen',
        verbEnglish: 'to need',
        subject: 'ich',
        conjugation: 'brauche'
      },
      {
        question: 'How do you conjugate "to visit" for "you" (informal)?',
        answer: 'besuchst',
        verb: 'besuchen',
        verbEnglish: 'to visit',
        subject: 'du',
        conjugation: 'besuchst'
      },
      {
        question: 'How do you conjugate "to get" for "he"?',
        answer: 'bekommt',
        verb: 'bekommen',
        verbEnglish: 'to get, to receive',
        subject: 'er',
        conjugation: 'bekommt'
      },
      {
        question: 'How do you conjugate "to begin" for "we"?',
        answer: 'beginnen',
        verb: 'beginnen',
        verbEnglish: 'to begin',
        subject: 'wir',
        conjugation: 'beginnen'
      },
      {
        question: 'How do you conjugate "to need" for "they"?',
        answer: 'brauchen',
        verb: 'brauchen',
        verbEnglish: 'to need',
        subject: 'sie',
        conjugation: 'brauchen'
      }
    ]
  }
}
