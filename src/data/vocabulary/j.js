export const letterJ = {
  nouns: [
    {
      german: 'der Januar',
      english: 'January',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Januare',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Juni',
      english: 'June',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Junis',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Juli',
      english: 'July',
      type: 'noun',
      gender: 'masculine',
      plural: 'the Julis',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'das Jahr',
      english: 'year',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Jahre',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Jäger',
      english: 'hunter',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Jäger',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Junge',
      english: 'boy',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Jungen',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'die Jacke',
      english: 'jacket',
      type: 'noun',
      gender: 'feminine',
      plural: 'die Jacken',
      article: 'die',
      pluralArticle: 'die'
    },
    {
      german: 'das Journal',
      english: 'journal, diary',
      type: 'noun',
      gender: 'neuter',
      plural: 'die Journale',
      article: 'das',
      pluralArticle: 'die'
    },
    {
      german: 'der Job',
      english: 'job',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Jobs',
      article: 'der',
      pluralArticle: 'die'
    },
    {
      german: 'der Saft',
      english: 'juice',
      type: 'noun',
      gender: 'masculine',
      plural: 'die Säfte',
      article: 'der',
      pluralArticle: 'die'
    }
  ],
  verbs: [
    {
      german: 'jagen',
      english: 'to hunt',
      type: 'verb',
      conjugations: {
        ich: 'jage',
        du: 'jagst',
        er: 'jagt',
        sie: 'jagt',
        es: 'jagt',
        wir: 'jagen',
        ihr: 'jagt',
        sie: 'jagen',
        Sie: 'jagen'
      }
    },
    {
      german: 'joinen',
      english: 'to join',
      type: 'verb',
      conjugations: {
        ich: 'joine',
        du: 'joinst',
        er: 'joint',
        sie: 'joint',
        es: 'joint',
        wir: 'joinen',
        ihr: 'joint',
        sie: 'joinen',
        Sie: 'joinen'
      }
    },
    {
      german: 'jubeln',
      english: 'to celebrate',
      type: 'verb',
      conjugations: {
        ich: 'jubele',
        du: 'jubelst',
        er: 'jubelt',
        sie: 'jubelt',
        es: 'jubelt',
        wir: 'jubeln',
        ihr: 'jubelt',
        sie: 'jubeln',
        Sie: 'jubeln'
      }
    }
  ],
  examples: {
    nominative: [
      {
        german: '___ Januar ist kalt.',
        english: 'January is cold.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Jahr beginnt.',
        english: 'The year begins.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Jäger kommt.',
        english: 'The hunter comes.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Junge spielt.',
        english: 'The boy plays.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Jacke ist neu.',
        english: 'The jacket is new.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Januar.',
        english: 'I see January.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Jahr.',
        english: 'He needs the year.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Jäger.',
        english: 'She visits the hunter.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Job.',
        english: 'We have the job.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Jacke.',
        english: 'You buy the jacket.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Jäger.',
        english: 'I help the hunter.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Jahr.',
        english: 'She gives the child the year.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Jäger.',
        english: 'He speaks with the hunter.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Junge.',
        english: 'We thank the boy.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Jäger.',
        english: 'You go to the hunter.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'January is cold.',
        german: 'Der Januar ist kalt.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The year begins.',
        german: 'Das Jahr beginnt.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see January.',
        german: 'Ich sehe den Januar.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the year.',
        german: 'Sie gibt dem Kind das Jahr.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The boy plays.',
        german: 'Der Junge spielt.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to hunt" for "I"?',
        answer: 'jage',
        verb: 'jagen',
        verbEnglish: 'to hunt',
        subject: 'ich',
        conjugation: 'jage'
      },
      {
        question: 'How do you conjugate "to join" for "you" (informal)?',
        answer: 'joinst',
        verb: 'joinen',
        verbEnglish: 'to join',
        subject: 'du',
        conjugation: 'joinst'
      },
      {
        question: 'How do you conjugate "to celebrate" for "he"?',
        answer: 'jubelt',
        verb: 'jubeln',
        verbEnglish: 'to celebrate',
        subject: 'er',
        conjugation: 'jubelt'
      },
      {
        question: 'How do you conjugate "to hunt" for "we"?',
        answer: 'jagen',
        verb: 'jagen',
        verbEnglish: 'to hunt',
        subject: 'wir',
        conjugation: 'jagen'
      },
      {
        question: 'How do you conjugate "to hunt" for "they" (formal)?',
        answer: 'jagen',
        verb: 'jagen',
        verbEnglish: 'to hunt',
        subject: 'Sie',
        conjugation: 'jagen'
      }
    ]
  }
}
