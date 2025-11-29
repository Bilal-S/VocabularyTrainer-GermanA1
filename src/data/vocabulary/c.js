export const letterC = {
  nouns: [
    {"boss": ["Chef", "Chefs", "der", "die", "m"]},
    {"café": ["Café", "Cafés", "das", "die", "n"]},
    {"computer": ["Computer", "Computer", "der", "die", "m"]},
    {"chance": ["Chance", "Chancen", "die", "die", "f"]},
    {"cola": ["Cola", "Colas", "das", "die", "n"]},
    {"culture": ["Kultur", "Kulturen", "die", "die", "f"]},
    {"account (bank)": ["Konto", "Konten", "das", "die", "n"]},
    {"cousin (male)": ["Cousin", "Cousins", "der", "die", "m"]},
    {"cousin (female)": ["Cousine", "Cousinen", "die", "die", "f"]},
    {"concert": ["Konzert", "Konzerte", "das", "die", "n"]}
  ],
  verbs: [
    {"to come": ["kommen", "komme", "kommst", "kommt", "kommt", "kommt", "kommen", "kommt", "kommen", "kommen"]},
    {"to buy": ["kaufen", "kaufe", "kaufst", "kauft", "kauft", "kauft", "kaufen", "kauft", "kaufen", "kaufen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Chef ist hier.',
        english: 'The boss is here.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Café ist neu.',
        english: 'The café is new.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Computer funktioniert.',
        english: 'The computer works.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Chance ist gut.',
        english: 'The chance is good.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Kultur ist interessant.',
        english: 'The culture is interesting.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Chef.',
        english: 'I see boss.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Computer.',
        english: 'He needs computer.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Café.',
        english: 'She visits the café.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Chance.',
        english: 'We have the chance.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Cola.',
        english: 'You buy the cola.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Chef.',
        english: 'I help the boss.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Computer.',
        english: 'She gives the child the computer.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Chef.',
        english: 'He speaks with the boss.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Chance.',
        english: 'We thank for the chance.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Café.',
        english: 'You go to the café.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The boss is here.',
        german: 'Der Chef ist hier.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The café is new.',
        german: 'Das Café ist neu.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the boss.',
        german: 'Ich sehe den Chef.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the computer.',
        german: 'Sie gibt dem Kind den Computer.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The culture is interesting.',
        german: 'Die Kultur ist interessant.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to come" for "I"?',
        answer: 'komme',
        verb: 'kommen',
        verbEnglish: 'to come',
        subject: 'ich',
        conjugation: 'komme'
      },
      {
        question: 'How do you conjugate "to come" for "you" (informal)?',
        answer: 'kommst',
        verb: 'kommen',
        verbEnglish: 'to come',
        subject: 'du',
        conjugation: 'kommst'
      },
      {
        question: 'How do you conjugate "to buy" for "he"?',
        answer: 'kauft',
        verb: 'kaufen',
        verbEnglish: 'to buy',
        subject: 'er',
        conjugation: 'kauft'
      },
      {
        question: 'How do you conjugate "to buy" for "we"?',
        answer: 'kaufen',
        verb: 'kaufen',
        verbEnglish: 'to buy',
        subject: 'wir',
        conjugation: 'kaufen'
      },
      {
        question: 'How do you conjugate "to come" for "they" (formal)?',
        answer: 'kommen',
        verb: 'kommen',
        verbEnglish: 'to come',
        subject: 'Sie',
        conjugation: 'kommen'
      }
    ]
  }
}
