import { 
  getRandomLetters, 
  getAllNounsFromAllLetters,
  getAllVerbsFromAllLetters,
  getAllExamplesFromAllLetters,
  getVocabularyByLetter,
  getAvailableLetters,
  getExamplesByTypeAndLetters
} from '../data/vocabulary/index.js'
import { validationService } from '../services/answerProcessors/validationService.js'
import { generateVocabularyBatch } from '../services/exerciseGenerators/vocabularyGenerator.js'

export class VocabularyManager {
  constructor() {
    this.currentBatch = []
    this.currentBatchIndex = 0
    this.currentLetters = getRandomLetters(3) // Use 3 random letters for variety
    this.excludeList = []
  }

  // Helper methods for mastery checking
  isSingularFormMastered(word, state) {
    const progress = state.progress[word]
    return progress && progress.singular && progress.singular.correctCount >= state.settings.masteringCount
  }

  isPluralFormMastered(word, state) {
    const progress = state.progress[word]
    return progress && progress.plural && progress.plural.correctCount >= state.settings.masteringCount
  }

  isExerciseMastered(exerciseKey, state) {
    const progress = state.progress[exerciseKey]
    return progress && progress.singular && progress.singular.correctCount >= state.settings.maxReviewCount
  }

  // Verb conjugation mastery helpers
  isVerbConjugationMastered(verb, subject, state) {
    const key = `${verb}|${subject}`
    const progress = state.progress[key]
    return progress && progress.singular && progress.singular.correctCount >= state.settings.masteringCount
  }

  isVerbFullyMastered(verb, state) {
    const subjects = ['ich', 'du', 'er', 'sie (she)', 'es', 'wir', 'ihr', 'sie (they)', 'Sie']
    return subjects.every(subject => this.isVerbConjugationMastered(verb, subject, state))
  }

  getAvailableVerbCombinations(verbs, state) {
    const subjects = ['ich', 'du', 'er', 'sie (she)', 'es', 'wir', 'ihr', 'sie (they)', 'Sie']
    const combinations = []
    
    verbs.forEach(verb => {
      subjects.forEach(subject => {
        if (!this.isVerbConjugationMastered(verb.german, subject, state)) {
          combinations.push({
            verb: verb.german,
            verbEnglish: verb.english,
            subject: subject,
            conjugation: verb.conjugations[subject]
          })
        }
      })
    })
    
    return combinations
  }

  // Helper to get available nouns filtered by step-specific mastery
  getAvailableNounsForStep(excludeList, state, stepType) {
    const allNouns = getAllNounsFromAllLetters(excludeList)
    
    if (stepType === 'VOCABULARY') {
      // Filter out nouns with mastered singular forms
      return allNouns.filter(noun => !this.isSingularFormMastered(noun.german, state))
    } else if (stepType === 'PLURAL') {
      // Filter out nouns with mastered plural forms
      return allNouns.filter(noun => !this.isPluralFormMastered(noun.german, state))
    }
    
    return allNouns
  }

  // Helper to get available exercises filtered by mastery
  getAvailableExercisesForStep(exercises, state, stepType) {
    // Filter out exercises that are already mastered
    return exercises.filter(exercise => !this.isExerciseMastered(exercise.german || exercise.english, state))
  }

