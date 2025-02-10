import React from 'react';

export function Contact() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      <div className="bg-gray-700/30 rounded-lg p-6 space-y-6">
        {/* Personal Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-400">Aditya Perswal</h3>
          <p className="text-gray-200">1340 Marble Hill Drive</p>
          <p className="text-gray-200">Lake Zurich, Illinois 60047</p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          {/* Phone */}
          <a 
            href="tel:+18477673725"
            className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-colors group"
          >
            <span className="text-xl">📱</span>
            <span className="group-hover:underline">(847) 767-3725</span>
          </a>

          {/* Email */}
          <a 
            href="mailto:adityaperswal@gmail.com"
            className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-colors group"
          >
            <span className="text-xl">✉️</span>
            <span className="group-hover:underline">adityaperswal@gmail.com</span>
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/aditya-perswal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-colors group"
          >
            <span className="text-xl">💼</span>
            <span className="group-hover:underline">linkedin.com/in/aditya-perswal</span>
          </a>

          {/* GitHub */}
          <a 
            href="https://github.com/aperswal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-colors group"
          >
            <span className="text-xl">🐱</span>
            <span className="group-hover:underline">github.com/aperswal</span>
          </a>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 space-y-3">
          <button 
            onClick={() => navigator.clipboard.writeText('adityaperswal@gmail.com')}
            className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <span>📋</span> Copy Email Address
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText('847-767-3725')}
            className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <span>📋</span> Copy Phone Number
          </button>
        </div>
      </div>
    </div>
  );
} 