import { useState, useCallback } from 'react'
import VocabularyManager from '../utils/vocabularyManager'

const STEPS = {
  0: 'INTRO',
  1: 'REVIEW',
  2: 'VOCABULARY',
  3: 'PLURAL',
  4: 'ARTICLES',
  5: 'TRANSLATIONS',
  6: 'VERBS',
  7: 'RECAP'
}

const STEP_CONFIG = {
  INTRO: {
    name: 'Introduction',
    totalItems: 0
  },
  REVIEW: {
    name: 'Review Previous Mistakes',
    totalItems: 10
  },
  VOCABULARY: {
    name: 'New Vocabulary',
    totalItems: 20
  },
  PLURAL: {
    name: 'Plural Practice',
    totalItems: 20
  },
  ARTICLES: {
    name: 'Articles in Context',
    totalItems: 30
  },
  TRANSLATIONS: {
    name: 'Case Translations',
    totalItems: 30
  },
  VERBS: {
    name: 'Verb Conjugation',
    totalItems: 30
  },
  RECAP: {
    name: 'Daily Recap',
    totalItems: 0
  }
}

export const useDailyRoutine = (state, setMessages) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [batchProgress, setBatchProgress] = useState({
    completed: 0,
    total: 0
  })
  const [vocabManager] = useState(() => new VocabularyManager())[0]
  const [currentExercise, setCurrentExercise] = useState(null)

  const getCurrentSection = useCallback(() => {
    return STEPS[currentStep] || 'INTRO'
  }, [currentStep])

  const getSectionProgress = useCallback(() => {
    if (currentStep === 0 || currentStep === 7) {
      return { completed: 0, total: 1, percentage: 100 }
    }
    
    const stepKey = STEPS[currentStep]
    const config = STEP_CONFIG[stepKey]
    
    return {
      completed: batchProgress.completed,
      total: config.totalItems,
      percentage: config.totalItems > 0 
        ? Math.round((batchProgress.completed / config.totalItems) * 100)
        : 100
    }
  }, [currentStep, batchProgress])

  const addSystemMessage = useCallback((content) => {
    const message = {
      id: Date.now(),
      type: 'system',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, message])
  }, [setMessages])

  const processCommand = useCallback(async (command) => {
    const normalizedCommand = command.trim().toLowerCase()

    if (normalizedCommand === 'today is a new day') {
      await startDailyRoutine()
    } else if (normalizedCommand === 'next step') {
      await skipToNextStep()
    } else if (normalizedCommand === 'clear all progress data') {
      // This is handled in App component
      return
    } else if (currentStep > 0 && currentStep < 7) {
      // Handle exercise answers
      await handleExerciseAnswer(command)
    } else {
      addSystemMessage(`I didn't understand that command. Available commands:
- **"Today is a new day"** - Start your daily routine
- **"Next Step"** - Skip to next exercise
- **"clear all progress data"** - Reset all progress`)
    }
  }, [currentStep, addSystemMessage])

  const startDailyRoutine = async () => {
    setCurrentStep(1)
    
    // Generate review batch
    const reviewBatch = vocabManager.generateReviewBatch(state.pools.reviewQueue)
    setCurrentExercise(reviewBatch[0])
    setBatchProgress({ completed: 0, total: reviewBatch.length })
    
    addSystemMessage(`# 🌅 Good morning! Let's start your German practice!

## Step 1: Review Previous Mistakes
We'll review ${state.pools.reviewQueue.length} items from your review queue.

**Batch 1 of 1** (${reviewBatch.length} items)
---
**Question:** ${reviewBatch[0]?.question || 'Loading question...'}
Type your answer below:`)
  }

  const skipToNextStep = async () => {
    if (currentStep < 7) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      
      const stepKey = STEPS[nextStep]
      const config = STEP_CONFIG[stepKey]
      
      // Generate exercises for the specific step
      let batch = []
      let exercise = null
      
      switch (stepKey) {
        case 'VOCABULARY':
          batch = vocabManager.generateVocabularyBatch(state.pools.unselected)
          exercise = batch[0]
          break
        case 'PLURAL':
          batch = vocabManager.generatePluralBatch(state.pools.unselected)
          exercise = batch[0]
          break
        case 'ARTICLES':
          batch = vocabManager.generateArticlesBatch()
          exercise = batch[0]
          break
        case 'TRANSLATIONS':
          batch = vocabManager.generateTranslationBatch()
          exercise = batch[0]
          break
        case 'VERBS':
          batch = vocabManager.generateVerbBatch()
          exercise = batch[0]
          break
        default:
          batch = []
          exercise = null
      }
      
      setCurrentExercise(exercise)
      setBatchProgress({ completed: 0, total: batch.length })
      
      let message = `# ⏭️ Skipping to Step ${nextStep}: ${config.name}\n\n`
      message += await getStepInstructions(stepKey)
      
      if (exercise) {
        message += `\n\n**Question:** ${exercise.question}\nType your answer below:`
      }
      
      addSystemMessage(message)
    } else {
      addSystemMessage("You've already completed all steps for today!")
    }
  }

  const getStepInstructions = async (stepKey) => {
    const instructions = {
      REVIEW: 'Review your previous mistakes. Type the German translations for the English words provided.',
      VOCABULARY: 'Learn 20 new German nouns with their articles. I\'ll show you English words, and you\'ll provide the German translation.',
      PLURAL: 'Practice German noun plurals. I\'ll give you singular nouns, and you\'ll provide the plural forms.',
      ARTICLES: 'Practice German articles in context. Fill in the blanks with the correct articles (der, die, das, ein, eine).',
      TRANSLATIONS: 'Translate sentences from English to German, focusing on correct case usage.',
      VERBS: 'Practice verb conjugation with different subjects.',
      RECAP: 'Review what you\'ve learned today.'
    }
    
    return instructions[stepKey] || ''
  }

  const handleExerciseAnswer = async (answer) => {
    if (!currentExercise) {
      addSystemMessage("Please wait for the exercise to load...")
      return
    }

    const isCorrect = vocabManager.validateAnswer(answer, currentExercise.answer, currentExercise.type)
    const progress = vocabManager.getBatchProgress()
    
    // Generate feedback message
    let feedback = `✅ Answer received: "${answer}"\n\n`
    
    if (isCorrect) {
      feedback += `🎉 **Correct!**\n\n`
      
      if (currentExercise.type === 'noun' || currentExercise.type === 'verb') {
        feedback += `**German:** ${currentExercise.answer}\n`
        feedback += `**English:** ${currentExercise.english}\n`
        if (currentExercise.gender) {
          feedback += `**Gender:** ${currentExercise.gender}\n`
        }
      } else if (currentExercise.type === 'plural') {
        feedback += `**Singular:** ${currentExercise.singular}\n`
        feedback += `**Plural:** ${currentExercise.answer}\n`
        feedback += `**English:** ${currentExercise.english}\n`
      } else if (currentExercise.type === 'conjugation') {
        feedback += `**Verb:** ${currentExercise.verb}\n`
        feedback += `**Subject:** ${currentExercise.subject}\n`
        feedback += `**Conjugation:** ${currentExercise.answer}\n`
      } else if (currentExercise.type === 'article') {
        feedback += `**Correct article:** ${currentExercise.answer}\n`
        feedback += `**Case:** ${currentExercise.caseType}\n`
        feedback += `**Sentence:** ${currentExercise.german.replace('___', currentExercise.answer)}\n`
      } else if (currentExercise.type === 'translation') {
        feedback += `**German:** ${currentExercise.answer}\n`
        feedback += `**English:** ${currentExercise.english}\n`
        feedback += `**Case:** ${currentExercise.caseType}\n`
      }
      
      feedback += `**Progress:** ${progress.current}/${progress.total} items completed\n\n`
      feedback += `Type your next answer or **"Next Step"** to skip to next exercise.`
    } else {
      feedback += `❌ **Not quite right.**\n\n`
      
      if (currentExercise.type === 'noun' || currentExercise.type === 'verb') {
        feedback += `The correct answer is: **${currentExercise.answer}**\n`
        feedback += `**English:** ${currentExercise.english}\n\n`
      } else if (currentExercise.type === 'plural') {
        feedback += `The correct plural is: **${currentExercise.answer}**\n`
        feedback += `Singular: ${currentExercise.singular}\n\n`
      } else if (currentExercise.type === 'conjugation') {
        feedback += `The correct conjugation is: **${currentExercise.answer}**\n`
        feedback += `Verb: ${currentExercise.verb} (${currentExercise.verbEnglish})\n`
        feedback += `Subject: ${currentExercise.subject}\n\n`
      } else if (currentExercise.type === 'article') {
        feedback += `The correct article is: **${currentExercise.answer}**\n`
        feedback += `Complete sentence: ${currentExercise.german.replace('___', currentExercise.answer)}\n\n`
      } else if (currentExercise.type === 'translation') {
        feedback += `The correct translation is: **${currentExercise.answer}**\n\n`
      }
      
      // Add ChatGPT link for help
      const helpQuery = encodeURIComponent(`Why is "${answer}" wrong for "${currentExercise.english}" in German?`)
      feedback += `💡 **Need help?** [Ask ChatGPT for explanation](https://chatgpt.com/?q=${helpQuery})\n\n`
      feedback += `**Progress:** ${progress.current}/${progress.total} items completed\n\n`
      feedback += `Try again or type **"Next Step"** to skip to next exercise.`
    }
    
    addSystemMessage(feedback)
    
    // Move to next exercise in batch
    const nextExercise = vocabManager.moveToNext()
    setCurrentExercise(nextExercise)
    
    // Update progress
    setBatchProgress(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total)
    }))
    
    // Check if batch is complete
    if (progress.isComplete) {
      await setTimeout(() => {
        completeStep()
      }, 2000)
    }
  }

  const completeStep = async () => {
    if (currentStep < 7) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      
      const stepKey = STEPS[nextStep]
      const config = STEP_CONFIG[stepKey]
      setBatchProgress({ completed: 0, total: config.totalItems })
      
      addSystemMessage(`# ✅ Step ${currentStep} Complete!

Moving to **Step ${nextStep}: ${config.name}**

${await getStepInstructions(stepKey)}`)
    } else {
      await generateDailyRecap()
    }
  }

  const generateDailyRecap = async () => {
    addSystemMessage(`# 🎉 Daily Routine Complete!

## Today's Summary:
- **Nouns Learned:** ${state.sessionStats.nounsLearned}
- **Verbs Introduced:** ${state.sessionStats.verbsIntroduced}
- **Items in Review Queue:** ${state.pools.reviewQueue.length}
- **Mistakes Made:** ${state.sessionStats.mistakesMade}

## Progress:
- **Mastered Words:** ${state.pools.mastered.length}
- **Remaining A1 Words:** ${state.pools.unselected.length}

Great job today! Come back tomorrow for more practice. 

Type **"Today is a new day"** tomorrow to continue your learning journey!`)
    
    setCurrentStep(0)
    setBatchProgress({ completed: 0, total: 0 })
  }

  return {
    currentStep,
    batchProgress,
    processCommand,
    getCurrentSection,
    getSectionProgress,
    completeStep,
    startDailyRoutine,
    skipToNextStep
  }
}
