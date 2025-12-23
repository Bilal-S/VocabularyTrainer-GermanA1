import assert from 'assert'
import { VocabularyManager } from '../../utils/vocabularyManager.js'
import { generateWelcomeMessage } from '../../services/messageService.js'

// Create our own getInitialState function since it's not exported
const getInitialState = () => {
  return {
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    settings: {
      masteringCount: 1,
      maxReviewBatchSize: 50,
      maxReviewCount: 1,
      maxVocabularyQuestions: 10,
      maxPluralQuestions: 10,
      maxArticlesQuestions: 10,
      maxTranslationsQuestions: 10,
      maxVerbsQuestions: 15,
      speechSettings: {
        enabled: true,
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        voiceUri: null,
        autoPronounce: false
      }
    },
    progress: {},
    pools: {
      unselected: [], // Start empty - words get moved here as they're used (internal only)
      mastered: {
        nouns: [],
        verbs: [],
        words: []
      },   // Words with correctCount >= masteringCount
      reviewQueue: [] // Words with incorrect answers
      // available: REMOVED - redundant with database data
      // Note: unselected is not exported (session-specific data)
    },
    currentStep: 0,
    batchProgress: {
      answered: [],
      remaining: []
    },
    sessionStats: {
      nounsLearned: 0,
      verbsIntroduced: 0,
      mistakesMade: 0,
      itemsAddedToReview: 0
    },
    lastSessionDate: null,
    currentSessionStats: {
      nounsLearnedToday: 0,
      verbsIntroducedToday: 0,
      mistakesMadeToday: 0,
      itemsAddedToReviewToday: 0,
      initialReviewQueueSize: 0
    }
  }
}

/**
 * Test harness for simulating daily routine flow
 */
export class TestHarness {
  constructor() {
    this.state = getInitialState()
    this.messages = []
    this.currentStep = 0
    this.vocabManager = new VocabularyManager()
    this.batchAnswers = {}
    this.testResults = {
      day1: {},
      day2: {}
    }
  }

  /**
   * Reset test harness for new test run
   */
  reset() {
    this.state = getInitialState()
    this.messages = []
    this.currentStep = 0
    this.batchAnswers = {}
    this.vocabManager = new VocabularyManager()
  }

  /**
   * Simulate user command
   */
  async processCommand(command) {
    const normalizedCommand = command.trim().toLowerCase()

    if (normalizedCommand === 'today is a new day' || normalizedCommand === 'tiand') {
      return await this.startDailyRoutine()
    } else if (normalizedCommand === 'next step') {
      return await this.skipToNextStep()
    } else if (normalizedCommand === 'progress summary') {
      return this.generateProgressSummary()
    } else if (this.currentStep > 0 && this.currentStep < 7) {
      return await this.handleAnswer(command)
    } else {
      return `Unknown command: ${command}`
    }
  }

