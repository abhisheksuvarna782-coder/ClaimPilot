import React from 'react';

export default function Panel({
  children,
  className = '',
  interactive = false,
  highlight = false,
  ...props
}) {
  return (
    <div
      className={`bg-deepblack border transition-all duration-200 ease-studio rounded-sm ${
        highlight 
          ? 'border-electric/50' 
          : 'border-lavender-border'
      } ${
        interactive 
          ? 'hover:border-electric/60 hover:bg-[#0E0F14] cursor-pointer' 
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

