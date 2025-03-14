'use client';

import { useState, useEffect, KeyboardEvent } from 'react';

interface BootMessage {
  text: string;
  delay: number;
}

export interface TerminalBootProps {
  onBootComplete: () => void;
}

// Simplified boot sequence with fewer messages for reliability
const bootSequence: BootMessage[] = [
  { text: "System initialization started...", delay: 300 },
  { text: "Loading BIOS...", delay: 300 },
  { text: "Checking hardware components...", delay: 300 },
  { text: "CPU: Notion Powered Brain Processor", delay: 300 },
  { text: "Memory: Loading Anki's Creative RAM", delay: 300 },
  { text: "Boot sequence complete.", delay: 300 },
  { text: "Type 'run adi.exe' to launch interface...", delay: 300 },
];

export default function TerminalBoot({ onBootComplete }: TerminalBootProps) {
  // State
  const [messages, setMessages] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Force completion after 15 seconds in case of any issues
  useEffect(() => {
    const forceCompleteTimer = setTimeout(() => {
      console.log('Force completing boot sequence due to timeout');
      onBootComplete();
    }, 15000);
    
    return () => clearTimeout(forceCompleteTimer);
  }, [onBootComplete]);

  // Display boot messages
  useEffect(() => {
    // Skip the boot animation if we're in a production environment
    if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
      console.log('Production environment detected, skipping boot animation');
      // Show all messages at once
      setMessages(bootSequence.map(msg => msg.text));
      
      // Show input after a short delay
      setTimeout(() => {
        setShowInput(true);
      }, 1000);
      
      return;
    }
    
    // Display messages sequentially
    if (currentIndex < bootSequence.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, bootSequence[currentIndex].text]);
        setCurrentIndex(prev => prev + 1);
      }, bootSequence[currentIndex].delay);
      
      return () => clearTimeout(timer);
    } else if (currentIndex === bootSequence.length && !showInput) {
      // Show input after all messages are displayed
      setTimeout(() => {
        setShowInput(true);
      }, 500);
    }
  }, [currentIndex, showInput]);
  
  // Handle user input
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = userInput.trim().toLowerCase();
      
      if (command === 'run adi.exe' || command === 'run adi' || command === 'adi.exe' || command === 'adi') {
        setIsBooted(true);
        // Small delay before completing
        setTimeout(() => {
          onBootComplete();
        }, 500);
      } else {
        // Add command to messages
        setMessages(prev => [...prev, `$ ${userInput}`, 'Command not recognized. Try "run adi.exe"']);
        setUserInput('');
      }
    }
  };
  
  // Render terminal
  return (
    <div 
      style={{
        backgroundColor: 'black',
        color: 'rgb(34, 197, 94)',
        fontFamily: 'monospace',
        padding: '20px',
        minHeight: '100vh',
        width: '100%',
        overflow: 'auto'
      }}
    >
      {messages.map((message, i) => (
        <div key={i} style={{ margin: '4px 0' }}>
          {message}
        </div>
      ))}
      
      {showInput && !isBooted && (
        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
          <span style={{ marginRight: '8px' }}>$</span>
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyDown={handleKeyPress}
            autoFocus
            style={{
              backgroundColor: 'transparent',
              color: 'rgb(34, 197, 94)',
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              width: '100%'
            }}
          />
        </div>
      )}
      
      {isBooted && (
        <div style={{ margin: '8px 0' }}>
          Loading interface...
        </div>
      )}
    </div>
  );
} 