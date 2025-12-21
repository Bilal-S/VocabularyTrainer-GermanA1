import React from 'react'
import { getDatabaseStatistics } from '../data/vocabulary/index.js'

const DatabaseInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const stats = getDatabaseStatistics()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            📊 Database Information
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
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
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Vocabulary Items</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.nouns + stats.verbs}
            </p>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.nouns}</p>
              <p className="text-sm text-gray-600">Nouns</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.verbs}</p>
              <p className="text-sm text-gray-600">Verbs</p>
            </div>
          </div>
          
          {/* Examples */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Nominative Case</span>
                <span className="text-lg font-bold text-purple-600">{stats.examples.nominative}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Accusative Case</span>
                <span className="text-lg font-bold text-blue-600">{stats.examples.accusative}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Dative Case</span>
                <span className="text-lg font-bold text-green-600">{stats.examples.dative}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Case Translations</span>
                <span className="text-lg font-bold text-indigo-600">{stats.examples.translations}</span>
              </div>
            </div>
          </div>
          
          {/* Total Examples */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Examples</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.examples.nominative +
               stats.examples.accusative +
               stats.examples.dative +
               stats.examples.translations}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DatabaseInfoModal