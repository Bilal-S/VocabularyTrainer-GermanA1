export const letterD = {
  nouns: [
    {"day": ["Tag", "Tage", "der", "die", "m"]},
    {"date": ["Datum", "Daten", "das", "die", "n"]},
    {"daughter": ["Tochter", "Töchter", "die", "die", "f"]},
    {"Germany": ["Deutschland", "Deutschlande", "das", "die", "n"]},
    {"December": ["Dezember", "Dezembers", "der", "die", "m"]},
    {"discotheque": ["Diskothek", "Diskotheken", "die", "die", "f"]},
    {"cathedral": ["Dom", "Dome", "der", "die", "m"]},
    {"printer": ["Drucker", "Drucker", "der", "die", "m"]},
    {"village": ["Dorf", "Dörfer", "das", "die", "n"]},
    {"Tuesday": ["Dienstag", "Dienstage", "der", "die", "m"]}
  ],
  verbs: [
    {"to thank": ["danken", "danke", "dankst", "dankt", "dankt", "dankt", "danken", "dankt", "danken", "danken"]},
    {"to think": ["denken", "denke", "denkst", "denkt", "denkt", "denkt", "denken", "denkt", "denken", "denken"]},
    {"to serve": ["dienen", "diene", "dienst", "dient", "dient", "dient", "dienen", "dient", "dienen", "dienen"]},
    {"to be allowed to": ["dürfen", "darf", "darfst", "darf", "darf", "darf", "dürfen", "dürft", "dürfen", "dürfen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Tag ist schön.',
        english: 'The day is beautiful.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Datum ist wichtig.',
        english: 'The date is important.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Tochter spielt.',
        english: 'The daughter plays.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Deutschland ist groß.',
        english: 'Germany is big.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Dienstag ist heute.',
        english: 'Tuesday is today.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Tag.',
        english: 'I see day.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er hat ___ Datum.',
        english: 'He has date.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Tochter.',
        english: 'She visits daughter.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Wir brauchen ___ Drucker.',
        english: 'We need printer.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Du hast ___ Dorf.',
        english: 'You have village.',
        answer: 'das',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich danke ___ Tag.',
        english: 'I thank for the day.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie hilft ___ Tochter.',
        english: 'She helps daughter.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Er gibt ___ Kind ___ Datum.',
        english: 'He gives the child the date.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir sprechen mit ___ Dom.',
        english: 'We speak with the cathedral.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Dorf.',
        english: 'You go to the village.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The day is beautiful.',
        german: 'Der Tag ist schön.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The date is important.',
        german: 'Das Datum ist wichtig.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the day.',
        german: 'Ich sehe den Tag.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She helps the daughter.',
        german: 'Sie hilft der Tochter.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'Germany is big.',
        german: 'Das Deutschland ist groß.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to thank" for "I"?',
        answer: 'danke',
        verb: 'danken',
        verbEnglish: 'to thank',
        subject: 'ich',
        conjugation: 'danke'
      },
      {
        question: 'How do you conjugate "to thank" for "you" (informal)?',
        answer: 'dankst',
        verb: 'danken',
        verbEnglish: 'to thank',
        subject: 'du',
        conjugation: 'dankst'
      },
      {
        question: 'How do you conjugate "to think" for "he"?',
        answer: 'denkt',
        verb: 'denken',
        verbEnglish: 'to think',
        subject: 'er',
        conjugation: 'denkt'
      },
      {
        question: 'How do you conjugate "to serve" for "we"?',
        answer: 'dienen',
        verb: 'dienen',
        verbEnglish: 'to serve',
        subject: 'wir',
        conjugation: 'dienen'
      },
      {
        question: 'How do you conjugate "to be allowed to" for "they" (formal)?',
        answer: 'dürfen',
        verb: 'dürfen',
        verbEnglish: 'to be allowed to',
        subject: 'Sie',
        conjugation: 'dürfen'
      }
    ]
  }
}
