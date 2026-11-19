import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) {
  const base = "relative inline-flex items-center justify-center font-display tracking-wider uppercase transition-all duration-200 ease-studio disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-electric";

  const sizes = {
    sm: "px-3.5 py-1.5 text-[11px] gap-2 rounded-sm",
    md: "px-5 py-2.5 text-xs gap-2.5 rounded-sm",
    lg: "px-7 py-3 text-xs gap-3 rounded-sm",
  };

  const variants = {
    // Primary solid electric medical blue with lavender-highlight text
    primary: "bg-electric text-lavender-highlight hover:bg-[#0092C7] active:bg-[#006082] border border-electric/60 shadow-none",
    
    // Hairline outline panel
    outline: "bg-deepblack text-lavender hover:text-lavender-highlight border border-lavender-border hover:border-electric active:bg-lavender-faint",
    
    // Clean transparent ghost
    ghost: "bg-transparent text-lavender-muted hover:text-lavender-highlight hover:bg-lavender-faint border border-transparent",

    // Human Next Reference CTA: Circular hairline outline with arrow
    cta: "bg-transparent text-lavender hover:text-lavender-highlight group border border-transparent p-0 normal-case tracking-normal",
  };

  if (variant === 'cta') {
    return (
      <button
        disabled={disabled}
        className={`inline-flex items-center gap-3.5 group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-electric rounded-full ${className}`}
        {...props}
      >
        <span className="w-10 h-10 rounded-full border border-lavender-border group-hover:border-electric group-hover:text-lavender-highlight text-lavender flex items-center justify-center transition-colors duration-200 ease-studio">
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
        <span className="font-display text-xs uppercase tracking-[0.2em] text-lavender-muted group-hover:text-lavender-highlight transition-colors duration-200">
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      disabled={disabled}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
