import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import clsx from 'clsx'
import SpeechIcon from './SpeechIcon'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

const Message = ({ message, currentStep, speakForStep, speechSettings = {} }) => {
  const [playingId, setPlayingId] = useState(null)
  const contentRef = useRef(null)
  const { speak, isSpeaking } = useSpeechSynthesis(speechSettings)
  const handleSpeak = async (text, id) => {
    if (isSpeaking && playingId === id) {
      // Already playing this text, don't restart
      return
    }

    setPlayingId(id)
    try {
      await speak(text)
    } catch (error) {
      console.error('Speech synthesis error:', error)
    } finally {
      setPlayingId(null)
    }
  }

  const renderContent = (content) => {
    // Step 1: Parse {{speak:text}} markers BEFORE markdown rendering
    const speechMarkerRegex = /\{\{speak:([^}]+)\}\}/g
    const speechData = []
    let processedContent = content
    
    // Find all speech markers and replace with placeholders
    let match
    let index = 0
    while ((match = speechMarkerRegex.exec(content)) !== null) {
      const germanText = match[1]
      const id = `speech-${index}`
      const placeholder = `<span class="speech-placeholder" data-speech-index="${index}">${germanText}</span>`
      
      speechData.push({
        index,
        text: germanText,
        id: `speech-${Math.random().toString(36).substr(2, 9)}`
      })
      
      processedContent = processedContent.replace(match[0], placeholder)
      index++
    }
    
    // Store speech data for use in useEffect
    if (speechData.length > 0) {
      contentRef.current = contentRef.current || {}
      contentRef.current.speechData = speechData
    }
    
    // Step 2: Configure and render markdown
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    const htmlContent = marked(processedContent)
    
    return { __html: htmlContent }
  }

  useEffect(() => {
    if (!contentRef.current || !contentRef.current.speechData) return

    const contentElement = contentRef.current
    const speechData = contentElement.speechData
    
    if (!speechData || speechData.length === 0) return
    
    // Find all speech placeholders and add icons
    const placeholders = contentElement.querySelectorAll('.speech-placeholder')
    
    placeholders.forEach(placeholder => {
      const index = parseInt(placeholder.getAttribute('data-speech-index'))
      const data = speechData[index]
      
      if (!data) return
      
      // Check if icon already added
      if (placeholder.querySelector('.inline-speech-icon')) return
      
      // Create and insert icon after text
      const iconSpan = document.createElement('span')
      iconSpan.className = 'inline-speech-icon ml-1'
      iconSpan.setAttribute('data-speech-id', data.id)
      iconSpan.innerHTML = `
        <button
          type="button"
          class="inline-flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 w-4 h-4"
          title="Hear pronunciation"
          aria-label="Hear pronunciation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="${playingId === data.id ? '#EF4444' : '#3B82F6'}" stroke-width="2" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      `
      
      // Add click handler
      const button = iconSpan.querySelector('button')
      button.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        handleSpeak(data.text, data.id)
      })
      
      placeholder.appendChild(iconSpan)
    })
  }, [message.content, playingId, handleSpeak])

  const isSystemMessage = message.type === 'system'
  const isUserMessage = message.type === 'user'

  return (
    <div
      className={clsx(
        'flex',
        isUserMessage ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'message-bubble max-w-2xl',
          {
            'message-user': isUserMessage,
            'message-system': isSystemMessage,
          }
        )}
      >
        {isSystemMessage ? (
          <div
            ref={contentRef}
            className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-800 prose-code:text-blue-600 prose-pre:bg-gray-800 prose-pre:text-gray-100 [&_ol]:text-gray-800 [&_ol_li::marker]:text-gray-800 [&_ul]:text-gray-800 [&_ul_li::marker]:text-gray-800"
            dangerouslySetInnerHTML={renderContent(message.content)}
          />
        ) : (
          <div className="text-white whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        
        {message.timestamp && (
          <div className={clsx(
            'text-xs mt-1 opacity-70',
            isUserMessage ? 'text-blue-100' : 'text-gray-500'
          )}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
