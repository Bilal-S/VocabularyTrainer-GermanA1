import { generateMessageId } from '../utils/idGenerator.js'
import { updateChecker } from '../utils/updateChecker.js'

/**
 * Add a system message to the messages array
 * @param {string} content - Message content
 * @param {Function} setMessages - Function to set messages
 */
export const addSystemMessage = (content, setMessages) => {
  const message = {
    id: generateMessageId(),
    type: 'system',
    content,
    timestamp: new Date().toISOString()
  }
  setMessages(prev => [...prev, message])
}

/**
 * Generate welcome message for the application
 * @param {boolean} isPWA - Whether running as PWA
 * @returns {string} Welcome message content
 */
export const generateWelcomeMessage = (isPWA = false) => {
  const updateMessage = isPWA ? `- 🔄 Auto-update notifications for PWA users` : ''
  
  return `# Welcome to A1 German Coach! 🇩🇪

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
${updateMessage}

Type **"Today is a new day"** to begin your German learning journey!`
}

/**
 * Generate update notification message
 * @param {Object} updateInfo - Update information
 * @returns {string} Update notification content
 */
export const generateUpdateMessage = (updateInfo) => {
  return `
---

## 🔄 Update Available!

**A new version (${updateInfo.latestVersion}) is available!**
- **Current version:** ${updateInfo.currentVersion}
- **Latest version:** ${updateInfo.latestVersion}

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

/**
 * Generate previous session summary message
 * @param {Object} sessionStats - Session statistics
 * @returns {string} Previous session summary content
 */
export const generatePreviousSessionSummary = (sessionStats) => {
  return `## Previous Session Summary:
- **Nouns learned:** ${sessionStats.nounsLearned}
- **Verbs introduced:** ${sessionStats.verbsIntroduced}
- **Items added to review queue:** ${sessionStats.itemsAddedToReview}
- **Items remaining in review queue:** ${sessionStats.itemsRemainingInReview}

---`
}

/**
 * Generate review queue empty message
 * @returns {string} Review queue empty notification
 */
export const generateReviewQueueEmptyMessage = () => {
  return `*Checking Review Queue...*
> **Status:** Your Review Queue is currently empty! Great job.
> **Action:** Moving immediately to Step 2.`
}

/**
 * Generate step start message for review
 * @param {Object} reviewItem - Current review item
 * @param {number} questionNumber - Current question number
 * @param {number} totalQuestions - Total questions in review
 * @returns {string} Step 1 message content
 */
export const generateReviewStepMessage = (reviewItem, questionNumber, totalQuestions) => {
  return `## Step 1: Review Previous Mistakes
We'll review ${totalQuestions} items from your review queue.

**Question ${questionNumber} of ${totalQuestions}: From ${reviewItem?.originSection || 'Unknown'}**
---
${reviewItem?.question || 'Loading question...'}
Type your answer below:`
}

/**
 * Generate batch exercise message
 * @param {number} stepNumber - Current step number
 * @param {string} stepName - Step name
 * @param {Array} batch - Current batch of exercises
 * @param {string} instructions - Exercise instructions
 * @param {string} example - Example format
 * @returns {string} Batch exercise message
 */
export const generateBatchMessage = (stepNumber, stepName, batch, instructions, example) => {
  let message = `Hello! I am your **A1 German Coach (Goethe-only)**. I am ready to guide you through your daily structured learning routine using only approved vocabulary from the Goethe-Institut A1 list.

***

### **Step 1: Review Previous Mistakes**
*Checking Review Queue...*
> **Status:** Your Review Queue is currently empty! Great job.
> **Action:** Moving immediately to Step 2.

---

### **Step ${stepNumber}: ${stepName}**
**[Step ${stepNumber} | Batch 1 | Remaining: ${batch.length}]**

${instructions}
*Example: ${example}*

`

  // Number the items sequentially starting from 1
  batch.forEach((item, index) => {
    if (item.english) {
      message += `*${index + 1}.* ${item.english}\n`
    } else if (item.german) {
      message += `*${index + 1}.* ${item.german}\n`
    }
  })

  return message
}

/**
 * Generate single question message
 * @param {number} stepNumber - Current step number
 * @param {string} stepName - Step name
 * @param {Object} exercise - Current exercise
 * @param {string} instructions - Exercise instructions
 * @returns {string} Single question message
 */
export const generateSingleQuestionMessage = (stepNumber, stepName, exercise, instructions) => {
  let message = `# ⏭️ Skipping to Step ${stepNumber}: ${stepName}\n\n`
  message += instructions + '\n\n'
  
  if (exercise) {
    message += `**Question:** ${exercise.question}\nType your answer below:`
  }
  
  return message
}

