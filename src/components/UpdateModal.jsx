import React from 'react'

const UpdateModal = ({ isOpen, onClose, onUpdate, updateInfo }) => {
  if (!isOpen || !updateInfo) return null

  const { currentVersion, latestVersion, shouldUpdate } = updateInfo

  const handleUpdate = () => {
    // Show feedback that update is starting
    onClose()
    // Call the update function directly to trigger the update process
    onUpdate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🔄 Update Check
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {shouldUpdate ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold text-amber-800">Update Available!</p>
                  <p className="text-sm text-amber-700">
                    There is a newer version {latestVersion}. You are on {currentVersion}.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-700 mb-2">Would you like to update?</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Updates include bug fixes and new features</p>
                <p>• You can continue using current version and update later</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🚀 Update Now
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800">You're Up to Date!</p>
                  <p className="text-sm text-green-700">
                    You are already on latest version {currentVersion}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-700">
                Your app is running the most current version available.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
                OK
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateModal
