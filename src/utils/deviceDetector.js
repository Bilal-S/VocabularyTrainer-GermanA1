// Device and Browser Detection Utility
// Helps provide device-specific installation instructions

export class DeviceDetector {
  constructor() {
    this.deviceInfo = this.detectDevice()
    this.browserInfo = this.detectBrowser()
    this.installCapability = this.assessInstallCapability()
  }

  detectDevice() {
    const userAgent = navigator.userAgent
    const platform = navigator.platform || 'unknown'

    return {
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/.test(userAgent),
      isDesktop: !/Mobile|Android|iPhone|iPad|iPod/.test(userAgent),
      platform: this.getPlatform(platform, userAgent),
      userAgent: userAgent
    }
  }

  detectBrowser() {
    const userAgent = navigator.userAgent
    const vendor = navigator.vendor || ''

    return {
      isChrome: /Chrome/.test(userAgent) && /Google Inc/.test(vendor),
      isFirefox: /Firefox/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isEdge: /Edg/.test(userAgent),
      isSamsung: /SamsungBrowser/.test(userAgent),
      isOpera: /Opera|OPR/.test(userAgent),
      name: this.getBrowserName(userAgent, vendor),
      version: this.getBrowserVersion(userAgent)
    }
  }

  getPlatform(platform, userAgent) {
    if (/iPhone|iPod/.test(userAgent)) return 'iOS (iPhone)'
    if (/iPad/.test(userAgent)) return 'iOS (iPad)'
    if (/Android/.test(userAgent)) return 'Android'
    if (/Win/.test(platform)) return 'Windows'
    if (/Mac/.test(platform)) return 'macOS'
    if (/Linux/.test(platform)) return 'Linux'
    return 'Unknown'
  }

  getBrowserName(userAgent, vendor) {
    if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) return 'Chrome'
    if (/Firefox/.test(userAgent)) return 'Firefox'
    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari'
    if (/Edg/.test(userAgent)) return 'Edge'
    if (/SamsungBrowser/.test(userAgent)) return 'Samsung Browser'
    if (/Opera|OPR/.test(userAgent)) return 'Opera'
    return 'Unknown'
  }

  getBrowserVersion(userAgent) {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edg)\/(\d+\.\d+)/)
    return match ? match[2] : 'Unknown'
  }

  assessInstallCapability() {
    // Check if PWA install is supported
    const hasBeforeInstallPrompt = 'beforeinstallprompt' in window
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = navigator.standalone === true

    return {
      canInstallNatively: hasBeforeInstallPrompt,
      isInstalledAsPWA: isStandalone || isIOSStandalone,
      supportsAddToHomeScreen: this.canAddToHomeScreen(),
      installMethod: this.getRecommendedInstallMethod()
    }
  }

  canAddToHomeScreen() {
    // iOS devices can add to home screen via Safari share menu
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    
    return isIOS && isSafari
  }

  getRecommendedInstallMethod() {
    const { isIOS, isAndroid } = this.deviceInfo
    const { isChrome, isFirefox, isSafari, isEdge } = this.browserInfo

    if (isIOS) {
      return 'ios-safari-share'
    } else if (isAndroid && isChrome) {
      return 'android-chrome-install'
    } else if (isAndroid && isFirefox) {
      return 'android-firefox-add'
    } else if (isChrome || isEdge) {
      return 'desktop-install'
    } else if (isFirefox || isSafari) {
      return 'desktop-bookmark'
    } else {
      return 'general-instructions'
    }
  }

  getInstallInstructions() {
    const method = this.installCapability.installMethod
    
    const instructions = {
      'ios-safari-share': {
        title: 'Install on iPhone/iPad',
        device: 'iOS (iPhone/iPad)',
        browser: 'Safari',
        steps: [
          '1. Open this page in Safari browser',
          '2. Tap the Share button (square with arrow)',
          '3. Scroll down and tap "Add to Home Screen"',
          '4. Tap "Add" to confirm installation'
        ],
        benefits: [
          'Works offline when installed',
          'Faster loading and startup',
          'Native app experience',
          'No browser address bar'
        ],
        icon: '🍎'
      },
      
      'android-chrome-install': {
        title: 'Install on Android',
        device: 'Android',
        browser: 'Chrome',
        steps: [
          '1. Open this page in Chrome',
          '2. Tap the three dots (⋮) menu',
          '3. Tap "Install app" or "Add to Home screen"',
          '4. Follow the on-screen prompts'
        ],
        benefits: [
          'Offline functionality',
          'Quick access from app drawer',
          'Full-screen experience',
          'Automatic updates'
        ],
        icon: '📱'
      },
      
      'android-firefox-add': {
        title: 'Add to Home Screen (Android)',
        device: 'Android',
        browser: 'Firefox',
        steps: [
          '1. Open this page in Firefox',
          '2. Tap the three dots (⋮) menu',
          '3. Tap "Add to Home screen"',
          '4. Enter a name and tap "OK"'
        ],
        benefits: [
          'Home screen shortcut',
          'Quick access to app',
          'Bookmarked for offline use'
        ],
        icon: '📱'
      },
      
      'desktop-install': {
        title: 'Install on Desktop',
        device: 'Desktop',
        browser: this.browserInfo.name,
        steps: [
          '1. Open this page in ' + this.browserInfo.name,
          '2. Look for the install icon (📲) in address bar',
          '3. Click "Install app" when prompted',
          '4. Follow the installation dialog'
        ],
        benefits: [
          'Desktop shortcut',
          'Standalone window',
          'Offline capabilities',
          'Auto-launch capability'
        ],
        icon: '🖥️'
      },
      
      'desktop-bookmark': {
        title: 'Create Desktop Shortcut',
        device: 'Desktop',
        browser: this.browserInfo.name,
        steps: [
          '1. Open this page in ' + this.browserInfo.name,
          '2. Bookmark this page (Ctrl+D or Cmd+D)',
          '3. Open bookmarks menu',
          '4. Drag bookmark to desktop',
          'Alternative: Right-click bookmark → "Create shortcut"'
        ],
        benefits: [
          'Desktop access',
          'Quick launch',
          'Bookmarked for reference'
        ],
        icon: '🔖'
      },
      
      'general-instructions': {
        title: 'Installation Instructions',
        device: this.deviceInfo.platform,
        browser: this.browserInfo.name,
        steps: [
          '1. Check if your browser supports PWA installation',
          '2. Look for an install icon in the address bar',
          '3. If no install icon, bookmark this page',
          '4. Create a desktop shortcut for easy access'
        ],
        benefits: [
          'Quick access to app',
          'Potential offline usage',
          'Better than typing URL manually'
        ],
        icon: '💡'
      }
    }

    return instructions[method] || instructions['general-instructions']
  }

  getDeviceInfo() {
    return {
      ...this.deviceInfo,
      ...this.browserInfo,
      ...this.installCapability,
      installInstructions: this.getInstallInstructions()
    }
  }

  // Static method for quick detection
  static getDeviceInfo() {
    const detector = new DeviceDetector()
    return detector.getDeviceInfo()
  }
}

// Create singleton instance
export const deviceDetector = new DeviceDetector()