/**
 * Generate daily recap message
 * @param {Object} sessionStats - Session statistics
 * @returns {string} Daily recap content
 */
export const generateDailyRecap = (sessionStats) => {
  return `# 🎉 Daily Routine Complete!

## Today's Summary in English:
- **Nouns learned:** ${sessionStats.nounsLearned}
- **Verbs introduced:** ${sessionStats.verbsIntroduced}
- **Items added to review queue:** ${sessionStats.itemsAddedToReview}
- **Items remaining in review queue:** ${sessionStats.itemsRemainingInReview}

## Progress Overview:
- **Total mastered words:** ${sessionStats.totalMastered}
- **Remaining A1 words:** ${sessionStats.totalRemaining}
- **Initial review queue size:** ${sessionStats.initialReviewQueueSize}
- **Mistakes made today:** ${sessionStats.mistakesMade}

Great job today! You've made excellent progress with your German learning. 

Type **"Today is a new day"** tomorrow to continue your learning journey!`
}

/**
 * Generate progress summary message
 * @param {Object} progressSummary - Progress summary data
 * @returns {string} Progress summary content
 */
export const generateProgressSummary = (progressSummary) => {
  return `# 📊 Current Progress Summary

## Learning Session Summary:
- **Nouns learned:** ${progressSummary.nounsLearned}
- **Verbs introduced:** ${progressSummary.verbsIntroduced}
- **Items added to review queue:** ${progressSummary.itemsAddedToReview}
- **Items remaining in review queue:** ${progressSummary.itemsRemainingInReview}

## Overall Progress Overview:
- **Total mastered words:** ${progressSummary.totalMastered}
- **Remaining A1 words:** ${progressSummary.totalRemaining}
- **Initial review queue size:** ${progressSummary.initialReviewQueueSize}
- **Mistakes made today:** ${progressSummary.mistakesMade}

### **Current Status:** ${progressSummary.currentStepText}**

Keep up the great work! You're making steady progress with your German learning.`
}

/**
 * Generate command not recognized message
 * @returns {string} Help message for unknown commands
 */
export const generateUnknownCommandMessage = () => {
  return `I didn't understand that command. Available commands:
- **"Today is a new day"** (or **"tiand"**) - Start your daily routine
- **"progress summary"** - Display current learning progress
- **"Next Step"** - Skip to next exercise
- **"clear all progress data"** - Reset all progress`
}

/**
 * Generate start routine requirement message
 * @returns {string} Message prompting to start routine
 */
export const generateStartRoutineMessage = () => {
  return 'Please start your daily routine first. Type **"Today is a new day"** to begin.'
}

/**
 * Generate completion message for step
 * @param {number} currentStep - Current step number
 * @param {string} nextStepName - Next step name
 * @returns {string} Step completion message
 */
export const generateStepCompletionMessage = (currentStep, nextStepName) => {
  return `✅ Review section complete! Moving to next step...`
}

/**
 * Generate all completed message
 * @returns {string} Message when all steps are complete
 */
export const generateAllCompletedMessage = () => {
  return "You've already completed all steps for today!"
}
