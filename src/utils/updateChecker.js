// PWA Update Checker Utility
// Handles version checking and update prompts for PWA instances

const STORAGE_KEYS = {
  LAST_UPDATE_CHECK: 'lastUpdateCheck',
  LAST_KNOWN_VERSION: 'lastKnownVersion',
  UPDATE_DISMISSED: 'updateDismissed',
  UPDATE_AVAILABLE: 'updateAvailable'
}

const CHECK_INTERVAL_HOURS = 24 // Check once per day

export class UpdateChecker {
  constructor() {
    this.currentVersion = this.getCurrentVersion()
    this.isPWA = this.checkIsPWA()
  }

  getCurrentVersion() {
    // Get version from build-time constant or fallback
    return typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0'
  }

  checkIsPWA() {
    // Check if running as PWA (standalone mode)
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true
  }

  getLastUpdateCheck() {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE_CHECK)
    return timestamp ? parseInt(timestamp) : 0
  }

  setLastUpdateCheck(timestamp = Date.now()) {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE_CHECK, timestamp.toString())
  }

  getLastKnownVersion() {
    return localStorage.getItem(STORAGE_KEYS.LAST_KNOWN_VERSION) || this.currentVersion
  }

  setLastKnownVersion(version) {
    localStorage.setItem(STORAGE_KEYS.LAST_KNOWN_VERSION, version)
  }

  isUpdateDismissed() {
    const timestamp = localStorage.getItem(STORAGE_KEYS.UPDATE_DISMISSED)
    if (!timestamp) return false
    
    const dismissedTime = parseInt(timestamp)
    const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60)
    
    // Allow showing update again after 24 hours
    return hoursSinceDismissed < 24
  }

  dismissUpdate() {
    localStorage.setItem(STORAGE_KEYS.UPDATE_DISMISSED, Date.now().toString())
  }

  shouldCheckForUpdates() {
    if (!this.isPWA) return false
    
    const lastCheck = this.getLastUpdateCheck()
    const hoursSinceLastCheck = (Date.now() - lastCheck) / (1000 * 60 * 60)
    
    return hoursSinceLastCheck >= CHECK_INTERVAL_HOURS
  }

  async forceCheckForUpdates() {
    // Force update check regardless of time restrictions
    try {
      // Fetch latest version from a version endpoint
      const latestVersion = await this.fetchLatestVersion()
      
      if (!latestVersion) {
        return { shouldUpdate: false, reason: 'fetch_failed' }
      }

      const shouldUpdate = this.compareVersions(latestVersion, this.currentVersion) > 0

      if (shouldUpdate) {
        this.setLastKnownVersion(latestVersion)
        localStorage.setItem(STORAGE_KEYS.UPDATE_AVAILABLE, 'true')
        return { 
          shouldUpdate: true, 
          currentVersion: this.currentVersion,
          latestVersion,
          reason: 'update_available'
        }
      }

      return { shouldUpdate: false, reason: 'up_to_date', currentVersion: this.currentVersion, latestVersion }
      
    } catch (error) {
      console.error('Force update check failed:', error)
      return { shouldUpdate: false, reason: 'error', error }
    }
  }

  async checkForUpdates() {
    if (!this.shouldCheckForUpdates()) {
      return { shouldUpdate: false, reason: 'not_time_yet' }
    }

    try {
      this.setLastUpdateCheck()
      
      // Fetch latest version from a version endpoint
      // For now, we'll simulate this by checking against a hardcoded version
      // In production, this would fetch from your server/version.json
      const latestVersion = await this.fetchLatestVersion()
      
      if (!latestVersion) {
        return { shouldUpdate: false, reason: 'fetch_failed' }
      }

      const lastKnownVersion = this.getLastKnownVersion()
      const shouldUpdate = this.compareVersions(latestVersion, lastKnownVersion) > 0

      if (shouldUpdate) {
        this.setLastKnownVersion(latestVersion)
        localStorage.setItem(STORAGE_KEYS.UPDATE_AVAILABLE, 'true')
        return { 
          shouldUpdate: true, 
          currentVersion: this.currentVersion,
          latestVersion,
          reason: 'update_available'
        }
      }

      return { shouldUpdate: false, reason: 'up_to_date' }
      
    } catch (error) {
      console.error('Update check failed:', error)
      return { shouldUpdate: false, reason: 'error', error }
    }
  }

  async fetchLatestVersion() {
    try {
      // In development, we'll simulate version checking with higher version
      if (import.meta.env.DEV) {
        // Simulate an update available in development
        return '3.2.1'
      }
      
      // Production version check - fetch from version.json
      const response = await fetch('/version.json', { 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.version
      
    } catch (error) {
      console.error('Failed to fetch latest version:', error)
      return null
    }
  }

  compareVersions(version1, version2) {
    // Simple semantic version comparison
    const v1Parts = version1.split('.').map(Number)
    const v2Parts = version2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0
      const v2Part = v2Parts[i] || 0
      
      if (v1Part > v2Part) return 1
      if (v1Part < v2Part) return -1
    }
    
    return 0
  }

  isUpdateAvailable() {
    return localStorage.getItem(STORAGE_KEYS.UPDATE_AVAILABLE) === 'true'
  }

  clearUpdateAvailable() {
    localStorage.removeItem(STORAGE_KEYS.UPDATE_AVAILABLE)
  }

  async refreshApp() {
    // Clear update flag and refresh the app
    this.clearUpdateAvailable()
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        // Update the service worker
        try {
          await registration.update()
          // Wait a bit for the update to take effect
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.warn('Service worker update failed:', error)
        }
      }
    }
    
    // Force a page reload to get the latest version
    // Add a small delay to ensure any pending operations complete
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  getUpdateInfo() {
    return {
      currentVersion: this.currentVersion,
      isPWA: this.isPWA,
      lastCheck: new Date(this.getLastUpdateCheck()),
      lastKnownVersion: this.getLastKnownVersion(),
      updateAvailable: this.isUpdateAvailable(),
      dismissed: this.isUpdateDismissed()
    }
  }
}

// Create a singleton instance
export const updateChecker = new UpdateChecker()
