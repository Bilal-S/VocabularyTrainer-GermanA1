export const letterD = {
  nouns: [
    {
      german: 'der Tag',
      english: 'day',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Tage',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Datum',
      english: 'date',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Daten',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'die Tochter',
      english: 'daughter',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Töchter',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Deutschland',
      english: 'Germany',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Deutschlande',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Dezember',
      english: 'December',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Dezembers',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Diskothek',
      english: 'discotheque',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Diskotheken',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'der Dom',
      english: 'cathedral',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Dome',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Drucker',
      english: 'printer',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Drucker',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Dorf',
      english: 'village',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Dörfer',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Dienstag',
      english: 'Tuesday',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Dienstage',
      article: 'der',
      pluralArticle: 'die'
    }
  ],
  verbs: [
    {
      german: 'danken',
      english: 'to thank',
      type: 'verb',
      conjugations: {
        ich: 'danke',
        du: 'dankst',
        er: 'dankt',
        sie: 'dankt',
        es: 'dankt',
        wir: 'danken',
        ihr: 'dankt',
        sie: 'danken',
        Sie: 'danken'
      }
    },
    {
      german: 'denken',
      english: 'to think',
      type: 'verb',
      conjugations: {
        ich: 'denke',
        du: 'denkst',
        er: 'denkt',
        sie: 'denkt',
        es: 'denkt',
        wir: 'denken',
        ihr: 'denkt',
        sie: 'denken',
        Sie: 'denken'
      }
    },
    {
      german: 'dienen',
      english: 'to serve',
      type: 'verb',
      conjugations: {
        ich: 'diene',
        du: 'dienst',
        er: 'dient',
        sie: 'dient',
        es: 'dient',
        wir: 'dienen',
        ihr: 'dient',
        sie: 'dienen',
        Sie: 'dienen'
      }
    },
    {
      german: 'dürfen',
      english: 'to be allowed to',
      type: 'verb',
      conjugations: {
        ich: 'darf',
        du: 'darfst',
        er: 'darf',
        sie: 'darf',
        es: 'darf',
        wir: 'dürfen',
        ihr: 'dürft',
        sie: 'dürfen',
        Sie: 'dürfen'
      }
    }
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
