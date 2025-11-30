export const letterU = {
  nouns: [
    {"lesson": ["Unterricht", "Unterrichte", "der", "die", "m"]},
    {"signature": ["Unterschrift", "Unterschriften", "die", "die", "f"]},
    {"vacation": ["Urlaub", "Urlaube", "der", "die", "m"]},
    {"clock": ["Uhr", "Uhren", "die", "die", "f"]}
  ],
  verbs: [
    {"to stay overnight": ["übernachten", "übernachte", "übernachtest", "übernachtet", "übernachtet", "übernachtet", "übernachten", "übernachtet", "übernachten", "übernachten"]},
    {"to transfer": ["überweisen", "überweise", "überweist", "überweist", "überweist", "überweist", "überweisen", "überweist", "überweisen", "überweisen"]},
    {"to move": ["umziehen", "ziehe um", "ziehst um", "zieht um", "zieht um", "zieht um", "umziehen", "zieht um", "umziehen", "umziehen"]},
    {"to sign": ["unterschreiben", "unterschreibe", "unterschreibst", "unterschreibt", "unterschreibt", "unterschreibt", "unterschreiben", "unterschreibt", "unterschreiben", "unterschreiben"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Unterricht ist interessant.',
        english: 'The lesson is interesting.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Unterschrift ist schön.',
        english: 'The signature is beautiful.',
        answer: 'Die',
        case: 'nominative'
      },
      {
        german: '___ Urlaub ist kurz.',
        english: 'The vacation is short.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Uhr geht.',
        english: 'The clock is going.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich besuche ___ Unterricht.',
        english: 'I attend the lesson.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie braucht ___ Unterschrift.',
        english: 'She needs the signature.',
        answer: 'die',
        case: 'accusative'
      },
      {
        german: 'Er macht ___ Urlaub.',
        english: 'He makes the vacation.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir sehen ___ Uhr.',
        english: 'We see the clock.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Lehrer im ___ Unterricht.',
        english: 'I help the teacher in the lesson.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie geht zu ___ Urlaub.',
        english: 'She goes to the vacation.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er spricht mit ___ Schüler über ___ Unterricht.',
        english: 'He speaks with the student about the lesson.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir warten auf ___ Uhr.',
        english: 'We wait for the clock.',
        answer: 'die',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The lesson is interesting.',
        german: 'Der Unterricht ist interessant.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She needs the signature.',
        german: 'Sie braucht die Unterschrift.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the teacher.',
        german: 'Ich helfe dem Lehrer im Unterricht.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The vacation was beautiful.',
        german: 'Der Urlaub war schön.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'We attended the lesson.',
        german: 'Wir besuchten den Unterricht.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'She signed the document.',
        german: 'Sie unterschrieb das Dokument.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'He transferred the money.',
        german: 'Er überwies das Geld.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'They moved to Berlin.',
        german: 'Sie zogen nach Berlin um.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'I stayed overnight.',
        german: 'Ich übernachtete im Hotel.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The clock is new.',
        german: 'Die Uhr ist neu.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'You signed the contract.',
        german: 'Du unterschriebst den Vertrag.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The lesson was long.',
        german: 'Der Unterricht war lang.',
        type: 'translation',
        caseType: 'simple_past'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to stay overnight" for "I"?',
        answer: 'übernachte',
        verb: 'übernachten',
        verbEnglish: 'to stay overnight',
        subject: 'ich',
        conjugation: 'übernachte'
      },
      {
        question: 'How do you conjugate "to transfer" for "you" (informal)?',
        answer: 'überweist',
        verb: 'überweisen',
        verbEnglish: 'to transfer',
        subject: 'du',
        conjugation: 'überweist'
      },
      {
        question: 'How do you conjugate "to move" for "he"?',
        answer: 'zieht um',
        verb: 'umziehen',
        verbEnglish: 'to move',
        subject: 'er',
        conjugation: 'zieht um'
      },
      {
        question: 'What is the simple past of "to stay overnight" for "she"?',
        answer: 'übernachtete',
        verb: 'übernachten',
        verbEnglish: 'to stay overnight',
        subject: 'sie',
        conjugation: 'übernachtete'
      },
      {
        question: 'What is the simple past of "to transfer" for "we"?',
        answer: 'überwiesen',
        verb: 'überweisen',
        verbEnglish: 'to transfer',
        subject: 'wir',
        conjugation: 'überwiesen'
      },
      {
        question: 'What is the simple past of "to move" for "they"?',
        answer: 'zogen um',
        verb: 'umziehen',
        verbEnglish: 'to move',
        subject: 'sie',
        conjugation: 'zogen um'
      },
      {
        question: 'How do you conjugate "to sign" for "I"?',
        answer: 'unterschreibe',
        verb: 'unterschreiben',
        verbEnglish: 'to sign',
        subject: 'ich',
        conjugation: 'unterschreibe'
      },
      {
        question: 'What is the simple past of "to sign" for "she"?',
        answer: 'unterschrieb',
        verb: 'unterschreiben',
        verbEnglish: 'to sign',
        subject: 'sie',
        conjugation: 'unterschrieb'
      }
    ]
  }
}
