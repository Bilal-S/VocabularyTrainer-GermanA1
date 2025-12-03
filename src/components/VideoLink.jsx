import React from 'react';

const VideoLink = ({ video }) => {
  if (!video) return null;

  return (
    <div className="mt-2">
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex-shrink-0">
          <div className="relative">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10,16.5V7.5L16,12M20,4.4C19.4,4.2 15.7,4 12,4C8.3,4 4.6,4.2 4,4.4C2,5.1 2,8.9 2,12C2,15.1 2,18.9 4,19.6C4.6,19.8 8.3,20 12,20C15.7,20 19.4,19.8 20,19.6C22,18.9 22,15.1 22,12C22,8.9 22,5.1 20,4.4Z" />
            </svg>
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              ▶
            </div>
          </div>
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-sm text-gray-800 truncate">{video.title}</h4>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {video.duration}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {video.views.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-medium">YouTube</span>
        </div>
      </a>
    </div>
  );
};

export default VideoLink;
