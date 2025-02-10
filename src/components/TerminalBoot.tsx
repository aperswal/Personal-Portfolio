import { useState, useEffect, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface BootMessage {
  text: string;
  delay: number;
}

const bootSequence: BootMessage[] = [
  { text: "System initialization started...", delay: 500 },
  { text: "Loading BIOS...", delay: 600 },
  { text: "Checking hardware components...", delay: 700 },
  { text: "CPU: Notion Powered Brain Processor", delay: 400 },
  { text: "Memory: Loading Anki's Creative RAM", delay: 400 },
  { text: "Loading personality modules... HIMYM jokes... Shark Tank memes... caffeine addiciton...", delay: 800 },
  { text: "Installing startup.dll...", delay: 600 },
  { text: "Importing development_skills.exe...", delay: 700 },
  { text: "Failed import of development_skills.exe...", delay: 300 },
  { text: "Importing backup ChatGPT.exe and Stackoverflow.exe...", delay: 300 },
  { text: "Mounting portfolio drive...", delay: 500 },
  { text: "Boot sequence complete.", delay: 1000 },
  { text: "Type 'run adi.exe' to launch interface...", delay: 500 },
];

export function TerminalBoot({ onBootComplete }: { onBootComplete: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const showMessage = () => {
      if (currentIndex < bootSequence.length) {
        const message = bootSequence[currentIndex];
        setMessages(prev => [...prev, message.text]);
        currentIndex++;
        
        timeoutId = setTimeout(showMessage, message.delay);
      } else {
        setIsBooted(true);
        setShowInput(true);
      }
    };

    // Start the boot sequence
    timeoutId = setTimeout(showMessage, 1000); // Initial delay

    // Cleanup timeouts on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = userInput.toLowerCase().trim();
      setMessages(prev => [...prev, `> ${userInput}`]);
      setUserInput('');

      if (command === 'run adi.exe') {
        setMessages(prev => [...prev, 'Launching ADI interface...']);
        setTimeout(onBootComplete, 1000);
      } else if (command === 'help') {
        setMessages(prev => [...prev, 
          'Available commands:', 
          '  - run adi.exe: Launch the ADI interface', 
          '  - help: Show this help message',
          '  - clear: Clear the terminal',
          '  - about: Show system information'
        ]);
      } else if (command === 'clear') {
        setMessages([]);
      } else if (command === 'about') {
        setMessages(prev => [...prev,
          '=== ADI System v1.0.0 ===',
          'A personal portfolio interface',
          'Created with Next.js & TypeScript',
          'Type "run adi.exe" to start'
        ]);
      } else {
        setMessages(prev => [...prev, 
          `Command not recognized: ${command}`, 
          'Type "help" for available commands'
        ]);
      }
    }
  };

  return (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen">
      <div className="mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="typing-animation"
            style={{ 
              animationDelay: `${index * 50}ms`,
              opacity: 0
            }}
          >
            {message.startsWith('>') ? message : <><span className="text-green-300">{'>'}</span> {message}</>}
          </div>
        ))}
      </div>
      {showInput && (
        <div className="flex items-center">
          <span className="text-green-300">{'>'}</span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-green-500 ml-2"
            autoFocus
          />
        </div>
      )}
    </div>
  );
} 