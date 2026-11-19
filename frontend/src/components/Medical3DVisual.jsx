import React from 'react';

/**
 * Static SVG fallback for the Hero visual stage.
 * Adheres strictly to the 1px hairline system and ClaimPilot palette:
 * Backgrounds: #06070B, #0A0A0A
 * Primary Accent: #007BA7 (Electric Blue)
 * Secondary Accent: #C9C2DC (Muted Lavender)
 * Highlight Tint: #E4DFEE
 *
 * Replaces the procedural Three.js mesh with an anatomical/evidence schematic
 * until a verified 3D model candidate is approved by the user.
 */
export default function Medical3DVisual({ className = '' }) {
  return (
    <div
      className={`relative w-full h-[450px] md:h-[520px] lg:h-[580px] flex items-center justify-center p-6 select-none ${className}`}
      aria-label="Evidence-linked anatomical verification schematic (Static Fallback)"
    >
      {/* Background Frame with 1px hairline borders */}
      <div className="absolute inset-4 rounded-sm border border-lavender-border/40 bg-midnight/60 pointer-events-none" />

      {/* Static Hairline SVG Medical & Coordinate Schematic */}
      <svg
        className="w-full h-full max-w-[500px] max-h-[500px] relative z-10"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Reticle (1px hairline #007BA7 at 30% opacity) */}
        <circle
          cx="250"
          cy="250"
          r="210"
          stroke="#007BA7"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.35"
        />

        {/* Mid Circular Reticle */}
        <circle
          cx="250"
          cy="250"
          r="160"
          stroke="#C9C2DC"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Inner Anatomical Alignment Ring */}
        <circle
          cx="250"
          cy="250"
          r="95"
          stroke="#007BA7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Center Target Crosshairs */}
        <line
          x1="250"
          y1="30"
          x2="250"
          y2="470"
          stroke="#C9C2DC"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        <line
          x1="30"
          y1="250"
          x2="470"
          y2="250"
          stroke="#C9C2DC"
          strokeWidth="1"
          strokeOpacity="0.2"
        />

        {/* Diagonal Axis Guides */}
        <line
          x1="100"
          y1="100"
          x2="400"
          y2="400"
          stroke="#007BA7"
          strokeWidth="1"
          strokeDasharray="2 4"
          strokeOpacity="0.2"
        />
        <line
          x1="100"
          y1="400"
          x2="400"
          y2="100"
          stroke="#007BA7"
          strokeWidth="1"
          strokeDasharray="2 4"
          strokeOpacity="0.2"
        />

        {/* Stylized Anatomical Spine / Axial Column Vector Geometry */}
        <g stroke="#007BA7" strokeWidth="1" strokeOpacity="0.75">
          {/* C1-C7 Cervical Segment Nodes */}
          <ellipse cx="250" cy="130" rx="22" ry="7" />
          <ellipse cx="250" cy="150" rx="26" ry="8" />
          <ellipse cx="250" cy="172" rx="30" ry="9" />
          {/* T1-T12 Thoracic Segment Nodes */}
          <ellipse cx="250" cy="196" rx="35" ry="10" />
          <ellipse cx="250" cy="222" rx="40" ry="11" />
          <ellipse cx="250" cy="250" rx="44" ry="12" />
          <ellipse cx="250" cy="278" rx="42" ry="11" />
          <ellipse cx="250" cy="304" rx="38" ry="10" />
          {/* L1-L5 Lumbar Segment Nodes */}
          <ellipse cx="250" cy="332" rx="34" ry="9" />
          <ellipse cx="250" cy="358" rx="28" ry="8" />
          <ellipse cx="250" cy="382" rx="20" ry="6" />

          {/* Central Axial Conduit */}
          <line x1="250" y1="120" x2="250" y2="395" strokeWidth="1.5" />
          {/* Lateral Nerve / Verification Pathways */}
          <path d="M 224 150 L 190 160 L 155 160" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 276 150 L 310 160 L 345 160" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 210 222 L 170 238 L 130 238" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 290 222 L 330 238 L 370 238" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 206 278 L 165 298 L 125 298" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 294 278 L 335 298 L 375 298" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 216 332 L 180 354 L 140 354" stroke="#C9C2DC" strokeOpacity="0.4" />
          <path d="M 284 332 L 320 354 L 360 354" stroke="#C9C2DC" strokeOpacity="0.4" />
        </g>

        {/* Verification Anchor Points */}
        <circle cx="155" cy="160" r="3" fill="#007BA7" />
        <circle cx="345" cy="160" r="3" fill="#C9C2DC" />
        <circle cx="130" cy="238" r="3" fill="#007BA7" />
        <circle cx="370" cy="238" r="3" fill="#C9C2DC" />
        <circle cx="125" cy="298" r="3" fill="#007BA7" />
        <circle cx="375" cy="298" r="3" fill="#C9C2DC" />
        <circle cx="140" cy="354" r="3" fill="#007BA7" />
        <circle cx="360" cy="354" r="3" fill="#C9C2DC" />

        {/* Hairline Metadata Callout Labels */}
        <text
          x="45"
          y="65"
          fill="#C9C2DC"
          fillOpacity="0.7"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="0.15em"
        >
          SYS // SCHEMATIC_FALLBACK
        </text>
        <text
          x="45"
          y="80"
          fill="#007BA7"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="0.1em"
        >
          GEOM: AXIAL_VERIFICATION_PLANE
        </text>
        <text
          x="45"
          y="95"
          fill="#8E88A8"
          fontFamily="monospace"
          fontSize="8"
        >
          MODE: STATIC VECTOR DISPLAY
        </text>

        <text
          x="330"
          y="435"
          fill="#C9C2DC"
          fillOpacity="0.7"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="0.1em"
        >
          3D MODEL: PENDING APPROVAL
        </text>
        <text
          x="330"
          y="450"
          fill="#007BA7"
          fontFamily="monospace"
          fontSize="8"
          letterSpacing="0.05em"
        >
          STATUS: CANDIDATES COMPILED
        </text>
      </svg>

      {/* Bottom Status Ribbon */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-sm bg-obsidian border border-lavender-border text-[10px] font-mono tracking-wider text-lavender-muted flex items-center gap-2 z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-electric" />
        <span>STAGE: STATIC SCHEMATIC FALLBACK ACTIVE</span>
      </div>
    </div>
  );
}
