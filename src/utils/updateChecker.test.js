// Test file for PWA Update Checker
// This file demonstrates and tests the update checker functionality

import { updateChecker } from './updateChecker.js'

// Mock localStorage for testing
const mockLocalStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null
  },
  setItem: function(key, value) {
    this.data[key] = value
  },
  removeItem: function(key) {
    delete this.data[key]
  }
}

// Mock window.matchMedia for PWA detection
const mockMatchMedia = (query) => ({
  matches: query === '(display-mode: standalone)' ? true : false
})

// Test functions
export function testUpdateChecker() {
  console.log('🧪 Testing PWA Update Checker...')
  
  // Test 1: Version comparison
  console.log('\n📋 Test 1: Version Comparison')
  const comparison1 = updateChecker.compareVersions('1.0.2', '1.0.1')
  const comparison2 = updateChecker.compareVersions('1.0.1', '1.0.2')
  const comparison3 = updateChecker.compareVersions('1.0.1', '1.0.1')
  
  console.log(`1.0.2 > 1.0.1:`, comparison1 === 1 ? '✅' : '❌')
  console.log(`1.0.1 > 1.0.2:`, comparison2 === -1 ? '✅' : '❌')
  console.log(`1.0.1 = 1.0.1:`, comparison3 === 0 ? '✅' : '❌')
  
  // Test 2: PWA detection
  console.log('\n📋 Test 2: PWA Detection')
  const originalMatchMedia = window.matchMedia
  window.matchMedia = mockMatchMedia
  
  const isPWADetected = updateChecker.checkIsPWA()
  console.log('PWA detection (standalone mode):', isPWADetected ? '✅' : '❌')
  
  // Restore original
  window.matchMedia = originalMatchMedia
  
  // Test 3: Update timing logic
  console.log('\n📋 Test 3: Update Timing Logic')
  const now = Date.now()
  const yesterday = now - (25 * 60 * 60 * 1000) // 25 hours ago
  const today = now - (12 * 60 * 60 * 1000) // 12 hours ago
  
  updateChecker.setLastUpdateCheck(yesterday)
  console.log('25 hours ago - should check:', updateChecker.shouldCheckForUpdates() ? '✅' : '❌')
  
  updateChecker.setLastUpdateCheck(today)
  console.log('12 hours ago - should not check:', !updateChecker.shouldCheckForUpdates() ? '✅' : '❌')
  
  // Test 4: Update dismissal logic
  console.log('\n📋 Test 4: Update Dismissal Logic')
  updateChecker.dismissUpdate()
  console.log('Just dismissed - should be dismissed:', updateChecker.isUpdateDismissed() ? '✅' : '❌')
  
  // Test 5: Current version
  console.log('\n📋 Test 5: Current Version')
  const currentVersion = updateChecker.getCurrentVersion()
  console.log('Current version:', currentVersion)
  console.log('Version format valid:', /^\d+\.\d+\.\d+$/.test(currentVersion) ? '✅' : '❌')
  
  // Test 6: Update info
  console.log('\n📋 Test 6: Update Info')
  const updateInfo = updateChecker.getUpdateInfo()
  console.log('Update info object structure:', 
    updateInfo.hasOwnProperty('currentVersion') &&
    updateInfo.hasOwnProperty('isPWA') &&
    updateInfo.hasOwnProperty('lastCheck') &&
    updateInfo.hasOwnProperty('lastKnownVersion') &&
    updateInfo.hasOwnProperty('updateAvailable') &&
    updateInfo.hasOwnProperty('dismissed') ? '✅' : '❌'
  )
  
  console.log('\n🎉 All tests completed!')
  return {
    versionComparison: { comparison1, comparison2, comparison3 },
    pwaDetection: isPWADetected,
    updateTiming: { yesterdayCheck: updateChecker.shouldCheckForUpdates() },
    dismissalLogic: updateChecker.isUpdateDismissed(),
    currentVersion,
    updateInfo
  }
}

// Export for use in console or other test files
if (typeof window !== 'undefined') {
  window.testUpdateChecker = testUpdateChecker
  console.log('💡 Run window.testUpdateChecker() in browser console to test the update checker')
}
