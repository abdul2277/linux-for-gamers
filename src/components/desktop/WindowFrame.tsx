import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useDistro } from '../../context/DistroContext';
import { WindowState } from '../../types/distro';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';

interface WindowFrameProps {
  window: WindowState;
  children: ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, activeWindowId } = useDistro();
  const isFocused = activeWindowId === win.id;

  // Dragging state
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ w: win.width, h: win.height });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Sync external coords
  useEffect(() => {
    setPos({ x: win.x, y: win.y });
  }, [win.x, win.y]);

  // Window drag handlers
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    focusWindow(win.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusWindow(win.id);
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: size.w,
      h: size.h
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !win.isMaximized) {
        const nextX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragStart.x));
        const nextY = Math.max(38, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
        setPos({ x: nextX, y: nextY });
      } else if (isResizing && !win.isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          w: Math.max(480, resizeStart.w + deltaX),
          h: Math.max(320, resizeStart.h + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, win.isMaximized]);

  if (win.isMinimized) {
    return null;
  }

  const containerStyle = win.isMaximized
    ? {
        top: '40px',
        left: '0px',
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex: win.zIndex
      }
    : {
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: `${size.w}px`,
        height: `${size.h}px`,
        zIndex: win.zIndex
      };

  return (
    <div
      ref={windowRef}
      onMouseDown={() => focusWindow(win.id)}
      style={containerStyle}
      className={`fixed flex flex-col bg-slate-950/95 backdrop-blur-2xl rounded-lg border transition-shadow duration-150 overflow-hidden ${
        isFocused 
          ? 'border-slate-700 shadow-2xl shadow-black/80 ring-1 ring-blue-500/20' 
          : 'border-slate-800/80 shadow-lg shadow-black/40 opacity-95'
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`h-9 px-3 flex items-center justify-between select-none cursor-move border-b border-slate-800/80 ${
          isFocused ? 'bg-slate-900/90 text-slate-200' : 'bg-slate-950/80 text-slate-400'
        }`}
      >
        {/* Left: Window title */}
        <div className="flex items-center gap-2 text-xs font-medium tracking-tight">
          <span className="truncate max-w-[320px] font-sans">{win.title}</span>
        </div>

        {/* Right: Window control buttons */}
        <div className="flex items-center gap-1">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-slate-950 relative">
        {children}
      </div>

      {/* Resize handle in bottom-right corner (if not maximized) */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize flex items-end justify-end p-0.5 text-slate-600 hover:text-blue-400"
        >
          <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="2" r="1" />
            <circle cx="2" cy="5" r="1" />
          </svg>
        </div>
      )}
    </div>
  );
};
