import React from 'react'
import clsx from 'clsx'

const Header = ({ section, progress, stepNumber, isReviewMode, children }) => {
  const progressPercentage = progress ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <div className={clsx('section-banner text-left', section.color)}>
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Top Row: Title and Actions */}
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold leading-tight">
            A1 German Coach - {section.name}
          </h1>
          <div className="flex items-center gap-1 pl-4 shrink-0">
            {children}
          </div>
        </div>
        
        {/* Bottom Row: Step Info & Progress */}
        {(progress && progress.total > 0) && (
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="whitespace-nowrap opacity-90">
              {isReviewMode ? 'Review' : (stepNumber ? `Step ${stepNumber}` : '')}
            </div>
            
            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="whitespace-nowrap opacity-90 min-w-[3rem] text-right">
              {progress.completed}/{progress.total}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
