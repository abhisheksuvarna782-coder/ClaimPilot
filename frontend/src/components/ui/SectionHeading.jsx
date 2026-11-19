import React from 'react';

export default function SectionHeading({
  tag,
  title,
  description,
  action,
  className = '',
  glow = false
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
      <div>
        {tag && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-glow animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-electric-light font-semibold">
              {tag}
            </span>
          </div>
        )}
        <h2 className={`text-2xl md:text-3xl font-heading font-bold text-white tracking-wide ${glow ? 'text-glow-blue' : ''}`}>
          {title}
        </h2>
        {description && (
          <p className="text-sm text-lavender-dim mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

