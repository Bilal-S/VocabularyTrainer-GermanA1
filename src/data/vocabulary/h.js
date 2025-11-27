export const letterH = {
  nouns: [
    {
      german: 'der Haus',
      english: 'house',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Häuser',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Hafen',
      english: 'harbor, port',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Häfen',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Kopf',
      english: 'head',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Köpfe',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Handy',
      english: 'mobile phone',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Handys',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Hunger',
      english: 'hunger',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Hunge',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Herr',
      english: 'Mr., gentleman',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Herren',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Hobby',
      english: 'hobby',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Hobbys',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'das Herz',
      english: 'heart',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Herzen',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'die Hand',
      english: 'hand',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Hände',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Hotel',
      english: 'hotel',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Hotels',
      article: 'das',
      pluralArticle: 'die'
    }
  ],
  verbs: [
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
      german: 'heißen',
      english: 'to be called, to be named',
      type: 'verb',
      conjugations: {
        ich: 'heiße',
        du: 'heißt',
        er: 'heißt',
        sie: 'heißt',
        es: 'heißt',
        wir: 'heißen',
        ihr: 'heißt',
        sie: 'heißen',
        Sie: 'heißen'
      }
    },
    {
      german: 'helfen',
      english: 'to help',
      type: 'verb',
      conjugations: {
        ich: 'helfe',
        du: 'hilfst',
        er: 'hilft',
        sie: 'hilft',
        es: 'hilft',
        wir: 'helfen',
        ihr: 'helft',
        sie: 'helfen',
        Sie: 'helfen'
      }
    },
    {
      german: 'holen',
      english: 'to get, to fetch',
      type: 'verb',
      conjugations: {
        ich: 'hole',
        du: 'holst',
        er: 'holt',
        sie: 'holt',
        es: 'holt',
        wir: 'holen',
        ihr: 'holt',
        sie: 'holen',
        Sie: 'holen'
      }
    }
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
