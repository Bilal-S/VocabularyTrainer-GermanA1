import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import Message from './Message'
import VerificationModal from './VerificationModal'

const ChatInterface = ({
  messages,
  onCommand,
  isStepComplete,
  getRemainingQuestions,
  currentStep,
  isCompleting,
  speakForStep,
  speechSettings
}) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Processing...')
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when component mounts or when messages change
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      
      // Check if latest message has autoPopulateInput property
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1]
        if (latestMessage.autoPopulateInput && !input) {
          setInput(latestMessage.autoPopulateInput)
        }
      }
    }
  }, [messages, isLoading, input])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      const maxHeight = 120
      inputRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      inputRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isCompleting) return

    const command = input.trim()
    setInput('')
    setIsLoading(true)

    // Set context-aware loading messages
    const normalizedCommand = command.toLowerCase()
    if (normalizedCommand.includes('today is a new day')) {
      setLoadingMessage('Starting your daily routine...')
    } else if (normalizedCommand === 'next step') {
      setLoadingMessage('Skipping to next step...')
    } else if (normalizedCommand === 'clear all progress data') {
      setLoadingMessage('Clearing all progress data...')
    } else {
      setLoadingMessage('Processing your answer...')
    }

    try {
      await onCommand(command)
    } catch (error) {
      console.error('Error processing command:', error)
      setLoadingMessage('Error occurred')
    } finally {
      setIsLoading(false)
      // Reset loading message after a short delay
      setTimeout(() => {
        setLoadingMessage('Processing...')
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleNextStep = async () => {
    if (isLoading || isCompleting) return
    
    // Check if step is complete
    if (isStepComplete && isStepComplete()) {
      // Step is complete, proceed normally
      setIsLoading(true)
      setLoadingMessage('Skipping to next step...')

      try {
        await onCommand('next step')
      } catch (error) {
        console.error('Error processing next step:', error)
        setLoadingMessage('Error occurred')
      } finally {
        setIsLoading(false)
        // Reset loading message after a short delay
        setTimeout(() => {
          setLoadingMessage('Processing...')
          inputRef.current?.focus()
        }, 100)
      }
    } else {
      // Step is not complete, show verification modal
      const remainingQuestions = getRemainingQuestions ? getRemainingQuestions() : 0
      setShowVerificationModal(true)
    }
  }

  const handleVerificationConfirm = async () => {
    setShowVerificationModal(false)
    setIsLoading(true)
    setLoadingMessage('Skipping to next step...')

    try {
      await onCommand('next step')
    } catch (error) {
      console.error('Error processing next step:', error)
      setLoadingMessage('Error occurred')
    } finally {
      setIsLoading(false)
      // Reset loading message after a short delay
      setTimeout(() => {
        setLoadingMessage('Processing...')
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e) => {
    // Only submit on Ctrl+Enter, allow Enter for new lines
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedCommands = [
    'Today is a new day',
    'progress summary',
    'Next Step',
    'clear all progress data'
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentStep={currentStep}
            speakForStep={speakForStep}
            speechSettings={speechSettings}
          />
        ))}
        
        {isLoading && (
          <div className="message-bubble message-system">
            <div className="flex items-center space-x-3">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <span className="text-gray-600 text-sm font-medium">{loadingMessage}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Commands */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-blue-700 font-medium mb-2">Quick commands:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCommands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => setInput(cmd)}
                  className="px-3 py-1 text-xs bg-white border border-blue-200 rounded-full text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end space-x-2">
          <div className="flex-1 flex items-end border border-gray-300 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isCompleting ? "Moving to next step..." : "Type your command or answer... (Ctrl+Enter to send)"}
              className="flex-1 py-3 pl-4 pr-2 resize-none border-none focus:ring-0 outline-none focus:outline-none bg-transparent min-h-[48px] text-sm md:text-base"
              disabled={isLoading || isCompleting}
              rows={1}
              style={{ maxHeight: '120px', overflowY: 'hidden' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isCompleting}
              className={`p-2 mb-1 mr-1 text-blue-500 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0 ${(isLoading || isCompleting) ? 'opacity-100 cursor-wait' : 'disabled:opacity-50 disabled:cursor-not-allowed'}`}
              title="Send answer"
            >
              {isLoading ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isLoading || isCompleting}
            className="btn btn-secondary h-[48px] hidden md:block"
            title="Skip to next step"
          >
            Next
          </button>
        </form>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onConfirm={handleVerificationConfirm}
        remainingQuestions={getRemainingQuestions ? getRemainingQuestions() : 0}
      />
    </div>
  )
}

export default ChatInterface
