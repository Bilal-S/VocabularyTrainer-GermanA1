import React, { useState, useEffect } from 'react'
import { useInstallInstructions } from '../hooks/useInstallInstructions'
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
            📲 Install App as PWA
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
          <h1 className="text-xl font-bold text-gray-800">Help: A1 German Coach</h1>
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
        <nav className="px-4 pb-3 flex gap-2 overflow-x-auto">
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
              <p className="mt-1">Need more help? Check the installation guide above or contact support.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default HelpModal
