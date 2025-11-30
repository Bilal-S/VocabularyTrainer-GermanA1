export const letterN = {
  nouns: [
    {"name": ["Name", "Namen", "der", "die", "m"]},
    {"number": ["Nummer", "Nummern", "die", "die", "f"]}
  ],
  verbs: [
    {"to take": ["nehmen", "nehme", "nimmst", "nimmt", "nimmt", "nimmt", "nehmen", "nehmt", "nehmen", "nehmen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Name ist kurz.',
        english: 'The name is short.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Nummer ist wichtig.',
        english: 'The number is important.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich brauche ___ Name.',
        english: 'I need the name.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie wählt ___ Nummer.',
        english: 'She chooses the number.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Mann mit ___ Namen.',
        english: 'I help the man with the name.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie ruft bei ___ Nummer an.',
        english: 'She calls at the number.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The name is short.',
        german: 'Der Name ist kurz.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She chose the number.',
        german: 'Sie wählte die Nummer.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'I took the book.',
        german: 'Ich nahm das Buch.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The man took the name.',
        german: 'Der Mann nahm den Namen.',
        type: 'translation',
        caseType: 'simple_past'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to take" for "I"?',
        answer: 'nehme',
        verb: 'nehmen',
        verbEnglish: 'to take',
        subject: 'ich',
        conjugation: 'nehme'
      },
      {
        question: 'What is the simple past of "to take" for "she"?',
        answer: 'nahm',
        verb: 'nehmen',
        verbEnglish: 'to take',
        subject: 'sie',
        conjugation: 'nahm'
      }
    ]
  }
}
