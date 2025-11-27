import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import Message from './Message'

const ChatInterface = ({ messages, onCommand }) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

    try {
      await onCommand(command)
    } catch (error) {
      console.error('Error processing command:', error)
    } finally {
      setIsLoading(false)
      // Focus back to input after a short delay to ensure messages are rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
            <div className="flex items-center space-x-2">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
              </div>
              <span className="text-gray-500 text-sm">Processing...</span>
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
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your command or answer..."
              className="chat-input flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
