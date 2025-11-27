import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import SectionBanner from './components/SectionBanner'
import HamburgerMenu from './components/HamburgerMenu'
import ImportExportModal from './components/ImportExportModal'
import { useVocabularyState } from './hooks/useVocabularyState'
import { useDailyRoutine } from './hooks/useDailyRoutine'

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
  const [messages, setMessages] = useState([])
  
  const {
    state,
    loadState,
    saveState,
    resetState,
    importState,
    exportState,
    updateProgress
  } = useVocabularyState()

  const {
    currentStep,
    sectionProgress,
    processCommand,
    getCurrentSection,
    getSectionProgress
  } = useDailyRoutine(state, setMessages, updateProgress)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'system',
      content: `# Welcome to A1 German Coach! 🇩🇪

This is your personal German vocabulary trainer using only official Goethe-Institut A1 vocabulary.

## Available Commands:
- **"Today is a new day"** - Start your daily learning routine
- **"Next Step"** - Skip to the next exercise
- **"clear all progress data"** - Reset all your progress

## Features:
- 📚 Structured 7-step daily routine
- 🎯 Progress tracking and mastery system
- 💾 Save/load your progress via JSON
- 📱 Mobile-friendly chat interface

Type **"Today is a new day"** to begin your German learning journey!`
    }
    
    setMessages([welcomeMessage])
  }, [])

  const handleCommand = async (command) => {
    const userMessage = {
      id: Date.now(),
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
        id: Date.now(),
        type: 'system',
        content: '✅ Progress data imported successfully! You can continue where you left off.'
      }])
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
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
      id: Date.now(),
      type: 'system',
      content: '✨ All progress data has been cleared. You can start fresh with "Today is a new day"!'
    }])
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
      <HamburgerMenu 
        onOpenImport={() => setIsModalOpen(true)}
        onExport={handleExport}
        onReset={handleReset}
      />
      
      <SectionBanner 
        section={{...sectionInfo, totalItems: progress.total}}
        progress={progress}
        stepNumber={currentStep > 0 && currentStep < 8 ? currentStep : null}
        isReviewMode={currentStep === 1}
      />
      
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
    </div>
  )
}

export default App
