'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Terminal } from 'lucide-react';
import { COMMANDS } from '@/constants/commands';
import { RESPONSES } from '@/constants/responses';
import { ASCII_LOGO } from '@/constants/asciiLogo';

export default function EnhancedRetroTerminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOutput([
      ASCII_LOGO,
      `Welcome to Osvaldo's interactive portfolio! Type 'help' for available commands.`,
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    updateSuggestions(e.target.value);
  };

  const updateSuggestions = (value: string) => {
    const matchedCommands = Object.keys(COMMANDS).filter((cmd) =>
      cmd.startsWith(value.toLowerCase())
    );
    setSuggestions(matchedCommands);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();
    let response = `Command not recognized: ${trimmedInput}. Type 'help' for available commands.`;

    if (trimmedInput === 'help') {
      response = Object.entries(COMMANDS)
        .map(([cmd, desc]) => `${cmd}: ${desc}`)
        .join('\n');
    } else if (trimmedInput === 'clear') {
      setOutput([]);
      setInput('');
      return;
    } else if (trimmedInput in RESPONSES) {
      response = RESPONSES[trimmedInput as keyof typeof RESPONSES];
    }

    setOutput((prev) => [...prev, `> ${input}`, response]);
    setHistory((prev) => [input, ...prev.slice(0, 9)]);
    setHistoryIndex(-1);
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        setHistoryIndex((prev) => prev + 1);
        setInput(history[historyIndex + 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        setHistoryIndex((prev) => prev - 1);
        setInput(historyIndex - 1 >= 0 ? history[historyIndex - 1] : '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono text-green-500 flex flex-col overflow-hidden">
      <div className="flex items-center mb-2">
        <Terminal className="mr-2" />
        <h1 className="text-xl">Osvaldo Valentin Portfolio</h1>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto pr-4 mb-4 relative"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
          borderRadius: '20px',
        }}
      >
        <div className="p-4 whitespace-pre-wrap">
          {output.map((line, index) => (
            <div key={index} className="mb-2">
              {line}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center">
          <span className="mr-2">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            autoFocus
            aria-label="Command input"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="text-sm text-green-300 mt-1">
            Suggestions: {suggestions.join(', ')}
          </div>
        )}
      </form>
    </div>
  );
}
