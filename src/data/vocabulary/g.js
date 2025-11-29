export const letterG = {
  nouns: [
    {"guest": ["Gast", "Gäste", "der", "die", "m"]},
    {"money": ["Geld", "Gelder", "das", "die", "n"]},
    {"garden": ["Garten", "Gärten", "der", "die", "m"]},
    {"gift, present": ["Geschenk", "Geschenke", "das", "die", "n"]},
    {"birthday": ["Geburtstag", "Geburtstage", "der", "die", "m"]},
    {"reason": ["Grund", "Gründe", "der", "die", "m"]},
    {"glass": ["Glas", "Gläser", "das", "die", "n"]},
    {"group": ["Gruppe", "Gruppen", "die", "die", "f"]},
    {"gift": ["Geschenk", "Geschenke", "das", "die", "n"]},
    {"god": ["Gott", "Götter", "der", "die", "m"]}
  ],
  verbs: [
    {"to give": ["geben", "gebe", "gibst", "gibt", "gibt", "gibt", "geben", "gebt", "geben", "geben"]},
    {"to go": ["gehen", "gehe", "gehst", "geht", "geht", "geht", "gehen", "geht", "gehen", "gehen"]},
    {"to believe": ["glauben", "glaube", "glaubst", "glaubt", "glaubt", "glaubt", "glauben", "glaubt", "glauben", "glauben"]},
    {"to greet": ["grüßen", "grüße", "grüßt", "grüßt", "grüßt", "grüßt", "grüßen", "grüßt", "grüßen", "grüßen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Gast kommt.',
        english: 'The guest comes.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Geld ist wichtig.',
        english: 'The money is important.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Garten ist schön.',
        english: 'The garden is beautiful.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Gruppe arbeitet.',
        english: 'The group works.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Geburtstag ist heute.',
        english: 'The birthday is today.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Gast.',
        english: 'I see guest.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Geld.',
        english: 'He needs money.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie besucht ___ Garten.',
        english: 'She visits garden.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Geschenk.',
        english: 'We have gift.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Du kaufst ___ Glas.',
        english: 'You buy glass.',
        answer: 'das',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Gast.',
        english: 'I help guest.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie gibt ___ Kind ___ Geschenk.',
        english: 'She gives the child a gift.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Gast.',
        english: 'He speaks with guest.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Gruppe.',
        english: 'We thank the group.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Du gehst zu ___ Gast.',
        english: 'You go to the guest.',
        answer: 'dem',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The guest comes.',
        german: 'Der Gast kommt.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'The money is important.',
        german: 'Das Geld ist wichtig.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'I see the guest.',
        german: 'Ich sehe den Gast.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'She gives the child a gift.',
        german: 'Sie gibt dem Kind das Geschenk.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The garden is beautiful.',
        german: 'Der Garten ist schön.',
        type: 'translation',
        caseType: 'nominative'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to give" for "I"?',
        answer: 'gebe',
        verb: 'geben',
        verbEnglish: 'to give',
        subject: 'ich',
        conjugation: 'gebe'
      },
      {
        question: 'How do you conjugate "to go" for "you" (informal)?',
        answer: 'gehst',
        verb: 'gehen',
        verbEnglish: 'to go',
        subject: 'du',
        conjugation: 'gehst'
      },
      {
        question: 'How do you conjugate "to believe" for "he"?',
        answer: 'glaubt',
        verb: 'glauben',
        verbEnglish: 'to believe',
        subject: 'er',
        conjugation: 'glaubt'
      },
      {
        question: 'How do you conjugate "to greet" for "we"?',
        answer: 'grüßen',
        verb: 'grüßen',
        verbEnglish: 'to greet',
        subject: 'wir',
        conjugation: 'grüßen'
      },
      {
        question: 'How do you conjugate "to give" for "they" (formal)?',
        answer: 'geben',
        verb: 'geben',
        verbEnglish: 'to give',
        subject: 'Sie',
        conjugation: 'geben'
      }
    ]
  }
}
