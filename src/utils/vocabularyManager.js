import { vocabularyData, getRandomNouns, getRandomVerbs, getSentencesByCase } from '../data/vocabulary.js'

export class VocabularyManager {
  constructor() {
    this.vocabulary = vocabularyData
    this.currentBatch = []
    this.currentBatchIndex = 0
  }

  // Generate Step 1: Review Previous Mistakes
  generateReviewBatch(reviewQueue, batchSize = 10) {
    // Get review items from vocabulary data
    const reviewItems = reviewQueue.map(word => {
      const noun = this.vocabulary.nouns.find(n => n.german === word)
      const verb = this.vocabulary.verbs.find(v => v.german === word)
      
      if (noun) {
        return {
          type: 'noun',
          question: `What is the German word for "${noun.english}"?`,
          answer: noun.german,
          word: noun.german,
          english: noun.english,
          gender: noun.gender,
          article: noun.article
        }
      } else if (verb) {
        return {
          type: 'verb',
          question: `What is the German word for "${verb.english}"?`,
          answer: verb.german,
          word: verb.german,
          english: verb.english
        }
      }
      return null
    }).filter(Boolean)

    this.currentBatch = reviewItems.slice(0, batchSize)
    this.currentBatchIndex = 0
    
    return this.currentBatch
  }

  // Generate Step 2: New Vocabulary (20 nouns)
  generateVocabularyBatch(exclude = [], batchSize = 20) {
    const nouns = getRandomNouns(batchSize, exclude)
    
    this.currentBatch = nouns.map(noun => ({
      type: 'vocabulary',
      question: `Provide the German translation for "${noun.english}" (include article)`,
      answer: noun.german,
      word: noun.german,
      english: noun.english,
      gender: noun.gender,
      article: noun.article,
      plural: noun.plural
    }))

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 3: Plural Practice (20 nouns)
  generatePluralBatch(exclude = [], batchSize = 20) {
    const nouns = getRandomNouns(batchSize, exclude)
    
    this.currentBatch = nouns.map(noun => ({
      type: 'plural',
      question: `What is the plural form of "${noun.german}"?`,
      answer: noun.plural,
      word: noun.german,
      singular: noun.german,
      plural: noun.plural,
      english: noun.english,
      article: noun.pluralArticle
    }))

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 4: Articles in Context (30 sentences: 10 each case)
  generateArticlesBatch() {
    const nominative = getSentencesByCase('nominative', 10)
    const accusative = getSentencesByCase('accusative', 10)
    const dative = getSentencesByCase('dative', 10)
    
    this.currentBatch = [
      ...nominative.map(s => ({ ...s, type: 'article', caseType: 'nominative' })),
      ...accusative.map(s => ({ ...s, type: 'article', caseType: 'accusative' })),
      ...dative.map(s => ({ ...s, type: 'article', caseType: 'dative' }))
    ]

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 5: Case Translations (30 sentences: 10 each case)
  generateTranslationBatch() {
    const translations = {
      nominative: [
        {
          english: 'The man is tall.',
          german: 'Der Mann ist groß.',
          type: 'translation',
          caseType: 'nominative'
        },
        {
          english: 'The woman works here.',
          german: 'Die Frau arbeitet hier.',
          type: 'translation',
          caseType: 'nominative'
        },
        {
          english: 'The child plays in the garden.',
          german: 'Das Kind spielt im Garten.',
          type: 'translation',
          caseType: 'nominative'
        }
      ],
      accusative: [
        {
          english: 'I see the man.',
          german: 'Ich sehe den Mann.',
          type: 'translation',
          caseType: 'accusative'
        },
        {
          english: 'He reads the book.',
          german: 'Er liest das Buch.',
          type: 'translation',
          caseType: 'accusative'
        },
        {
          english: 'She visits the woman.',
          german: 'Sie besucht die Frau.',
          type: 'translation',
          caseType: 'accusative'
        }
      ],
      dative: [
        {
          english: 'I give the book to the man.',
          german: 'Ich gebe dem Mann das Buch.',
          type: 'translation',
          caseType: 'dative'
        },
        {
          english: 'He helps the woman.',
          german: 'Er hilft der Frau.',
          type: 'translation',
          caseType: 'dative'
        },
        {
          english: 'I thank the child.',
          german: 'Ich danke dem Kind.',
          type: 'translation',
          caseType: 'dative'
        }
      ]
    }

    const allTranslations = [
      ...translations.nominative,
      ...translations.accusative,
      ...translations.dative
    ]

    this.currentBatch = allTranslations
    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 6: Verb Conjugation (3 rounds of 10 items)
  generateVerbBatch(exclude = [], batchSize = 10) {
    const verbs = getRandomVerbs(Math.ceil(batchSize / 2), exclude)
    const subjects = ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'Sie']
    
    this.currentBatch = []
    
    for (let i = 0; i < batchSize; i++) {
      const verb = verbs[i % verbs.length]
      const subject = subjects[i % subjects.length]
      
      this.currentBatch.push({
        type: 'conjugation',
        question: `How do you conjugate "${verb.english}" for "${subject}"?`,
        answer: verb.conjugations[subject],
        verb: verb.german,
        verbEnglish: verb.english,
        subject: subject,
        conjugation: verb.conjugations[subject]
      })
    }

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  getCurrentItem() {
    return this.currentBatch[this.currentBatchIndex] || null
  }

  moveToNext() {
    this.currentBatchIndex++
    return this.getCurrentItem()
  }

  getBatchProgress() {
    return {
      current: this.currentBatchIndex + 1,
      total: this.currentBatch.length,
      remaining: this.currentBatch.length - this.currentBatchIndex - 1,
      isComplete: this.currentBatchIndex >= this.currentBatch.length - 1
    }
  }

  resetBatch() {
    this.currentBatch = []
    this.currentBatchIndex = 0
  }

  // Validate user answers
  validateAnswer(userAnswer, correctAnswer, type) {
    const normalizedUser = userAnswer.trim().toLowerCase()
    const normalizedCorrect = correctAnswer.trim().toLowerCase()

    switch (type) {
      case 'noun':
      case 'verb':
      case 'plural':
      case 'conjugation':
        return normalizedUser === normalizedCorrect
      
      case 'article':
        // Accept multiple valid articles
        const validArticles = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'eines']
        return validArticles.includes(normalizedUser) && normalizedUser === normalizedCorrect
      
      case 'translation':
        // More flexible checking for translations
        return this.fuzzyMatch(normalizedUser, normalizedCorrect)
      
      default:
        return normalizedUser === normalizedCorrect
    }
  }

  fuzzyMatch(answer, correct) {
    // Simple fuzzy matching for translations
    const answerWords = answer.split(' ')
    const correctWords = correct.split(' ')
    
    if (answerWords.length !== correctWords.length) return false
    
    let matches = 0
    for (let i = 0; i < answerWords.length; i++) {
      if (answerWords[i] === correctWords[i] || 
          this.levenshteinDistance(answerWords[i], correctWords[i]) <= 1) {
        matches++
      }
    }
    
    return matches === correctWords.length
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}

export default VocabularyManager
