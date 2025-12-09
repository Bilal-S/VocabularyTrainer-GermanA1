import React, { useState, useEffect } from 'react'
import { useInstallInstructions } from '../hooks/useInstallInstructions'
import { updateChecker } from '../utils/updateChecker'
import VideoLink from './VideoLink'

const videos = [
  {
    "platform": "Desktop (Windows / Chrome)",
    "title": "Installing a PWA on your desktop or laptop",
    "url": "https://www.youtube.com/watch?v=vaZCRZbV7Ok",
    "duration": "0:30",
    "views": 8945
  },
  {
    "platform": "MacOS (Safari)",
    "title": "How To Download YouTube App On Mac | macOs Sonoma Edition",
    "url": "https://www.youtube.com/watch?v=WMx-33cchL8",
    "duration": "1:13",
    "views": 46736
  },
  {
    "platform": "Android",
    "title": "Installing a PWA on an Android Device",
    "url": "https://www.youtube.com/watch?v=iJteraObjgs",
    "duration": "0:39",
    "views": 28760
  },
  {
    "platform": "iOS (iPhone, iPad)",
    "title": "Installing a PWA on your iPhone",
    "url": "https://www.youtube.com/watch?v=AwfKUpq5seE",
    "duration": "0:52",
    "views": 45380
  }
]

const HelpModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const [version, setVersion] = useState('1.2.5')
  const { 
    deviceInfo, 
    isLoading, 
    shouldShowInstallInstructions,
    getInstallationStatus,
    getStatusMessage,
    getAllDeviceInstructions,
    getPWABenefits,
    getTroubleshootingSteps
  } = useInstallInstructions()

  // Load version from version.json on mount
  useEffect(() => {
    const loadVersion = async () => {
      try {
        const versionData = await updateChecker.getDisplayedVersion()
        setVersion(versionData)
      } catch (error) {
        console.warn('Failed to load version:', error)
        // Fallback to hardcoded version if loading fails
      }
    }
    
    if (isOpen) {
      loadVersion()
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  const InstallationSection = () => {
    if (!shouldShowInstallInstructions() && !isLoading) return null

    return (
      <section id="installation" className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📲 Install App as PWA for Easy Offline Use
            <span className="text-sm font-normal text-gray-500">
              {getStatusMessage()}
            </span>
          </h3>
        </div>

        {!isLoading && deviceInfo?.installInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg text-blue-900 mb-3 flex items-center gap-2">
              {deviceInfo.installInstructions.icon}
              {deviceInfo.installInstructions.title}
            </h4>
            
            <div className="mb-4">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Your device:</strong> {deviceInfo.installInstructions.device} with {deviceInfo.installInstructions.browser}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-blue-800">Installation Steps:</h5>
              {deviceInfo.installInstructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-blue-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PWA Benefits */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Why Install as PWA?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getPWABenefits().map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{benefit.icon}</span>
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">{benefit.title}</h5>
                    <p className="text-xs text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Device Instructions */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Instructions for Other Devices</h4>
          <div className="space-y-2">
            {getAllDeviceInstructions().map((instruction, index) => {
              // Create a mapping function to match device instruction titles to video platforms
              const getVideoForPlatform = (instructionTitle) => {
                const platformMap = {
                  'iPhone/iPad (Safari)': 'iOS (iPhone, iPad)',
                  'Android (Chrome)': 'Android',
                  'Android (Firefox)': 'Android',
                  'Desktop (Chrome/Edge)': 'Desktop (Windows / Chrome)',
                  'Desktop (Firefox/Safari)': 'MacOS (Safari)'
                };
                const mappedPlatform = platformMap[instructionTitle];
                return videos.find(v => v.platform === mappedPlatform);
              };

              const video = getVideoForPlatform(instruction.title);
              return (
                <details key={index} className="bg-gray-50 rounded-lg p-3 cursor-pointer">
                  <summary className="font-medium text-gray-800 text-sm flex items-center gap-2 hover:text-blue-600">
                    <span>{instruction.icon}</span>
                    <span>{instruction.title}</span>
                    <span className="text-gray-500 font-normal">- {instruction.description}</span>
                    {video && (
                      <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        📹 Video Available
                      </span>
                    )}
                  </summary>
                  <div className="mt-3 pl-6">
                    {video ? (
                      <VideoLink video={video} />
                    ) : (
                      <div className="text-xs text-gray-500 italic">
                        No video tutorial available for this platform. Follow the text instructions above.
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Troubleshooting */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Troubleshooting</h4>
          <div className="space-y-2">
            {getTroubleshootingSteps().map((step, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-yellow-800 text-sm">{step.issue}</h5>
                    <p className="text-xs text-yellow-700 mt-1">{step.solution}</p>
                  </div>
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                    {step.browser}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">Help: A1 German Coach</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">v{version}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            aria-label="Close help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 pb-3 flex gap-2 overflow-x-auto justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => scrollToSection('overview')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'overview' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('commands')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'commands' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Commands
            </button>
            <button
              onClick={() => scrollToSection('answering')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'answering' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Answering
            </button>
            <button
              onClick={() => scrollToSection('learning-system')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'learning-system' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Learning System
            </button>
            <button
              onClick={() => scrollToSection('installation')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'installation' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Install App
            </button>
            <button
              onClick={() => scrollToSection('settings')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeSection === 'settings' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Settings
            </button>
          </div>
          <div className="ml-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">v{version}</span>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="overflow-y-auto h-[calc(100vh-120px)]">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Overview Section */}
          <section id="overview" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to A1 German Coach!</h2>
            <p className="text-gray-600">
              This app helps you practice German A1 vocabulary through a daily structured routine using only official Goethe-Institut vocabulary.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">🎯 Your Learning Journey</h3>
              <p className="text-sm text-green-700">
                Each day, you'll progress through 7 structured steps designed to build comprehensive German vocabulary skills:
                review, new words, plurals, articles, translations, verbs, and daily recap.
              </p>
            </div>
          </section>

          {/* Commands Section */}
          <section id="commands" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Key Commands</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <h3 className="font-semibold text-blue-800">"Today is a new day" (or "tiand")</h3>
                    <p className="text-sm text-blue-700">Starts your fresh daily practice session with 7 structured learning steps.</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800">"Next Step"</h3>
                    <p className="text-sm text-yellow-700">Skips the current exercise if you get stuck. Use sparingly to maximize learning!</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <h3 className="font-semibold text-orange-800">"progress summary"</h3>
                    <p className="text-sm text-orange-700">Displays your current learning progress and statistics, similar to the daily recap in Step 7.</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">!</span>
                  <div>
                    <h3 className="font-semibold text-red-800">"clear all progress data"</h3>
                    <p className="text-sm text-red-700">⚠️ COMPLETELY resets all your progress. Use with extreme caution - this cannot be undone!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Answering Section */}
          <section id="answering" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">How to Answer Questions</h2>
            <p className="text-gray-600">For lists of questions, you can provide answers in two formats:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Numbered Format (Recommended)
                </h3>
                <pre className="bg-white p-3 rounded text-xs font-mono text-gray-600 border">
1. der Tisch <br></br>
7-das Buch <br></br>
12 die Frau</pre>
                <p className="text-xs text-green-700 mt-2">Benefits: Clear, error-resistant, allows partial out of order answers. Flexible number entry.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">⚡</span> Sequential Format
                </h3>
                <pre className="bg-white p-3 rounded text-xs font-mono text-gray-600 border">
der Tisch <br></br>
das Buch <br></br>
die Frau <br></br>
</pre>
                <p className="text-xs text-blue-700 mt-2">Quick but answers must be in exact order and one per line</p>
              </div>
            </div>
          </section>

          {/* The Learning System Section */}
          <section id="learning-system" className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-2xl font-bold text-gray-800">The Learning System</h2>
              <p className="text-gray-600 mt-2">
                Our 7-step daily routine is designed to build comprehensive German vocabulary skills through structured, progressive learning. Defaults question counts for each of the Steps can be changed in Settings.
              </p>
            </div>

            {/* Step 1 */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-indigo-800">Step 1: Introduction</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-indigo-700">Purpose:</h4>
                  <p className="text-sm text-indigo-600">Overview of today's learning session and welcome message</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-700">What Happens:</h4>
                  <p className="text-sm text-indigo-600">Displays instructions for the daily routine and available commands</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-700">Content:</h4>
                  <ul className="text-sm text-indigo-600 list-disc list-inside space-y-1">
                    <li>Welcome message with app overview</li>
                    <li>List of available commands ("Today is a new day", "Next Step", "clear all progress data")</li>
                    <li>Brief explanation of the 7-step learning process</li>
                  </ul>
                </div>
                <div className="bg-indigo-100 rounded p-3">
                  <p className="text-xs text-indigo-700">
                    <strong>Progress:</strong> No exercises, just informational setup for the day
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔄</span>
                <h3 className="text-xl font-bold text-orange-800">Step 2: Review Previous Mistakes</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-orange-700">Purpose:</h4>
                  <p className="text-sm text-orange-600">Targeted practice on previously missed vocabulary items</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700">What Happens:</h4>
                  <p className="text-sm text-orange-600">Pulls words randomly from review queue for reinforcement</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700">Process:</h4>
                  <ul className="text-sm text-orange-600 list-disc list-inside space-y-1">
                    <li>Presents up to your selected maximum review batch size items (default: 50, configurable 10-99)</li>
                    <li>Shows one item at a time with English→German translation prompts</li>
                    <li>During review items must be answered correctly a certain number of times. This is based on your max review count setting (default: 3) to be considered mastered</li>
                    <li>Once you have mastered an item it moves mastered from review queue to mastered pool</li>
                  </ul>
                </div>
                <div className="bg-orange-100 rounded p-3">
                  <p className="text-xs text-orange-700">
                    <strong>Smart Features:</strong> If no items in review queue, automatically advances to Step 3. 
                    Tracks both singular and plural forms separately for nouns.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📖</span>
                <h3 className="text-xl font-bold text-green-800">Step 3: New Vocabulary (default 20 Nouns)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-700">Purpose:</h4>
                  <p className="text-sm text-green-600">Learn 20 new A1 level nouns from official Goethe-Institut vocabulary</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">Process:</h4>
                  <ul className="text-sm text-green-600 list-disc list-inside space-y-1">
                    <li>Randomly selects 20 nouns (default) from unselected pool (alphabetical order avoided)</li>
                    <li>Displays all 20 English nouns at once for efficient learning</li>
                    <li>User provides German translations (article + noun) for each</li>
                    <li>Supports partial responses - user can answer some items, resubmit others</li>
                    <li>Moves to next step only when all 20 items are answered</li>
                  </ul>
                </div>
                <div className="bg-green-100 rounded p-3">
                  <p className="text-xs text-green-700">
                    <strong>Mastery Rules:</strong> A setting determines how many times each noun needs be correctly answered (default: 1) to move to mastered pool. You have to master the singular and the plural of the noun the set number of times.
                    Wrong answers are added to reviewQueue for future practice.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔢</span>
                <h3 className="text-xl font-bold text-blue-800">Step 4: Plural Practice (default 20 Nouns)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-700">Purpose:</h4>
                  <p className="text-sm text-blue-600">Master German noun pluralization rules and patterns</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700">Process:</h4>
                  <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                    <li>Randomly selects 20 (default) different nouns from unselected pool (different from Step 3)</li>
                    <li>Displays German singular noun, user provides correct plural form</li>
                    <li>Handles irregular plurals and exceptions from A1 vocabulary</li>
                    <li>Supports batch responses with numbered or sequential format</li>
                  </ul>
                </div>
                <div className="bg-blue-100 rounded p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Learning Focus:</strong> Recognizes pluralization patterns (-e, -er, -en endings), 
                    covers irregular plurals (die Mutter → die Mütter), practices with and without article variations.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-bold text-purple-800">Step 5: Articles in Context (default 30 Sentences)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-purple-700">Purpose:</h4>
                  <p className="text-sm text-purple-600">Practice correct article usage (der/die/das) in realistic contexts</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700">Process:</h4>
                  <ul className="text-sm text-purple-600 list-disc list-inside space-y-1">
                    <li>30 sentences total: 10 nominative, 10 accusative, 10 dative cases</li>
                    <li>Presented in batches of 10 sentences at a time</li>
                    <li>Each sentence has a blank where user must choose correct article</li>
                    <li>Uses only A1 vocabulary in natural, contextual examples</li>
                  </ul>
                </div>
                <div className="bg-purple-100 rounded p-3">
                  <p className="text-xs text-purple-700">
                    <strong>Case Focus:</strong> Nominative (subject), Accusative (direct objects), Dative (indirect objects).
                    Smart feedback explains why specific article is correct in that context.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔄</span>
                <h3 className="text-xl font-bold text-red-800">Step 6: Case Translations (default 10 Sentences)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-red-700">Purpose:</h4>
                  <p className="text-sm text-red-600">Apply German grammar rules through English→German translation</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700">Process:</h4>
                  <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                    <li>10 sentences mix of (nominative, accusative, dative)</li>
                    <li>English sentence provided, user translates to German</li>
                    <li>Tests complete sentence construction, not just individual words</li>
                    <li>Available in full batch (30) or partial (10 at a time)</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded p-3">
                  <p className="text-xs text-red-700">
                    <strong>Skills Tested:</strong> Word order, case system application, preposition usage with correct cases,
                    integration of vocabulary with grammar rules. Mistakes added to review queue.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <h3 className="text-xl font-bold text-yellow-800">Step 7: Daily Recap</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-yellow-700">Purpose:</h4>
                  <p className="text-sm text-yellow-600">Consolidate learning and track daily progress</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-700">Content Displayed:</h4>
                  <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1">
                    <li><strong>Nouns introduced:</strong> Count and specific words introduced in Steps 3-4</li>
                    <li><strong>Verbs Introduced:</strong> New verbs practiced during the session</li>
                    <li><strong>Review Progress:</strong> Items moved from review queue to mastered</li>
                    <li><strong>Remaining Work:</strong> Items still in review queue for future sessions</li>
                    <li><strong>Session Statistics:</strong> Total questions answered, accuracy rates, time spent</li>
                  </ul>
                </div>
                <div className="bg-yellow-100 rounded p-3">
                  <p className="text-xs text-yellow-700">
                    <strong>Progress Visualization:</strong> Clear display of learning milestones achieved.
                    Forward planning shows what next session will focus on.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Algorithm Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🧠 Learning Algorithm Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Mastery System</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>Mastering Count:</strong> Configurable (1-9), default = 1</li>
                    <li><strong>Tracking:</strong> Each vocabulary item tracks correctCount and incorrectCount</li>
                    <li><strong>Pool Management:</strong> unselected (never-seen), reviewQueue (incorrect), mastered (correct ≥ masteringCount)</li>
                    <li><strong>Smart Exclusion:</strong> Mastered items never appear in new exercises</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Batch Response Handling</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>Flexible Submission:</strong> Accepts numbered or sequential answer formats</li>
                    <li><strong>Partial Progress:</strong> Can answer some items, continue later with remaining</li>
                    <li><strong>Running Summary:</strong> Shows cumulative progress through current batch</li>
                    <li><strong>Auto-advancement:</strong> Moves to next step when batch is complete</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Error Recovery</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>Immediate Feedback:</strong> Correct answers shown with explanations</li>
                    <li><strong>Review Queue:</strong> Wrong answers automatically added for tomorrow</li>
                    <li><strong>External Help:</strong> Links to ChatGPT for detailed grammar explanations</li>
                    <li><strong>Progress Preservation:</strong> All learning progress saved to locally. No backend needed.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Installation Section */}
          <InstallationSection />

          {/* Settings Section */}
          <section id="settings" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Settings & Features</h2>
            <p className="text-gray-600">Tap the menu icon (☰) in the top-right to access:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">⚙️ Learning Settings</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Mastery threshold (correct answers needed)</li>
                  <li>• Review batch sizes</li>
                  <li>• Progress tracking options</li>
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-800 mb-2">💾 Data Management</h3>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Export progress to JSON</li>
                  <li>• Import saved progress</li>
                  <li>• Reset all data (with confirmation)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center text-sm text-gray-500">
              <p>A1 German Coach - Learn German with official Goethe-Institut vocabulary</p>
              <p>(c) 2026 - Bilal Soylu</p>
              <p className="mt-1">More? This is published as open source and you can <a href="https://github.com/Bilal-S/VocabularyTrainer-GermanA1">use the code for your own project.</a></p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default HelpModal
