export const letterC = {
  nouns: [
    {
      german: 'der Chef',
      english: 'boss',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Chefs',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Café',
      english: 'café',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Cafés',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Computer',
      english: 'computer',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Computer',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Chance',
      english: 'chance',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Chancen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Cola',
      english: 'cola',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Colas',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'die Kultur',
      english: 'culture',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Kulturen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Konto',
      english: 'account (bank)',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Konten',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Cousin',
      english: 'cousin (male)',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Cousins',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Cousine',
      english: 'cousin (female)',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Cousinen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Konzert',
      english: 'concert',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Konzerte',
      article: 'das',
      pluralArticle: 'die'
    }
  ],
  verbs: [
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
      german: 'kaufen',
      english: 'to buy',
      type: 'verb',
      conjugations: {
        ich: 'kaufe',
        du: 'kaufst',
        er: 'kauft',
        sie: 'kauft',
        es: 'kauft',
        wir: 'kaufen',
        ihr: 'kauft',
        sie: 'kaufen',
        Sie: 'kaufen'
      }
    }
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
