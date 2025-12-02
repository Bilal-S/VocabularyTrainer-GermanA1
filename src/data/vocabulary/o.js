export const letterO = {
  nouns: [
    {"fruit": ["Obst", "Obst", "das", "die", "n"]},
    {"oil": ["Öl", "Öle", "das", "die", "n"]},
    {"grandma": ["Oma", "Omas", "die", "die", "f"]},
    {"grandpa": ["Opa", "Opas", "der", "die", "m"]},
    {"order": ["Ordnung", "Ordnungen", "die", "die", "f"]},
    {"place": ["Ort", "Orte", "der", "die", "m"]},
    {"ear": ["Ohr", "Ohren", "das", "die", "n"]}
  ],
  verbs: [
    {"to open": ["öffnen", "öffne", "öffnest", "öffnet", "öffnet", "öffnet", "öffnen", "öffnet", "öffnen", "öffnen"]},
    {"to arrange": ["ordnen", "ordne", "ordnest", "ordnet", "ordnet", "ordnet", "ordnen", "ordnet", "ordnen", "ordnen"]},
    {"to operate": ["operieren", "operiere", "operierst", "operiert", "operiert", "operiert", "operieren", "operiert", "operieren", "operieren"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Obst ist frisch.',
        english: 'The fruit is fresh.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Öl ist teuer.',
        english: 'The oil is expensive.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Oma kommt.',
        english: 'The grandma is coming.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Opa arbeitet.',
        english: 'The grandpa is working.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Ordnung ist gut.',
        english: 'The order is good.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Ort ist schön.',
        english: 'The place is beautiful.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich kaufe ___ Obst.',
        english: 'I buy the fruit.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie braucht ___ Öl.',
        english: 'She needs the oil.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er besucht ___ Oma.',
        english: 'He visits the grandma.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Wir sehen ___ Opa.',
        english: 'We see the grandpa.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Du machst ___ Ordnung.',
        english: 'You make the order.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Ich suche ___ Ort.',
        english: 'I search for the place.',
        answer: 'den',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Oma.',
        english: 'I help the grandma.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Sie geht zu ___ Opa.',
        english: 'She goes to the grandpa.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Oma über ___ Ordnung.',
        english: 'He speaks with the grandma about the order.',
        answer: 'der die',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Opa.',
        english: 'We thank the grandpa.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du sitzt bei ___ Oma.',
        english: 'You sit with the grandma.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Ich komme aus ___ Ort.',
        english: 'I come from the place.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The fruit is fresh.',
        german: 'Das Obst ist frisch.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She buys the oil.',
        german: 'Sie kauft das Öl.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the grandma.',
        german: 'Ich helfe der Oma.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The grandpa works hard.',
        german: ['Der Opa arbeitet hart.', 'Der Großvater arbeitet hart.'],
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'We open the door.',
        german: 'Wir öffnen die Tür.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'The order is good.',
        german: 'Die Ordnung ist gut.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'He finds the place.',
        german: 'Er findet den Ort.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'The oil is cheap.',
        german: 'Das Öl ist billig.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'Grandma loves the fruit.',
        german: ['Die Oma liebt das Obst.', 'Die Großmutter liebt das Obst.'],
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'Grandpa opens the window.',
        german: ['Der Opa öffnet das Fenster.', 'Der Großvater öffnet das Fenster.'],
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I come from this place.',
        german: 'Ich komme aus diesem Ort.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'She makes order.',
        german: 'Sie macht Ordnung.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'We thank the grandma.',
        german: ['Wir danken der Oma.', 'Wir danken der Großmutter.'],
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The place is beautiful.',
        german: 'Der Ort ist schön.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'You open the bottle.',
        german: 'Du öffnest die Flasche.',
        type: 'translation',
        caseType: 'accusative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to open" for "I"?',
        answer: 'öffne',
        verb: 'öffnen',
        verbEnglish: 'to open',
        subject: 'ich',
        conjugation: 'öffne'
      },
      {
        question: 'How do you conjugate "to open" for "you" (informal)?',
        answer: 'öffnest',
        verb: 'öffnen',
        verbEnglish: 'to open',
        subject: 'du',
        conjugation: 'öffnest'
      },
      {
        question: 'What is the simple past of "to open" for "she"?',
        answer: 'öffnete',
        verb: 'öffnen',
        verbEnglish: 'to open',
        subject: 'sie',
        conjugation: 'öffnete'
      },
      {
        question: 'What is the simple past of "to open" for "we"?',
        answer: 'öffneten',
        verb: 'öffnen',
        verbEnglish: 'to open',
        subject: 'wir',
        conjugation: 'öffneten'
      },
      {
        question: 'What is the simple past of "to open" for "they"?',
        answer: 'öffneten',
        verb: 'öffnen',
        verbEnglish: 'to open',
        subject: 'sie',
        conjugation: 'öffneten'
      }
    ]
  }
}
