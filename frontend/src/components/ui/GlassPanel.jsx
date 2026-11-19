import React from 'react';

export default function GlassPanel({
  children,
  className = '',
  glow = false,
  interactive = false,
  ...props
}) {
  return (
    <div
      className={`glass-panel rounded-2xl relative transition-all duration-300 ${
        glow ? 'shadow-glow-sm' : ''
      } ${
        interactive ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {/* Corner subtle tech accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-electric/60 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-electric/60 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-electric/60 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-electric/60 rounded-br-lg pointer-events-none" />
      {children}
    </div>
  );
}

