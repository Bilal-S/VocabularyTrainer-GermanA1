import React, { useRef, useState } from 'react'

const ImportExportModal = ({ isOpen, onClose, onImport, onExport }) => {
  const fileInputRef = useRef(null)
  const [importError, setImportError] = useState('')

  if (!isOpen) return null

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        setImportError('')
        onImport(jsonData)
      } catch (error) {
        setImportError('Invalid JSON file. Please select a valid progress file.')
      }
    }
    reader.onerror = () => {
      setImportError('Failed to read the file. Please try again.')
    }
    reader.readAsText(file)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleExportClick = () => {
    onExport()
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Import/Export Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Import Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                📁 Import Progress
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Load your previous progress from a JSON file.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="btn btn-primary w-full"
              >
                Choose File to Import
              </button>
              {importError && (
                <p className="mt-2 text-sm text-red-600">{importError}</p>
              )}
            </div>

            {/* Export Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                💾 Export Progress
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Download your current progress as a JSON file.
              </p>
              <button
                onClick={handleExportClick}
                className="btn btn-secondary w-full"
              >
                Export Current Progress
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                📖 Instructions
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Export your progress to save it locally</li>
                <li>• Import to continue from where you left off</li>
                <li>• Keep your progress file safe and private</li>
                <li>• You can share progress between devices</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportExportModal
