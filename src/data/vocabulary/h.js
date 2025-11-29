export const letterH = {
  nouns: [
    {"hair": ["Haar", "Haare", "das", "die", "n"]},
    {"chicken": ["Hähnchen", "Hähnchen", "das", "die", "n"]},
    {"half board": ["Halbpension", "Halbpensionen", "die", "die", "f"]},
    {"hall": ["Halle", "Hallen", "die", "die", "f"]},
    {"bus stop": ["Haltestelle", "Haltestellen", "die", "die", "f"]},
    {"hand": ["Hand", "Hände", "die", "die", "f"]},
    {"mobile phone": ["Handy", "Handys", "das", "die", "n"]},
    {"house": ["Haus", "Häuser", "das", "die", "n"]},
    {"homework": ["Hausaufgabe", "Hausaufgaben", "die", "die", "f"]},
    {"housewife": ["Hausfrau", "Hausfrauen", "die", "die", "f"]},
    {"houseman": ["Hausmann", "Hausmänner", "der", "die", "m"]},
    {"homeland": ["Heimat", "Heimaten", "die", "die", "f"]},
    {"stove": ["Herd", "Herde", "der", "die", "m"]},
    {"Mr., gentleman": ["Herr", "Herren", "der", "die", "m"]},
    {"help": ["Hilfe", "Hilfen", "die", "die", "f"]},
    {"hobby": ["Hobby", "Hobbys", "das", "die", "n"]},
    {"wedding": ["Hochzeit", "Hochzeiten", "die", "die", "f"]},
    {"hotel": ["Hotel", "Hotels", "das", "die", "n"]},
    {"dog": ["Hund", "Hunde", "der", "die", "m"]},
    {"hunger": ["Hunger", "Hunger", "der", "die", "m"]}
  ],
  verbs: [
    {"to have": ["haben", "habe", "hast", "hat", "hat", "hat", "haben", "habt", "haben", "haben"]},
    {"to hold": ["halten", "halte", "hälst", "hält", "hält", "hält", "halten", "haltet", "halten", "halten"]},
    {"to marry": ["heiraten", "heirate", "heiratest", "heiratet", "heiratet", "heiratet", "heiraten", "heiratet", "heiraten", "heiraten"]},
    {"to be called, to be named": ["heißen", "heiße", "heißt", "heißt", "heißt", "heißt", "heißen", "heißt", "heißen", "heißen"]},
    {"to help": ["helfen", "helfe", "hilfst", "hilft", "hilft", "hilft", "helfen", "helft", "helfen", "helfen"]},
    {"to get, to fetch": ["holen", "hole", "holst", "holt", "holt", "holt", "holen", "holt", "holen", "holen"]},
    {"to hear": ["hören", "höre", "hörst", "hört", "hört", "hört", "hören", "hört", "hören", "hören"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Haus ist groß.',
        english: 'The house is big.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Handy ist neu.',
        english: 'The mobile phone is new.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Herr kommt.',
        english: 'The gentleman comes.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Hobby ist interessant.',
        english: 'The hobby is interesting.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Herz schlägt.',
        english: 'The heart beats.',
        answer: 'Das',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Haus.',
        english: 'I see the house.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Handy.',
        english: 'He needs the mobile phone.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Herr.',
        english: 'She visits the gentleman.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Hobby.',
        english: 'We have the hobby.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Hotel.',
        english: 'You buy the hotel.',
        answer: 'das',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Herr.',
        english: 'I help the gentleman.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Haus.',
        english: 'She gives the child the house.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Herr.',
        english: 'He speaks with the gentleman.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Hobby.',
        english: 'We thank for the hobby.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Haus.',
        english: 'You go to the house.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The house is big.',
        german: 'Das Haus ist groß.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The mobile phone is new.',
        german: 'Das Handy ist neu.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the house.',
        german: 'Ich sehe das Haus.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the house.',
        german: 'Sie gibt dem Kind das Haus.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The hobby is interesting.',
        german: 'Das Hobby ist interessant.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to have" for "I"?',
        answer: 'habe',
        verb: 'haben',
        verbEnglish: 'to have',
        subject: 'ich',
        conjugation: 'habe'
      },
      {
        question: 'How do you conjugate "to be called" for "you" (informal)?',
        answer: 'heißt',
        verb: 'heißen',
        verbEnglish: 'to be called, to be named',
        subject: 'du',
        conjugation: 'heißt'
      },
      {
        question: 'How do you conjugate "to help" for "he"?',
        answer: 'hilft',
        verb: 'helfen',
        verbEnglish: 'to help',
        subject: 'er',
        conjugation: 'hilft'
      },
      {
        question: 'How do you conjugate "to get" for "we"?',
        answer: 'holen',
        verb: 'holen',
        verbEnglish: 'to get, to fetch',
        subject: 'wir',
        conjugation: 'holen'
      },
      {
        question: 'How do you conjugate "to have" for "they" (formal)?',
        answer: 'haben',
        verb: 'haben',
        verbEnglish: 'to have',
        subject: 'Sie',
        conjugation: 'haben'
      }
    ]
  }
}
