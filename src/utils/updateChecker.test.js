// Simple test for UpdateChecker functionality
import { updateChecker } from './updateChecker.js'

// Test function to verify manual update check
export async function testManualUpdateCheck() {
  console.log('🧪 Testing UpdateChecker functionality...')
  
  try {
    // Test 1: Check if PWA detection works
    console.log('📱 PWA Detection:', updateChecker.isPWA)
    
    // Test 2: Check current version
    console.log('📋 Current Version:', updateChecker.currentVersion)
    
    // Test 3: Test force update check (bypasses time restrictions)
    console.log('🔄 Testing force update check...')
    const result = await updateChecker.forceCheckForUpdates()
    
    console.log('📊 Update Check Result:', result)
    
    // Test 4: Verify update info
    const info = updateChecker.getUpdateInfo()
    console.log('ℹ️ Update Info:', info)
    
    console.log('✅ UpdateChecker tests completed successfully!')
    return result
    
  } catch (error) {
    console.error('❌ UpdateChecker test failed:', error)
    throw error
  }
}

// Auto-test when in development mode
if (import.meta.env.DEV) {
  console.log('🚀 Running UpdateChecker development tests...')
  testManualUpdateCheck().catch(console.error)
}
