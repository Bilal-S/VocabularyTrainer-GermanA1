export const letterE = {
  nouns: [
    {"meal, food": ["Essen", "Essen", "das", "die", "n"]},
    {"email": ["E-Mail", "E-Mails", "die", "die", "f"]},
    {"apology": ["Entschuldigung", "Entschuldigungen", "die", "die", "f"]},
    {"experience": ["Erfahrung", "Erfahrungen", "die", "die", "f"]},
    {"married couple": ["Ehepaar", "Ehepaare", "das", "die", "n"]},
    {"purchase, shopping": ["Einkauf", "Einkäufe", "der", "die", "m"]},
    {"invitation": ["Einladung", "Einladungen", "das", "die", "n"]},
    {"parents": ["Eltern", "Eltern", "die", "die", "p"]},
    {"granddaughter": ["Enkelin", "Enkelinnen", "die", "die", "f"]},
    {"strawberry": ["Erdbeere", "Erdbeeren", "die", "die", "f"]}
  ],
  verbs: [
    {"to tell, to count": ["erzählen", "erzähle", "erzählst", "erzählt", "erzählt", "erzählt", "erzählen", "erzählt", "erzählen", "erzählen"]},
    {"to remember": ["erinnern", "erinnere", "erinnerst", "erinnert", "erinnert", "erinnert", "erinnern", "erinnert", "erinnern", "erinnern"]},
    {"to allow": ["erlauben", "erlaube", "erlaubst", "erlaubt", "erlaubt", "erlaubt", "erlauben", "erlaubt", "erlauben", "erlauben"]},
    {"to eat": ["essen", "esse", "isst", "isst", "isst", "isst", "essen", "esst", "essen", "essen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Essen ist fertig.',
        english: 'The meal is ready.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ E-Mail ist wichtig.',
        english: 'The email is important.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Erfahrung ist gut.',
        english: 'The experience is good.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Eltern sind hier.',
        english: 'The parents are here.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Einladung kommt.',
        english: 'The invitation comes.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich koche ___ Essen.',
        english: 'I cook meal.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er schreibt ___ E-Mail.',
        english: 'He writes email.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Sie braucht ___ Erfahrung.',
        english: 'She needs experience.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Einladung.',
        english: 'We have invitation.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Einkauf.',
        english: 'You make the purchase.',
        answer: 'den',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Eltern.',
        english: 'I help the parents.',
        answer: 'den',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Essen.',
        english: 'She gives the child the meal.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Eltern.',
        english: 'He speaks with the parents.',
        answer: 'den',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Erfahrung.',
        english: 'We thank for the experience.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Einladung.',
        english: 'You go to the invitation.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The meal is ready.',
        german: 'Das Essen ist fertig.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The email is important.',
        german: 'Die E-Mail ist wichtig.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I cook the meal.',
        german: 'Ich koche das Essen.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child the meal.',
        german: 'Sie gibt dem Kind das Essen.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The parents are here.',
        german: 'Die Eltern sind hier.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to tell" for "I"?',
        answer: 'erzähle',
        verb: 'erzählen',
        verbEnglish: 'to tell, to count',
        subject: 'ich',
        conjugation: 'erzähle'
      },
      {
        question: 'How do you conjugate "to remember" for "you" (informal)?',
        answer: 'erinnerst',
        verb: 'erinnern',
        verbEnglish: 'to remember',
        subject: 'du',
        conjugation: 'erinnerst'
      },
      {
        question: 'How do you conjugate "to allow" for "he"?',
        answer: 'erlaubt',
        verb: 'erlauben',
        verbEnglish: 'to allow',
        subject: 'er',
        conjugation: 'erlaubt'
      },
      {
        question: 'How do you conjugate "to eat" for "we"?',
        answer: 'essen',
        verb: 'essen',
        verbEnglish: 'to eat',
        subject: 'wir',
        conjugation: 'essen'
      },
      {
        question: 'How do you conjugate "to remember" for "they" (formal)?',
        answer: 'erinnern',
        verb: 'erinnern',
        verbEnglish: 'to remember',
        subject: 'Sie',
        conjugation: 'erinnern'
      }
    ]
  }
}
