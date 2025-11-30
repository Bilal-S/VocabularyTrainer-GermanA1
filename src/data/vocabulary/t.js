export const letterT = {
  nouns: [
    {"bag": ["Tasche", "Taschen", "die", "die", "f"]},
    {"taxi": ["Taxi", "Taxis", "das", "die", "n"]},
    {"tea": ["Tee", "Tees", "der", "die", "m"]},
    {"part": ["Teil", "Teile", "der", "die", "m"]},
    {"telephone": ["Telefon", "Telefone", "das", "die", "n"]},
    {"appointment": ["Termin", "Termine", "der", "die", "m"]},
    {"test": ["Test", "Tests", "der", "die", "m"]},
    {"text": ["Text", "Texte", "der", "die", "m"]},
    {"topic": ["Thema", "Themen", "das", "die", "n"]},
    {"ticket": ["Ticket", "Tickets", "das", "die", "n"]},
    {"table": ["Tisch", "Tische", "der", "die", "m"]},
    {"daughter": ["Tochter", "Töchter", "die", "die", "f"]},
    {"toilet": ["Toilette", "Toiletten", "die", "die", "f"]},
    {"tomato": ["Tomate", "Tomaten", "die", "die", "f"]},
    {"stairs": ["Treppe", "Treppen", "die", "die", "f"]}
  ],
  verbs: [
    {"to dance": ["tanzen", "tanze", "tanzt", "tanzt", "tanzt", "tanzt", "tanzen", "tanzt", "tanzen", "tanzen"]},
    {"to make a phone call": ["telefonieren", "telefoniere", "telefonierst", "telefoniert", "telefoniert", "telefoniert", "telefonieren", "telefoniert", "telefonieren", "telefonieren"]},
    {"to meet": ["treffen", "treffe", "triffst", "trifft", "trifft", "trifft", "treffen", "trefft", "treffen", "treffen"]},
    {"to drink": ["trinken", "trinke", "trinkst", "trinkt", "trinkt", "trinkt", "trinken", "trinkt", "trinken", "trinken"]},
    {"to do": ["tun", "tue", "tust", "tut", "tut", "tut", "tun", "tut", "tun", "tun"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Tasche ist neu.',
        english: 'The bag is new.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Taxi kommt.',
        english: 'The taxi is coming.',
        answer: 'Das',
        case: 'nominative'
      },
      {
        german: '___ Tee ist heiß.',
        english: 'The tea is hot.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Termin ist wichtig.',
        english: 'The appointment is important.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Test ist schwer.',
        english: 'The test is difficult.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Tisch ist hell.',
        english: 'The table is bright.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Tochter spielt.',
        english: 'The daughter is playing.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Toilette ist sauber.',
        english: 'The toilet is clean.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Tomate ist rot.',
        english: 'The tomato is red.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich kaufe ___ Tasche.',
        english: 'I buy the bag.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Sie nehme ___ Taxi.',
        english: 'She takes the taxi.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er trinkt ___ Tee.',
        english: 'He drinks the tea.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir brauchen ___ Termin.',
        english: 'We need the appointment.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Du schreibst ___ Test.',
        english: 'You write the test.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Ich lese ___ Text.',
        english: 'I read the text.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie kaufte ___ Ticket.',
        english: 'She bought the ticket.',
        answer: 'das',
        case: 'accusative'
      },
      {
        german: 'Er sieht ___ Tisch.',
        english: 'He sees the table.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir besuchen ___ Tochter.',
        english: 'We visit the daughter.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Tochter.',
        english: 'I help the daughter.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Sie spricht mit ___ Taxifahrer.',
        english: 'She speaks with the taxi driver.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er geht zu ___ Termin.',
        english: 'He goes to the appointment.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir sitzen an ___ Tisch.',
        english: 'We sit at the table.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Du arbeitest für ___ Test.',
        english: 'You work for the test.',
        answer: 'den',
        case: 'dative'
      },
      {
        german: 'Ich gebe ___ Kind ___ Tee.',
        english: 'I give the child the tea.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie dankt ___ Lehrer.',
        english: 'She thanks the teacher.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er kommt aus ___ Stadt.',
        english: 'He comes from the city.',
        answer: 'der',
        case: 'dative'
      },
      {
        german: 'Wir wohnen bei ___ Familie.',
        english: 'We live near the family.',
        answer: 'der',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The bag is new.',
        german: 'Die Tasche ist neu.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She takes the taxi.',
        german: 'Sie nimmt das Taxi.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the daughter.',
        german: 'Ich helfe der Tochter.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The tea is hot.',
        german: 'Der Tee ist heiß.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'We made the appointment.',
        german: 'Wir machten den Termin.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The test was difficult.',
        german: 'Der Test war schwierig.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'He drank the tea.',
        german: 'Er trank den Tee.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'She bought the ticket.',
        german: 'Sie kaufte das Ticket.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'We met the teacher.',
        german: 'Wir trafen den Lehrer.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'You danced well.',
        german: 'Du tanztest gut.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The daughter played.',
        german: 'Die Tochter spielte.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'I called the friend.',
        german: 'Ich telefonierte mit dem Freund.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'They drank coffee.',
        german: 'Sie tranken Kaffee.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The table was clean.',
        german: 'Der Tisch war sauber.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'You did the work.',
        german: 'Du tatst die Arbeit.',
        type: 'translation',
        caseType: 'simple_past'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to dance" for "I"?',
        answer: 'tanze',
        verb: 'tanzen',
        verbEnglish: 'to dance',
        subject: 'ich',
        conjugation: 'tanze'
      },
      {
        question: 'How do you conjugate "to drink" for "you" (informal)?',
        answer: 'trinkst',
        verb: 'trinken',
        verbEnglish: 'to drink',
        subject: 'du',
        conjugation: 'trinkst'
      },
      {
        question: 'How do you conjugate "to meet" for "he"?',
        answer: 'trifft',
        verb: 'treffen',
        verbEnglish: 'to meet',
        subject: 'er',
        conjugation: 'trifft'
      },
      {
        question: 'What is the simple past of "to dance" for "she"?',
        answer: 'tanzte',
        verb: 'tanzen',
        verbEnglish: 'to dance',
        subject: 'sie',
        conjugation: 'tanzte'
      },
      {
        question: 'What is the simple past of "to drink" for "we"?',
        answer: 'tranken',
        verb: 'trinken',
        verbEnglish: 'to drink',
        subject: 'wir',
        conjugation: 'tranken'
      },
      {
        question: 'What is the simple past of "to meet" for "they"?',
        answer: 'trafen',
        verb: 'treffen',
        verbEnglish: 'to meet',
        subject: 'sie',
        conjugation: 'trafen'
      },
      {
        question: 'How do you conjugate "to call" for "I"?',
        answer: 'telefoniere',
        verb: 'telefonieren',
        verbEnglish: 'to make a phone call',
        subject: 'ich',
        conjugation: 'telefoniere'
      },
      {
        question: 'How do you conjugate "to do" for "you" (informal)?',
        answer: 'tust',
        verb: 'tun',
        verbEnglish: 'to do',
        subject: 'du',
        conjugation: 'tust'
      },
      {
        question: 'What is the simple past of "to call" for "she"?',
        answer: 'telefonierte',
        verb: 'telefonieren',
        verbEnglish: 'to make a phone call',
        subject: 'sie',
        conjugation: 'telefonierte'
      },
      {
        question: 'What is the simple past of "to do" for "we"?',
        answer: 'taten',
        verb: 'tun',
        verbEnglish: 'to do',
        subject: 'wir',
        conjugation: 'taten'
      },
      {
        question: 'How do you conjugate "to do" for "they"?',
        answer: 'tun',
        verb: 'tun',
        verbEnglish: 'to do',
        subject: 'sie',
        conjugation: 'tun'
      },
      {
        question: 'What is the simple past of "to do" for "I"?',
        answer: 'tat',
        verb: 'tun',
        verbEnglish: 'to do',
        subject: 'ich',
        conjugation: 'tat'
      }
    ]
  }
}
