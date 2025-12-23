import assert from 'assert'
import './mocks/localStorage.js'
import './mocks/document.js'
import './mocks/window.js'
import { TestHarness } from '../src/tests/helpers/testHarness.js'
import { UserSimulator } from '../src/tests/helpers/userSimulator.js'
import { createReviewQueueFromBaseData } from './reviewBaseData.js'

/**
 * Review Queue Specific Test for German A1 Coach
 * Validates adding items from all sections to review queue and clearing them
 */
class ReviewQueueTest {
  constructor() {
    this.harness = new TestHarness()
    this.simulator = new UserSimulator()
    this.simulator.setVocabularyManager(this.harness.vocabManager)
  }

  log(message, type = 'info') {
    const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : 'ℹ️'
    console.log(`${icon} ${message}`)
  }

  assert(condition, description) {
    try {
      assert(condition, description)
      this.log(description, 'pass')
      return true
    } catch (error) {
      this.log(description, 'fail')
      this.log(`  Expected: true, Actual: ${condition}`, 'fail')
      return false
    }
  }

  async runTest() {
    console.group('🔄 Review Queue Comprehensive Test')
    
    try {
      // 1. Setup
      this.harness.reset()
      
      // Configure settings for this test
      this.harness.state.settings.maxReviewCount = 1
      this.harness.state.settings.maxReviewBatchSize = 100 // Ensure we can review all mistakes at once
      this.harness.state.settings.masteringCount = 5 // Prevent immediate mastery during review
      
      // Configure simulator to FAIL everything on Day 1
      this.simulator.correctnessRates = {
        vocabulary: 0.0,
        review: 0.0,
        plural: 0.0,
        articles: 0.0,
        translations: 0.0,
        verbs: 0.0
      }
      
      // 2. Day 1: Generate Mistakes
      this.log('Starting Day 1: Generating mistakes in all sections...')
      
      // Pre-populate review queue with base data items
      const baseReviewQueue = createReviewQueueFromBaseData()
      this.harness.state.pools.reviewQueue = baseReviewQueue
      
      await this.harness.processCommand('Today is a new day')
      
      // Since we pre-populated review queue, we should be in Step 1
      // Process all review queue items to generate mistakes
      if (this.harness.currentStep === 1 && this.harness.currentBatch) {
        this.log(`Processing review batch of size: ${this.harness.currentBatch.length}`)
        
        const batchSize = this.harness.currentBatch.length
        for (let i = 0; i < batchSize; i++) {
          const item = this.harness.currentBatch[this.harness.currentBatchIndex]
          const answer = this.simulator.generateReviewAnswer(item) // Will be incorrect
          await this.harness.handleAnswer(answer)
        }
      }
      
      // Now skip through remaining steps to complete Day 1
      await this.harness.skipToNextStepFromStep(1) // Skip to Step 2
      await this.harness.skipToNextStepFromStep(2) // Skip to Step 3
      await this.harness.skipToNextStepFromStep(3) // Skip to Step 4
      await this.harness.skipToNextStepFromStep(4) // Skip to Step 5
      await this.harness.skipToNextStepFromStep(5) // Skip to Step 6
      await this.harness.skipToNextStepFromStep(6) // Skip to Step 7 (Recap)

      // Verify Review Queue Population
      const day1Stats = this.harness.getCurrentSessionStats()
      const expectedMistakes = baseReviewQueue.length
      
      this.log(`Day 1 Mistakes: ${day1Stats.mistakesMade} / Expected: ${expectedMistakes}`)
      this.log(`Review Queue Size: ${this.harness.state.pools.reviewQueue.length}`)
      
      this.assert(
        day1Stats.mistakesMade === expectedMistakes,
        `Should have mistakes for all questions (${expectedMistakes})`
      )
      
      this.assert(
        this.harness.state.pools.reviewQueue.length === expectedMistakes,
        'Review queue should contain all mistakes'
      )

      // Verify variety in review queue
      const sectionsInQueue = [...new Set(this.harness.state.pools.reviewQueue.map(item => item.section))]
      this.log(`Sections in review queue: ${sectionsInQueue.join(', ')}`)
      
      this.assert(sectionsInQueue.length >= 4, 'Should have items from multiple sections')

      // Verify no duplicate verb conjugations in review queue
      const verbItems = this.harness.state.pools.reviewQueue.filter(item => item.section === 'VERBS')
      const uniqueVerbItems = [...new Set(verbItems.map(item => item.word))]
      this.assert(
        verbItems.length === uniqueVerbItems.length,
        'Should not have duplicate verb conjugations in review queue'
      )

      // 3. Day 2: Clear Review Queue
      this.log('Starting Day 2: Clearing review queue...')
      
      // Update date
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      this.harness.state.lastSessionDate = yesterday.toISOString().split('T')[0]
      this.harness.resetSessionStats() // Reset daily stats

      // Configure simulator to PASS everything
      this.simulator.correctnessRates = {
        vocabulary: 1.0,
        review: 1.0,
        plural: 1.0,
        articles: 1.0,
        translations: 1.0,
        verbs: 1.0
      }

      await this.harness.processCommand('Today is a new day')
      
      // Should be in Step 1
      this.assert(
        this.harness.currentStep === 1,
        'Should start in Step 1 (Review)'
      )

      // Process Review Batch
      if (this.harness.currentStep === 1 && this.harness.currentBatch) {
        this.log(`Processing review batch of size: ${this.harness.currentBatch.length}`)
        
        // Verify no duplicate questions in the batch
        const batchQuestions = this.harness.currentBatch.map(item => 
          item.type === 'conjugation' ? `${item.verb}|${item.subject}` : item.word || item.question
        )
        const uniqueBatchQuestions = [...new Set(batchQuestions)]
        this.assert(
          batchQuestions.length === uniqueBatchQuestions.length,
          'Review batch should not contain duplicate questions'
        )
        
        // Answer one by one as per Step 1 logic
        const batchSize = this.harness.currentBatch.length
        for (let i = 0; i < batchSize; i++) {
          const item = this.harness.currentBatch[this.harness.currentBatchIndex]
          this.log(`  Answering question ${i + 1}/${batchSize}: ${item.word} (${item.originSection})`)
          
          const answer = this.simulator.generateReviewAnswer(item) // Should be correct
          this.log(`    Generated answer: ${answer}`)
          this.log(`    Expected answer: ${item.answer}`)
          
          await this.harness.handleAnswer(answer)
          
          // Check progress after each answer
          const progress = this.harness.state.progress[item.word]
          if (progress) {
            this.log(`    Progress for "${item.word}": singular.correctCount=${progress.singular.correctCount}, threshold=${this.harness.state.settings.maxReviewCount}`)
          } else {
            this.log(`    WARNING: No progress found for "${item.word}"`)
          }
          
          // Check if item is still in review queue
          const stillInQueue = this.harness.state.pools.reviewQueue.find(qItem =>
            (typeof qItem === 'string' ? qItem : qItem.word) === item.word
          )
          if (stillInQueue) {
            this.log(`    WARNING: Item "${item.word}" still in review queue after correct answer!`)
          }
          
          this.log(`    Review queue size: ${this.harness.state.pools.reviewQueue.length}`)
        }
      }

      // Check Review Queue Status
      this.log(`Review Queue Size after review: ${this.harness.state.pools.reviewQueue.length}`)
      
      // Debug: Show remaining items
      if (this.harness.state.pools.reviewQueue.length > 0) {
        this.log('Remaining items in review queue:')
        this.harness.state.pools.reviewQueue.forEach(item => {
          const word = typeof item === 'string' ? item : item.word
          const section = typeof item === 'string' ? 'Unknown' : item.section
          this.log(`  - ${word} (${section})`)
        })
      }
      
      this.assert(
        this.harness.state.pools.reviewQueue.length === 0,
        'Review queue should be empty after successful review (maxReviewCount=1)'
      )

      this.log('Review Queue Test Completed')

    } catch (error) {
      this.log(`Test failed: ${error.message}`, 'fail')
      console.error(error)
    }
    
    console.groupEnd()
  }
}

// Run test
const test = new ReviewQueueTest()
test.runTest().then(() => process.exit(0))
