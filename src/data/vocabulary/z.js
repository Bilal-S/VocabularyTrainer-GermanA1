export const letterZ = {
  nouns: [
    {"number": ["Zahl", "Zahlen", "die", "die", "f"]},
    {"time": ["Zeit", "Zeiten", "die", "die", "f"]},
    {"newspaper": ["Zeitung", "Zeitungen", "die", "die", "f"]},
    {"room": ["Zimmer", "Zimmer", "das", "die", "n"]},
    {"tooth": ["Zahn", "Zähne", "der", "die", "m"]},
    {"onion": ["Zwiebel", "Zwiebeln", "die", "die", "f"]},
    {"return": ["Zurück", "Zurück", "das", "die", "n"]},
    {"train": ["Zug", "Züge", "der", "die", "m"]}
  ],
  verbs: [
    {"to go back": ["zurückgehen", "gehe zurück", "gehst zurück", "geht zurück", "geht zurück", "geht zurück", "zurückgehen", "geht zurück", "zurückgehen", "zurückgehen"]},
    {"to drive": ["fahren", "fahre", "fährst", "fährt", "fährt", "fährt", "fahren", "fahrt", "fahren", "fahren"]},
    {"to pull": ["ziehen", "ziehe", "ziehst", "zieht", "zieht", "zieht", "ziehen", "zieht", "ziehen", "ziehen"]},
    {"to count": ["zählen", "zähle", "zählst", "zählt", "zählt", "zählt", "zählen", "zählt", "zählen", "zählen"]},
    {"to show": ["zeigen", "zeige", "zeigst", "zeigt", "zeigt", "zeigt", "zeigen", "zeigt", "zeigen", "zeigen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Zimmer ist groß.',
        english: 'The room is large.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Zug kommt.',
        english: 'The train is coming.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Zahl ist wichtig.',
        english: 'The number is important.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Zeit ist kurz.',
        english: 'The time is short.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Zeitung ist da.',
        english: 'The newspaper is here.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Zahn tut weh.',
        english: 'The tooth hurts.',
        answer: 'Der',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich sehe ___ Zimmer.',
        english: 'I see the room.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Sie nehme ___ Zug.',
        english: 'She takes the train.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er braucht ___ Zeit.',
        english: 'He needs the time.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Wir lesen ___ Zeitung.',
        english: 'We read the newspaper.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Du zählst ___ Zahl.',
        english: 'You count the number.',
        answer: 'die',
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
        german: 'Sie geht zu ___ Zimmer.',
        english: 'She goes to the room.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Lehrer.',
        english: 'He speaks with the teacher.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir sitzen in ___ Zimmer.',
        english: 'We sit in the room.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du kommst aus ___ Stadt.',
        english: 'You come from the city.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The room is large.',
        german: 'Das Zimmer ist groß.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She takes the train.',
        german: 'Sie nimmt den Zug.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the child.',
        german: 'Ich helfe dem Kind.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The train was late.',
        german: 'Der Zug war spät.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'We counted the numbers.',
        german: 'Wir zählten die Zahlen.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'He showed the way.',
        german: 'Er zeigte den Weg.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'They went back home.',
        german: 'Sie gingen nach Hause zurück.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'She drove the car.',
        german: 'Sie fuhr das Auto.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'I pulled the door.',
        german: 'Ich zog die Tür.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The number was high.',
        german: 'Die Zahl war hoch.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'You showed the book.',
        german: 'Du zeigtest das Buch.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'We went back to school.',
        german: 'Wir gingen zur Schule zurück.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'He counted to ten.',
        german: 'Er zählte bis zehn.',
        type: 'translation',
        caseType: 'simple_past'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to go back" for "I"?',
        answer: 'gehe zurück',
        verb: 'zurückgehen',
        verbEnglish: 'to go back',
        subject: 'ich',
        conjugation: 'gehe zurück'
      },
      {
        question: 'How do you conjugate "to count" for "you" (informal)?',
        answer: 'zählst',
        verb: 'zählen',
        verbEnglish: 'to count',
        subject: 'du',
        conjugation: 'zählst'
      },
      {
        question: 'How do you conjugate "to show" for "he"?',
        answer: 'zeigt',
        verb: 'zeigen',
        verbEnglish: 'to show',
        subject: 'er',
        conjugation: 'zeigt'
      },
      {
        question: 'What is the simple past of "to go back" for "she"?',
        answer: 'ging zurück',
        verb: 'zurückgehen',
        verbEnglish: 'to go back',
        subject: 'sie',
        conjugation: 'ging zurück'
      },
      {
        question: 'What is the simple past of "to count" for "we"?',
        answer: 'zählten',
        verb: 'zählen',
        verbEnglish: 'to count',
        subject: 'wir',
        conjugation: 'zählten'
      },
      {
        question: 'What is the simple past of "to show" for "they"?',
        answer: 'zeigten',
        verb: 'zeigen',
        verbEnglish: 'to show',
        subject: 'sie',
        conjugation: 'zeigten'
      },
      {
        question: 'How do you conjugate "to drive" for "I"?',
        answer: 'fahre',
        verb: 'fahren',
        verbEnglish: 'to drive',
        subject: 'ich',
        conjugation: 'fahre'
      },
      {
        question: 'What is the simple past of "to drive" for "she"?',
        answer: 'fuhr',
        verb: 'fahren',
        verbEnglish: 'to drive',
        subject: 'sie',
        conjugation: 'fuhr'
      },
      {
        question: 'What is the simple past of "to pull" for "we"?',
        answer: 'zogen',
        verb: 'ziehen',
        verbEnglish: 'to pull',
        subject: 'wir',
        conjugation: 'zogen'
      },
      {
        question: 'How do you conjugate "to pull" for "I"?',
        answer: 'ziehe',
        verb: 'ziehen',
        verbEnglish: 'to pull',
        subject: 'ich',
        conjugation: 'ziehe'
      },
      {
        question: 'What is the simple past of "to drive" for "they"?',
        answer: 'fuhren',
        verb: 'fahren',
        verbEnglish: 'to drive',
        subject: 'sie',
        conjugation: 'fuhren'
      }
    ]
  }
}
