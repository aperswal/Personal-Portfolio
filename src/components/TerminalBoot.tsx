import { useState, useEffect, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { withNoSSR } from '@/lib/utils/dynamic';

interface BootMessage {
  text: string;
  delay: number;
}

export interface TerminalBootProps {
  onBootComplete: () => void;
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

// Wrap the component with withNoSSR and properly type it
export const TerminalBoot = withNoSSR(TerminalBootComponent) as React.FC<TerminalBootProps>;

function TerminalBootComponent({ onBootComplete }: TerminalBootProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [currentMessageChars, setCurrentMessageChars] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Type out the current message character by character
  useEffect(() => {
    if (!isMounted || !messages[currentTypingIndex]) return;

    const message = messages[currentTypingIndex];
    if (currentMessageChars.length < message.length) {
      const timeout = setTimeout(() => {
        setCurrentMessageChars(prev => message.slice(0, prev.length + 1));
        setIsTyping(true);
      }, 30); // Adjust typing speed here

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (currentTypingIndex < messages.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentTypingIndex(prev => prev + 1);
          setCurrentMessageChars('');
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentMessageChars, currentTypingIndex, messages, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
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

    timeoutId = setTimeout(showMessage, 1000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMounted]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      const command = userInput.toLowerCase().trim();
      if (command) {
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
        setMessages(prev => [...prev, `> ${userInput}`]);
      }
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
        setCurrentTypingIndex(0);
        setCurrentMessageChars('');
      } else if (command === 'about') {
        setMessages(prev => [...prev,
          '=== ADI System v1.0.0 ===',
          'A personal portfolio interface',
          'Created with Next.js & TypeScript',
          'Type "run adi.exe" to start'
        ]);
      } else if (command) {
        setMessages(prev => [...prev, 
          `Command not recognized: ${command}`, 
          'Type "help" for available commands'
        ]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setUserInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (newIndex >= 0) {
          setUserInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else {
          setUserInput('');
        }
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading terminal...</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen">
      <div className="mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={cn(
              "transition-opacity duration-100",
              index === currentTypingIndex ? "border-r border-green-500" : ""
            )}
          >
            {index < currentTypingIndex ? (
              message.startsWith('>') ? message : <><span className="text-green-300">{'>'}</span> {message}</>
            ) : index === currentTypingIndex ? (
              message.startsWith('>') ? currentMessageChars : <><span className="text-green-300">{'>'}</span> {currentMessageChars}</>
            ) : null}
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
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-green-500 ml-2"
            autoFocus
            disabled={isTyping}
          />
        </div>
      )}
    </div>
  );
} 