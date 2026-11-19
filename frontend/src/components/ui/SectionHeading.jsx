import React from 'react';

export default function SectionHeading({
  tag,
  title,
  highlightWord,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
      <div>
        {tag && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted font-medium">
              {tag}
            </span>
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-lavender-highlight">
          {title}
          {highlightWord && (
            <span className="text-electric ml-2">{highlightWord}</span>
          )}
        </h2>
        {description && (
          <p className="text-xs md:text-sm text-lavender-muted mt-1.5 max-w-2xl leading-relaxed font-body">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
