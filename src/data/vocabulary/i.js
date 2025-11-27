export const letterI = {
  nouns: [
    {
      german: 'der Insel',
      english: 'island',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Inseln',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'der Markt',
      english: 'market',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Märkte',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Park',
      english: 'park',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Parke',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Garten',
      english: 'garden',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Gärten',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Schreibtisch',
      english: 'desk',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Schreibtische',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Bild',
      english: 'picture, image',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Bilder',
      article: 'das',
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
      german: 'das Büro',
      english: 'office',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Büros',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Koffer',
      english: 'suitcase',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Koffer',
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
    }
  ],
  verbs: [
    {
      german: 'ignorieren',
      english: 'to ignore',
      type: 'verb',
      conjugations: {
        ich: 'ignoriere',
        du: 'ignorierst',
        er: 'ignoriert',
        sie: 'ignoriert',
        es: 'ignoriert',
        wir: 'ignorieren',
        ihr: 'ignoriert',
        sie: 'ignorieren',
        Sie: 'ignorieren'
      }
    },
    {
      german: 'importieren',
      english: 'to import',
      type: 'verb',
      conjugations: {
        ich: 'importiere',
        du: 'importierst',
        er: 'importiert',
        sie: 'importiert',
        es: 'importiert',
        wir: 'importieren',
        ihr: 'importiert',
        sie: 'importieren',
        Sie: 'importieren'
      }
    },
    {
      german: 'informieren',
      english: 'to inform',
      type: 'verb',
      conjugations: {
        ich: 'informiere',
        du: 'informierst',
        er: 'informiert',
        sie: 'informiert',
        es: 'informiert',
        wir: 'informieren',
        ihr: 'informiert',
        sie: 'informieren',
        Sie: 'informieren'
      }
    },
    {
      german: 'interessieren',
      english: 'to interest',
      type: 'verb',
      conjugations: {
        ich: 'interessiere',
        du: 'interessierst',
        er: 'interessiert',
        sie: 'interessiert',
        es: 'interessiert',
        wir: 'interessieren',
        ihr: 'interessiert',
        sie: 'interessieren',
        Sie: 'interessieren'
      }
    }
  ],
  examples: {
    nominative: [
      {
        german: '___ Insel ist schön.',
        english: 'The island is beautiful.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Markt ist groß.',
        english: 'The market is big.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Park ist grün.',
        english: 'The park is green.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Bild ist alt.',
        english: 'The picture is old.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Kind spielt.',
        english: 'The child plays.',
        answer: 'Das',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Insel.',
        english: 'I see the island.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Er besucht ___ Markt.',
        english: 'He visits the market.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie betritt ___ Park.',
        english: 'She enters the park.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir malen ___ Bild.',
        english: 'We paint the picture.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Du hast ___ Kind.',
        english: 'You have the child.',
        answer: 'das',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Kind.',
        english: 'I help the child.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Bild.',
        english: 'She gives the child the picture.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Kind.',
        english: 'He speaks with the child.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Kind.',
        english: 'We thank the child.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Kind.',
        english: 'You go to the child.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The island is beautiful.',
        german: 'Die Insel ist schön.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The market is big.',
        german: 'Der Markt ist groß.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the island.',
        german: 'Ich sehe die Insel.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the picture.',
        german: 'Sie gibt dem Kind das Bild.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The child plays.',
        german: 'Das Kind spielt.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to ignore" for "I"?',
        answer: 'ignoriere',
        verb: 'ignorieren',
        verbEnglish: 'to ignore',
        subject: 'ich',
        conjugation: 'ignoriere'
      },
      {
        question: 'How do you conjugate "to import" for "you" (informal)?',
        answer: 'importierst',
        verb: 'importieren',
        verbEnglish: 'to import',
        subject: 'du',
        conjugation: 'importierst'
      },
      {
        question: 'How do you conjugate "to inform" for "he"?',
        answer: 'informiert',
        verb: 'informieren',
        verbEnglish: 'to inform',
        subject: 'er',
        conjugation: 'informiert'
      },
      {
        question: 'How do you conjugate "to interest" for "we"?',
        answer: 'interessieren',
        verb: 'interessieren',
        verbEnglish: 'to interest',
        subject: 'wir',
        conjugation: 'interessieren'
      },
      {
        question: 'How do you conjugate "to ignore" for "they" (formal)?',
        answer: 'ignorieren',
        verb: 'ignorieren',
        verbEnglish: 'to ignore',
        subject: 'Sie',
        conjugation: 'ignorieren'
      }
    ]
  }
}
