import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import Message from './Message'

const ChatInterface = ({ messages, onCommand }) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Processing...')
  const [loadingStage, setLoadingStage] = useState('command')
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
    }
  }, [messages, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const command = input.trim()
    setInput('')
    setIsLoading(true)

    // Set context-aware loading messages
    const normalizedCommand = command.toLowerCase()
    if (normalizedCommand.includes('today is a new day')) {
      setLoadingMessage('Starting your daily routine...')
      setLoadingStage('starting-routine')
    } else if (normalizedCommand === 'next step') {
      setLoadingMessage('Skipping to next step...')
      setLoadingStage('next-step')
    } else if (normalizedCommand === 'clear all progress data') {
      setLoadingMessage('Clearing all progress data...')
      setLoadingStage('clearing-data')
    } else {
      setLoadingMessage('Processing your answer...')
      setLoadingStage('processing-answer')
    }

    try {
      await onCommand(command)
    } catch (error) {
      console.error('Error processing command:', error)
      setLoadingMessage('Error occurred')
      setLoadingStage('error')
    } finally {
      setIsLoading(false)
      // Reset loading message after a short delay
      setTimeout(() => {
        setLoadingMessage('Processing...')
        setLoadingStage('command')
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleNextStep = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setLoadingMessage('Skipping to next step...')
    setLoadingStage('next-step')

    try {
      await onCommand('next step')
    } catch (error) {
      console.error('Error processing next step:', error)
      setLoadingMessage('Error occurred')
      setLoadingStage('error')
    } finally {
      setIsLoading(false)
      // Reset loading message after a short delay
      setTimeout(() => {
        setLoadingMessage('Processing...')
        setLoadingStage('command')
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
    'Next Step',
    'clear all progress data'
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
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
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your command or answer... (Ctrl+Enter to send)"
              className="chat-input flex-1 resize-none"
              disabled={isLoading}
              rows={3}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Skip to next step"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
