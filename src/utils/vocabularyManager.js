import { 
  getRandomLetters, 
  getNounsFromLetters, 
  getVerbsFromLetters, 
  getExamplesByTypeAndLetters,
  getAllNounsFromAllLetters,
  getAllVerbsFromAllLetters,
  getAllExamplesFromAllLetters,
  initializeVocabularyPools,
  getVocabularyByLetter,
  getAvailableLetters
} from '../data/vocabulary/index.js'

export class VocabularyManager {
  constructor() {
    this.currentBatch = []
    this.currentBatchIndex = 0
    this.currentLetters = getRandomLetters(3) // Use 3 random letters for variety
    this.excludeList = []
  }

  // CRITICAL FIX: Add umlaut substitution helper
  // the sss is for ß replacement as convenient shorthand
  normalizeUmlauts(text) {
    return text
      .replace(/ue/g, 'ü')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/Ue/g, 'Ü')
      .replace(/Oe/g, 'Ö')
      .replace(/Ae/g, 'Ä')
      .replace(/sss/g, 'ß')
  }

  // Helper to find synonyms based on English translation
  getSynonyms(englishWord) {
    if (!englishWord) return []
    // CRITICAL FIX: Use getAllNounsFromAllLetters to find potential synonyms
    const allNouns = getAllNounsFromAllLetters()
    return allNouns.filter(n => n.english.toLowerCase() === englishWord.toLowerCase())
  }

  // Helper to check if two German words are synonyms (same English meaning)
  areGermanWordsSynonyms(germanWord1, germanWord2, englishWord) {
    if (!englishWord) return false;
    
    // Get all nouns with the same English word
    const synonyms = this.getSynonyms(englishWord);
    
    // Check if both words are in the synonyms list
    const normalizedWord1 = this.normalizeUmlauts(germanWord1);
    const normalizedWord2 = this.normalizeUmlauts(germanWord2);
    
    const foundWords = synonyms.filter(syn => {
      const normalizedSyn = this.normalizeUmlauts(syn.german);
      return normalizedSyn === normalizedWord1 || normalizedSyn === normalizedWord2;
    });
    
    // If both words are found in the synonyms list, they are synonyms
    return foundWords.length >= 2;
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

    // CRITICAL FIX: Shuffle review queue for random order each time
    const shuffledReviewQueue = [...reviewQueue].sort(() => 0.5 - Math.random())

    // Use all available letters to search for review items
    const allLetters = getAvailableLetters()
    
    // Find matching words from all letters with section-aware question generation
    const reviewItems = shuffledReviewQueue.map(item => {
      const itemWord = typeof item === 'string' ? item : item.word
      const section = typeof item === 'string' ? 'Unknown' : item.section
      
      const letterData = this.findWordInLetters(itemWord, allLetters)
      
      // If noun/verb lookup failed, try finding an example if it's a sentence
      if (!letterData && itemWord && itemWord.includes(' ')) {
        // This is likely an Article or Translation sentence
        // We handle this inside the switch cases below now using findExample
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
                word: displayWord,
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
              
              const cleanSubjects = Object.keys(subjectMapping)
              const randomCleanSubject = cleanSubjects[Math.floor(Math.random() * cleanSubjects.length)]
              const subjectObj = subjectMapping[randomCleanSubject]
              const conjugation = letterData.conjugations[randomCleanSubject]
              
              return {
                type: 'conjugation',
                question: `Conjugate "${letterData.english}" for "${subjectObj.display}" (e.g., "ich bin"):`,
                answer: `${subjectObj.clean} ${conjugation}`,
                verb: letterData.german,
                verbEnglish: letterData.english,
                subject: subjectObj.display, // Keep display subject for reference
                cleanSubject: subjectObj.clean, // Store clean subject for validation
                conjugation: conjugation,
                word: letterData.german,
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
            // Try to find the specific failed example using the stored sentence
            let articleExample = null
            if (itemWord && itemWord.includes(' ')) {
              articleExample = this.findExample(itemWord)
            }
            
            // Fallback to random if not found (or if itemWord was missing)
            if (!articleExample) {
              const randomExamples = getExamplesByTypeAndLetters('articles', getRandomLetters(2), 1)
              articleExample = randomExamples[0]
            }

            if (articleExample) {
              return {
                type: 'article',
                question: `Fill in the blank(s): ${articleExample.german.replace('___', '_____')}`,
                answer: articleExample.answer || articleExample.german.match(/___\s*(\w+)/)?.[1] || articleExample.answer,
                german: articleExample.german,
                english: articleExample.english,
                caseType: articleExample.caseType || articleExample.case || 'nominative',
                originSection: section
              }
            }
            break
            
          case 'TRANSLATIONS':
            // Try to find the specific failed example using the stored sentence
            let transExample = null
            if (itemWord && itemWord.includes(' ')) {
              transExample = this.findExample(itemWord)
            }

            // Fallback to random if not found
            if (!transExample) {
              const randomExamples = getExamplesByTypeAndLetters('translations', getRandomLetters(2), 1)
              transExample = randomExamples[0]
            }

            if (transExample) {
              return {
                type: 'translation',
                question: `Translate to German: "${transExample.english}"`,
                answer: transExample.german,
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

    this.currentBatch = reviewItems.slice(0, batchSize)
    this.currentBatchIndex = 0
    
    return this.currentBatch
  }

  // Generate Step 2: New Vocabulary (20 nouns)
  generateVocabularyBatch(exclude = [], batchSize = 20) {
    const combinedExclude = [...exclude, ...this.excludeList]
    console.log('Generating vocabulary batch with TRUE RANDOMIZATION:', { 
      exclude: exclude.slice(0, 5), 
      excludeListSize: this.excludeList.length,
      totalCombinedExclude: combinedExclude.length,
      batchSize 
    })
    
    // CRITICAL FIX: Use ALL nouns from ALL letters for true randomization
    const allNouns = getAllNounsFromAllLetters(combinedExclude)
    
    if (!allNouns || allNouns.length === 0) {
      console.error('No nouns available from vocabulary database')
      return []
    }

    // Take the requested batch size from the shuffled all-nouns array
    const selectedNouns = allNouns.slice(0, batchSize)

    // CRITICAL FIX: Add debugging to see letter distribution
    const letterDistribution = {}
    selectedNouns.forEach(noun => {
      // Use the full german word (including article) for letter distribution
      const germanWord = noun.german || noun.word || ''
      const firstLetter = germanWord.charAt(0).toLowerCase()
      letterDistribution[firstLetter] = (letterDistribution[firstLetter] || 0) + 1
    })

    console.log('DEBUG: Letter distribution in selected nouns:', letterDistribution)

    // Ensure we have proper noun structure
    const validNouns = selectedNouns.filter(noun => 
      noun && 
      noun.german && 
      noun.english && 
      noun.article
    )

    if (validNouns.length === 0) {
      console.error('No valid nouns found in generated batch')
      return []
    }

    this.currentBatch = validNouns.map(noun => ({
      type: 'vocabulary',
      form: 'singular', // Track that this is singular form practice
      question: `Provide German translation for "${noun.english}" (include article)`,
      answer: noun.german,
      word: noun.german,
      english: noun.english,
      gender: noun.gender,
      article: noun.article,
      plural: noun.plural
    }))

    this.currentBatchIndex = 0
    this.addToExcludeList(validNouns.map(n => n.german))
    
    console.log('Generated vocabulary batch with TRUE RANDOMIZATION:', {
      totalAvailable: allNouns.length,
      batchSize: this.currentBatch.length,
      firstItem: this.currentBatch[0]
    })
    
    return this.currentBatch
  }

  // Generate Step 3: Plural Practice (20 nouns)
  generatePluralBatch(exclude = [], batchSize = 20) {
    const combinedExclude = [...exclude, ...this.excludeList]
    console.log('Generating plural batch with TRUE RANDOMIZATION:', { 
      exclude: exclude.slice(0, 5), 
      excludeListSize: this.excludeList.length,
      totalCombinedExclude: combinedExclude.length,
      batchSize 
    })
    
    // CRITICAL FIX: Use ALL nouns from ALL letters for true randomization
    const allNouns = getAllNounsFromAllLetters(combinedExclude)
    
    if (!allNouns || allNouns.length === 0) {
      console.error('No nouns available for plural batch')
      console.error('DEBUG: Exclude list might be too large. Available letters check:')
      
      // DEBUG: Check what's available across all letters
      const availableLetters = getAvailableLetters()
      const debugInfo = {}
      availableLetters.forEach(letter => {
        const letterData = getVocabularyByLetter(letter)
        const availableNouns = (letterData.nouns || []).filter(noun => 
          !combinedExclude.includes(noun.german)
        )
        debugInfo[letter] = availableNouns.length
      })
      console.error('DEBUG: Available nouns by letter after exclude filtering:', debugInfo)
      return []
    }

    // Take the requested batch size from the shuffled all-nouns array
    const selectedNouns = allNouns.slice(0, batchSize)

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
      totalAvailable: allNouns.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 4: Articles in Context (30 sentences: 10 each case)
  generateArticlesBatch() {
    console.log('Generating articles batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL examples from ALL letters for true randomization
    const nominative = getAllExamplesFromAllLetters('nominative')
    const accusative = getAllExamplesFromAllLetters('accusative')
    const dative = getAllExamplesFromAllLetters('dative')
    
    if (!nominative || !accusative || !dative) {
      console.error('No examples available for articles batch')
      return []
    }

    this.currentBatch = [
      ...nominative.slice(0, 10).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'nominative' })),
      ...accusative.slice(0, 10).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'accusative' })),
      ...dative.slice(0, 10).map(s => ({ ...s, word: s.german, type: 'article', caseType: 'dative' }))
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
  generateTranslationBatch() {
    console.log('Generating translation batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL translations from ALL letters for true randomization
    const translations = getAllExamplesFromAllLetters('translations')
    
    if (!translations || translations.length === 0) {
      console.error('No translations available for translation batch')
      return []
    }

    this.currentBatch = translations.slice(0, 30).map(t => ({
      ...t,
      word: t.english, // Use English prompt as ID for translations
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

  // Generate Step 6: Verb Conjugation (3 rounds of 10 items)
  generateVerbBatch(exclude = [], batchSize = 10) {
    console.log('Generating verb batch with TRUE RANDOMIZATION:', { exclude: exclude.slice(0, 5), batchSize })
    
    // CRITICAL FIX: Use ALL verbs from ALL letters for true randomization
    const allVerbs = getAllVerbsFromAllLetters([...exclude, ...this.excludeList])
    
    if (!allVerbs || allVerbs.length === 0) {
      console.error('No verbs available for conjugation batch')
      return []
    }

    // Use explicit subjects to distinguish between singular "she" and plural "they"
    // Create mapping for clean subject vs display subject
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
    
    const displaySubjects = Object.values(subjectMapping)
    const cleanSubjects = Object.keys(subjectMapping)
    
    this.currentBatch = []
    for (let i = 0; i < batchSize; i++) {
      const verb = allVerbs[i % allVerbs.length]
      const cleanSubject = cleanSubjects[i % cleanSubjects.length]
      const subjectObj = subjectMapping[cleanSubject]
      const conjugation = verb.conjugations[cleanSubject]
      
      this.currentBatch.push({
        type: 'conjugation',
        question: `Conjugate "${verb.english}" for "${subjectObj.display}" (e.g., "ich bin"):`,
        answer: `${subjectObj.clean} ${conjugation}`, // Store clean subject in answer
        verb: verb.german,
        verbEnglish: verb.english,
        subject: subjectObj.display, // Keep display subject for reference
        cleanSubject: subjectObj.clean, // Store clean subject for validation
        conjugation: conjugation,
        word: verb.german // For progress tracking
      })
    }

    this.currentBatchIndex = 0
    this.addToExcludeList(allVerbs.slice(0, Math.ceil(batchSize / 2)).map(v => v.german))
    
    console.log('Generated verb batch with TRUE RANDOMIZATION:', {
      totalAvailable: allVerbs.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Helper methods
  getLetterData(letter) {
    // Use the actual alphabet-based vocabulary data
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

  // CRITICAL FIX: Implement case-sensitive validation for German answers
  validateAnswer(userAnswer, correctAnswer, type, exercise = null) {
    if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
      console.warn('validateAnswer called with missing arguments', { userAnswer, correctAnswer, type });
      return false;
    }
  
    // CRITICAL FIX: Normalize umlauts for ALL input to handle ue -> ü etc.
    const normalizedUser = this.normalizeUmlauts(String(userAnswer).trim());
  
    // Normalize correct answer(s) as well if needed (though database usually has ü)
    // But keeping it consistent in case DB has alternative spellings
    const normalizeCorrect = (val) =>
      Array.isArray(val)
        ? val.map((v) => this.normalizeUmlauts(String(v).trim()))
        : this.normalizeUmlauts(String(val).trim());
  
    const normalizedCorrect = normalizeCorrect(correctAnswer);
  
    console.log('Validating answer:', { userAnswer: normalizedUser, correctAnswer: normalizedCorrect, type });
  
    switch (type) {
      case 'noun':
      case 'vocabulary':
      case 'verb':
      case 'plural':
      case 'article':
        // Case-sensitive comparison for German words
        if (Array.isArray(normalizedCorrect)) {
          return normalizedCorrect.some((ans) => this.caseSensitiveMatch(normalizedUser, ans));
        }
  
        // Check exact match first
        if (this.caseSensitiveMatch(normalizedUser, normalizedCorrect)) return true;
  
        // Check synonyms for nouns - enhanced logic to handle multiple German forms of same English word
        if (type === 'noun' && exercise && exercise.english) {
          // Get all nouns with the same English word (including synonyms)
          const synonyms = this.getSynonyms(exercise.english);
          
          // Check if user's answer matches any of the synonyms
          for (const syn of synonyms) {
            const normalizedSyn = this.normalizeUmlauts(syn.german);
            if (this.caseSensitiveMatch(normalizedUser, normalizedSyn)) return true;
          }
          
          // Special case: if we have a correct answer that's different from what we're checking,
          // check if the user's answer and the correct answer are synonyms of each other
          if (exercise && exercise.english && correctAnswer && correctAnswer !== normalizedUser) {
            // Check if user's answer and correct answer are synonyms for the same English word
            if (this.areGermanWordsSynonyms(normalizedUser, correctAnswer, exercise.english)) {
              return true;
            }
          }
        }
        return false;
  
      case 'conjugation':
        // Special handling for conjugation - expect "subject + verb" format
        return this.validateConjugationAnswer(normalizedUser, normalizedCorrect, exercise);
  
      case 'translation':
        // Case-sensitive for German translations with some flexibility
        if (Array.isArray(normalizedCorrect)) {
          return normalizedCorrect.some((ans) => this.fuzzyMatch(normalizedUser, ans));
        }
        return this.fuzzyMatch(normalizedUser, normalizedCorrect);
  
      default:
        return this.caseSensitiveMatch(normalizedUser, normalizedCorrect);
    }
  }
  
  // CRITICAL FIX: Case-sensitive matching for German answers
  caseSensitiveMatch(answer, correct) {
    const answerWords = answer.split(' ').filter(Boolean);
    const correctWords = correct.split(' ').filter(Boolean);
  
    if (answerWords.length !== correctWords.length) {
      return false;
    }
  
    for (let i = 0; i < correctWords.length; i++) {
      if (answerWords[i] !== correctWords[i]) {
        // Allow for case variations in articles
        const isArticle = /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines)$/i.test(correctWords[i]);
        if (isArticle && answerWords[i].toLowerCase() === correctWords[i].toLowerCase()) {
          continue;
        }
        return false;
      }
    }
  
    return true;
  }
  
  // CRITICAL FIX: Enhanced conjugation answer validation with umlaut support
  validateConjugationAnswer(userAnswer, correctAnswer, exercise = null) {
    // Apply umlaut normalization to user input
    const normalizedUser = this.normalizeUmlauts(userAnswer);
    // Handle array of correct answers if passed (unlikely for conjugation currently but good practice)
    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
  
    for (const correct of correctAnswers) {
      const normalizedCorrect = this.normalizeUmlauts(correct);
  
      console.log('Conjugation validation details:', {
        originalUser: userAnswer,
        normalizedUser,
        originalCorrect: correct,
        normalizedCorrect,
      });
  
      // Parse user input to separate subject and verb
      const userParts = normalizedUser.split(' ');
      const correctParts = normalizedCorrect.split(' ');
  
      // CRITICAL FIX: Support multi-word verbs (separable verbs, etc.)
      // Check that the number of words matches exactly first ("match as a whole")
      if (userParts.length !== correctParts.length) {
        continue;
      }

      // Check Subject (first word) - case insensitive
      const userSubject = userParts[0];
      const correctSubject = correctParts[0];
      
      // Use clean subject comparison if available
      let cleanCorrectSubject = correctSubject;
      if (exercise && exercise.cleanSubject) {
        // Only use clean subject if it matches the first word of correct answer (sanity check)
        // or just trust it. For standard conjugations, correctParts[0] IS the clean subject.
        cleanCorrectSubject = exercise.cleanSubject;
      }

      // If correctSubject from string doesn't match cleanSubject, it means answer format might be different
      // But assuming standard format "subject verb...", correctParts[0] is the subject.
      
      const subjectMatch = userSubject.toLowerCase() === cleanCorrectSubject.toLowerCase();

      // Check Verb Phrase (remaining words) - case sensitive
      // We join the remaining parts to compare the full verb phrase
      const userVerbPhrase = userParts.slice(1).join(' ');
      const correctVerbPhrase = correctParts.slice(1).join(' ');
      
      const verbMatch = userVerbPhrase === correctVerbPhrase;

      if (subjectMatch && verbMatch) return true;
    }
  
    return false;
  }
  
  fuzzyMatch(answer, correct) {
    const answerWords = answer.split(' ').filter(Boolean);
    const correctWords = correct.split(' ').filter(Boolean);
  
    if (answerWords.length !== correctWords.length) {
      return false;
    }
  
    let matches = 0;
    for (let i = 0; i < correctWords.length; i++) {
      const answerWord = answerWords[i];
      const correctWord = correctWords[i];
  
      // Try exact match first (case-sensitive)
      if (answerWord === correctWord) {
        matches++;
      } else if (answerWord.toLowerCase() === correctWord.toLowerCase()) {
        // Allow case-insensitive for simple words
        const isSimpleWord =
          /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines|und|oder|aber|in|an|auf|unter|über|mit|zu|bei|von|nach|vor|für|durch|gegen|ohne|während|bis|seit|wegen)$/.test(
            correctWord.toLowerCase()
          );
        if (isSimpleWord) {
          matches++;
        } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
          // Allow one character difference for more complex words
          matches++;
        }
      } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
        // Allow one character difference for typos
        matches++;
      }
    }
  
    return matches === correctWords.length;
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
