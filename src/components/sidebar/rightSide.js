import React from 'react';

export default function RightSidebar() {
  return (
    <div className="w-16 h-full flex flex-col justify-center items-center">
      <div className="space-y-6">
        {/* Nút điều hướng lên */}
        <button className="w-10 h-10 rounded-full bg-gray-800 hover-orange-bg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Nút điều hướng xuống */}
        <button className="w-10 h-10 rounded-full bg-gray-800 hover-orange-bg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}