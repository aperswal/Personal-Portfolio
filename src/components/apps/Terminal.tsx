import React, { useState, useRef, useEffect } from 'react';
import { withNoSSR } from '@/lib/utils/dynamic';

const TerminalComponent = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to MyOS Terminal', 'Type "help" for available commands']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const commands: Record<string, string> = {
      help: 'Available commands: help, clear, about, contact',
      about: 'MyOS Terminal - A Unix-like terminal experience',
      contact: 'Email: adityaperswal@gmail.com\nGitHub: github.com/aperswal',
      clear: '',
    };

    if (cmd === 'clear') {
      setOutput([]);
      return;
    }

    const response = commands[cmd.toLowerCase()] || `Command not found: ${cmd}`;
    setOutput(prev => [...prev, `> ${cmd}`, response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-black text-green-500 p-4 font-mono h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span className="mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};

export const Terminal = withNoSSR(TerminalComponent); 