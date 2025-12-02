import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'
import HamburgerMenu from './components/HamburgerMenu'
import ImportExportModal from './components/ImportExportModal'
import SettingsModal from './components/SettingsModal'
import HelpModal from './components/HelpModal'
import UpdateModal from './components/UpdateModal'
import { useVocabularyState } from './hooks/useVocabularyState'
import { useDailyRoutine } from './hooks/useDailyRoutine'
import { generateMessageId } from './utils/idGenerator'
import { updateChecker } from './utils/updateChecker'

const SECTIONS = {
  INTRO: { id: 'intro', name: 'Introduction', color: 'section-intro' },
  REVIEW: { id: 'review', name: 'Review Previous Mistakes', color: 'section-review' },
  VOCABULARY: { id: 'vocabulary', name: 'New Vocabulary', color: 'section-vocabulary' },
  PLURAL: { id: 'plural', name: 'Plural Practice', color: 'section-plural' },
  ARTICLES: { id: 'articles', name: 'Articles in Context', color: 'section-articles' },
  TRANSLATIONS: { id: 'translations', name: 'Case Translations', color: 'section-translations' },
  VERBS: { id: 'verbs', name: 'Verb Conjugation', color: 'section-verbs' },
  RECAP: { id: 'recap', name: 'Daily Recap', color: 'section-recap' }
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateInfo, setUpdateInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  
  const {
    state,
    loadState,
    saveState,
    resetState,
    importState,
    exportState,
    updateProgress,
    trackSessionLearning,
    getCurrentSessionStats,
    updateSettings,
    getSettings
  } = useVocabularyState()

  const {
    currentStep,
    sectionProgress,
    processCommand,
    getCurrentSection,
    getSectionProgress
  } = useDailyRoutine(state, setMessages, updateProgress, trackSessionLearning, getCurrentSessionStats)

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }

    // Global functions for update buttons in chat messages
    window.updateApp = async () => {
      await updateChecker.refreshApp()
    }

    window.dismissUpdate = () => {
      updateChecker.dismissUpdate()
      setMessages(prev => [...prev, {
        id: generateMessageId(),
        type: 'system',
        content: '✅ Update dismissed. You will be notified again tomorrow.'
      }])
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      // Clean up global functions
      delete window.updateApp
      delete window.dismissUpdate
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setMessages(prev => [...prev, {
        id: generateMessageId(),
        type: 'system',
        content: '🎉 German Coach has been installed! You can now access it from your home screen.'
      }])
    }
    
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: generateMessageId(),
      type: 'system',
      content: `# Welcome to A1 German Coach! 🇩🇪

This is your personal German vocabulary trainer using only official Goethe-Institut A1 vocabulary.

## Available Commands:
- **"Today is a new day"** (or **"tiand"**) - Start your daily learning routine
- **"Next Step"** - Skip to the next exercise
- **"clear all progress data"** - Reset all your progress

## Features:
- 📚 Structured 7-step daily routine
- 🎯 Progress tracking and mastery system
- 💾 Save/load your progress via JSON
- 📱 Mobile-friendly chat interface
- 📲 Install as PWA for offline access (Menu ☰ → Install)
- 🔄 Check for updates manually (Menu ☰ → Check for Updates)

Type **"Today is a new day"** to begin your German learning journey!`
    }
    
    setMessages([welcomeMessage])
  }, [])

  const handleCommand = async (command) => {
    const userMessage = {
      id: generateMessageId(),
      type: 'user',
      content: command
    }
    
    setMessages(prev => [...prev, userMessage])
    
    await processCommand(command)
  }

  const handleImport = (jsonData) => {
    const success = importState(jsonData)
    if (success) {
      setMessages([{
        id: generateMessageId(),
        type: 'system',
        content: '✅ Progress data imported successfully! You can continue where you left off.'
      }])
    } else {
      setMessages(prev => [...prev, {
        id: generateMessageId(),
        type: 'system',
        content: '❌ Failed to import data. Please check the file format and try again.'
      }])
    }
    setIsModalOpen(false)
  }

  const handleExport = () => {
    exportState()
  }

  const handleReset = () => {
    resetState()
    setMessages([{
      id: generateMessageId(),
      type: 'system',
      content: '✨ All progress data has been cleared. You can start fresh with "Today is a new day"!'
    }])
  }

  const handleSettingsSave = (newSettings) => {
    updateSettings(newSettings)
    setMessages(prev => [...prev, {
      id: generateMessageId(),
      type: 'system',
      content: '✅ Settings updated successfully!'
    }])
  }

  const handleManualUpdateCheck = async () => {
    try {
      const updateResult = await updateChecker.forceCheckForUpdates()
      setUpdateInfo(updateResult)
      setIsUpdateModalOpen(true)
    } catch (error) {
      console.error('Manual update check failed:', error)
      setUpdateInfo({
        shouldUpdate: false,
        reason: 'error',
        error: error.message
      })
      setIsUpdateModalOpen(true)
    }
  }

  const handleUpdateNow = async () => {
    await updateChecker.refreshApp()
  }

  const currentSection = getCurrentSection()
  const sectionInfo = SECTIONS[currentSection] || SECTIONS.INTRO
  const progress = getSectionProgress()

  // Get step config for current section
  const STEP_CONFIG = {
    INTRO: { totalItems: 0 },
    REVIEW: { totalItems: 10 },
    VOCABULARY: { totalItems: 20 },
    PLURAL: { totalItems: 20 },
    ARTICLES: { totalItems: 30 },
    TRANSLATIONS: { totalItems: 30 },
    VERBS: { totalItems: 30 },
    RECAP: { totalItems: 0 }
  }

  const stepNumber = Object.values(STEP_CONFIG).findIndex(config => config.totalItems === progress.total && progress.total > 0) + 1

  return (
    <div className="chat-container">
      <Header 
        section={{...sectionInfo, totalItems: progress.total}}
        progress={progress}
        stepNumber={currentStep > 0 && currentStep < 8 ? currentStep : null}
        isReviewMode={currentStep === 1}
      >
        <button 
          onClick={() => setIsHelpModalOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Help"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <HamburgerMenu 
          onOpenImport={() => setIsModalOpen(true)}
          onExport={handleExport}
          onReset={handleReset}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onInstall={handleInstall}
          isInstallable={isInstallable}
          onCheckUpdates={handleManualUpdateCheck}
        />
      </Header>
      
      <ChatInterface 
        messages={messages}
        onCommand={handleCommand}
      />
      
      <ImportExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={getSettings()}
        onSave={handleSettingsSave}
      />
      
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
      
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateNow}
        updateInfo={updateInfo}
      />
    </div>
  )
}

export default App
