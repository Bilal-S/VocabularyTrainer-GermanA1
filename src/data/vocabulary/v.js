export const letterV = {
  nouns: [
    {"father": ["Vater", "Väter", "der", "die", "m"]},
    {"club": ["Verein", "Vereine", "der", "die", "m"]},
    {"seller": ["Verkäufer", "Verkäufer", "der", "die", "m"]},
    {"relative": ["Verwandte", "Verwandten", "der", "die", "m"]},
    {"forer": ["Vorname", "Vornamen", "der", "die", "m"]},
    {"caution": ["Vorsicht", "Vorsichten", "die", "die", "f"]},
    {"area code": ["Vorwahl", "Vorwahlen", "die", "die", "f"]}
  ],
  verbs: [
    {"to earn": ["verdienen", "verdiene", "verdienst", "verdient", "verdient", "verdient", "verdienen", "verdienst", "verdienen", "verdienen"]},
    {"to sell": ["verkaufen", "verkaufe", "verkaufst", "verkauft", "verkauft", "verkauft", "verkaufen", "verkauft", "verkaufen", "verkaufen"]},
    {"to rent out": ["vermieten", "vermieste", "vermietest", "vermietet", "vermietet", "vermietet", "vermieten", "vermietet", "vermieten", "vermieten"]},
    {"to understand": ["verstehen", "verstehe", "verstehst", "versteht", "versteht", "versteht", "verstehen", "versteht", "verstehen", "verstehen"]},
    {"to imagine": ["vorstellen", "stelle vor", "stellst vor", "stellt vor", "stellt vor", "stellt vor", "vorstellen", "stellt vor", "vorstellen", "vorstellen"]}
  ],
  examples: {
    nominative: [
      {
        german: '___ Vater arbeitet.',
        english: 'The father works.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Verein ist groß.',
        english: 'The club is large.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Verkäufer hilft.',
        english: 'The seller helps.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Verwandte kommt.',
        english: 'The relative is coming.',
        answer: 'Der',
        case: 'nominative'
      },
      {
        german: '___ Vorsicht ist wichtig.',
        english: 'The caution is important.',
        answer: 'Die',
        case: 'nominative'
      }
    ],
    accusative: [
      {
        german: 'Ich besuche ___ Vater.',
        english: 'I visit the father.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Sie braucht ___ Verkäufer.',
        english: 'She needs the seller.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Er sieht ___ Verwandte.',
        english: 'He sees the relative.',
        answer: 'den',
        case: 'accusative'
      },
      {
        german: 'Wir haben ___ Vorsicht.',
        english: 'We have the caution.',
        answer: 'die',
        case: 'accusative'
      }
    ],
    dative: [
      {
        german: 'Ich helfe ___ Vater.',
        english: 'I help the father.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Sie spricht mit ___ Verkäufer.',
        english: 'She speaks with the seller.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Er geht zu ___ Verein.',
        english: 'He goes to the club.',
        answer: 'dem',
        case: 'dative'
      },
      {
        german: 'Wir danken ___ Verwandten.',
        english: 'We thank the relatives.',
        answer: 'den',
        case: 'dative'
      }
    ],
    translations: [
      {
        english: 'The father works.',
        german: 'Der Vater arbeitet.',
        type: 'translation',
        caseType: 'nominative'
      },
      {
        english: 'She needs the seller.',
        german: 'Sie braucht den Verkäufer.',
        type: 'translation',
        caseType: 'accusative'
      },
      {
        english: 'I help the father.',
        german: 'Ich helfe dem Vater.',
        type: 'translation',
        caseType: 'dative'
      },
      {
        english: 'The club was large.',
        german: 'Der Verein war groß.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'We understood the lesson.',
        german: 'Wir verstanden die Stunde.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'He sold the car.',
        german: 'Er verkaufte das Auto.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'She imagined the problem.',
        german: 'Sie stellte sich das Problem vor.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'They earned money.',
        german: 'Sie verdienten Geld.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'I rented the apartment.',
        german: 'Ich vermietete die Wohnung.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'The relative came yesterday.',
        german: 'Der Verwandte kam gestern.',
        type: 'translation',
        caseType: 'simple_past'
      },
      {
        english: 'You showed caution.',
        german: 'Du zeigtest Vorsicht.',
        type: 'translation',
        caseType: 'simple_past'
      }
    ],
    conjugations: [
      {
        question: 'How do you conjugate "to earn" for "I"?',
        answer: 'verdiene',
        verb: 'verdienen',
        verbEnglish: 'to earn',
        subject: 'ich',
        conjugation: 'verdiene'
      },
      {
        question: 'How do you conjugate "to sell" for "you" (informal)?',
        answer: 'verkaufst',
        verb: 'verkaufen',
        verbEnglish: 'to sell',
        subject: 'du',
        conjugation: 'verkaufst'
      },
      {
        question: 'How do you conjugate "to understand" for "he"?',
        answer: 'versteht',
        verb: 'verstehen',
        verbEnglish: 'to understand',
        subject: 'er',
        conjugation: 'versteht'
      },
      {
        question: 'What is the simple past of "to earn" for "she"?',
        answer: 'verdiente',
        verb: 'verdienen',
        verbEnglish: 'to earn',
        subject: 'sie',
        conjugation: 'verdiente'
      },
      {
        question: 'What is the simple past of "to sell" for "we"?',
        answer: 'verkauften',
        verb: 'verkaufen',
        verbEnglish: 'to sell',
        subject: 'wir',
        conjugation: 'verkauften'
      },
      {
        question: 'What is the simple past of "to understand" for "they"?',
        answer: 'verstanden',
        verb: 'verstehen',
        verbEnglish: 'to understand',
        subject: 'sie',
        conjugation: 'verstanden'
      },
      {
        question: 'How do you conjugate "to rent out" for "I"?',
        answer: 'vermieste',
        verb: 'vermieten',
        verbEnglish: 'to rent out',
        subject: 'ich',
        conjugation: 'vermieste'
      },
      {
        question: 'What is the simple past of "to imagine" for "she"?',
        answer: 'stellte vor',
        verb: 'vorstellen',
        verbEnglish: 'to imagine',
        subject: 'sie',
        conjugation: 'stellte vor'
      },
      {
        question: 'What is the simple past of "to rent out" for "we"?',
        answer: 'vermieteten',
        verb: 'vermieten',
        verbEnglish: 'to rent out',
        subject: 'wir',
        conjugation: 'vermieteten'
      },
      {
        question: 'How do you conjugate "to imagine" for "I"?',
        answer: 'stelle vor',
        verb: 'vorstellen',
        verbEnglish: 'to imagine',
        subject: 'ich',
        conjugation: 'stelle vor'
      },
      {
        question: 'What is the simple past of "to understand" for "I"?',
        answer: 'verstand',
        verb: 'verstehen',
        verbEnglish: 'to understand',
        subject: 'ich',
        conjugation: 'verstand'
      },
      {
        question: 'What is the simple past of "to sell" for "she"?',
        answer: 'verkaufte',
        verb: 'verkaufen',
        verbEnglish: 'to sell',
        subject: 'sie',
        conjugation: 'verkaufte'
      }
    ]
  }
}
