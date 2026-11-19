import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const base = "relative inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-xs uppercase tracking-wider rounded-xl gap-2 font-semibold",
    lg: "px-7 py-3.5 text-sm uppercase tracking-widest rounded-xl gap-3 font-bold",
  };

  const variants = {
    primary: "bg-electric hover:bg-electric-light text-white shadow-glow-sm hover:shadow-glow-md border border-electric-light/50",
    secondary: "bg-deepblack/80 hover:bg-deepblack text-lavender-light border border-electric/30 hover:border-electric-light/70 shadow-sm hover:shadow-glow-sm",
    outline: "bg-transparent text-lavender-light border border-lavender-dim/30 hover:border-electric-light hover:text-white",
    ghost: "bg-transparent hover:bg-electric/10 text-lavender-dim hover:text-lavender-light",
  };

  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {/* Subtle background light sweep */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
      {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
      <span>{children}</span>
    </button>
  );
}