  // Generate Step 1: Review Previous Mistakes
  generateReviewBatch(reviewQueue, batchSize = 10) {
    if (!reviewQueue || reviewQueue.length === 0) {
      console.warn('No review queue items available')
      return []
    }

    console.log('Generating review batch with TRUE RANDOMIZATION:', {
      queueSize: reviewQueue.length,
      batchSize
    })

    // CRITICAL FIX: Remove duplicates from review queue first
    const uniqueReviewQueue = []
    const seenItems = new Set()
    
    for (const item of reviewQueue) {
      const itemWord = typeof item === 'string' ? item : item.word
      // Add a section to string-only items for consistent key creation
      const itemSection = typeof item === 'string' ? 'VOCABULARY' : item.section
      
      const uniqueKey = `${itemWord}|${itemSection}`
      
      if (!seenItems.has(uniqueKey)) {
        seenItems.add(uniqueKey)
        // If the original item was a string, push an object with the inferred section
        if (typeof item === 'string') {
          uniqueReviewQueue.push({ word: item, section: itemSection })
        } else {
          uniqueReviewQueue.push(item)
        }
      }
    }
    
    console.log('Removed duplicates from review queue:', {
      original: reviewQueue.length,
      unique: uniqueReviewQueue.length,
      duplicatesRemoved: reviewQueue.length - uniqueReviewQueue.length
    })

    // Shuffle review queue for random order each time
    const shuffledReviewQueue = [...uniqueReviewQueue].sort(() => 0.5 - Math.random())

    // Use all available letters to search for review items
    const allLetters = getAvailableLetters()
    
    // Find matching words from all letters with section-aware question generation
    const reviewItems = shuffledReviewQueue.map(item => {
      const itemWord = typeof item === 'string' ? item : item.word
      const section = typeof item === 'string' ? 'Unknown' : item.section
      
      // Handle verb conjugation pattern "verb|subject"
      let letterData = null
      let verbSubject = null
      
      if (section === 'VERBS' && itemWord && itemWord.includes('|')) {
        // This is a verb conjugation review item
        const [verb, subject] = itemWord.split('|')
        verbSubject = { verb, subject }
        letterData = this.findWordInLetters(verb, allLetters)
      } else {
        letterData = this.findWordInLetters(itemWord, allLetters)
      }
      
      // If noun/verb lookup failed, try finding an example if it's a sentence
      if (!letterData && itemWord && itemWord.includes(' ')) {
        // This is likely an Article or Translation sentence
        // We handle this inside the switch cases below now using findExampleByType
      }
      
      if (letterData) {
        // CRITICAL FIX: Generate section-aware review questions based on original mistake
        switch (section) {
          case 'PLURAL':
            if (letterData.type === 'noun') {
              // Use raw word without article for the question, but full plural with article for answer
              const displayWord = letterData.word || letterData.german.split(' ').pop()
              return {
                type: 'plural',
                form: 'plural', // Track that this is plural form review
                question: `What is plural form of "${displayWord}"?`,
                answer: letterData.plural,
                word: letterData.german, // CRITICAL FIX: Use full german (with article) to match review queue
                singular: letterData.german,
                plural: letterData.plural,
                english: letterData.english,
                article: letterData.pluralArticle,
                originSection: section
              }
            }
            break
            
          case 'VERBS':
            if (letterData.type === 'verb') {
              // Use same subject mapping as main verb generation for consistency
              const subjectMapping = {
                'ich': { clean: 'ich', display: 'ich' },
                'du': { clean: 'du', display: 'du' },
                'er': { clean: 'er', display: 'er' },
                'sie (she)': { clean: 'sie', display: 'sie (she)' },
                'es': { clean: 'es', display: 'es' },
                'wir': { clean: 'wir', display: 'wir' },
                'ihr': { clean: 'ihr', display: 'ihr' },
                'sie (they)': { clean: 'sie', display: 'sie (they)' },
                'Sie': { clean: 'Sie', display: 'Sie' }
              }
              
              // CRITICAL FIX: Use the specific subject from verbSubject if available, otherwise random
              let randomCleanSubject
              if (verbSubject && verbSubject.subject) {
                randomCleanSubject = verbSubject.subject
              } else {
                const cleanSubjects = Object.keys(subjectMapping)
                randomCleanSubject = cleanSubjects[Math.floor(Math.random() * cleanSubjects.length)]
              }
              
              const subjectObj = subjectMapping[randomCleanSubject]
              const conjugation = letterData.conjugations[randomCleanSubject]
              
              return {
                type: 'conjugation',
                question: `Conjugate "${letterData.english}" -> "${letterData.german}" for "${subjectObj.display}":`,
                answer: `${subjectObj.clean} ${conjugation}`,
                verb: letterData.german,
                verbEnglish: letterData.english,
                subject: subjectObj.display, // Keep display subject for reference
                cleanSubject: subjectObj.clean, // Store clean subject for validation
                conjugation: conjugation,
                word: `${letterData.german}|${randomCleanSubject}`, // Store with subject for progress tracking
                originSection: section
              }
            }
            break
            
          case 'VOCABULARY':
          default:
            // Default: vocabulary translation question
            if (letterData.type === 'noun') {
              return {
                type: 'noun',
                form: 'singular', // Track that this is singular form review
                question: `What is German word for "${letterData.english}"?`,
                answer: letterData.german,
                word: letterData.german,
                english: letterData.english,
                gender: letterData.gender,
                article: letterData.article,
                originSection: section
              }
            } else if (letterData.type === 'verb') {
              return {
                type: 'verb',
                question: `What is German word for "${letterData.english}"?`,
                answer: letterData.german,
                word: letterData.german,
                english: letterData.english,
                originSection: section
              }
            }
            break
        }
      } else {
        // Handle non-letter data (Articles, Translations)
        switch (section) {
          case 'ARTICLES':
            // CRITICAL FIX: Try to find the specific failed example using the stored sentence in the correct example type
            let articleExample = null
            if (itemWord && itemWord.includes(' ')) {
              // Search in nominative first, then accusative, then dative
              articleExample = this.findExampleByType(itemWord, 'nominative') ||
                              this.findExampleByType(itemWord, 'accusative') ||
                              this.findExampleByType(itemWord, 'dative')
            }
            
            // Fallback to random if not found (or if itemWord was missing)
            if (!articleExample) {
              console.log(`DEBUG: Using random article as fallback for "${itemWord}"`)
              const randomExamples = getExamplesByTypeAndLetters('articles', getRandomLetters(2), 1)
              articleExample = randomExamples[0]
            }

            if (articleExample) {
              console.log(`DEBUG: Generated article review item:`, {
                itemWord,
                articleExampleGerman: articleExample.german,
                wordKey: itemWord
              })
              return {
                type: 'article',
                question: `Fill in the blank(s): ${articleExample.german.replace('___', '_____')}`,
                answer: articleExample.answer || articleExample.german.match(/___\s*(\w+)/)?.[1] || articleExample.answer,
                word: itemWord, // CRITICAL FIX: Use original itemWord from review queue for progress tracking
                german: articleExample.german,
                english: articleExample.english,
                caseType: articleExample.caseType || articleExample.case || 'nominative',
                originSection: section
              }
            }
            break
            
          case 'TRANSLATIONS':
            // CRITICAL FIX: Try to find the specific failed example using the stored sentence in the 'translations' array only
            let transExample = null
            if (itemWord && itemWord.includes(' ')) {
              transExample = this.findExampleByType(itemWord, 'translations')
              console.log(`DEBUG: Looking for translation "${itemWord}":`, transExample ? 'FOUND' : 'NOT FOUND')
            }

            // Fallback to random if not found
            if (!transExample) {
              console.log(`DEBUG: Using random translation as fallback for "${itemWord}"`)
              const randomExamples = getExamplesByTypeAndLetters('translations', getRandomLetters(2), 1)
              transExample = randomExamples[0]
            }

            if (transExample) {
              console.log(`DEBUG: Generated translation review item:`, {
                itemWord,
                transExampleEnglish: transExample.english,
                wordKey: itemWord
              })
              return {
                type: 'translation',
                question: `Translate to German: "${transExample.english}"`,
                answer: transExample.german,
                word: itemWord, // CRITICAL FIX: Use original itemWord from review queue for progress tracking
                german: transExample.german,
                english: transExample.english,
                caseType: transExample.caseType || transExample.case || 'nominative',
                originSection: section
              }
            }
            break
        }
      }
      return null
    }).filter(Boolean)

    // CRITICAL FIX: Remove any null/duplicate items from the batch
    const uniqueBatch = []
    const seenQuestions = new Set()
    
    for (const item of reviewItems) {
      // Create a unique key for each question to detect duplicates
      // Use a more specific key to avoid flagging different question types for the same word as duplicates
      const questionKey = item.type === 'conjugation'
        ? `${item.verb}|${item.subject}`
        : `${item.word}|${item.originSection}`
      
      if (!seenQuestions.has(questionKey)) {
        seenQuestions.add(questionKey)
        uniqueBatch.push(item)
      } else {
        console.log(`DEBUG: Skipping duplicate question: ${questionKey}`)
      }
    }

    this.currentBatch = uniqueBatch.slice(0, batchSize)
    this.currentBatchIndex = 0
    
    console.log('Generated review batch:', {
      totalItems: reviewItems.length,
      uniqueItems: uniqueBatch.length,
      batchSize: this.currentBatch.length,
      duplicatesSkipped: reviewItems.length - uniqueBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 2: New Vocabulary (20 nouns)
  generateVocabularyBatch(exclude = [], batchSize = 20, state = null) {
    const combinedExclude = [...exclude, ...this.excludeList]
    
    // Check if we need to filter by mastery
    let availableNouns = null
    if (state) {
      availableNouns = this.getAvailableNounsForStep(combinedExclude, state, 'VOCABULARY')
      console.log('Using state-filtered nouns for vocabulary batch')
    }
    
    // Delegate to the vocabulary generator service
    // If availableNouns is null, service will fetch from all letters
    this.currentBatch = generateVocabularyBatch(combinedExclude, batchSize, availableNouns)

    this.currentBatchIndex = 0
    if (this.currentBatch.length > 0) {
      this.addToExcludeList(this.currentBatch.map(item => item.word))
    }
    
    return this.currentBatch
  }

  // Generate Step 3: Plural Practice (20 nouns)
  generatePluralBatch(exclude = [], batchSize = 20, state = null) {
    const combinedExclude = [...exclude, ...this.excludeList]
    console.log('Generating plural batch with TRUE RANDOMIZATION:', { 
      exclude: exclude.slice(0, 5), 
      excludeListSize: this.excludeList.length,
      totalCombinedExclude: combinedExclude.length,
      batchSize 
    })
    
    // CRITICAL FIX: Filter out nouns with mastered plural forms if state is provided
    let availableNouns
    if (state) {
      availableNouns = this.getAvailableNounsForStep(combinedExclude, state, 'PLURAL')
      console.log('After filtering mastered plural forms:', {
        originalCount: getAllNounsFromAllLetters(combinedExclude).length,
        filteredCount: availableNouns.length,
        batchSize
      })
    } else {
      availableNouns = getAllNounsFromAllLetters(combinedExclude)
    }
    
    if (!availableNouns || availableNouns.length === 0) {
      console.warn('No nouns available for plural batch (all may be mastered)')
      return []
    }

    // Take the requested batch size from the filtered array
    const selectedNouns = availableNouns.slice(0, batchSize)

    // CRITICAL FIX: Add debugging to see letter distribution
    const letterDistribution = {}
    selectedNouns.forEach(noun => {
      // Use full german word (including article) for letter distribution
      const germanWord = noun.german || noun.word || ''
      const firstLetter = germanWord.charAt(0).toLowerCase()
      letterDistribution[firstLetter] = (letterDistribution[firstLetter] || 0) + 1
    })

    console.log('DEBUG: Letter distribution in selected nouns:', letterDistribution)

    this.currentBatch = selectedNouns.map(noun => ({
      type: 'plural',
      form: 'plural', // Track that this is plural form practice
      question: `What is plural form of "${noun.german}"?`,
      answer: noun.plural,
      word: noun.german,
      singular: noun.german,
      plural: noun.plural,
      english: noun.english,
      article: noun.pluralArticle
    }))

    this.currentBatchIndex = 0
    this.addToExcludeList(selectedNouns.map(n => n.german))
    
    console.log('Generated plural batch with TRUE RANDOMIZATION:', {
      totalAvailable: availableNouns.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 4: Articles in Context (30 sentences: 10 each case)
  generateArticlesBatch(batchSize = 30, state = null) {
    console.log('Generating articles batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL examples from ALL letters for true randomization
    let nominative = getAllExamplesFromAllLetters('nominative')
    let accusative = getAllExamplesFromAllLetters('accusative')
    let dative = getAllExamplesFromAllLetters('dative')
    
    // Filter out mastered exercises if state is provided
    if (state) {
      nominative = this.getAvailableExercisesForStep(nominative, state, 'ARTICLES')
      accusative = this.getAvailableExercisesForStep(accusative, state, 'ARTICLES')
      dative = this.getAvailableExercisesForStep(dative, state, 'ARTICLES')
      
      console.log('After filtering mastered article exercises:', {
        originalNominative: getAllExamplesFromAllLetters('nominative').length,
        filteredNominative: nominative.length,
        originalAccusative: getAllExamplesFromAllLetters('accusative').length,
        filteredAccusative: accusative.length,
        originalDative: getAllExamplesFromAllLetters('dative').length,
        filteredDative: dative.length,
        batchSize
      })
    }
    
    if (!nominative || !accusative || !dative) {
      console.warn('No examples available for articles batch (all may be mastered)')
      return []
    }

    // Calculate items per case based on batch size (divide by 3 for equal distribution)
    const itemsPerCase = Math.floor(batchSize / 3)
    const remainingItems = batchSize - (itemsPerCase * 3)
    
    this.currentBatch = [
      ...nominative.slice(0, itemsPerCase + (remainingItems > 0 ? remainingItems : 0)).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'nominative' })),
      ...accusative.slice(0, itemsPerCase + (remainingItems > 1 ? 1 : 0)).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'accusative' })),
      ...dative.slice(0, itemsPerCase + (remainingItems > 2 ? 1 : 0)).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'dative' }))
    ]

    this.currentBatchIndex = 0
    
    console.log('Generated articles batch with TRUE RANDOMIZATION:', {
      totalNominative: nominative.length,
      totalAccusative: accusative.length,
      totalDative: dative.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 5: Case Translations (30 sentences: 10 each case)
  generateTranslationBatch(batchSize = 30, state = null) {
    console.log('Generating translation batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL translations from ALL letters for true randomization
    let translations = getAllExamplesFromAllLetters('translations')
    
    // Filter out mastered exercises if state is provided
    if (state) {
      translations = this.getAvailableExercisesForStep(translations, state, 'TRANSLATIONS')
      console.log('After filtering mastered translation exercises:', {
        originalCount: getAllExamplesFromAllLetters('translations').length,
        filteredCount: translations.length,
        batchSize
      })
    }
    
    if (!translations || translations.length === 0) {
      console.warn('No translations available for translation batch (all may be mastered)')
      return []
    }

    this.currentBatch = translations.slice(0, batchSize).map(t => ({
      ...t,
      word: t.english || t.german || 'unknown', // Use English prompt as ID for translations, fallback to german or 'unknown'
      answer: t.german, // Ensure answer property exists
      type: 'translation'
    }))

    this.currentBatchIndex = 0
    
    console.log('Generated translation batch with TRUE RANDOMIZATION:', {
      totalAvailable: translations.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 6: Verb Conjugation (configurable items)
  generateVerbBatch(exclude = [], batchSize = 10, state = null) {
    console.log('Generating verb batch with TRUE RANDOMIZATION:', {
      exclude: exclude.slice(0, 5),
      batchSize,
      hasState: !!state
    })
    
    // CRITICAL FIX: Use ALL verbs from ALL letters for true randomization
    const allVerbs = getAllVerbsFromAllLetters([...exclude, ...this.excludeList])
    
    if (!allVerbs || allVerbs.length === 0) {
      console.error('No verbs available for conjugation batch')
      return []
    }

    // If state is provided, filter by mastery
    let availableCombinations
    if (state) {
      availableCombinations = this.getAvailableVerbCombinations(allVerbs, state)
      console.log('After filtering mastered verb combinations:', {
        totalVerbs: allVerbs.length,
        totalCombinations: allVerbs.length * 9,
        availableCombinations: availableCombinations.length,
        batchSize
      })
      
      // Return empty if all combinations are mastered
      if (availableCombinations.length === 0) {
        console.log('All verb conjugations have been mastered!')
        return []
      }
    } else {
      // No state - generate all combinations
      const subjects = ['ich', 'du', 'er', 'sie (she)', 'es', 'wir', 'ihr', 'sie (they)', 'Sie']
      
      availableCombinations = []
      allVerbs.forEach(verb => {
        subjects.forEach(subject => {
          availableCombinations.push({
            verb: verb.german,
            verbEnglish: verb.english,
            subject: subject,
            conjugation: verb.conjugations[subject]
          })
        })
      })
    }

    // Shuffle combinations for randomness
    const shuffled = [...availableCombinations].sort(() => 0.5 - Math.random())
    
    // Take requested batch size
    const selectedCombinations = shuffled.slice(0, batchSize)
    
    // Create subject mapping for display
    const subjectMapping = {
      'ich': { clean: 'ich', display: 'ich' },
      'du': { clean: 'du', display: 'du' },
      'er': { clean: 'er', display: 'er' },
      'sie (she)': { clean: 'sie', display: 'sie (she)' },
      'es': { clean: 'es', display: 'es' },
      'wir': { clean: 'wir', display: 'wir' },
      'ihr': { clean: 'ihr', display: 'ihr' },
      'sie (they)': { clean: 'sie', display: 'sie (they)' },
      'Sie': { clean: 'Sie', display: 'Sie' }
    }
    
    // Format batch items
    this.currentBatch = selectedCombinations.map(combo => {
      const subjectObj = subjectMapping[combo.subject]
      return {
        type: 'conjugation',
        question: `Conjugate "${combo.verbEnglish}" -> "${combo.verb}" for "${subjectObj.display}":`,
        answer: `${subjectObj.clean} ${combo.conjugation}`,
        verb: combo.verb,
        verbEnglish: combo.verbEnglish,
        subject: subjectObj.display,
        cleanSubject: subjectObj.clean,
        conjugation: combo.conjugation,
        word: `${combo.verb}|${subjectObj.clean}` // CRITICAL FIX: Use verb|subject format for progress tracking
      }
    })

    this.currentBatchIndex = 0
    
    // Track unique verbs used
    const uniqueVerbs = [...new Set(selectedCombinations.map(c => c.verb))]
    this.addToExcludeList(uniqueVerbs)
    
    console.log('Generated verb batch with TRUE RANDOMIZATION:', {
      totalAvailable: availableCombinations.length,
      batchSize: this.currentBatch.length,
      uniqueVerbs: uniqueVerbs.length
    })
    
    return this.currentBatch
  }

  // Helper methods
  getLetterData(letter) {
    // Use actual alphabet-based vocabulary data
    return getVocabularyByLetter(letter)
  }

  findWordInLetters(word, letters) {
    for (const letter of letters) {
      const letterData = this.getLetterData(letter)
      if (letterData) {
        // CRITICAL FIX: Search both full german field and raw word field
        const noun = (letterData.nouns || []).find(n => 
          n.german === word || n.word === word
        )
        if (noun) return { ...noun, type: 'noun' }
        
        const verb = (letterData.verbs || []).find(v => 
          v.german === word || v.word === word
        )
        if (verb) return { ...verb, type: 'verb' }
      }
    }
    return null
  }

  // Find example by sentence (german or english)
  findExample(sentence) {
    const letters = getAvailableLetters()
    for (const letter of letters) {
      const letterData = this.getLetterData(letter)
      if (letterData && letterData.examples) {
        // Search in all example types
        for (const type of Object.keys(letterData.examples)) {
          const examples = letterData.examples[type] || []
          const found = examples.find(ex => 
            ex.german === sentence || ex.english === sentence
          )
          if (found) {
            return { ...found, type: 'example', exampleType: type }
          }
        }
      }
    }
    return null
  }

  // CRITICAL FIX: Find example by sentence and specific type (e.g., only search in 'translations')
  findExampleByType(sentence, exampleType) {
    const letters = getAvailableLetters()
    for (const letter of letters) {
      const letterData = this.getLetterData(letter)
      if (letterData && letterData.examples && letterData.examples[exampleType]) {
        const examples = letterData.examples[exampleType] || []
        const found = examples.find(ex => 
          ex.german === sentence || ex.english === sentence
        )
        if (found) {
          return { ...found, type: 'example', exampleType: exampleType }
        }
      }
    }
    return null
  }

  addToExcludeList(words) {
    this.excludeList = [...new Set([...this.excludeList, ...words])]
  }

  // DEBUG: Method to reset exclude list for testing
  resetExcludeList() {
    console.log('DEBUG: Resetting exclude list. Was:', this.excludeList.length, 'items')
    this.excludeList = []
    console.log('DEBUG: Exclude list reset to empty')
  }

  // DEBUG: Method to get exclude list size
  getExcludeListSize() {
    return this.excludeList.length
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

  validateAnswer(userAnswer, correctAnswer, type, exercise = null) {
    return validationService.validateAnswer(userAnswer, correctAnswer, type, exercise)
  }

  // Add normalizeAccents method to match what TestHarness expects
  normalizeAccents(text) {
    return validationService.normalizeUmlauts(text)
  }
}
