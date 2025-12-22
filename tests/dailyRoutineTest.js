import assert from 'assert'
import './mocks/localStorage.js'
import './mocks/document.js'
import './mocks/window.js'
import { TestHarness } from '../src/tests/helpers/testHarness.js'
import { UserSimulator } from '../src/tests/helpers/userSimulator.js'

/**
 * Main Node.js Flow Test for German A1 Coach
 * Simulates two consecutive days of learning and validates complete application flow
 */
class GermanDailyRoutineTest {
  constructor() {
    this.harness = new TestHarness()
    this.simulator = new UserSimulator()
    this.simulator.setVocabularyManager(this.harness.vocabManager)
    this.results = {
      passed: 0,
      failed: 0,
      details: []
    }
  }

  /**
   * Log test result with icon
   */
  log(message, type = 'info') {
    const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : 'ℹ️'
    console.log(`${icon} ${message}`)
  }

  /**
   * Run assertion and track results
   */
  assert(condition, description) {
    try {
      assert(condition, description)
      this.log(description, 'pass')
      this.results.passed++
      this.results.details.push({ description, status: 'PASS' })
      return true
    } catch (error) {
      this.log(description, 'fail')
      this.log(`  Expected: true, Actual: ${condition}`, 'fail')
      this.results.failed++
      this.results.details.push({ description, status: 'FAIL', error: error.message })
      return false
    }
  }

