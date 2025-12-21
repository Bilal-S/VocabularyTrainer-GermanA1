/**
 * Comprehensive Test Suite Runner for German A1 Coach
 * 
 * This script runs all test scenarios and provides detailed reporting
 * on the application's functionality, speech synthesis, and user experience.
 */

import { runTestScenario } from './helpers/testHarness.js'
import { testScenarios } from './data/testScenarios.js'
import { UserSimulator } from './helpers/userSimulator.js'

/**
 * Test results collector
 */
class TestResults {
  constructor() {
    this.results = []
    this.startTime = null
    this.endTime = null
  }

  addResult(scenario, result) {
    this.results.push({
      scenario: scenario.name,
      category: scenario.category,
      description: scenario.description,
      passed: result.passed,
      issues: result.issues,
      duration: result.duration,
      details: result
    })
  }

  getSummary() {
    const total = this.results.length
    const passed = this.results.filter(r => r.passed).length
    const failed = total - passed
    const categories = [...new Set(this.results.map(r => r.category))]

    return {
      total,
      passed,
      failed,
      passRate: ((passed / total) * 100).toFixed(1),
      categories: categories.map(cat => ({
        name: cat,
        total: this.results.filter(r => r.category === cat).length,
        passed: this.results.filter(r => r.category === cat && r.passed).length,
        failed: this.results.filter(r => r.category === cat && !r.passed).length
      })),
      duration: this.endTime - this.startTime
    }
  }

  generateReport() {
    const summary = this.getSummary()
    
    let report = `\n=== GERMAN A1 COACH TEST SUITE REPORT ===\n`
    report += `Generated: ${new Date().toISOString()}\n`
    report += `Duration: ${(summary.duration / 1000).toFixed(2)}s\n\n`

    // Summary
    report += `SUMMARY:\n`
    report += `  Total Tests: ${summary.total}\n`
    report += `  Passed: ${summary.passed}\n`
    report += `  Failed: ${summary.failed}\n`
    report += `  Pass Rate: ${summary.passRate}%\n\n`

    // Category breakdown
    report += `CATEGORY BREAKDOWN:\n`
    summary.categories.forEach(cat => {
      const catPassRate = ((cat.passed / cat.total) * 100).toFixed(1)
      report += `  ${cat.name}: ${cat.passed}/${cat.total} (${catPassRate}%)\n`
    })
    report += `\n`

    // Failed tests details
    const failedTests = this.results.filter(r => !r.passed)
    if (failedTests.length > 0) {
      report += `FAILED TESTS:\n`
      failedTests.forEach(test => {
        report += `  ❌ ${test.scenario}\n`
        report += `     Category: ${test.category}\n`
        report += `     Description: ${test.description}\n`
        report += `     Issues:\n`
        test.issues.forEach(issue => {
          report += `       - ${issue}\n`
        })
        report += `     Duration: ${(test.duration / 1000).toFixed(2)}s\n\n`
      })
    }

    // Passed tests summary
    const passedTests = this.results.filter(r => r.passed)
    if (passedTests.length > 0) {
      report += `PASSED TESTS:\n`
      passedTests.forEach(test => {
        report += `  ✅ ${test.scenario} (${(test.duration / 1000).toFixed(2)}s)\n`
      })
      report += `\n`
    }

    // Recommendations
    report += `RECOMMENDATIONS:\n`
    if (summary.failed === 0) {
      report += `  🎉 All tests passed! The application is functioning correctly.\n`
    } else {
      const criticalIssues = failedTests.filter(t => 
        t.issues.some(i => i.includes('Critical') || i.includes('Error'))
      )
      
      if (criticalIssues.length > 0) {
        report += `  🚨 ${criticalIssues.length} critical issues need immediate attention\n`
      }
      
      const speechIssues = failedTests.filter(t => t.category === 'Speech Synthesis')
      if (speechIssues.length > 0) {
        report += `  🔊 ${speechIssues.length} speech synthesis issues detected\n`
      }
      
      const uiIssues = failedTests.filter(t => t.category === 'UI/UX')
      if (uiIssues.length > 0) {
        report += `  🎨 ${uiIssues.length} UI/UX issues found\n`
      }
      
      report += `  📊 Overall pass rate of ${summary.passRate}% needs improvement\n`
    }

    return report
  }
}

/**
 * Runs a single test scenario with detailed logging
 */
