import { useState, useEffect } from 'react'
import { deviceDetector } from '../utils/deviceDetector'

export const useInstallInstructions = () => {
  const [deviceInfo, setDeviceInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get device info on mount
    const getDeviceInfo = () => {
      try {
        const info = deviceDetector.getDeviceInfo()
        setDeviceInfo(info)
      } catch (error) {
        console.error('Failed to detect device:', error)
        // Fallback to basic info
        setDeviceInfo({
          isInstalledAsPWA: false,
          canInstallNatively: false,
          installInstructions: deviceDetector.getInstallInstructions()
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure all navigator APIs are available
    const timer = setTimeout(getDeviceInfo, 100)
    return () => clearTimeout(timer)
  }, [])

  const shouldShowInstallInstructions = () => {
    if (!deviceInfo || isLoading) return false
    
    // Show if not installed as PWA
    return !deviceInfo.isInstalledAsPWA
  }

  const getInstallationStatus = () => {
    if (!deviceInfo || isLoading) return 'loading'
    
    if (deviceInfo.isInstalledAsPWA) return 'installed'
    if (deviceInfo.canInstallNatively) return 'can-install'
    return 'bookmark-only'
  }

  const getStatusMessage = () => {
    const status = getInstallationStatus()
    
    switch (status) {
      case 'installed':
        return '✅ App is installed as PWA'
      case 'can-install':
        return '📲 Ready to install as PWA'
      case 'bookmark-only':
        return '🔖 Create bookmark for easy access'
      default:
        return '⏳ Detecting installation options...'
    }
  }

  const getAllDeviceInstructions = () => {
    // Return instructions for all device types for reference
    return [
      {
        method: 'ios-safari-share',
        title: 'iPhone/iPad (Safari)',
        description: 'Add to Home Screen via Share menu',
        icon: '🍎'
      },
      {
        method: 'android-chrome-install',
        title: 'Android (Chrome)',
        description: 'Install app directly from browser',
        icon: '📱'
      },
      {
        method: 'android-firefox-add',
        title: 'Android (Firefox)',
        description: 'Add to Home screen',
        icon: '🦊'
      },
      {
        method: 'desktop-install',
        title: 'Desktop (Chrome/Edge)',
        description: 'Install app for desktop use',
        icon: '🖥️'
      },
      {
        method: 'desktop-bookmark',
        title: 'Desktop (Firefox/Safari)',
        description: 'Create desktop shortcut',
        icon: '🔖'
      }
    ]
  }

  const getPWABenefits = () => [
    {
      icon: '📴',
      title: 'Offline Access',
      description: 'Use the app without internet connection'
    },
    {
      icon: '⚡',
      title: 'Faster Loading',
      description: 'Instant startup and smooth performance'
    },
    {
      icon: '🎯',
      title: 'Focused Interface',
      description: 'No browser address bar or tabs'
    },
    {
      icon: '🔄',
      title: 'Auto Updates',
      description: 'Always get the latest features'
    },
    {
      icon: '📱',
      title: 'App Store Feel',
      description: 'Native app experience'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Receive updates and reminders'
    }
  ]

  const getTroubleshootingSteps = () => [
    {
      issue: 'Install button not showing',
      solution: 'Try refreshing the page or using a different browser',
      browser: 'Chrome, Edge'
    },
    {
      issue: '"Add to Home Screen" missing on iOS',
      solution: 'Make sure you\'re using Safari, not Chrome or other browsers',
      browser: 'iOS Safari'
    },
    {
      issue: 'App won\'t work offline',
      solution: 'Try reinstalling or clearing browser cache',
      browser: 'All'
    },
    {
      issue: 'Desktop shortcut not working',
      solution: 'Create a bookmark first, then drag to desktop',
      browser: 'Firefox, Safari'
    }
  ]

  return {
    deviceInfo,
    isLoading,
    shouldShowInstallInstructions,
    getInstallationStatus,
    getStatusMessage,
    getAllDeviceInstructions,
    getPWABenefits,
    getTroubleshootingSteps
  }
}
