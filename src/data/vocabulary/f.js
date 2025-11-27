export const letterF = {
  nouns: [
    {
      german: 'der Freund',
      english: 'friend (male)',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Freunde',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Freundin',
      english: 'friend (female)',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Freundinnen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Fenster',
      english: 'window',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Fenster',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Februar',
      english: 'February',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Februare',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Fahrrad',
      english: 'bicycle',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Fahrräder',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'die Familie',
      english: 'family',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Familien',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'die Frau',
      english: 'woman, wife',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Frauen',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Foto',
      english: 'photo',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Fotos',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Fußball',
      english: 'football, soccer',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Fußbälle',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Film',
      english: 'film, movie',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Filme',
      article: 'der',
      pluralArticle: 'die'
    }
  ],
  verbs: [
    {
      german: 'finden',
      english: 'to find',
      type: 'verb',
      conjugations: {
        ich: 'finde',
        du: 'findest',
        er: 'findet',
        sie: 'findet',
        es: 'findet',
        wir: 'finden',
        ihr: 'findet',
        sie: 'finden',
        Sie: 'finden'
      }
    },
    {
      german: 'fragen',
      english: 'to ask',
      type: 'verb',
      conjugations: {
        ich: 'frage',
        du: 'fragst',
        er: 'fragt',
        sie: 'fragt',
        es: 'fragt',
        wir: 'fragen',
        ihr: 'fragt',
        sie: 'fragen',
        Sie: 'fragen'
      }
    },
    {
      german: 'fahren',
      english: 'to drive, to travel',
      type: 'verb',
      conjugations: {
        ich: 'fahre',
        du: 'fährst',
        er: 'fährt',
        sie: 'fährt',
        es: 'fährt',
        wir: 'fahren',
        ihr: 'fahrt',
        sie: 'fahren',
        Sie: 'fahren'
      }
    },
    {
      german: 'fallen',
      english: 'to fall',
      type: 'verb',
      conjugations: {
        ich: 'falle',
        du: 'fällst',
        er: 'fällt',
        sie: 'fällt',
        es: 'fällt',
        wir: 'fallen',
        ihr: 'fallt',
        sie: 'fallen',
        Sie: 'fallen'
      }
    }
  ],
  examples: {
    nominative: [
      {
        german: '___ Freund kommt.',
        english: 'The friend comes.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Fenster ist offen.',
        english: 'The window is open.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Familie ist groß.',
        english: 'The family is big.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Frau arbeitet.',
        english: 'The woman works.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Film ist gut.',
        english: 'The film is good.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Freund.',
        english: 'I see the friend.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er öffnet ___ Fenster.',
        english: 'He opens the window.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Familie.',
        english: 'She visits the family.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Wir machen ___ Foto.',
        english: 'We take a photo.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Film.',
        english: 'You buy the film.',
        answer: 'den',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Freund.',
        english: 'I help the friend.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Fahrrad.',
        english: 'She gives the child the bicycle.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Familie.',
        english: 'He speaks with the family.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Frau.',
        english: 'We thank the woman.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Freund.',
        english: 'You go to the friend.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The friend comes.',
        german: 'Der Freund kommt.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The window is open.',
        german: 'Das Fenster ist offen.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the friend.',
        german: 'Ich sehe den Freund.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the bicycle.',
        german: 'Sie gibt dem Kind das Fahrrad.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The family is big.',
        german: 'Die Familie ist groß.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to find" for "I"?',
        answer: 'finde',
        verb: 'finden',
        verbEnglish: 'to find',
        subject: 'ich',
        conjugation: 'finde'
      },
      {
        question: 'How do you conjugate "to ask" for "you" (informal)?',
        answer: 'fragst',
        verb: 'fragen',
        verbEnglish: 'to ask',
        subject: 'du',
        conjugation: 'fragst'
      },
      {
        question: 'How do you conjugate "to drive" for "he"?',
        answer: 'fährt',
        verb: 'fahren',
        verbEnglish: 'to drive, to travel',
        subject: 'er',
        conjugation: 'fährt'
      },
      {
        question: 'How do you conjugate "to fall" for "we"?',
        answer: 'fallen',
        verb: 'fallen',
        verbEnglish: 'to fall',
        subject: 'wir',
        conjugation: 'fallen'
      },
      {
        question: 'How do you conjugate "to find" for "they" (formal)?',
        answer: 'finden',
        verb: 'finden',
        verbEnglish: 'to find',
        subject: 'Sie',
        conjugation: 'finden'
      }
    ]
  }
}
