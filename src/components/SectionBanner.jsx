import React from 'react'
import clsx from 'clsx'

const SectionBanner = ({ section, progress }) => {
  const progressPercentage = progress ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <div className={clsx('section-banner', section.color)}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">{section.name}</h1>
          {progress && (
            <span className="text-sm opacity-90">
              {progress.completed}/{progress.total}
            </span>
          )}
        </div>
        
        {progress && progress.total > 0 && (
          <div className="progress-bar bg-white bg-opacity-30">
            <div
              className="progress-fill bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionBanner
