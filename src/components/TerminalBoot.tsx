import { useState, useEffect, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

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

export default function TerminalBoot({ onBootComplete }: TerminalBootProps) {
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

  // Add a failsafe to ensure boot completion
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isBooted) {
        console.log('TerminalBoot failsafe triggered');
        setIsBooted(true);
        setShowInput(true);
        setMessages(bootSequence.map(msg => msg.text));
      }
    }, 10000); // 10 second failsafe
    
    return () => clearTimeout(timeoutId);
  }, [isBooted]);

  // Main boot sequence effect - simplified to be more reliable
  useEffect(() => {
    try {
      setIsMounted(true);
      let timeout: NodeJS.Timeout | null = null;
      let currentIndex = 0;
      
      const showMessage = () => {
        if (currentIndex < bootSequence.length) {
          const message = bootSequence[currentIndex];
          
          setMessages(prev => [...prev, message.text]);
          currentIndex++;
          
          // Schedule next message
          timeout = setTimeout(showMessage, message.delay);
        } else {
          setShowInput(true);
          timeout = null;
        }
      };
      
      // Start the boot sequence
      timeout = setTimeout(showMessage, 500);
      
      // Cleanup function
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } catch (error) {
      console.error('Error in boot sequence:', error);
      // Fallback to complete state
      setMessages(bootSequence.map(msg => msg.text));
      setShowInput(true);
    }
  }, []);

  // Type out the current message character by character
  useEffect(() => {
    if (!isMounted || !messages[currentTypingIndex]) return;
    console.log('Typing message:', currentTypingIndex, messages[currentTypingIndex]);

    const message = messages[currentTypingIndex];
    if (currentMessageChars.length < message.length) {
      const timeout = setTimeout(() => {
        setCurrentMessageChars(prev => message.slice(0, prev.length + 1));
        setIsTyping(true);
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (currentTypingIndex < messages.length - 1) {
        console.log('Moving to next message');
        const timeout = setTimeout(() => {
          setCurrentTypingIndex(prev => prev + 1);
          setCurrentMessageChars('');
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentMessageChars, currentTypingIndex, messages, isMounted]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = userInput.trim().toLowerCase();
      const newMessages = [...messages, `> ${command}`];
      
      if (command === 'run adi.exe') {
        newMessages.push('Launching interface...');
        setMessages(newMessages);
        setUserInput('');
        setIsBooted(true);
        
        // Wait a moment then complete boot
        setTimeout(() => {
          if (onBootComplete) {
            try {
              onBootComplete();
            } catch (error) {
              console.error('Error calling onBootComplete:', error);
            }
          }
        }, 1000);
      } else if (command === 'help') {
        newMessages.push('Available commands:');
        newMessages.push('- run adi.exe: Launch the portfolio interface');
        newMessages.push('- help: Show this help message');
        newMessages.push('- clear: Clear the terminal');
        setMessages(newMessages);
        setUserInput('');
      } else if (command === 'clear') {
        setMessages([]);
        setUserInput('');
      } else if (command === '') {
        setMessages(newMessages);
        setUserInput('');
      } else {
        newMessages.push(`Command not recognized: ${command}`);
        newMessages.push("Type 'help' for available commands");
        setMessages(newMessages);
        setUserInput('');
      }
      
      // Add command to history
      if (command !== '') {
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setUserInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setUserInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setUserInput('');
      }
    }
  };

  if (!isMounted) {
    console.log('TerminalBoot not yet mounted');
    return (
      <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading terminal...</div>
      </div>
    );
  }

  console.log('Rendering terminal interface, messages:', messages.length);
  return (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen overflow-auto" style={{backgroundColor: 'black', color: 'rgb(34, 197, 94)', fontFamily: 'monospace', padding: '1rem', minHeight: '100vh', overflow: 'auto'}}>
      {messages.map((message, i) => (
        <div key={i} className={cn("mb-1", message.startsWith('>') ? 'text-blue-500' : '')} style={{marginBottom: '0.25rem', color: message.startsWith('>') ? 'rgb(59, 130, 246)' : 'inherit'}}>
          {message}
        </div>
      ))}
      
      {showInput && (
        <div className="flex items-center">
          <span className="mr-2" style={{marginRight: '0.5rem'}}>{'>'}</span>
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-green-500 flex-1"
            style={{backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'rgb(34, 197, 94)', flexGrow: 1}}
            autoFocus
          />
        </div>
      )}
    </div>
  );
} 