  /**
   * Start daily routine
   */
  async startDailyRoutine() {
    this.resetSessionStats()
    
    // Clear messages and show welcome
    const welcomeMessage = generateWelcomeMessage()
    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: welcomeMessage,
      timestamp: new Date().toISOString()
    })

    // Check if we have previous data to show summary
    if (this.state.lastSessionDate && this.state.lastSessionDate !== new Date().toISOString().split('T')[0]) {
      const sessionStats = this.getCurrentSessionStats()
      const summaryMessage = `## Previous Session Summary:\n- **Nouns introduced:** ${sessionStats.nounsLearned}\n- **Verbs introduced:** ${sessionStats.verbsIntroduced}\n- **Items added to review queue:** ${sessionStats.itemsAddedToReview}\n- **Total items in review queue:** ${sessionStats.itemsRemainingInReview}\n\n---`
      
      this.messages.push({
        id: Date.now(),
        type: 'system',
        content: summaryMessage,
        timestamp: new Date().toISOString()
      })
    }

    // Check if review queue is empty
    if (this.state.pools.reviewQueue.length === 0) {
      const emptyQueueMessage = '*Checking Review Queue...*\n> **Status:** Your Review Queue is currently empty! Great job.\n> **Action:** Moving immediately to Step 2.'
      
      this.messages.push({
        id: Date.now(),
        type: 'system',
        content: emptyQueueMessage,
        timestamp: new Date().toISOString()
      })

      // Skip directly to Step 2
      await this.skipToNextStepFromStep(1)
      return 'Skipped to Step 2 - Review queue empty'
    }

    // Start with Step 1
    this.currentStep = 1
    return await this.startStep(1)
  }

  /**
   * Start specific step
   */
  async startStep(stepNumber) {
    this.currentStep = stepNumber
    this.batchAnswers = {}

    switch (stepNumber) {
      case 1:
        return await this.startReviewStep()
      case 2:
        return await this.startVocabularyStep()
      case 3:
        return await this.startPluralStep()
      case 4:
        return await this.startArticlesStep()
      case 5:
        return await this.startTranslationsStep()
      case 6:
        return await this.startVerbsStep()
      case 7:
        return await this.startRecapStep()
      default:
        return `Invalid step: ${stepNumber}`
    }
  }

  /**
   * Start Step 1: Review Previous Mistakes
   */
  async startReviewStep() {
    const reviewBatchSize = Math.min(this.state.settings.maxReviewBatchSize, this.state.pools.reviewQueue.length)
    const reviewBatch = this.vocabManager.generateReviewBatch(this.state.pools.reviewQueue, reviewBatchSize)
    
    if (reviewBatch.length === 0) {
      await this.skipToNextStepFromStep(1)
      return 'No review items, skipping to Step 2'
    }

    const item = reviewBatch[0]
    const message = `## Step 1: Review Previous Mistakes\nWe'll review ${this.state.pools.reviewQueue.length} items from your review queue.\n\n**Question 1 of ${reviewBatch.length}: From ${item?.originSection || 'Unknown'}**\n---\n${item?.question || 'Loading question...'}\nType your answer below:`
    
    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    this.currentBatch = reviewBatch
    this.currentBatchIndex = 0
    return message
  }

  /**
   * Start Step 2: New Vocabulary
   */
  async startVocabularyStep() {
    const excludeList = [
      ...this.state.pools.mastered.nouns,
      ...this.state.pools.mastered.verbs,
      ...this.state.pools.mastered.words,
      ...this.state.pools.reviewQueue.map(item => typeof item === 'string' ? item : item.word),
      ...this.state.pools.unselected
    ]

    const batch = this.vocabManager.generateVocabularyBatch(excludeList, this.state.settings.maxVocabularyQuestions, this.state)
    
    if (batch.length === 0) {
      await this.skipToNextStepFromStep(2)
      return 'All vocabulary mastered, skipping to Step 3'
    }

    this.trackSessionLearning('nouns', batch.length)
    this.currentBatch = batch

    let message = `### **Step 2: New Vocabulary (${batch.length} Nouns)**\n**[Step 2 | Batch 1 | Remaining: ${batch.length}]**\n\nPlease translate following **English nouns** into **German** (Article + Noun) singular form:\n*Example: 1. house -> das Haus*\n\n`

    batch.forEach((item, index) => {
      message += `*${index + 1}.* ${item.english}\n`
    })

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Start Step 3: Gender & Number Drill
   */
  async startPluralStep() {
    const excludeList = [
      ...this.state.pools.mastered.nouns,
      ...this.state.pools.mastered.verbs,
      ...this.state.pools.mastered.words,
      ...this.state.pools.reviewQueue.map(item => typeof item === 'string' ? item : item.word),
      ...this.state.pools.unselected
    ]

    const batch = this.vocabManager.generatePluralBatch(excludeList, this.state.settings.maxPluralQuestions, this.state)
    
    if (batch.length === 0) {
      await this.skipToNextStepFromStep(3)
      return 'All plural forms mastered, skipping to Step 4'
    }

    this.currentBatch = batch

    let message = `### **Step 3: Gender & Number Drill (${batch.length} Nouns)**\n**[Step 3 | Batch 1 | Remaining: ${batch.length}]**\n\nPlease provide **plural forms** for following German nouns:\n*Example: 1. das Haus -> die Häuser*\n\n`

    batch.forEach((item, index) => {
      message += `*${index + 1}.* ${item.singular}\n`
    })

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Start Step 4: Articles in Context
   */
  async startArticlesStep() {
    const batch = this.vocabManager.generateArticlesBatch(this.state.settings.maxArticlesQuestions, this.state)
    
    if (batch.length === 0) {
      await this.skipToNextStepFromStep(4)
      return 'All article exercises mastered, skipping to Step 5'
    }

    this.currentBatch = batch

    let message = `### **Step 4: Articles in Context (${batch.length} Items)**\n**[Step 4 | Batch 1 | Remaining: ${batch.length}]**\n\nPlease complete the article or translate the sentence:\n\n`

    batch.forEach((item, index) => {
      message += `*${index + 1}.* ${item.question}\n`
    })

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Start Step 5: Case Translations
   */
  async startTranslationsStep() {
    const batch = this.vocabManager.generateTranslationBatch(this.state.settings.maxTranslationsQuestions, this.state)
    
    if (batch.length === 0) {
      await this.skipToNextStepFromStep(5)
      return 'All translation exercises mastered, skipping to Step 6'
    }

    this.currentBatch = batch

    let message = `### **Step 5: Case Translations (${batch.length} Items)**\n**[Step 5 | Batch 1 | Remaining: ${batch.length}]**\n\nTranslate the sentences paying attention to German cases:\n\n`

    batch.forEach((item, index) => {
      message += `*${index + 1}.* ${item.question}\n`
    })

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Start Step 6: Verb Conjugation
   */
  async startVerbsStep() {
    const batch = this.vocabManager.generateVerbBatch([], this.state.settings.maxVerbsQuestions)
    
    if (batch.length === 0) {
      await this.skipToNextStepFromStep(6)
      return 'All verb exercises mastered, moving to recap'
    }

    this.currentBatch = batch
    const uniqueVerbs = [...new Set(batch.map(item => item.word))]
    this.trackSessionLearning('verbs', uniqueVerbs.length)

    let message = `### **Step 6: Verb Conjugation (${batch.length} Items)**\n**[Step 6 | Batch 1 | Remaining: ${batch.length}]**\n\nPlease conjugate following **verbs for given subjects**:\n\n`

    batch.forEach((item, index) => {
      message += `*${index + 1}.* ${item.verb} (${item.subject})\n`
    })

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Start Step 7: Daily Recap
   */
  async startRecapStep() {
    const sessionStats = this.getCurrentSessionStats()
    
    const message = `# 🎉 Daily Routine Complete!\n\n## Today's Summary in English:\n- **Nouns introduced:** ${sessionStats.nounsLearned}\n- **Verbs introduced:** ${sessionStats.verbsIntroduced}\n- **Items added to review queue:** ${sessionStats.itemsAddedToReview}\n- **Items in review queue:** ${sessionStats.itemsRemainingInReview}\n\n## Progress Overview:\n- **Total mastered words:** ${sessionStats.totalMastered}\n- **Remaining A1 words:** ${sessionStats.totalRemaining}\n- **Initial review queue size:** ${sessionStats.initialReviewQueueSize}\n- **Mistakes made today:** ${sessionStats.mistakesMade}\n\nGreat job today! You've made excellent progress with your German learning.\n\nType **"Today is a new day"** tomorrow to continue your learning journey!`

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    this.currentStep = 0
    return message
  }

  /**
   * Skip to next step
   */
  async skipToNextStep() {
    if (this.currentStep < 7) {
      return await this.skipToNextStepFromStep(this.currentStep)
    } else {
      return "You've already completed all steps for today!"
    }
  }

  /**
   * Skip to next step from specific step
   */
  async skipToNextStepFromStep(fromStep) {
    const nextStep = fromStep + 1
    return await this.startStep(nextStep)
  }

  /**
   * Handle user answer
   */
  async handleAnswer(answer) {
    if (this.currentStep === 1) {
      return await this.handleSingleAnswer(answer)
    } else {
      return await this.handleBatchAnswer(answer)
    }
  }

  /**
   * Handle single answer (Step 1)
   */
  async handleSingleAnswer(answer) {
    if (!this.currentBatch || this.currentBatchIndex >= this.currentBatch.length) {
      return 'No more questions in review batch'
    }

    const currentExercise = this.currentBatch[this.currentBatchIndex]
    const isCorrect = this.vocabManager.validateAnswer(answer, currentExercise.answer, currentExercise.type, currentExercise)
    
    // CRITICAL FIX: For ARTICLES and TRANSLATIONS, use the original review queue item word for progress tracking
    // This ensures proper matching between review queue items and progress tracking
    const progressWord = currentExercise.word
    
    // Update progress with the correct word key
    this.updateProgress(progressWord, isCorrect, currentExercise.originSection, currentExercise.form)
    
    // Move to next exercise
    this.currentBatchIndex++
    
    let feedback = `✅ Answer received: "${answer}"\n\n`
    
    if (isCorrect) {
      feedback += `🎉 **Correct!**\n\n`
      if (answer !== currentExercise.answer && this.vocabManager.normalizeAccents(answer) === this.vocabManager.normalizeAccents(currentExercise.answer)) {
         feedback += `⚠️ **Watch your umlauts!** Correct spelling: **${currentExercise.answer}**\n\n`
      }
    } else {
      feedback += `❌ **Not quite right.**\n\n`
      feedback += `The correct answer is: **${currentExercise.answer}**\n\n`
    }

    // Show next question or completion message
    if (this.currentBatchIndex < this.currentBatch.length) {
      const nextExercise = this.currentBatch[this.currentBatchIndex]
      feedback += `**Progress:** ${this.currentBatchIndex}/${this.currentBatch.length} questions completed\n\n`
      feedback += `**Question ${this.currentBatchIndex + 1} of ${this.currentBatch.length}: From ${nextExercise?.originSection || 'Unknown'}**\n---\n${nextExercise?.question || 'Loading question...'}\nType your answer below:`
    } else {
      feedback += `**Progress:** ${this.currentBatch.length}/${this.currentBatch.length} questions completed\n\n`
      feedback += `✅ Review section complete! Moving to next step...`
      setTimeout(() => {
        this.skipToNextStepFromStep(1)
      }, 100)
    }

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: feedback,
      timestamp: new Date().toISOString()
    })

    return feedback
  }

  /**
   * Handle batch answer (Steps 2-6)
   */
  async handleBatchAnswer(answer) {
    const lines = answer.split('\n').filter(line => line.trim())
    const numberedAnswers = []
    const sequentialAnswers = []
    
    lines.forEach(line => {
      const match = line.match(/^(\d+)(?:[\.\)\-]\s*|\s+)(.+)$/i)
      
      if (match) {
        numberedAnswers.push({ index: parseInt(match[1]) - 1, answer: match[2].trim() })
      } else if (line.trim()) {
        sequentialAnswers.push({ index: null, answer: line.trim() })
      }
    })

    if (numberedAnswers.length > 0 && sequentialAnswers.length > 0) {
      return "⚠️ Error: Please provide either all numbered answers (e.g., '1. answer') or all sequential answers (one per line). Mixed formats are not supported."
    }

    const unansweredIndices = this.currentBatch
      .map((_, index) => index)
      .filter(index => !this.batchAnswers[index])

    const updatedBatchAnswers = { ...this.batchAnswers }
    const newlyAnsweredIndices = []
    
    if (numberedAnswers.length > 0) {
      numberedAnswers.forEach(answerObj => {
        if (answerObj.index !== null && answerObj.index >= 0 && answerObj.index < this.currentBatch.length) {
          if (!this.batchAnswers[answerObj.index]) {
            updatedBatchAnswers[answerObj.index] = answerObj.answer
            newlyAnsweredIndices.push(answerObj.index)
          }
        }
      })
    } else {
      sequentialAnswers.forEach((answerObj, i) => {
        if (i < unansweredIndices.length) {
          const targetIndex = unansweredIndices[i]
          updatedBatchAnswers[targetIndex] = answerObj.answer
          newlyAnsweredIndices.push(targetIndex)
        }
      })
    }
    
    this.batchAnswers = updatedBatchAnswers
    
    // Grade batch answers
    const feedback = this.generateBatchFeedback(updatedBatchAnswers, newlyAnsweredIndices)
    
    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: feedback,
      timestamp: new Date().toISOString()
    })

    // Check if batch is complete
    if (Object.keys(updatedBatchAnswers).length >= this.currentBatch.length) {
      setTimeout(() => {
        this.skipToNextStepFromStep(this.currentStep)
      }, 100)
    }

    return feedback
  }

  /**
   * Generate batch feedback
   */
  generateBatchFeedback(allAnswers, newlyAnsweredIndices) {
    const stepNames = ['', 'REVIEW', 'VOCABULARY', 'PLURAL', 'ARTICLES', 'TRANSLATIONS', 'VERBS', 'RECAP']
    const stepName = stepNames[this.currentStep] || `Step ${this.currentStep}`
    
    let feedback = `**[Step ${this.currentStep} | Batch 1 | Grading Partial Response]**\n\n`
    
    const totalAnswered = Object.keys(allAnswers).length
    const remaining = this.currentBatch.length - totalAnswered
    
    // Grade newly answered items
    newlyAnsweredIndices.forEach(index => {
      const exercise = this.currentBatch[index]
      const userAnswer = allAnswers[index]
      if (exercise && userAnswer) {
        const isCorrect = this.vocabManager.validateAnswer(userAnswer, exercise.answer, exercise.type, exercise)
        const prompt = exercise.english || exercise.question || exercise.word
        
        const wordToTrack = exercise.word
        
        if (isCorrect) {
          feedback += `${index + 1}. **${prompt}**: Your answer: **${userAnswer}** ✅\n`
          if (wordToTrack) {
            this.updateProgress(wordToTrack, true, stepName, exercise.form || 'singular')
          }
        } else {
          const correctDisplay = Array.isArray(exercise.answer)
            ? exercise.answer.join(' or ')
            : exercise.answer
          feedback += `${index + 1}. **${prompt}**: Your answer: **${userAnswer}** <span style="color: red;">**Correction:**</span> **${correctDisplay}**\n`
          
          if (wordToTrack) {
            this.updateProgress(wordToTrack, false, stepName, exercise.form || 'singular')
          }
        }
      }
    })
    
    feedback += `\n`
    
    if (remaining === 0) {
      feedback += `🎉 **Step ${this.currentStep} Complete!** All ${this.currentBatch.length} items have been answered.\n\n`
      feedback += `**Progress Summary:**\n`
      feedback += `- **Items Processed:** ${totalAnswered}\n`
      feedback += `- **Remaining:** 0\n\n`
      
      let nextStepInfo = ""
      if (this.currentStep < 7) {
        nextStepInfo = `Moving to **Step ${this.currentStep + 1}**...`
      } else {
        nextStepInfo = `Moving to **Daily Recap**...`
      }
      
      feedback += `${nextStepInfo}\n\n`
      feedback += `Type **"Next Step"** to continue or wait for automatic progression.`
    } else {
      feedback += `**[Step ${this.currentStep} | Batch 1 | Remaining: ${remaining}]**\n\n`
      feedback += `Please continue with remaining items:\n\n`
      
      this.currentBatch.forEach((exercise, actualIndex) => {
        if (!allAnswers[actualIndex]) {
          const prompt = exercise.english || exercise.question || exercise.word
          feedback += `*${actualIndex + 1}.* ${prompt}\n`
        }
      })
    }
    
    return feedback
  }

  /**
   * Update progress for a word
   */
  updateProgress(word, isCorrect, section = 'Unknown', form = 'singular') {
    if (!word) {
      console.error(`updateProgress called with invalid word: ${word} (Section: ${section})`)
      return
    }

    if (!this.state.progress[word]) {
      this.state.progress[word] = {
        singular: { correctCount: 0, incorrectCount: 0 },
        plural: { correctCount: 0, incorrectCount: 0 },
        section: section
      }
    }

    let wasAddedToReview = false
    let wasMovedToMastered = false

    if (isCorrect) {
      if (!this.state.progress[word][form]) {
        this.state.progress[word][form] = { correctCount: 0, incorrectCount: 0 }
      }
      this.state.progress[word][form].correctCount++

      const isInReviewQueue = this.state.pools.reviewQueue.findIndex(item =>
        typeof item === 'string' ? item === word : item.word === word
      ) > -1

      const masteringThreshold = isInReviewQueue
        ? this.state.settings.maxReviewCount
        : this.state.settings.masteringCount

      let shouldRemoveFromReview = false
      if (isInReviewQueue) {
        if (form === 'singular' && this.state.progress[word].singular.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        } else if (form === 'plural' && this.state.progress[word].plural.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        } else if (section === 'VERBS' && this.state.progress[word].singular.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        } else if ((section === 'ARTICLES' || section === 'TRANSLATIONS') && this.state.progress[word].singular.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        }
      }

      let isFullyMastered = false
      if (section === 'VOCABULARY' || section === 'PLURAL') {
        const singularMastered = this.state.progress[word].singular.correctCount >= this.state.settings.masteringCount
        const pluralMastered = this.state.progress[word].plural.correctCount >= this.state.settings.masteringCount
        isFullyMastered = singularMastered && pluralMastered
      } else if (section === 'ARTICLES' || section === 'TRANSLATIONS') {
        isFullyMastered = this.state.progress[word].singular.correctCount >= masteringThreshold
      } else {
        isFullyMastered = this.state.progress[word].singular.correctCount >= this.state.settings.masteringCount
      }
      
      if (isFullyMastered) {
        // 1. If fully mastered, remove from review queue (if present) and move to mastered pool.
        const reviewIndex = this.state.pools.reviewQueue.findIndex(item =>
          (typeof item === 'string' ? item === word : item.word === word) &&
          (typeof item === 'string' ? true : item.section === section)
        )
        if (reviewIndex > -1) {
          console.log(`DEBUG: Removing fully mastered '${word}' from review queue (Section: ${section})`)
          this.state.pools.reviewQueue.splice(reviewIndex, 1)
        }

        const unselectedIndex = this.state.pools.unselected.indexOf(word)
        if (unselectedIndex > -1) {
          this.state.pools.unselected.splice(unselectedIndex, 1)
        }

        const isAlreadyMastered = this.state.pools.mastered.nouns.includes(word) ||
                                  this.state.pools.mastered.verbs.includes(word) ||
                                  this.state.pools.mastered.words.includes(word)

        if (!isAlreadyMastered) {
          if (section === 'VOCABULARY' || section === 'PLURAL') {
            this.state.pools.mastered.nouns.push(word)
          } else if (section === 'VERBS') {
            this.state.pools.mastered.verbs.push(word)
          } else { // ARTICLES, TRANSLATIONS, etc.
            this.state.pools.mastered.words.push(word)
          }
          wasMovedToMastered = true
        }
      } else if (shouldRemoveFromReview) {
        // 2. If not fully mastered but meets review threshold, only remove from review queue.
        const reviewIndex = this.state.pools.reviewQueue.findIndex(item =>
          (typeof item === 'string' ? item === word : item.word === word) &&
          (typeof item === 'string' ? true : item.section === section)
        )
        if (reviewIndex > -1) {
          console.log(`DEBUG: Removing '${word}' from review queue after meeting threshold (Section: ${section})`)
          this.state.pools.reviewQueue.splice(reviewIndex, 1)
        }
      } else if (isInReviewQueue) {
        // 3. If still in review queue but doesn't meet any removal criteria, log it.
        console.log(`DEBUG: '${word}' (Section: ${section}) NOT removed. Correct: ${this.state.progress[word][form].correctCount} Threshold: ${masteringThreshold}`)
      }
    } else {
      this.state.progress[word][form].incorrectCount++
      
      const existsInReview = this.state.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      )
      if (existsInReview === -1) {
        this.state.pools.reviewQueue.push({ word, section })
        wasAddedToReview = true
      }

      this.state.currentSessionStats.mistakesMadeToday++
      this.state.sessionStats.mistakesMade++
    }

    if (wasAddedToReview) {
      this.state.currentSessionStats.itemsAddedToReviewToday++
      this.state.sessionStats.itemsAddedToReview++
    }

    // Save state to localStorage
    this.saveState()
  }

  /**
   * Track session learning
   */
  trackSessionLearning(type, count = 1) {
    switch (type) {
      case 'nouns':
        this.state.currentSessionStats.nounsLearnedToday += count
        this.state.sessionStats.nounsLearned += count
        break
      case 'verbs':
        this.state.currentSessionStats.verbsIntroducedToday += count
        this.state.sessionStats.verbsIntroduced += count
        break
    }
  }

  /**
   * Reset session stats
   */
  resetSessionStats() {
    this.state.currentSessionStats = {
      nounsLearnedToday: 0,
      verbsIntroducedToday: 0,
      mistakesMadeToday: 0,
      itemsAddedToReviewToday: 0,
      initialReviewQueueSize: this.state.pools.reviewQueue.length
    }
  }

  /**
   * Get current session stats
   */
  getCurrentSessionStats() {
    const masteredCount = (this.state.pools.mastered.nouns?.length || 0) + 
                       (this.state.pools.mastered.verbs?.length || 0) + 
                       (this.state.pools.mastered.words?.length || 0)
    
    const totalAvailable = 1000 // Approximate total vocabulary count
    const inReviewCount = this.state.pools.reviewQueue.length
    const remainingCount = Math.max(0, totalAvailable - masteredCount - inReviewCount)

    return {
      nounsLearned: this.state.currentSessionStats.nounsLearnedToday,
      verbsIntroduced: this.state.currentSessionStats.verbsIntroducedToday,
      mistakesMade: this.state.currentSessionStats.mistakesMadeToday,
      itemsAddedToReview: this.state.currentSessionStats.itemsAddedToReviewToday,
      itemsRemainingInReview: this.state.pools.reviewQueue.length,
      initialReviewQueueSize: this.state.currentSessionStats.initialReviewQueueSize,
      totalMastered: masteredCount,
      totalRemaining: remainingCount
    }
  }

  /**
   * Generate progress summary
   */
  generateProgressSummary() {
    const sessionStats = this.getCurrentSessionStats()
    
    const message = `# 📊 Current Progress Summary\n\n## Learning Session Summary:\n- **Nouns introduced:** ${sessionStats.nounsLearned}\n- **Verbs introduced:** ${sessionStats.verbsIntroduced}\n- **Items added to review queue:** ${sessionStats.itemsAddedToReview}\n- **Total items in review queue:** ${sessionStats.itemsRemainingInReview}\n\n## Overall Progress Overview:\n- **Total mastered words:** ${sessionStats.totalMastered}\n- **Remaining A1 words:** ${sessionStats.totalRemaining}\n- **Initial review queue size:** ${sessionStats.initialReviewQueueSize}\n- **Mistakes made today:** ${sessionStats.mistakesMade}\n\n${this.currentStep > 0 && this.currentStep < 7 ? `### **Current Status:** Step ${this.currentStep} of 7**` : ''}\n${this.currentStep === 0 ? '### **Current Status:** Not started - Type "Today is a new day" to begin!' : ''}\n${this.currentStep === 7 ? '### **Current Status:** Daily routine complete!' : ''}\n\nKeep up the great work! You're making steady progress with your German learning.`

    this.messages.push({
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date().toISOString()
    })

    return message
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      const stateToSave = {
        ...this.state,
        lastSessionDate: new Date().toISOString().split('T')[0]
      }
      localStorage.setItem('a1-german-coach-state', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Error saving state:', error)
    }
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const savedState = localStorage.getItem('a1-german-coach-state')
      if (savedState) {
        this.state = JSON.parse(savedState)
        return true
      }
    } catch (error) {
      console.error('Error loading state:', error)
    }
    return false
  }

  /**
   * Assert test conditions
   */
  assert(condition, message) {
    try {
      assert(condition, message)
      console.log(`✅ ${message}`)
      return true
    } catch (error) {
      console.log(`❌ ${message}`)
      console.error(error)
      return false
    }
  }
}

/**
 * Run a test scenario using the TestHarness
 */
export async function runTestScenario(scenario) {
  const harness = new TestHarness()
  const startTime = Date.now()
  
  try {
    // Initialize the harness
    harness.reset()
    
    // Run the scenario steps
    if (scenario.steps) {
      for (const step of scenario.steps) {
        switch (step.type) {
          case 'command':
            await harness.processCommand(step.command)
            break
          case 'validate':
            const issues = step.validate(harness)
            if (issues && issues.length > 0) {
              return {
                passed: false,
                issues,
                duration: Date.now() - startTime
              }
            }
            break
          default:
            console.warn(`Unknown step type: ${step.type}`)
        }
      }
    }
    
    // If no explicit validation steps, assume success
    return {
      passed: true,
      issues: [],
      duration: Date.now() - startTime
    }
    
  } catch (error) {
    return {
      passed: false,
      issues: [`Test execution error: ${error.message}`],
      duration: Date.now() - startTime
    }
  }
}
