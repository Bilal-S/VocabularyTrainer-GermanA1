import { useState, useCallback } from 'react'
import { VocabularyManager } from '../utils/vocabularyManager'
import { generateMessageId } from '../utils/idGenerator'
import { updateChecker } from '../utils/updateChecker'
import { getStepConfig, getCurrentSection as getCurrentStepSection, STEPS, STEP_CONFIG } from '../services/stepService'
import { speak } from '../services/speechSynthesisService'

export const useDailyRoutine = (state, setMessages, updateProgress, trackSessionLearning, getCurrentSessionStats, resetSessionStats) => {
  // Get speech settings from state
  const getSpeechSettings = () => {
    return {
      enabled: state.settings?.speechEnabled || false,
      voice: state.settings?.selectedVoice || null,
      rate: state.settings?.speechRate || 1,
      pitch: state.settings?.speechPitch || 1,
      volume: state.settings?.speechVolume || 1
    }
  }

  // Speak German text with current settings
  const speakGerman = useCallback((text, options = {}) => {
    const settings = getSpeechSettings()
    if (!settings.enabled) return

    const speechOptions = {
      voice: settings.voice,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
      ...options
    }

    speak(text, 'de-DE', speechOptions)
  }, [state.settings])

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
  const [isCompleting, setIsCompleting] = useState(false)

  const getCurrentSection = useCallback(() => {
    return getCurrentStepSection(currentStep) || 'INTRO'
  }, [currentStep])

  const getSectionProgress = useCallback(() => {
    if (currentStep === 0 || currentStep === 7) {
      return { completed: 0, total: 1, percentage: 100 }
    }
    
    const config = getStepConfig(currentStep, state.settings)
    
    // Use batchProgress.total if available (corrects count for variable-length batches like Review)
    const total = batchProgress.total > 0 ? batchProgress.total : config.totalItems
    
    return {
      completed: batchProgress.completed,
      total: total,
      percentage: total > 0 
        ? Math.round((batchProgress.completed / total) * 100)
        : 100
    }
  }, [currentStep, batchProgress, state.settings])

  const isStepComplete = useCallback(() => {
    // Intro and Recap steps are always considered complete
    if (currentStep === 0 || currentStep === 7) {
      return true
    }
    
    // For batch mode, check if all items in current batch have been answered
    if (isBatchMode && currentBatch.length > 0) {
      return Object.keys(batchAnswers).length >= currentBatch.length
    }
    
    // For single question mode, check if batch progress is complete
    return batchProgress.completed >= batchProgress.total && batchProgress.total > 0
  }, [currentStep, isBatchMode, currentBatch, batchAnswers, batchProgress])

  const getRemainingQuestions = useCallback(() => {
    // Intro and Recap steps have no questions
    if (currentStep === 0 || currentStep === 7) {
      return 0
    }
    
    // For batch mode, count unanswered items in current batch
    if (isBatchMode && currentBatch.length > 0) {
      return currentBatch.length - Object.keys(batchAnswers).length
    }
    
    // For single question mode, use batch progress
    return Math.max(0, batchProgress.total - batchProgress.completed)
  }, [currentStep, isBatchMode, currentBatch, batchAnswers, batchProgress])

  const addSystemMessage = useCallback((content) => {
    const message = {
      id: generateMessageId(),
      type: 'system',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, message])
  }, [setMessages])

  const processCommand = async (command) => {
    const normalizedCommand = command.trim().toLowerCase()

    if (normalizedCommand === 'today is a new day' || normalizedCommand === 'tiand') {
      await startDailyRoutine()
    } else if (normalizedCommand === 'next step') {
      if (currentStep === 0) {
        addSystemMessage("Please start your daily routine first. Type **\"Today is a new day\"** to begin.")
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
      addSystemMessage(`I didn't understand that command. Available commands:
- **"Today is a new day"** (or **"tiand"**) - Start your daily routine
- **"progress summary"** - Display current learning progress
- **"Next Step"** - Skip to next exercise
- **"clear all progress data"** - Reset all progress`)
    }
  }

  const startDailyRoutine = async () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // CRITICAL FIX: Reset session stats when starting a new day
    resetSessionStats()
    
    // CRITICAL FIX: Reset batch answers when starting a new day
    setBatchAnswers({})
    
    // Check for PWA updates if running as PWA
    let updateMessage = ''
    if (updateChecker.isPWA) {
      const updateResult = updateChecker.checkForUpdates()
      if (updateResult.shouldUpdate && !updateChecker.isUpdateDismissed()) {
        updateMessage = `
---
## 🔄 Update Available!

**A new version (${updateResult.latestVersion}) is available!**
- **Current version:** ${updateResult.currentVersion}
- **Latest version:** ${updateResult.latestVersion}

<button onclick="window.updateApp()" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 8px 0;">
  🚀 Update Now
</button>
<button onclick="window.dismissUpdate()" style="background-color: #6b7280; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 8px 8px 8px 0;">
  ✖️ Dismiss
</button>

*Updates include bug fixes and new features. You can continue using the current version and update later.*

---

`
      }
    }
    
    // Clear messages and show welcome screen first
    const welcomeMessage = `# Welcome to A1 German Coach! 🇩🇪

This is your personal German vocabulary trainer using only official Goethe-Institut A1 vocabulary.

## Available Commands:
- **"Today is a new day"** - Start your daily learning routine
- **"Next Step"** - Skip to the next exercise
- **"clear all progress data"** - Reset all your progress

## Features:
- 📚 Structured 7-step daily routine
- 🎯 Progress tracking and mastery system
- 💾 Save/load your progress via JSON
- 📱 Mobile-friendly chat interface
${updateChecker.isPWA ? '- 🔄 Auto-update notifications for PWA users' : ''}

Type **"Today is a new day"** to begin your German learning journey!${updateMessage}`
    
    setMessages([{
      id: generateMessageId(),
      type: 'system',
      content: welcomeMessage
    }])
    
    // Check if we have previous data to show summary
    if (state.lastSessionDate && state.lastSessionDate !== new Date().toISOString().split('T')[0]) {
      const sessionStats = getCurrentSessionStats()
      const summaryMessage = `## Previous Session Summary:
- **Nouns introduced:** ${sessionStats.nounsLearned}
- **Verbs introduced:** ${sessionStats.verbsIntroduced}
- **Items added to review queue:** ${sessionStats.itemsAddedToReview}
- **Items in review queue:** ${sessionStats.itemsRemainingInReview}

---

`
      
      await delay(1000)
      setMessages(prev => [...prev, {
        id: generateMessageId(),
        type: 'system',
        content: summaryMessage
      }])
    }
    
    // Check if review queue is empty
    if (state.pools.reviewQueue.length === 0) {
      await delay(2000)
      addSystemMessage(`*Checking Review Queue...*
> **Status:** Your Review Queue is currently empty! Great job.
> **Action:** Moving immediately to Step 2.`)
        
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
    addSystemMessage(`## Step 1: Review Previous Mistakes
We'll review ${state.pools.reviewQueue.length} items from your review queue.

**Question 1 of ${reviewBatch.length}: From ${currentReview?.originSection || 'Unknown'}**
---
${currentReview?.question || 'Loading question...'}
Type your answer below:`)
  }

  const skipToNextStepFromStep = async (fromStep) => {
    const nextStep = fromStep + 1
    setCurrentStep(nextStep)
    
    const config = getStepConfig(nextStep, state.settings)
    
    // Generate exercises for the specific step
    let batch = []
    let exercise = null
    
    switch (STEPS[nextStep]) {
      case 'VOCABULARY':
        // Generate exclude list from mastered and review queue words (handle new structure)
        const masteredWords = Array.isArray(state.pools.mastered) 
          ? state.pools.mastered 
          : [
              ...(state.pools.mastered.nouns || []),
              ...(state.pools.mastered.verbs || []),
              ...(state.pools.mastered.words || [])
            ]
        
        // Add words with mastered singular form to exclude list
        const singularMastered = Object.keys(state.progress).filter(word => 
            state.progress[word].singular?.correctCount >= state.settings.masteringCount
        )

        const excludeList = [
          ...masteredWords,
          ...state.pools.reviewQueue.map(item => typeof item === 'string' ? item : item.word),
          ...state.pools.unselected, // Also exclude words already used in this session
          ...singularMastered
        ]
        
        // Generate vocabulary batch and ensure state synchronization
        batch = vocabManager.generateVocabularyBatch(excludeList, state.settings.maxVocabularyQuestions, state)
        
        // Check if all singular forms are mastered
        if (batch.length === 0) {
          addSystemMessage(`🎉 **All vocabulary items have been mastered!**

All singular noun forms have been answered correctly ${state.settings.masteringCount} times and are now in your mastered pool.

Moving to **Step 3: Plural Practice** in 1 second...`)
          
          // Automatically move to next step after standardized delay
          setTimeout(() => {
            skipToNextStepFromStep(2)
          }, 1000)
          return
        }
        
        // Validate that we have a proper batch
        if (!batch || batch.length === 0) {
          console.error('Failed to generate vocabulary batch')
          addSystemMessage("⚠️ Error: Unable to generate vocabulary exercises. Please check vocabulary data.")
          return
        }
        
        // Track session learning for nouns
        trackSessionLearning('nouns', batch.length)
        
        // Synchronize states between VocabularyManager and hook
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        // CRITICAL FIX: Reset answers when starting a new batch
        setBatchAnswers({})
        
        // Generate initial batch message
        let batchMessage = `Hello! I am your **A1 German Coach (Goethe-only)**. I am ready to guide you through your daily structured learning routine using only approved vocabulary from Goethe-Institut A1 list.

***

### **Step 1: Review Previous Mistakes**
*Checking Review Queue...*
> **Status:** Your Review Queue is currently empty! Great job.
> **Action:** Moving immediately to Step 2.

---

### **Step 2: New Vocabulary (${config.totalItems} Nouns)**
**[Step 2 | Batch 1 | Remaining: ${batch.length}]**

Please translate to following **English nouns** into **German** (Article + Noun) singular form:
*Example: 1. house -> das Haus*

`
        // Number the items sequentially starting from 1
        batch.forEach((item, index) => {
          batchMessage += `*${index + 1}.* ${item.english}\n`
        })
        addSystemMessage(batchMessage)
              
        console.log('Vocabulary batch generated:', {
          batchLength: batch.length,
          firstItem: batch[0],
          vocabManagerBatch: vocabManager.currentBatch?.length
        })
        return
      case 'PLURAL':
        // Build exclude list for Plural step
        const masteredForPlural = Array.isArray(state.pools.mastered) 
          ? state.pools.mastered 
          : [
              ...(state.pools.mastered.nouns || []),
              ...(state.pools.mastered.verbs || []),
              ...(state.pools.mastered.words || [])
            ]

        // Add words with mastered plural form
        const pluralMastered = Object.keys(state.progress).filter(word => 
            state.progress[word].plural?.correctCount >= state.settings.masteringCount
        )

        const pluralExcludeList = [
          ...masteredForPlural,
          ...state.pools.reviewQueue.map(item => typeof item === 'string' ? item : item.word),
          ...state.pools.unselected,
          ...pluralMastered
        ]

        batch = vocabManager.generatePluralBatch(pluralExcludeList, state.settings.maxPluralQuestions, state)
        
        // Check if all plural forms are mastered
        if (batch.length === 0) {
          addSystemMessage(`🎉 **All plural forms have been mastered!**

All plural noun forms have been answered correctly ${state.settings.masteringCount} times and are now in your mastered pool.

Moving to **Step 4: Articles in Context** in 1 second...`)
          
          // Automatically move to next step after standardized delay
          setTimeout(() => {
            skipToNextStepFromStep(3)
          }, 2000)
          return
        }
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        // Reset answers when starting a new batch
        setBatchAnswers({})
        
        let pluralMessage = `### **Step 3: Plural Practice (${config.totalItems} Nouns)**
**[Step 3 | Batch 1 | Remaining: ${batch.length}]**

Please provide to **plural forms** for the following German nouns:
*Example: 1. das Haus -> die Häuser*

`
        // Number the items sequentially starting from 1 with translation and speech markers
        batch.forEach((item, index) => {
          pluralMessage += `{{translate:${item.english}}} *${index + 1}.* {{speak:${item.singular}}} \n`
        })
        addSystemMessage(pluralMessage)
        
        return
      case 'ARTICLES':
        batch = vocabManager.generateArticlesBatch(state.settings.maxArticlesQuestions, state)
        
        // Check if all article exercises are mastered
        if (batch.length === 0) {
          addSystemMessage(`🎉 **All article exercises have been mastered!**

All article exercises have been answered correctly ${state.settings.maxReviewCount} times and are now in your mastered pool.

Moving to **Step 5: Case Translations** in 1 second...`)
          
          // Automatically move to next step after standardized delay
          setTimeout(() => {
            skipToNextStepFromStep(4)
          }, 2000)
          return
        }
        
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        // CRITICAL FIX: Reset answers when starting a new batch
        setBatchAnswers({})
        
        let articlesMessage = `### **Step 4: Articles in Context (${config.totalItems} Items)**
**[Step 4 | Batch 1 | Remaining: ${batch.length}]**

Please fill in the blanks with **correct articles** (der, die, das, ein, eine):

`
        // Number the items sequentially starting from 1 with translation and speech markers for German words
        batch.forEach((item, index) => {
            articlesMessage += `{{translate:${item.english}}} *${index + 1}.* {{speak:${item.german}}}\n`
        })
        addSystemMessage(articlesMessage)
        

        return
      case 'TRANSLATIONS':
        batch = vocabManager.generateTranslationBatch(state.settings.maxTranslationsQuestions, state)
        
        // Check if all translation exercises are mastered
        if (batch.length === 0) {
          addSystemMessage(`🎉 **All translation exercises have been mastered!**

All translation exercises have been answered correctly ${state.settings.maxReviewCount} times and are now in your mastered pool.

Moving to **Step 6: Verb Conjugation**...`)
          
          // Automatically move to next step after brief delay
          setTimeout(() => {
            skipToNextStepFromStep(5)
          }, 2000)
          return
        }
        
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        // CRITICAL FIX: Reset answers when starting a new batch
        setBatchAnswers({})
        
        let translationsMessage = `### **Step 5: Case Translations (${config.totalItems} Items)**
**[Step 5 | Batch 1 | Remaining: ${batch.length}]**

Please translate to following **sentences from English to German**:

`
        // Number the items sequentially starting from 1
        batch.forEach((item, index) => {
          translationsMessage += `*${index + 1}.* ${item.english}\n`
        })
        addSystemMessage(translationsMessage)       

        return
      case 'VERBS':
        // Pass state to enable mastery filtering
        batch = vocabManager.generateVerbBatch([], state.settings.maxVerbsQuestions, state)
        
        // Check if all verb conjugations are mastered
        if (batch.length === 0) {
          addSystemMessage(`🎉 **All verb conjugations have been mastered!**

All verb+subject combinations have been answered correctly ${state.settings.masteringCount} times and are now in your mastered pool.

Moving to **Step 7: Daily Recap** in 1 second...`)
          
          // Automatically move to next step after standardized delay
          setTimeout(() => {
            skipToNextStepFromStep(6)
          }, 1000)
          return
        }
        
        setCurrentBatch(batch)
        setBatchProgress({ completed: 0, total: batch.length })
        setIsBatchMode(true)
        
        // Track session learning for verbs
        const uniqueVerbs = [...new Set(batch.map(item => item.word))]
        trackSessionLearning('verbs', uniqueVerbs.length)
        
        // CRITICAL FIX: Reset answers when starting a new batch
        setBatchAnswers({})
        
        let verbsMessage = `### **Step 6: Verb Conjugation (${config.totalItems} Items)**
**[Step 6 | Batch 1 | Remaining: ${batch.length}]**

Please conjugate the following **verbs for the given subjects**:

`
        // Number the items sequentially starting from 1 with translation and speech markers
        batch.forEach((item, index) => {
          verbsMessage += `{{translate:${item.verbEnglish}}} *${index + 1}.* {{speak:${item.verb}}} (${item.subject})\n`
        })
        addSystemMessage(verbsMessage)
        
        return
      case 'RECAP':
        // CRITICAL FIX: Handle Step 7 recap directly
        await generateDailyRecap()
        return
      default:
        batch = []
        exercise = null
    }
    
    setCurrentExercise(exercise)
    setBatchProgress({ completed: 0, total: batch.length })
    setIsBatchMode(false)
    
    let message = `# ⏭️ Skipping to Step ${nextStep}: ${config.name}\n\n`
    message += await getStepInstructions(STEPS[nextStep])
    
    if (exercise) {
      message += `\n\n**Question:** ${exercise.question}\nType your answer below:`
    }
    
    addSystemMessage(message)
  }

  const skipToNextStep = async () => {
    if (currentStep < 7) {
      await skipToNextStepFromStep(currentStep)
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

  const handleSingleAnswer = async (answer) => {
    if (!currentExercise) {
      addSystemMessage("Please wait for exercise to load...")
      return
    }

    const isCorrect = vocabManager.validateAnswer(answer, currentExercise.answer, currentExercise.type, currentExercise)
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
        const answers = Array.isArray(currentExercise.answer) 
          ? currentExercise.answer.join('** or **') 
          : currentExercise.answer
        feedback += `The correct translation is: **${answers}**\n\n`
      }
      
      // Add ChatGPT link for help
      const helpQuery = encodeURIComponent(`Why is "${answer}" wrong for "${currentExercise.english}" in German?`)
      feedback += `💡 **Need help?** <a href="https://chatgpt.com/?q=${helpQuery}" target="_blank" rel="noopener noreferrer">Ask ChatGPT for explanation</a>\n\n`
    }
    
    // Move to next exercise in batch
    const nextExercise = vocabManager.moveToNext()
    setCurrentExercise(nextExercise)
    
    // Update progress for review section
    const nextQuestionNumber = progress.current + 1
    setBatchProgress(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total)
    }))
    
    // Update progress in state with section and subject information
    const subject = currentExercise.type === 'conjugation' ? currentExercise.cleanSubject : null
    updateProgress(currentExercise.word, isCorrect, currentExercise.originSection, currentExercise.form || 'singular', subject)
    
    // Show next question or completion message
    if (nextExercise && nextQuestionNumber <= progress.total) {
      feedback += `**Progress:** ${nextQuestionNumber}/${progress.total} questions completed\n\n`
      feedback += `**Question ${nextQuestionNumber} of ${progress.total}: From ${nextExercise?.originSection || 'Unknown'}**\n---\n${nextExercise?.question || 'Loading question...'}\nType your answer below:`
    } else if (nextQuestionNumber >= progress.total) {
      feedback += `**Progress:** ${progress.total}/${progress.total} questions completed\n\n`
      feedback += `✅ Review section complete! Moving to next step...`
    }
    
    addSystemMessage(feedback)
    
    // Check if review batch is complete and move to next step
    if (progress.isComplete) {
      await setTimeout(() => {
        completeStep()
      }, 2000)
    }
  }

  const handleBatchAnswer = async (answer) => {
    // CRITICAL FIX: Parse batch answer with proper handling
    console.log('handleBatchAnswer called with:', { answer, currentStep, currentBatchLength: currentBatch.length })
    
    const lines = answer.split('\n').filter(line => line.trim())
    const numberedAnswers = []
    const sequentialAnswers = []
    
    lines.forEach(line => {
      // Enhanced regex to match:
      // 1. Answer (space)
      // 1. Answer (dot)
      // 1) Answer (paren)
      // 1- Answer (dash)
      // Captures the number and the answer content
      const match = line.match(/^(\d+)(?:[\.\)\-]\s*|\s+)(.+)$/i)
      
      if (match) {
        numberedAnswers.push({ index: parseInt(match[1]) - 1, answer: match[2].trim() })
      } else if (line.trim()) {
        // For lines not starting with a number, treat as sequential answers for remaining items
        sequentialAnswers.push({ index: null, answer: line.trim() })
      }
    })

    // Check for mixed numbered and sequential answers
    if (numberedAnswers.length > 0 && sequentialAnswers.length > 0) {
      addSystemMessage("⚠️ Error: Please provide either all numbered answers (e.g., '1. answer') or all sequential answers (one per line). Mixed formats are not supported.")
      return
    }

    // Get current unanswered items (based on current batchAnswers state)
    const unansweredIndices = currentBatch
      .map((_, index) => index)
      .filter(index => !batchAnswers[index])

    console.log('Current batchAnswers:', batchAnswers)
    console.log('Unanswered indices:', unansweredIndices)
    console.log('Numbered answers:', numberedAnswers)
    console.log('Sequential answers:', sequentialAnswers)

    // CRITICAL FIX: Update batch answers with proper validation
    const updatedBatchAnswers = { ...batchAnswers }
    const newlyAnsweredIndices = []
    
    if (numberedAnswers.length > 0) {
      // Handle numbered answers
      numberedAnswers.forEach(answerObj => {
        if (answerObj.index !== null && answerObj.index >= 0 && answerObj.index < currentBatch.length) {
          // Direct numbered answer - use the specified index (if not already answered)
          if (!batchAnswers[answerObj.index]) {
            updatedBatchAnswers[answerObj.index] = answerObj.answer
            newlyAnsweredIndices.push(answerObj.index)
            console.log(`Added numbered answer at index ${answerObj.index}: "${answerObj.answer}"`)
          }
        }
      })
    } else {
      // Handle sequential answers - map to remaining unanswered items in order
      sequentialAnswers.forEach((answerObj, i) => {
        if (i < unansweredIndices.length) {
          const targetIndex = unansweredIndices[i]
          updatedBatchAnswers[targetIndex] = answerObj.answer
          newlyAnsweredIndices.push(targetIndex)
          console.log(`Added sequential answer at index ${targetIndex}: "${answerObj.answer}"`)
        }
      })
    }
    
    console.log('Updated batchAnswers:', updatedBatchAnswers)
    console.log('Newly answered indices:', newlyAnsweredIndices)
    
    setBatchAnswers(updatedBatchAnswers)
    
    // Grade batch answers - only provide feedback for newly answered items
    const feedback = generateBatchFeedback(updatedBatchAnswers, newlyAnsweredIndices)
    addSystemMessage(feedback)
    
    // Update progress based on total answered items
    const totalAnswered = Object.keys(updatedBatchAnswers).length
    setBatchProgress(prev => ({
      ...prev,
      completed: Math.min(totalAnswered, prev.total)
    }))
  }

  const generateBatchFeedback = (allAnswers, newlyAnsweredIndices) => {
    // Enhanced error handling with fallback
    if (!currentBatch || !currentBatch.length) {
      console.error('No batch available for grading. Current batch:', currentBatch)
      addSystemMessage("⚠️ Error: No exercise batch is currently available. Please try starting a new step with 'Next Step' command.")
      return "No batch available for grading."
    }
    
    if (!allAnswers || Object.keys(allAnswers).length === 0) {
      addSystemMessage("Please provide your answers in the format:\n1. answer1\n2. answer2\n...")
      return "No answers provided to grade."
    }
    
    const stepName = STEPS[currentStep] || `Step ${currentStep}`
    let feedback = `**[Step ${currentStep} | Batch 1 | Grading Partial Response]**\n\n`
    
    // Count total answered and remaining
    const totalAnswered = Object.keys(allAnswers).length
    const remaining = currentBatch.length - totalAnswered
    
    // Show feedback only for newly answered items in this round
    const newlyAnsweredItems = []
    newlyAnsweredIndices.forEach(index => {
      const exercise = currentBatch[index]
      const userAnswer = allAnswers[index]
      if (exercise && userAnswer) {
        newlyAnsweredItems.push({ exercise, index, userAnswer })
      }
    })
    
    // Helper to get the appropriate display prompt based on exercise type
    const getPrompt = (exercise) => {
      if (exercise.type === 'article') return exercise.german
      if (exercise.type === 'plural') return exercise.singular
      if (exercise.type === 'conjugation') return `${exercise.verb} (${exercise.subject})`
      return exercise.english || exercise.question || exercise.german
    }

    if (newlyAnsweredItems.length > 0) {
      feedback += `**Feedback for this round:**\n\n`
      
      newlyAnsweredItems.forEach(({ exercise, index, userAnswer }) => {
        const isCorrect = vocabManager.validateAnswer(userAnswer, exercise.answer, exercise.type, exercise)
        const prompt = getPrompt(exercise)
        
        // Ensure word is defined for progress tracking
        // For Articles (Step 4), word is the german sentence
        // For Translations (Step 5), word is the english sentence
        const wordToTrack = exercise.word || exercise.german || exercise.english || exercise.question
        
        if (!wordToTrack) {
          console.warn('Missing word for progress tracking:', exercise)
        }

        if (isCorrect) {
          feedback += `${index + 1}. **${prompt}**: Your answer: **${userAnswer}** ✅\n`
          // Update progress for correct answers with form and subject information
          if (wordToTrack) {
            const subject = exercise.type === 'conjugation' ? exercise.cleanSubject : null
            updateProgress(wordToTrack, true, `${stepName}`, exercise.form || 'singular', subject)
          }
        } else {
          const helpQuery = encodeURIComponent(`Why is "${userAnswer}" wrong for "${prompt}" in German?`)
          const correctDisplay = Array.isArray(exercise.answer)
            ? exercise.answer.join(' or ')
            : exercise.answer
          feedback += `${index + 1}. **${prompt}**: Your answer: **${userAnswer}** <span style="color: red;">**Correction:**</span> **${correctDisplay}** <a href="https://chatgpt.com/?q=${helpQuery}" target="_blank" rel="noopener noreferrer" title="Ask ChatGPT for explanation">💡</a>\n`
          
          // Update progress for incorrect answers with form and subject information
          if (wordToTrack) {
            const subject = exercise.type === 'conjugation' ? exercise.cleanSubject : null
            updateProgress(wordToTrack, false, `${stepName}`, exercise.form || 'singular', subject)
          }
        }
      })
      
      feedback += `\n`
    }
    
    // Display summary of all answers received so far
    const answeredItems = Object.keys(allAnswers).map(index => ({
      index: parseInt(index),
      exercise: currentBatch[parseInt(index)],
      answer: allAnswers[index]
    })).sort((a, b) => a.index - b.index);
    
    if (answeredItems.length > 0) {
      feedback += `<details>\n<summary><strong>All answers submitted so far (${answeredItems.length}/${currentBatch.length})</strong></summary>\n\n`
      answeredItems.forEach(({ index, exercise, answer }) => {
        // Validation logic for summary list
        const isCorrect = vocabManager.validateAnswer(answer, exercise.answer, exercise.type, exercise)
        const prompt = getPrompt(exercise)
        
        if (isCorrect) {
          feedback += `${index + 1}. **${prompt}**: **${answer}** ✅\n`
        } else {
          const helpQuery = encodeURIComponent(`Why is "${answer}" wrong for "${prompt}" in German?`)
          const correctDisplay = Array.isArray(exercise.answer) 
            ? exercise.answer.join(' or ') 
            : exercise.answer
          feedback += `${index + 1}. **${prompt}**: **${answer}** <span style="color: red;">❌ Correction: **${correctDisplay}**</span> <a href="https://chatgpt.com/?q=${helpQuery}" target="_blank" rel="noopener noreferrer" title="Ask ChatGPT for explanation">💡</a>\n`
        }
      });
      feedback += `\n</details>\n\n***\n\n`
    }
    
    // Check if all items have been answered
    if (remaining === 0) {
      feedback += `🎉 **Step ${currentStep} Complete!** All ${currentBatch.length} items have been answered.\n\n`
      feedback += `**Progress Summary:**\n`
      feedback += `- **Items Processed:** ${totalAnswered}\n`
      feedback += `- **Remaining:** 0\n\n`
      
      let nextStepInfo = ""
      if (currentStep < 7) {
        const nextStepKey = STEPS[currentStep + 1]
        const nextConfig = STEP_CONFIG[nextStepKey]
        nextStepInfo = `Moving to **Step ${currentStep + 1}: ${nextConfig.name}** in 1 second...`
      } else {
        nextStepInfo = `Moving to **Daily Recap** in 1 second...`
      }
      
      feedback += `${nextStepInfo}\n\n`
      feedback += `⏳ *Auto-advancing to next step...*`
      
      // Standardized auto-advance to next step after 1 second
      setTimeout(() => {
        completeStep()
      }, 2000)
      
      return feedback
    }
    
    feedback += `**[Step ${currentStep} | Batch 1 | Remaining: ${remaining}]**\n\n`
    feedback += `Please continue with the remaining items:\n\n`
    
    // List remaining items (only unanswered ones) with original numbering and speech markers
    currentBatch.forEach((exercise, actualIndex) => {
      if (!allAnswers[actualIndex]) {
        const prompt = getPrompt(exercise)
        let itemWithSpeech = prompt
        
        // Add translation and speech markers for different step types (NOT step 2)
        if (currentStep === 3 && exercise.type === 'plural') {
          itemWithSpeech = `{{speak:${exercise.singular}}}`
        } else if (currentStep === 4 && exercise.type === 'article') {
          // directly use the whole sentence
          itemWithSpeech = `{{speak:${exercise.german}}}`
        } else if (currentStep === 6 && exercise.type === 'conjugation') {
          itemWithSpeech = `{{speak:${exercise.verb}}} (${exercise.subject})`
        }
        
        // Add translation marker at the very beginning of each line (only for steps that need it)
        let translationText = ''
        if (currentStep === 3 && exercise.type === 'plural') {
          translationText = exercise.english
        } else if (currentStep === 4 && exercise.type === 'article') {
          translationText = exercise.english
        } else if (currentStep === 6 && exercise.type === 'conjugation') {
          translationText = exercise.verbEnglish
        }
        
        if (translationText && translationText !== '') {
          feedback += `{{translate:${translationText}}} *${actualIndex + 1}.* ${itemWithSpeech}\n`
        } else {
          feedback += `*${actualIndex + 1}.* ${itemWithSpeech}\n`
        }
        
      }
    })
    
    return feedback
  }

  const completeStep = async () => {
    // Prevent duplicate completion calls
    if (isCompleting) {
      return
    }
    
    setIsCompleting(true)
    
    try {
      if (currentStep < 7) {
        // Automatically proceed to generate and display the next step's batch
        await skipToNextStepFromStep(currentStep)
      } else {
        await generateDailyRecap()
      }
    } finally {
      // Reset completion state after a brief delay to allow UI to settle
      setTimeout(() => {
        setIsCompleting(false)
      }, 500)
    }
  }

  const generateDailyRecap = async () => {
    console.log('Generating daily recap...')
    const sessionStats = getCurrentSessionStats()
    console.log('Session stats for recap:', sessionStats)
    
    addSystemMessage(`# 🎉 Daily Routine Complete!

## Today's Summary in English:
- **Nouns introduced:** ${sessionStats.nounsLearned}
- **Verbs introduced:** ${sessionStats.verbsIntroduced}
- **Items added to review queue:** ${sessionStats.itemsAddedToReview}
- **Items in review queue:** ${sessionStats.itemsRemainingInReview}

## Progress Overview:
- **Total mastered words:** ${sessionStats.totalMastered}
- **Remaining A1 words:** ${sessionStats.totalRemaining}
- **Initial review queue size:** ${sessionStats.initialReviewQueueSize}
- **Mistakes made today:** ${sessionStats.mistakesMade}

Great job today! You've made excellent progress with your German learning. 

Type **"Today is a new day"** tomorrow to continue your learning journey!`)
    
    setCurrentStep(0)
    setBatchProgress({ completed: 0, total: 0 })
  }

  const generateProgressSummary = async () => {
    console.log('Generating progress summary...')
    const sessionStats = getCurrentSessionStats()
    console.log('Session stats for progress summary:', sessionStats)
    
    addSystemMessage(`# 📊 Current Progress Summary

## Learning Session Summary:
- **Nouns introduced:** ${sessionStats.nounsLearned}
- **Verbs introduced:** ${sessionStats.verbsIntroduced}
- **Items added to review queue:** ${sessionStats.itemsAddedToReview}
- **Items in review queue:** ${sessionStats.itemsRemainingInReview}

## Overall Progress Overview:
- **Total mastered words:** ${sessionStats.totalMastered}
- **Remaining A1 words:** ${sessionStats.totalRemaining}
- **Initial review queue size:** ${sessionStats.initialReviewQueueSize}
- **Mistakes made today:** ${sessionStats.mistakesMade}

${currentStep > 0 && currentStep < 7 ? `### **Current Status:** Step ${currentStep} of 7 - ${STEP_CONFIG[STEPS[currentStep]].name}**` : ''}
${currentStep === 0 ? '### **Current Status:** Not started - Type "Today is a new day" to begin!' : ''}
${currentStep === 7 ? '### **Current Status:** Daily routine complete!' : ''}

Keep up the great work! You're making steady progress with your German learning.`)
  }

  return {
    currentStep,
    batchProgress,
    processCommand,
    getCurrentSection,
    getSectionProgress,
    isStepComplete,
    getRemainingQuestions,
    completeStep,
    startDailyRoutine,
    skipToNextStep,
    isCompleting,
    speakGerman // Expose speech function for external use
  }
}
