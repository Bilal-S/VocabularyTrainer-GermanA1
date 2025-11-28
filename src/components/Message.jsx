import React from 'react'
import { marked } from 'marked'
import clsx from 'clsx'

const Message = ({ message }) => {
  const renderContent = (content) => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    const htmlContent = marked(content)
    
    return { __html: htmlContent }
  }

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
