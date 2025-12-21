/**
 * User behavior simulator for realistic answer generation
 */
export class UserSimulator {
  constructor() {
    this.vocabularyManager = null
    this.correctnessRates = {
      vocabulary: 0.7,      // 70% correct for new vocabulary
      review: 0.6,          // 60% correct for review items
      plural: 0.65,          // 65% correct for plural forms
      articles: 0.7,        // 70% correct for article agreement
      translations: 0.75,    // 75% correct for case translations
      verbs: 0.8            // 80% correct for verb conjugation
    }
    this.errorRates = {
      umlaut: 0.15,        // 15% chance of umlaut error
      article: 0.1,         // 10% chance of article error
      spelling: 0.05,        // 5% chance of spelling error
      case: 0.1              // 10% chance of case error
    }
  }

  /**
   * Set vocabulary manager for answer generation
   */
  setVocabularyManager(manager) {
    this.vocabularyManager = manager
  }

  /**
   * Generate answers for vocabulary batch
   */
  generateVocabularyAnswers(batch) {
    return batch.map((item, index) => {
      const isCorrect = Math.random() < this.correctnessRates.vocabulary
      const answer = isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'vocabulary')
      
      return `${index + 1}. ${answer}`
    }).join('\n')
  }

  /**
   * Generate answers for plural drill batch
   */
  generatePluralAnswers(batch) {
    return batch.map((item, index) => {
      const isCorrect = Math.random() < this.correctnessRates.plural
      const answer = isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'plural')
      
      return `${index + 1}. ${answer}`
    }).join('\n')
  }

  /**
   * Generate answers for article agreement batch
   */
  generateArticlesAnswers(batch) {
    return batch.map((item, index) => {
      const isCorrect = Math.random() < this.correctnessRates.articles
      const answer = isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'articles')
      
      return `${index + 1}. ${answer}`
    }).join('\n')
  }

  /**
   * Generate answers for case translation batch
   */
  generateTranslationsAnswers(batch) {
    return batch.map((item, index) => {
      const isCorrect = Math.random() < this.correctnessRates.translations
      const answer = isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'translations')
      
      return `${index + 1}. ${answer}`
    }).join('\n')
  }

  /**
   * Generate answers for verb conjugation batch
   */
  generateVerbAnswers(batch) {
    return batch.map((item, index) => {
      const isCorrect = Math.random() < this.correctnessRates.verbs
      const answer = isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'verbs')
      
      return `${index + 1}. ${answer}`
    }).join('\n')
  }

  /**
   * Generate answers for review batch (single question mode)
   */
  generateReviewAnswer(item) {
    const isCorrect = Math.random() < this.correctnessRates.review
    return isCorrect ? item.answer : this.generateIncorrectAnswer(item, 'review')
  }

  /**
   * Generate incorrect answer based on error patterns
   */
  generateIncorrectAnswer(item, type) {
    if (!item.answer) return 'incorrect answer'

    let incorrectAnswer = item.answer

    // Apply different error patterns based on type
    if (type === 'vocabulary' || type === 'review') {
      // Vocabulary/Review errors: article mistakes, umlaut mistakes
      if (Math.random() < this.errorRates.article && item.answer.includes(' ')) {
        // Change article (der/die/das) for vocabulary
        incorrectAnswer = incorrectAnswer.replace(/^der /, 'die ').replace(/^die /, 'das ').replace(/^das /, 'der ')
      }
      
      if (Math.random() < this.errorRates.umlaut) {
        // Remove or add umlauts
        incorrectAnswer = this.addOrRemoveUmlauts(incorrectAnswer)
      }
    } else if (type === 'plural') {
      // Plural errors: wrong plural ending
      if (Math.random() < 0.5) {
        // Change plural ending
        incorrectAnswer = incorrectAnswer.replace(/e$/, 'er').replace(/er$/, 'e').replace(/en$/, 'e').replace(/e$/, 'en')
      }
    } else if (type === 'articles') {
      // Article agreement errors: gender/number mismatch
      if (Math.random() < 0.5) {
        // Change gender or number
        incorrectAnswer = incorrectAnswer.replace(/der/, 'die').replace(/die/, 'das').replace(/das/, 'der')
      }
    } else if (type === 'translations') {
      // Case translation errors: wrong case ending
      if (Math.random() < 0.5) {
        // Change case ending
        incorrectAnswer = incorrectAnswer.replace(/en$/, 'em').replace(/em$/, 'en').replace(/es$/, 'en')
      }
    } else if (type === 'verbs') {
      // Verb conjugation errors: wrong ending or wrong person
      if (Math.random() < 0.5) {
        // Change verb ending
        incorrectAnswer = incorrectAnswer.replace(/e$/, 'st').replace(/st$/, 'e').replace(/t$/, 'e')
      }
    }

    // Sometimes add spelling errors
    if (Math.random() < this.errorRates.spelling) {
      incorrectAnswer = this.addSpellingError(incorrectAnswer)
    }

    return incorrectAnswer
  }

  /**
   * Add or remove umlauts from text
   */
  addOrRemoveUmlauts(text) {
    const umlautMap = {
      'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss',
      'Ä': 'A', 'Ö': 'O', 'Ü': 'U'
    }

    const reverseUmlautMap = {
      'a': 'ä', 'o': 'ö', 'u': 'ü', 'ss': 'ß',
      'A': 'Ä', 'O': 'Ö', 'U': 'Ü'
    }

    // Randomly decide to add or remove umlauts
    if (Math.random() < 0.5) {
      // Remove umlauts
      return text.replace(/[äöüßÄÖÜ]/g, (match) => umlautMap[match] || match)
    } else {
      // Add umlauts (only to letters that commonly have umlauts)
      return text.replace(/[aouAOU]/g, (match) => {
        if (Math.random() < 0.3) { // 30% chance to add umlaut
          return reverseUmlautMap[match] || match
        }
        return match
      })
    }
  }

  /**
   * Add spelling error to text
   */
  addSpellingError(text) {
    if (text.length < 3) return text

    const errorTypes = [
      // Double letter
      () => {
        const pos = Math.floor(Math.random() * (text.length - 1))
        return text.slice(0, pos + 1) + text[pos] + text.slice(pos + 1)
      },
      // Missing letter
      () => {
        const pos = Math.floor(Math.random() * text.length)
        return text.slice(0, pos) + text.slice(pos + 1)
      },
      // Swapped letters
      () => {
        if (text.length < 2) return text
        const pos = Math.floor(Math.random() * (text.length - 1))
        return text.slice(0, pos) + text[pos + 1] + text[pos] + text.slice(pos + 2)
      }
    ]

    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)]
    return errorType()
  }

  /**
   * Generate realistic delay between answers (in milliseconds)
   */
  generateAnswerDelay() {
    // Simulate thinking time: 2-8 seconds
    return Math.floor(Math.random() * 6000) + 2000
  }

  /**
   * Simulate user completing a batch with delays
   */
  async simulateBatchCompletion(harness, answers, stepNumber) {
    const answerLines = answers.split('\n').filter(line => line.trim())
    
    for (let i = 0; i < answerLines.length; i++) {
      // Simulate user thinking
      await new Promise(resolve => setTimeout(resolve, this.generateAnswerDelay()))
      
      // Submit partial answers (simulate realistic behavior)
      const partialAnswers = answerLines.slice(0, i + 1).join('\n')
      await harness.handleAnswer(partialAnswers)
    }
  }

  /**
   * Simulate user completing review questions with delays
   */
  async simulateReviewCompletion(harness, batch) {
    for (let i = 0; i < batch.length; i++) {
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, this.generateAnswerDelay()))
      
      const answer = this.generateReviewAnswer(batch[i])
      await harness.handleAnswer(answer)
    }
  }
}