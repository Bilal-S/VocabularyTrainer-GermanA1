#!/usr/bin/env node

/**
 * Test runner for German A1 Coach Daily Routine Test
 * 
 * Usage:
 *   node tests/runDailyRoutineTest.js
 */

import GermanDailyRoutineTest from './dailyRoutineTest.js'

console.log('🚀 Starting German A1 Coach Daily Routine Test Suite...\n')

const test = new GermanDailyRoutineTest()

test.runCompleteTest()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed successfully!')
      process.exit(0)
    } else {
      console.log('\n❌ Some tests failed. Please review the output above.')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('\n💥 Test execution failed with error:')
    console.error(error)
    process.exit(1)
  })
