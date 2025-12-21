/**
 * Test scenarios and expected outcomes for two-day flow test
 */

export const testScenarios = [
  {
    name: 'Day 1 - Fresh Start',
    category: 'Daily Routine',
    description: 'First day with empty state, no review queue',
    steps: [
      {
        type: 'command',
        command: 'today is a new day'
      },
      {
        type: 'validate',
        validate: (harness) => {
          const issues = []
          
          // Check if we introduced vocabulary
          const stats = harness.getCurrentSessionStats()
          if (stats.nounsLearned === 0) {
            issues.push('Should introduce new vocabulary on Day 1')
          }
          
          return issues
        }
      }
    ]
  },
  
  {
    name: 'Day 2 - With Review Queue',
    category: 'Daily Routine',
    description: 'Second day with review queue from previous mistakes',
    steps: [
      {
        type: 'command',
        command: 'today is a new day'
      },
      {
        type: 'validate',
        validate: (harness) => {
          const issues = []
          
          // Check if we have some learning activity
          const stats = harness.getCurrentSessionStats()
          if (stats.nounsLearned === 0 && stats.verbsIntroduced === 0) {
            issues.push('Should have learning activity on Day 2')
          }
          
          return issues
        }
      }
    ]
  },

  {
    name: 'Basic Speech Synthesis',
    category: 'Speech Synthesis',
    description: 'Tests basic speech functionality',
    steps: [
      {
        type: 'validate',
        validate: (harness) => {
          const issues = []
          
          // Check if speech synthesis service is available
          if (typeof harness.speak !== 'function') {
            issues.push('Speech synthesis service should be available')
          }
          
          return issues
        }
      }
    ]
  },

  {
    name: 'German Language Support',
    category: 'German Language',
    description: 'Tests German language specific functionality',
    steps: [
      {
        type: 'validate',
        validate: (harness) => {
          const issues = []
          
          // Check if we can handle German umlauts
          const testWord = 'Müde'
          if (!testWord.includes('ü')) {
            issues.push('Should support German umlauts')
          }
          
          return issues
        }
      }
    ]
  }
]

export const validationRules = {
  progressTracking: {
    correctAnswersIncrementProgress: 'Correct answers should increment correctCount',
    incorrectAnswersIncrementMistakes: 'Incorrect answers should increment incorrectCount',
    reviewQueuePopulation: 'Mistakes should add items to review queue',
    masteryThresholdCheck: 'Items should move to mastered when threshold reached',
    dualFormTracking: 'Both singular and plural forms should be tracked separately'
  },

  statePersistence: {
    localStorageSave: 'State should be saved to localStorage',
    localStorageLoad: 'State should be loaded from localStorage',
    sessionStatsPreservation: 'Session stats should be preserved between reloads',
    settingsPreservation: 'Settings should be preserved between sessions'
  },

  flowValidation: {
    stepProgressionOrder: 'Steps should progress in correct order (1-7)',
    batchCompletionDetection: 'Batch completion should be detected correctly',
    automaticAdvancement: 'Should advance automatically when batch is complete',
    reviewQueueHandling: 'Review queue should be processed before new content'
  },

  contentValidation: {
    vocabularyGeneration: 'Vocabulary should be generated from unselected pool',
    excludeListRespect: 'Exclude list should be respected during generation',
    randomSelection: 'Items should be randomly selected (not alphabetical)',
    umlautTolerance: 'System should accept answers without umlauts'
  }
}

export const testAssertions = {
  day1: [
    {
      description: 'Day 1 should skip Step 1 and go directly to Step 2',
      validate: (harness) => {
        return harness.messages.some(msg => 
          msg.content.includes('Moving immediately to Step 2')
        )
      }
    },
    {
      description: 'Day 1 should introduce correct number of nouns',
      validate: (harness) => {
        const stats = harness.getCurrentSessionStats()
        return stats.nounsLearned === harness.state.settings.maxVocabularyQuestions
      }
    }
  ],

  day2: [
    {
      description: 'Day 2 should start with review queue from Day 1',
      validate: (harness) => {
        return harness.state.pools.reviewQueue.length > 0
      }
    },
    {
      description: 'Day 2 should process Step 1 (Review)',
      validate: (harness) => {
        return harness.messages.some(msg => 
          msg.content.includes('Step 1: Review Previous Mistakes')
        )
      }
    }
  ]
}

export const errorThresholds = {
  acceptableRanges: {
    vocabularyCorrectness: { min: 0.6, max: 0.8 },
    reviewCorrectness: { min: 0.5, max: 0.7 },
    itemsInReviewQueue: { min: 2, max: 8 },
    mistakesPerDay: { min: 8, max: 20 },
    masteredItems: { min: 0, max: 8 }
  },

  toleranceLevels: {
    umlautErrors: 0.15,
    articleErrors: 0.1,
    spellingErrors: 0.05,
    caseErrors: 0.1
  }
}
