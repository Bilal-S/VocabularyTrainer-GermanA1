export const letterF = {
  nouns: [
    {"friend (male)": ["Freund", "Freunde", "der", "die", "m"]},
    {"friend (female)": ["Freundin", "Freundinnen", "die", "die", "f"]},
    {"window": ["Fenster", "Fenster", "das", "die", "n"]},
    {"February": ["Februar", "Februare", "der", "die", "m"]},
    {"bicycle": ["Fahrrad", "Fahrräder", "das", "die", "n"]},
    {"family": ["Familie", "Familien", "die", "die", "f"]},
    {"woman, wife": ["Frau", "Frauen", "die", "die", "f"]},
    {"photo": ["Foto", "Fotos", "das", "die", "n"]},
    {"football, soccer": ["Fußball", "Fußbälle", "der", "die", "m"]},
    {"film, movie": ["Film", "Filme", "der", "die", "m"]}
  ],
  verbs: [
    {"to find": ["finden", "finde", "findest", "findet", "findet", "findet", "finden", "findet", "finden", "finden"]},
    {"to ask": ["fragen", "frage", "fragst", "fragt", "fragt", "fragt", "fragen", "fragt", "fragen", "fragen"]},
    {"to drive, to travel": ["fahren", "fahre", "fährst", "fährt", "fährt", "fährt", "fahren", "fahrt", "fahren", "fahren"]},
    {"to fall": ["fallen", "falle", "fällst", "fällt", "fällt", "fällt", "fallen", "fallt", "fallen", "fallen"]}
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