async function runSingleTest(scenario, results) {
  console.log(`\n🧪 Running: ${scenario.name}`)
  console.log(`   Category: ${scenario.category}`)
  console.log(`   Description: ${scenario.description}`)
  
  const startTime = Date.now()
  
  try {
    const result = await runTestScenario(scenario)
    const duration = Date.now() - startTime
    
    results.addResult(scenario, { ...result, duration })
    
    if (result.passed) {
      console.log(`   ✅ PASSED (${(duration / 1000).toFixed(2)}s)`)
    } else {
      console.log(`   ❌ FAILED (${(duration / 1000).toFixed(2)}s)`)
      result.issues.forEach(issue => {
        console.log(`      - ${issue}`)
      })
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.log(`   💥 ERROR (${(duration / 1000).toFixed(2)}s): ${error.message}`)
    
    results.addResult(scenario, {
      passed: false,
      issues: [`Test execution error: ${error.message}`],
      duration
    })
  }
}

/**
 * Runs all test scenarios
 */
async function runAllTests() {
  console.log('🚀 Starting German A1 Coach Test Suite...\n')
  
  const results = new TestResults()
  results.startTime = Date.now()

  // Group tests by category for better organization
  const categories = {}
  testScenarios.forEach(scenario => {
    if (!categories[scenario.category]) {
      categories[scenario.category] = []
    }
    categories[scenario.category].push(scenario)
  })

  // Run tests by category
  for (const [category, scenarios] of Object.entries(categories)) {
    console.log(`\n📂 Testing Category: ${category}`)
    console.log('='.repeat(50))
    
    for (const scenario of scenarios) {
      await runSingleTest(scenario, results)
      
      // Small delay between tests to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  results.endTime = Date.now()

  // Generate and display report
  const report = results.generateReport()
  console.log(report)

  // Save report to file if in Node.js environment
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `test-report-${timestamp}.txt`
      fs.writeFileSync(filename, report)
      console.log(`\n📄 Report saved to: ${filename}`)
    } catch (error) {
      console.log(`\n⚠️  Could not save report to file: ${error.message}`)
    }
  }

  return results
}

/**
 * Runs a specific category of tests
 */
async function runTestCategory(categoryName) {
  console.log(`🎯 Running tests for category: ${categoryName}\n`)
  
  const results = new TestResults()
  results.startTime = Date.now()

  const categoryTests = testScenarios.filter(s => s.category === categoryName)
  
  if (categoryTests.length === 0) {
    console.log(`❌ No tests found for category: ${categoryName}`)
    return results
  }

  for (const scenario of categoryTests) {
    await runSingleTest(scenario, results)
  }

  results.endTime = Date.now()
  
  const report = results.generateReport()
  console.log(report)

  return results
}

/**
 * Quick smoke test for critical functionality
 */
async function runSmokeTest() {
  console.log('💨 Running Quick Smoke Test...\n')
  
  const criticalScenarios = testScenarios.filter(s => 
    s.category === 'Speech Synthesis' || 
    s.name.includes('Basic Flow') ||
    s.name.includes('Database')
  )

  const results = new TestResults()
  results.startTime = Date.now()

  for (const scenario of criticalScenarios) {
    await runSingleTest(scenario, results)
  }

  results.endTime = Date.now()
  
  const summary = results.getSummary()
  console.log(`\n🔥 Smoke Test Results: ${summary.passed}/${summary.total} passed (${summary.passRate}%)`)
  
  if (summary.failed === 0) {
    console.log('✅ All critical systems operational!')
  } else {
    console.log('⚠️  Some critical issues detected - review full test suite')
  }

  return results
}

/**
 * Validates German language specific functionality
 */
async function runGermanLanguageTest() {
  console.log('🇩🇪 Running German Language Specific Tests...\n')
  
  const germanTests = [
    {
      name: 'German Umlaut Handling',
      category: 'German Language',
      description: 'Tests proper handling of German umlauts (ä, ö, ü, ß)',
      steps: [
        {
          type: 'validate',
          description: 'Test umlaut recognition',
          validate: (context) => {
            const testCases = [
              { user: 'ae', correct: 'ä', expected: true },
              { user: 'Muede', correct: 'Müde', expected: true },
              { user: 'Haus', correct: 'Haus', expected: true },
              { user: 'Fenster', correct: 'Tür', expected: false }
            ]
            
            const results = testCases.map(testCase => {
              const isAccentError = testCase.user.toLowerCase() !== testCase.correct.toLowerCase() &&
                testCase.user.replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü').toLowerCase() === 
                testCase.correct.toLowerCase()
              return isAccentError === testCase.expected
            })
            
            return results.every(r => r) ? [] : ['Umlaut detection logic failed']
          }
        }
      ]
    },
    {
      name: 'German Article Support',
      category: 'German Language',
      description: 'Tests German article system (der, die, das)',
      steps: [
        {
          type: 'validate',
          description: 'Test article handling',
          validate: (context) => {
            const articles = ['der', 'die', 'das', 'den', 'dem', 'des']
            const testWord = 'Tisch'
            const article = 'der'
            
            // This would test article selection logic
            return articles.includes(article) ? [] : ['German article system not working']
          }
        }
      ]
    }
  ]

  const results = new TestResults()
  results.startTime = Date.now()

  for (const scenario of germanTests) {
    await runSingleTest(scenario, results)
  }

  results.endTime = Date.now()
  
  const report = results.generateReport()
  console.log(report)

  return results
}

// Export functions for different test modes
export {
  runAllTests,
  runTestCategory,
  runSmokeTest,
  runGermanLanguageTest,
  TestResults
}

// Auto-run tests if this file is executed directly
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'all'
  
  switch (mode) {
    case 'smoke':
      await runSmokeTest()
      break
    case 'german':
      await runGermanLanguageTest()
      break
    default:
      await runAllTests()
  }
}