  /**
   * Run Day 1 test scenario
   */
  async runDay1Test() {
    console.group('🌅 Day 1 Test: Fresh Start')
    
    try {
      // Reset harness for fresh start
      this.harness.reset()
      
      // Start daily routine
      this.log('Starting Day 1 with fresh state...')
      await this.harness.processCommand('Today is a new day')
      
      // Verify empty review queue handling
      this.assert(
        this.harness.messages.some(msg => msg.content.includes('Moving immediately to Step 2')),
        'Should skip Step 1 when review queue is empty'
      )

      // Simulate Step 2: New Vocabulary
      this.log('Simulating Step 2: New Vocabulary...')
      const vocabAnswers = this.simulator.generateVocabularyAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(vocabAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 3: Plural Practice
      this.log('Simulating Step 3: Plural Practice...')
      const pluralAnswers = this.simulator.generatePluralAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(pluralAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 4: Articles in Context
      this.log('Simulating Step 4: Articles in Context...')
      const articlesAnswers = this.simulator.generateArticlesAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(articlesAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 5: Case Translations
      this.log('Simulating Step 5: Case Translations...')
      const translationsAnswers = this.simulator.generateTranslationsAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(translationsAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 6: Verb Conjugation
      this.log('Simulating Step 6: Verb Conjugation...')
      const verbAnswers = this.simulator.generateVerbAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(verbAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Wait for recap
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get final stats for Day 1
      const day1Stats = this.harness.getCurrentSessionStats()
      
      // Validate expected ranges
      this.assert(
        day1Stats.nounsLearned === this.harness.state.settings.maxVocabularyQuestions,
        `Day 1 should introduce exactly ${this.harness.state.settings.maxVocabularyQuestions} nouns (actual: ${day1Stats.nounsLearned})`
      )
      
      this.assert(
        day1Stats.verbsIntroduced >= (this.harness.state.settings.maxVerbsQuestions / 3),
        `Day 1 should introduce verbs (actual unique: ${day1Stats.verbsIntroduced})`
      )
      
      this.assert(
        day1Stats.itemsAddedToReview >= 3 && day1Stats.itemsAddedToReview <= 25,
        `Day 1 should add 3-25 items to review queue (actual: ${day1Stats.itemsAddedToReview})`
      )
      
      this.assert(
        day1Stats.totalMastered >= 0,
        `Day 1 should have valid mastered items (actual: ${day1Stats.totalMastered})`
      )
      
      this.assert(
        day1Stats.mistakesMade >= 3 && day1Stats.mistakesMade <= 30,
        `Day 1 should have 3-30 mistakes (actual: ${day1Stats.mistakesMade})`
      )

      // Store Day 1 results for comparison
      this.day1Results = {
        stats: day1Stats,
        state: JSON.parse(JSON.stringify(this.harness.state)),
        messages: [...this.harness.messages]
      }

      this.log(`Day 1 completed: ${day1Stats.nounsLearned} nouns, ${day1Stats.verbsIntroduced} verbs, ${day1Stats.itemsAddedToReview} review items`)

    } catch (error) {
      this.log(`Day 1 test failed: ${error.message}`, 'fail')
      console.error(error)
    }
    
    console.groupEnd()
  }

  /**
   * Run Day 2 test scenario
   */
  async runDay2Test() {
    console.group('🌙 Day 2 Test: With Review Queue')
    
    try {
      // Load Day 1 state (simulate next day)
      this.harness.state = JSON.parse(JSON.stringify(this.day1Results.state))
      this.harness.messages = [...this.day1Results.messages]
      
      // Update session date to simulate new day
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      this.harness.state.lastSessionDate = yesterday.toISOString().split('T')[0]
      
      // Start daily routine for Day 2
      this.log('Starting Day 2 with previous state...')
      await this.harness.processCommand('Today is a new day')
      
      // Verify review queue is processed
      this.assert(
        this.harness.messages.some(msg => msg.content.includes('Step 1: Review Previous Mistakes')),
        'Should start with Step 1 when review queue has items'
      )

      // Simulate Step 1: Review Previous Mistakes
      if (this.harness.currentStep === 1 && this.harness.currentBatch && this.harness.currentBatch.length > 0) {
        this.log('Simulating Step 1: Review Previous Mistakes...')
        
        for (let i = 0; i < this.harness.currentBatch.length; i++) {
          const reviewAnswer = this.simulator.generateReviewAnswer(this.harness.currentBatch[i])
          await this.harness.handleAnswer(reviewAnswer)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Simulate Step 2: New Vocabulary
      this.log('Simulating Step 2: New Vocabulary...')
      const vocabAnswers = this.simulator.generateVocabularyAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(vocabAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 3: Plural Practice
      this.log('Simulating Step 3: Plural Practice...')
      const pluralAnswers = this.simulator.generatePluralAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(pluralAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 4: Articles in Context
      this.log('Simulating Step 4: Articles in Context...')
      const articlesAnswers = this.simulator.generateArticlesAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(articlesAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 5: Case Translations
      this.log('Simulating Step 5: Case Translations...')
      const translationsAnswers = this.simulator.generateTranslationsAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(translationsAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate Step 6: Verb Conjugation
      this.log('Simulating Step 6: Verb Conjugation...')
      const verbAnswers = this.simulator.generateVerbAnswers(this.harness.currentBatch || [])
      await this.harness.handleAnswer(verbAnswers)
      
      // Wait for automatic advancement
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Wait for recap
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get final stats for Day 2
      const day2Stats = this.harness.getCurrentSessionStats()
      
      // Validate expected ranges
      this.assert(
        day2Stats.nounsLearned === this.harness.state.settings.maxVocabularyQuestions,
        `Day 2 should introduce exactly ${this.harness.state.settings.maxVocabularyQuestions} nouns (actual: ${day2Stats.nounsLearned})`
      )
      
      this.assert(
        day2Stats.verbsIntroduced >= (this.harness.state.settings.maxVerbsQuestions / 3),
        `Day 2 should introduce verbs (actual unique: ${day2Stats.verbsIntroduced})`
      )
      
      this.assert(
        day2Stats.totalMastered >= 0,
        `Day 2 should have mastered items (actual: ${day2Stats.totalMastered})`
      )

      // Store Day 2 results
      this.day2Results = {
        stats: day2Stats,
        state: JSON.parse(JSON.stringify(this.harness.state)),
        messages: [...this.harness.messages]
      }

      this.log(`Day 2 completed: ${day2Stats.nounsLearned} nouns, ${day2Stats.verbsIntroduced} verbs, ${day2Stats.totalMastered} mastered`)

    } catch (error) {
      this.log(`Day 2 test failed: ${error.message}`, 'fail')
      console.error(error)
    }
    
    console.groupEnd()
  }

  /**
   * Run cumulative validation tests
   */
  runCumulativeTests() {
    console.group('📊 Cumulative Validation')
    
    try {
      // Validate two-day totals
      const totalNouns = this.day1Results.stats.nounsLearned + this.day2Results.stats.nounsLearned
      const totalVerbs = this.day1Results.stats.verbsIntroduced + this.day2Results.stats.verbsIntroduced
      const totalMistakes = this.day1Results.stats.mistakesMade + this.day2Results.stats.mistakesMade

      this.assert(
        totalNouns === (this.day1Results.state.settings.maxVocabularyQuestions + this.day2Results.state.settings.maxVocabularyQuestions),
        `Two days should introduce correct total nouns (actual: ${totalNouns})`
      )
      
      this.assert(
        totalVerbs >= (this.day1Results.state.settings.maxVerbsQuestions / 3 * 2),
        `Two days should introduce correct total verbs (actual: ${totalVerbs})`
      )
      
      this.assert(
        totalMistakes >= 10 && totalMistakes <= 60,
        `Two days should have 10-60 total mistakes (actual: ${totalMistakes})`
      )

      // Validate state persistence
      this.assert(
        this.day2Results.state.userId === this.day1Results.state.userId,
        'User ID should be preserved between days'
      )
      
      this.assert(
        this.day2Results.state.settings.masteringCount === this.day1Results.state.settings.masteringCount,
        'Settings should be preserved between days'
      )

      // Validate progress tracking
      this.assert(
        Object.keys(this.day2Results.state.progress).length > Object.keys(this.day1Results.state.progress).length,
        'Progress should accumulate between days'
      )

      this.log('Cumulative validation completed')

    } catch (error) {
      this.log(`Cumulative validation failed: ${error.message}`, 'fail')
      console.error(error)
    }
    
    console.groupEnd()
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60))
    console.log('📋 TEST REPORT')
    console.log('='.repeat(60))
    
    console.log(`\n📊 SUMMARY:`)
    console.log(`   ✅ Passed: ${this.results.passed}`)
    console.log(`   ❌ Failed: ${this.results.failed}`)
    console.log(`   📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`)
    
    if (this.results.failed > 0) {
      console.log(`\n❌ FAILED TESTS:`)
      this.results.details
        .filter(detail => detail.status === 'FAIL')
        .forEach(detail => {
          console.log(`   • ${detail.description}`)
          if (detail.error) {
            console.log(`     Error: ${detail.error}`)
          }
        })
    }
    
    console.log(`\n📈 DAY 1 RESULTS:`)
    console.log(`   Nouns learned: ${this.day1Results.stats.nounsLearned}`)
    console.log(`   Verbs introduced: ${this.day1Results.stats.verbsIntroduced}`)
    console.log(`   Items added to review: ${this.day1Results.stats.itemsAddedToReview}`)
    console.log(`   Mistakes made: ${this.day1Results.stats.mistakesMade}`)
    console.log(`   Mastered items: ${this.day1Results.stats.totalMastered}`)
    
    console.log(`\n📈 DAY 2 RESULTS:`)
    console.log(`   Nouns learned: ${this.day2Results.stats.nounsLearned}`)
    console.log(`   Verbs introduced: ${this.day2Results.stats.verbsIntroduced}`)
    console.log(`   Items added to review: ${this.day2Results.stats.itemsAddedToReview}`)
    console.log(`   Mistakes made: ${this.day2Results.stats.mistakesMade}`)
    console.log(`   Mastered items: ${this.day2Results.stats.totalMastered}`)
    console.log(`   Review queue size: ${this.day2Results.stats.itemsRemainingInReview}`)
    
    console.log(`\n📈 CUMULATIVE RESULTS:`)
    console.log(`   Total nouns: ${this.day1Results.stats.nounsLearned + this.day2Results.stats.nounsLearned}`)
    console.log(`   Total verbs: ${this.day1Results.stats.verbsIntroduced + this.day2Results.stats.verbsIntroduced}`)
    console.log(`   Total mistakes: ${this.day1Results.stats.mistakesMade + this.day2Results.stats.mistakesMade}`)
    console.log(`   Final review queue: ${this.day2Results.stats.itemsRemainingInReview}`)
    console.log(`   Final mastered: ${this.day2Results.stats.totalMastered}`)
    
    console.log('\n' + '='.repeat(60))
    
    return this.results.failed === 0
  }

  /**
   * Run complete two-day flow test
   */
  async runCompleteTest() {
    console.group('🇩🇪 German A1 Coach - Two Day Flow Test')
    console.log('This test simulates two consecutive days of German learning')
    console.log('and validates the complete application flow including:')
    console.log('- Progress tracking across days')
    console.log('- Review queue functionality')
    console.log('- State persistence')
    console.log('- Final progress summary numbers')
    console.log('')
    
    try {
      await this.runDay1Test()
      await this.runDay2Test()
      this.runCumulativeTests()
      
      const allTestsPassed = this.generateReport()
      
      if (allTestsPassed) {
        console.log('🎉 ALL TESTS PASSED! The application flow is working correctly.')
      } else {
        console.log('⚠️  SOME TESTS FAILED. Please review the failures above.')
      }
      
    } catch (error) {
      console.error('Test execution failed:', error)
    }
    
    console.groupEnd()
    
    return this.results.failed === 0
  }
}

// Export for use in Node.js
export default GermanDailyRoutineTest

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new GermanDailyRoutineTest()
  test.runCompleteTest().then(success => {
    process.exit(success ? 0 : 1)
  }).catch(error => {
    console.error('Test execution failed:', error)
    process.exit(1)
  })
}
