import React from 'react';
import Image from 'next/image';
import { User, Target, Code } from 'lucide-react';

export function About() {
  return (
    <div className="h-full p-8 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-green-400/20">
            <Image
              src="/headshot.jpg"
              alt="Profile Picture"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-lg text-gray-400 italic">
            &ldquo;Dressing is just decoration for food.&rdquo;
          </p>
        </div>

        {/* Introduction Section */}
        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-blue-400">About Me</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            I solve complex problems with simple solutions. I build fast, scalable systems 
            that users actually need. Right now, I'm focused on learning and growing as 
            much as possible.
          </p>
        </div>

        {/* Goals Section */}
        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold text-green-400">My 10-Year Vision</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Code size={16} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-400 mb-2">Better Code</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-green-400 transition-colors">
                  I want to write code that makes the next developer smile. Code that's 
                  powerful yet simple to understand and maintain.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Code size={16} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-400 mb-2">Better Teaching</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-green-400 transition-colors">
                  I want to explain complex tech in simple terms. Help other engineers 
                  understand difficult concepts and grow beyond what I can do.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Code size={16} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-400 mb-2">Better Systems</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-green-400 transition-colors">
                  I want to build systems that are just right - not too complex, not too 
                  simple. Like a good doctor who knows both when to treat and when to wait.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-sm text-gray-500">
              • • •
            </span>
          </div>
        </div>

        {/* Quote Section */}
        <div className="text-center py-8">
          <blockquote className="text-lg italic text-gray-400">
            "Simplicity is the ultimate sophistication."
          </blockquote>
          <cite className="text-sm text-gray-500 mt-2 block">
            - Leonardo da Vinci
          </cite>
        </div>
      </div>
    </div>
  );
} 