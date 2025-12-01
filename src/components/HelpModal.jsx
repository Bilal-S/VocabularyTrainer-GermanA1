import React from 'react'

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Guide: A1 German Coach</h2>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          <section>
            <p className="text-gray-600">
              Welcome! This app helps you practice German A1 vocabulary through a daily structured routine.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Key Commands</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium text-blue-600">"Today is a new day"</span>
                <br />Starts a fresh daily practice session.
              </li>
              <li>
                <span className="font-medium text-blue-600">"Next Step"</span>
                <br />Skips the current exercise if you get stuck.
              </li>
              <li>
                <span className="font-medium text-red-600">"clear all progress data"</span>
                <br />COMPLETELY resets your progress. Use with caution.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Answering Questions</h3>
            <p className="text-sm text-gray-600 mb-2">For lists of questions, you can provide answers in two ways:</p>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-gray-700 mb-1">#1 Numbered (Recommended)</p>
              <pre className="text-xs text-gray-500 font-mono mb-3">
1. der Tisch
3. das Buch</pre>
              
              <p className="font-medium text-gray-700 mb-1">#2 Sequential</p>
              <pre className="text-xs text-gray-500 font-mono">
der Tisch
das Buch</pre>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Settings</h3>
            <p className="text-sm text-gray-600">
              Tap the menu icon (top-right) to:
            </p>
            <ul className="list-disc list-inside mt-1 text-sm text-gray-600 ml-1">
              <li>Adjust how many times you must answer correctly to master a word.</li>
              <li>Change review batch sizes.</li>
              <li>Import/Export your progress to save it.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HelpModal
