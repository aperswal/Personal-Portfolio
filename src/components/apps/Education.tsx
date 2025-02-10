import React from 'react';

export function Education() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Education</h2>
      <div className="bg-gray-700/30 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">University of Illinois Urbana-Champaign</h3>
            <p className="text-blue-400">Bachelor of Science in Computer Engineering</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-400">May 2025</span>
            <p className="text-sm text-gray-400">Champaign, IL</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Academic Performance</h4>
            <p className="text-gray-300">GPA: 3.83 / 4.0</p>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-2">Relevant Coursework</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Data Structures & Algorithms</li>
              <li>Systems Programming</li>
              <li>Cloud Architecture</li>
              <li>AI/ML</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-2">Certifications</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>AWS Cloud Practitioner</li>
              <li>Bloomberg BMC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 