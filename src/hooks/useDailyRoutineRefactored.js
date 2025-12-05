import { useState, useCallback } from 'react'
import VocabularyManager from '../utils/vocabularyManager'
import { 
  getCurrentSection, 
  getNextStep, 
  isFinalStep,
  getStepInstructions 
} from '../services/stepService.js'
import { 
  isStepComplete, 
  getRemainingQuestions, 
  getSectionProgress,
  getProgressSummary
} from '../services/progressService.js'
import { 
  addSystemMessage,
  generateWelcomeMessage,
  generateUpdateMessage,
  generatePreviousSessionSummary,
  generateReviewQueueEmptyMessage,
  generateReviewStepMessage,
  generateDailyRecap,
  generateProgressSummary,
  generateUnknownCommandMessage,
  generateStartRoutineMessage
} from '../services/messageService.js'
import { 
  processSingleAnswer,
  isValidSingleAnswer 
} from '../services/answerProcessors/singleAnswerProcessor.js'
import { 
  parseBatchAnswer,
  updateBatchAnswers,
  isBatchComplete,
  getRemainingCount 
} from '../services/answerProcessors/batchAnswerProcessor.js'
import { 
  generateBatchFeedback 
} from '../services/answerProcessors/feedbackGenerator.js'
import { 
  generateVocabularyBatch,
  generateVocabularyMessage,
  getVocabularyExcludeList,
  validateVocabularyBatch
} from '../services/exerciseGenerators/vocabularyGenerator.js'
import { updateChecker } from '../utils/updateChecker.js'

// Import vocabulary generation functions that would be created in other generators
// For now, we'll use the existing VocabularyManager methods
// In a complete refactor, these would be extracted to separate generator files

