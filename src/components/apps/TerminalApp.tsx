import React, { useState, useRef, useEffect } from 'react';
import { useDistro } from '../../context/DistroContext';
import { Terminal as TerminalIcon, Play, Trash2, Copy, Check } from 'lucide-react';

export const TerminalApp: React.FC = () => {
  const { terminalHistory, executeTerminalCommand, clearTerminal } = useDistro();
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeTerminalCommand(inputVal);
    setInputVal('');
  };

  const handleQuickCmd = (cmd: string) => {
    executeTerminalCommand(cmd);
    inputRef.current?.focus();
  };

  const handleCopyLogs = () => {
    const text = terminalHistory.map(h => `$ ${h.command}\n${h.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-mono overflow-hidden select-text">
      {/* Quick shortcuts header */}
      <div className="h-9 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-slate-500 font-semibold uppercase mr-1">Quick:</span>
          {['docker ps', 'kubectl get pods', 'devforge build', 'mold --version', 'top', 'uname -a'].map(cmd => (
            <button
              key={cmd}
              onClick={() => handleQuickCmd(cmd)}
              className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopyLogs}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy terminal buffer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-3 overflow-y-auto space-y-3 cursor-text font-mono text-[12px] leading-relaxed"
      >
        <div className="text-slate-500 text-[11px] pb-1">
          DevForge Linux 2026.1 (x86_64) · Linux 6.12.8-devforge-rt · Mold 2.34
          <br />Type 'help' or click quick command buttons above.
        </div>

        {terminalHistory.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400 font-bold">devforge@workstation</span>
              <span className="text-slate-600">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-slate-300">$ {item.command}</span>
            </div>
            {item.output && (
              <pre className="text-slate-300 whitespace-pre-wrap pl-2 border-l border-slate-800 text-[11px] select-text">
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Active Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold">devforge@workstation</span>
          <span className="text-slate-600">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-slate-300">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            autoFocus
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-[12px]"
          />
        </form>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
