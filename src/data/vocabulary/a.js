export const letterA = {
  nouns: [
    {"evening": ["Abend", "Abende", "der", "die", "m"]},
    {"address": ["Adresse", "Adressen", "die", "die", "f"]},
    {"age": ["Alter", "Alter", "das", "die", "n"]},
    {"arrival": ["Ankunft", "Ankünfte", "der", "die", "m"]},
    {"answer": ["Antwort", "Antworten", "die", "die", "f"]},
    {"apple": ["Apfel", "Äpfel", "der", "die", "m"]},
    {"work": ["Arbeit", "Arbeiten", "die", "die", "f"]},
    {"doctor": ["Arzt", "Ärzte", "der", "die", "m"]},
    {"car": ["Auto", "Autos", "das", "die", "n"]},
    {"eye": ["Auge", "Augen", "das", "die", "n"]}
  ],
  verbs: [
    {"to answer": ["antworten", "antworte", "antwortest", "antwortet", "antwortet", "antwortet", "antworten", "antwortet", "antworten", "antworten"]},
    {"to work": ["arbeiten", "arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeitet", "arbeiten", "arbeitet", "arbeiten", "arbeiten"]},
    {"to begin": ["anfangen", "fange an", "fängst an", "fängt an", "fängt an", "fängt an", "fangen an", "fangt an", "fangen an", "fangen an"]},
    {"to arrive": ["ankommen", "komme an", "kommst an", "kommt an", "kommt an", "kommt an", "kommen an", "kommt an", "kommen an", "kommen an"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Abend ist schön.',
        english: 'The evening is beautiful.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Adresse ist alt.',
        english: 'The address is old.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Auto ist neu.',
        english: 'The car is new.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Apfel schmeckt gut.',
        english: 'The apple tastes good.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Arzt arbeitet hier.',
        english: 'The doctor works here.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Abend.',
        english: 'I see the evening.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Antwort.',
        english: 'He needs the answer.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Sie kauft ___ Auto.',
        english: 'She buys the car.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Alter.',
        english: 'We have the age.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Du besuchst ___ Arzt.',
        english: 'You visit the doctor.',
        answer: 'den',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Arzt.',
        english: 'I help the doctor.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie dankt ___ Abend.',
        english: 'She thanks for the evening.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er gibt ___ Kind ___ Apfel.',
        english: 'He gives the child the apple.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir sprechen mit ___ Adresse.',
        english: 'We speak with the address.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Arbeit.',
        english: 'You go to the work.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The evening is beautiful.',
        german: 'Der Abend ist schön.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The doctor works here.',
        german: 'Der Arzt arbeitet hier.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She visits the address.',
        german: 'Sie besucht die Adresse.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I give the child the apple.',
        german: 'Ich gebe dem Kind den Apfel.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'They work in the evening.',
        german: 'Sie arbeiten am Abend.',
        type: 'translation',
        caseType: 'temporal'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to answer" for "I"?',
        answer: 'antworte',
        verb: 'antworten',
        verbEnglish: 'to answer',
        subject: 'ich',
        conjugation: 'antworte'
      },
      {
        question: 'How do you conjugate "to work" for "you" (formal)?',
        answer: 'arbeiten',
        verb: 'arbeiten',
        verbEnglish: 'to work',
        subject: 'Sie',
        conjugation: 'arbeiten'
      },
      {
        question: 'How do you conjugate "to begin" for "he"?',
        answer: 'fängt an',
        verb: 'anfangen',
        verbEnglish: 'to begin',
        subject: 'er',
        conjugation: 'fängt an'
      },
      {
        question: 'How do you conjugate "to arrive" for "we"?',
        answer: 'kommen an',
        verb: 'ankommen',
        verbEnglish: 'to arrive',
        subject: 'wir',
        conjugation: 'kommen an'
      },
      {
        question: 'How do you conjugate "to work" for "she"?',
        answer: 'arbeitet',
        verb: 'arbeiten',
        verbEnglish: 'to work',
        subject: 'sie',
        conjugation: 'arbeitet'
      }
    ]
  }
}
