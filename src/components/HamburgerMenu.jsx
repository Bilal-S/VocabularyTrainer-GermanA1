import React, { useState } from 'react'
import { deviceDetector } from '../utils/deviceDetector'
import { updateChecker } from '../utils/updateChecker'

const HamburgerMenu = ({ onOpenImport, onExport, onReset, onOpenSettings, onInstall, isInstallable, onOpenHelp, onCheckUpdates }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleImport = () => {
    setIsOpen(false)
    onOpenImport()
  }

  const handleExport = () => {
    setIsOpen(false)
    onExport()
  }

  const handleReset = () => {
    setIsOpen(false)
    if (window.confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
      onReset()
    }
  }

  const handleInstall = () => {
    setIsOpen(false)
    onInstall()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleImport}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                📁 Import Progress
              </button>
              <button
                onClick={handleExport}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                💾 Export Progress
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  onOpenHelp()
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ❓ Help
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  onOpenSettings()
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ⚙️ Settings
              </button>
              {updateChecker.isPWA && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onCheckUpdates()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                  title="Check for app updates"
                >
                  🔄 Check for Updates
                </button>
              )}
              {isInstallable && (
                <button
                  onClick={handleInstall}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                  title="Install app as PWA"
                >
                  📲 Install App
                </button>
              )}
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleReset}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default HamburgerMenu