export const useDailyRoutine = (state, setMessages, updateProgress, trackSessionLearning, getCurrentSessionStats) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [batchProgress, setBatchProgress] = useState({
    completed: 0,
    total: 0
  })
  const vocabManager = useState(() => new VocabularyManager())[0]
  const [currentExercise, setCurrentExercise] = useState(null)
  const [currentBatch, setCurrentBatch] = useState([])
  const [batchAnswers, setBatchAnswers] = useState({})
  const [isBatchMode, setIsBatchMode] = useState(false)

  const getCurrentSectionCallback = useCallback(() => {
    return getCurrentSection(currentStep)
  }, [currentStep])

  const getSectionProgressCallback = useCallback(() => {
    return getSectionProgress(currentStep, batchProgress)
  }, [currentStep, batchProgress])

  const isStepCompleteCallback = useCallback(() => {
    return isStepComplete(currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers)
  }, [currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers])

  const getRemainingQuestionsCallback = useCallback(() => {
    return getRemainingQuestions(currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers)
  }, [currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers])

  const processCommand = async (command) => {
    const normalizedCommand = command.trim().toLowerCase()

    if (normalizedCommand === 'today is a new day' || normalizedCommand === 'tiand') {
      await startDailyRoutine()
    } else if (normalizedCommand === 'next step') {
      if (currentStep === 0) {
        addSystemMessage(generateStartRoutineMessage(), setMessages)
      } else {
        await skipToNextStep()
      }
    } else if (normalizedCommand === 'progress summary') {
      await generateProgressSummary()
    } else if (normalizedCommand === 'clear all progress data') {
      // This is handled in App component
      return
    } else if (currentStep > 0 && currentStep < 7) {
      // Handle exercise answers - check if batch mode
      if (isBatchMode) {
        await handleBatchAnswer(command)
      } else {
        await handleSingleAnswer(command)
      }
    } else {
      addSystemMessage(generateUnknownCommandMessage(), setMessages)
    }
  }

  const startDailyRoutine = async () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // CRITICAL FIX: Reset batch answers when starting a new day
    setBatchAnswers({})
    
    // Check for PWA updates if running as PWA
    let updateMessage = ''
    if (updateChecker.isPWA) {
      const updateResult = await updateChecker.checkForUpdates()
      if (updateResult.shouldUpdate && !updateChecker.isUpdateDismissed()) {
        updateMessage = generateUpdateMessage(updateResult)
      }
    }
    
    // Clear messages and show welcome screen first
    const welcomeMessage = generateWelcomeMessage(updateChecker.isPWA) + updateMessage
    
    setMessages([{
      id: generateMessageId(),
      type: 'system',
      content: welcomeMessage
    }])
    
    // Check if we have previous data to show summary
    if (state.lastSessionDate && state.lastSessionDate !== new Date().toISOString().split('T')[0]) {
      const sessionStats = getCurrentSessionStats()
      const summaryMessage = generatePreviousSessionSummary(sessionStats)
      
      await delay(1000)
      addSystemMessage(summaryMessage, setMessages)
    }
    
    // Check if review queue is empty
    if (state.pools.reviewQueue.length === 0) {
      await delay(2000)
      addSystemMessage(generateReviewQueueEmptyMessage(), setMessages)
        
      // Skip directly to Step 2 after a brief delay
      await delay(2000)
      await skipToNextStepFromStep(1)
      return
    }
    
    // Reduce delay for better UX - show Step 1 immediately
    await delay(state.lastSessionDate ? 2000 : 800)
    
    setCurrentStep(1)
    setIsBatchMode(false) // Ensure single question mode for Step 1
      
    // Generate review batch with configurable batch size
    const reviewBatchSize = Math.min(state.settings.maxReviewBatchSize, state.pools.reviewQueue.length)
    const reviewBatch = vocabManager.generateReviewBatch(state.pools.reviewQueue, reviewBatchSize)
    setCurrentExercise(reviewBatch[0])
    setBatchProgress({ completed: 1, total: reviewBatch.length }) // Start with 1 since we're on question 1
      
    const currentReview = reviewBatch[0]
    addSystemMessage(generateReviewStepMessage(currentReview, 1, reviewBatch.length), setMessages)
  }

  const skipToNextStepFromStep = async (fromStep) => {
    const nextStep = getNextStep(fromStep)
    setCurrentStep(nextStep)
    
    // For now, we'll use the existing VocabularyManager methods
    // In a complete refactor, these would use the dedicated generator services
    let batch = []
    let exercise = null
    
    switch (nextStep) {
      case 2: // VOCABULARY
        batch = vocabManager.generateVocabularyBatch(getVocabularyExcludeList(state))
        
        if (!validateVocabularyBatch(batch)) {
          console.error('Failed to generate vocabulary batch')
          addSystemMessage("⚠️ Error: Unable to generate vocabulary exercises. Please check vocabulary data.", setMessages)
          return
        }
        
        trackSessionLearning('nouns', batch.length)
        
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        setBatchAnswers({})
        
        addSystemMessage(generateVocabularyMessage(batch, nextStep), setMessages)
        return
        
      case 3: // PLURAL
        batch = vocabManager.generatePluralBatch(state.pools.unselected)
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        setBatchAnswers({})
        break
        
      case 4: // ARTICLES
        batch = vocabManager.generateArticlesBatch()
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        setBatchAnswers({})
        break
        
      case 5: // TRANSLATIONS
        batch = vocabManager.generateTranslationBatch()
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        setBatchAnswers({})
        break
        
      case 6: // VERBS
        batch = vocabManager.generateVerbBatch()
        const uniqueVerbs = [...new Set(batch.map(item => item.word))]
        trackSessionLearning('verbs', uniqueVerbs.length)
        
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        setBatchAnswers({})
        break
        
      case 7: // RECAP
        await generateDailyRecap()
        return
        
      default:
        batch = []
        exercise = null
    }
    
    // For steps not handled above, use existing message generation
    if (nextStep !== 2 && nextStep !== 7) {
      setCurrentExercise(exercise)
      setBatchProgress({ completed: 0, total: batch.length })
      setIsBatchMode(false)
      
      const stepName = getStepInstructions(getCurrentSection(nextStep))
      let message = `# ⏭️ Skipping to Step ${nextStep}: ${stepName}\n\n`
      message += stepName
      
      if (exercise) {
        message += `\n\n**Question:** ${exercise.question}\nType your answer below:`
      }
      
      addSystemMessage(message, setMessages)
    }
  }

  const skipToNextStep = async () => {
    if (currentStep < 7) {
      await skipToNextStepFromStep(currentStep)
    } else {
      addSystemMessage("You've already completed all steps for today!", setMessages)
    }
  }

  const handleSingleAnswer = async (answer) => {
    if (!isValidSingleAnswer(answer)) {
      addSystemMessage("Please wait for exercise to load...", setMessages)
      return
    }

    const result = processSingleAnswer(answer, currentExercise, vocabManager, vocabManager.getBatchProgress())
    
    if (result.error) {
      addSystemMessage(result.error, setMessages)
      return
    }
    
    addSystemMessage(result.feedback, setMessages)
    
    // Update progress in state with section information
    updateProgress(result.progressUpdate.word, result.progressUpdate.isCorrect, result.progressUpdate.section, result.progressUpdate.form)
    
    // Update current exercise
    setCurrentExercise(result.nextExercise)
    
    // Update progress for review section
    setBatchProgress(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total)
    }))
    
    // Check if review batch is complete and move to next step
    if (result.shouldProceed) {
      await setTimeout(() => {
        completeStep()
      }, 2000)
    }
  }

  const handleBatchAnswer = async (answer) => {
    const parsedAnswer = parseBatchAnswer(answer)
    
    if (parsedAnswer.error) {
      addSystemMessage(parsedAnswer.message, setMessages)
      return
    }

    const result = updateBatchAnswers(batchAnswers, currentBatch, parsedAnswer)
    
    if (result.error) {
      addSystemMessage(result.error, setMessages)
      return
    }
    
    setBatchAnswers(result.updatedBatchAnswers)
    
    // Grade batch answers - only provide feedback for newly answered items
    const feedback = generateBatchFeedback(
      result.updatedBatchAnswers, 
      result.newlyAnsweredIndices, 
      currentBatch, 
      currentStep, 
      vocabManager
    )
    addSystemMessage(feedback, setMessages)
    
    // Update progress based on total answered items
    setBatchProgress(prev => ({
      ...prev,
      completed: Math.min(result.totalAnswered, prev.total)
    }))
    
    // Check if batch is complete
    if (isBatchComplete(currentBatch, result.updatedBatchAnswers)) {
      setTimeout(() => {
        completeStep()
      }, 3000)
    }
  }

  const completeStep = async () => {
    if (currentStep < 7) {
      await skipToNextStepFromStep(currentStep)
    } else {
      const sessionStats = getCurrentSessionStats()
      addSystemMessage(generateDailyRecap(sessionStats), setMessages)
      setCurrentStep(0)
      setBatchProgress({ completed: 0, total: 0 })
    }
  }

  const generateProgressSummary = async () => {
    console.log('Generating progress summary...')
    const sessionStats = getCurrentSessionStats()
    console.log('Session stats for progress summary:', sessionStats)
    
    const progressSummaryData = getProgressSummary(state, state.currentSessionStats, currentStep)
    addSystemMessage(generateProgressSummary(progressSummaryData), setMessages)
  }

  return {
    currentStep,
    batchProgress,
    processCommand,
    getCurrentSection: getCurrentSectionCallback,
    getSectionProgress: getSectionProgressCallback,
    isStepComplete: isStepCompleteCallback,
    getRemainingQuestions: getRemainingQuestionsCallback,
    completeStep,
    startDailyRoutine,
    skipToNextStep
  }
}
