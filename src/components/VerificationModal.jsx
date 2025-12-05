import React from 'react'

const VerificationModal = ({ isOpen, onClose, onConfirm, remainingQuestions }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Step Not Complete</h3>
              <p className="text-sm text-gray-600">Are you sure you want to continue?</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">
              You have <span className="font-semibold text-yellow-600">{remainingQuestions} unanswered question{remainingQuestions !== 1 ? 's' : ''}</span> in this step.
            </p>
            <p className="text-gray-700 mt-2">
              Moving to the next step means you'll lose your current progress and won't be able to return to these questions.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Continue Anyway
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Stay and Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationModal
