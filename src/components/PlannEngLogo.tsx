import React from 'react';

interface PlannEngLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'mark-only';
  showSubtitle?: boolean;
}

export const PlannEngLogo: React.FC<PlannEngLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = false,
}) => {
  // Dimensions & typography scaling matching the official lockup
  const config = {
    sm: { w: 32, h: 32, textClass: 'text-xl', gap: 'gap-2.5', subClass: 'text-[9px]' },
    md: { w: 44, h: 44, textClass: 'text-2xl sm:text-[28px]', gap: 'gap-3 sm:gap-3.5', subClass: 'text-[10px]' },
    lg: { w: 56, h: 56, textClass: 'text-3xl sm:text-4xl', gap: 'gap-3.5 sm:gap-4', subClass: 'text-xs' },
    xl: { w: 76, h: 76, textClass: 'text-4xl sm:text-5xl', gap: 'gap-4 sm:gap-5', subClass: 'text-sm' },
    '2xl': { w: 104, h: 104, textClass: 'text-5xl sm:text-6xl', gap: 'gap-5 sm:gap-6', subClass: 'text-base' },
  };

  const { w, h, textClass, gap, subClass } = config[size] || config.md;

  // Exact 3D Isometric "PE" Monogram Cube Mark matching the uploaded official asset
  const LogoMark = (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_4px_16px_rgba(59,130,246,0.35)] select-none"
    >
      <defs>
        {/* Top Luminous Highlights (Bright Sky Cyan to White-Blue) */}
        <linearGradient id="exactTopGleam" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4FA0E8" />
          <stop offset="45%" stopColor="#7EBDF8" />
          <stop offset="100%" stopColor="#E2F1FE" />
        </linearGradient>

        {/* Top Surface Mid Gradient */}
        <linearGradient id="exactTopMid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#76B8F7" />
          <stop offset="100%" stopColor="#4A90E2" />
        </linearGradient>

        {/* Left Vertical Face - Front Facet of P (Vibrant Azure Blue) */}
        <linearGradient id="exactPFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#519DE9" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Left Outer Bevel - Left Edge of P */}
        <linearGradient id="exactPBevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#74B5F7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Right Front Faces - E Prongs (Rich Corporate Blue) */}
        <linearGradient id="exactEFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Right-Facing Shadow Depth - E Side Facets (Deep Royal Sapphire) */}
        <linearGradient id="exactERightSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="60%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F274A" />
        </linearGradient>

        {/* Interior Cutout Cavity & Underside Shadow */}
        <linearGradient id="exactInnerShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0B192E" />
        </linearGradient>

        {/* White Silver Chamfer Bevel Highlight */}
        <linearGradient id="exactSilverEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>

        {/* Soft Drop Glow */}
        <filter id="exactLogoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#exactLogoShadow)">
        {/* ============================================================ */}
        {/* 1. LETTER 'P' (LEFT HALF OF ISOMETRIC CUBE)                  */}
        {/* ============================================================ */}

        {/* P - Outer Left Bevel Edge */}
        <polygon
          points="14,38 23,32.5 23,83 14,84.5"
          fill="url(#exactPBevel)"
        />

        {/* P - Vertical Spine Front Face */}
        <polygon
          points="23,32.5 35,39 35,89.5 23,83"
          fill="url(#exactPFront)"
        />

        {/* P - Top Crest Slope (Upper Rim of P loop) */}
        <polygon
          points="14,38 58,13 58,25 35,39"
          fill="url(#exactTopGleam)"
        />

        {/* P - Front Curved Surface of P Upper Loop */}
        <polygon
          points="35,39 58,25 58,37 35,51"
          fill="url(#exactTopMid)"
        />

        {/* P - Inner Diamond Cutout / Counter Cavity (Hole of P) */}
        <polygon
          points="35,51 49,43 49,52 35,60"
          fill="url(#exactInnerShadow)"
          opacity="0.85"
        />

        {/* P - Bottom Return Bar of Loop (slants back into left spine) */}
        <polygon
          points="35,60 54,49 54,58 35,69"
          fill="url(#exactPFront)"
        />

        {/* P - Underside Shadow of P Return Bar */}
        <polygon
          points="35,69 54,58 54,62 35,73"
          fill="url(#exactInnerShadow)"
        />

        {/* P - Left Lower Stem Base Bevel */}
        <polygon
          points="23,83 35,89.5 48,97 36,92"
          fill="url(#exactInnerShadow)"
        />

        {/* ============================================================ */}
        {/* 2. CENTRAL DIVIDING BEVEL & SILVER HIGHLIGHT RIDGE            */}
        {/* ============================================================ */}
        <polygon
          points="55,30 61,26.5 61,105 55,101"
          fill="url(#exactInnerShadow)"
          opacity="0.9"
        />

        {/* ============================================================ */}
        {/* 3. LETTER 'E' (RIGHT HALF - THREE ISOMETRIC PRONGS)          */}
        {/* ============================================================ */}

        {/* --- TOP PRONG OF E --- */}
        {/* Top Luminous Facet of Top Prong */}
        <polygon
          points="58,13 102,38 88,46 58,25"
          fill="url(#exactTopGleam)"
        />
        {/* Front Face of Top Prong */}
        <polygon
          points="88,46 102,38 102,48 88,56"
          fill="url(#exactEFront)"
        />
        {/* Right Shadow End Facet of Top Prong */}
        <polygon
          points="102,38 106,40.5 106,47 102,48"
          fill="url(#exactERightSide)"
        />
        {/* Underside Ceiling of Top Notch */}
        <polygon
          points="61,38 88,56 79,61 61,46"
          fill="url(#exactInnerShadow)"
        />

        {/* Top Notch Back Wall (Recessed space between Top & Mid) */}
        <polygon
          points="61,46 79,61 69,67 61,61"
          fill="url(#exactInnerShadow)"
        />

        {/* --- MIDDLE PRONG OF E --- */}
        {/* Top Surface of Middle Prong */}
        <polygon
          points="61,52 94,70 82,77 61,62"
          fill="url(#exactTopGleam)"
        />
        {/* Front Face of Middle Prong */}
        <polygon
          points="82,77 94,70 94,78 82,85"
          fill="url(#exactEFront)"
        />
        {/* Right Shadow End Facet of Middle Prong */}
        <polygon
          points="94,70 98,72.5 98,78 94,78"
          fill="url(#exactERightSide)"
        />
        {/* Underside Ceiling of Lower Notch */}
        <polygon
          points="61,67 82,85 73,89.5 61,74"
          fill="url(#exactInnerShadow)"
        />

        {/* Lower Notch Back Wall (Recessed space between Mid & Bottom) */}
        <polygon
          points="61,74 73,89.5 65,94 61,88"
          fill="url(#exactInnerShadow)"
        />

        {/* --- BOTTOM BASE PRONG OF E --- */}
        {/* Top Surface of Bottom Prong */}
        <polygon
          points="61,80 102,76 89,84 61,88"
          fill="url(#exactTopMid)"
        />
        {/* Front Face along bottom-right edge to bottom vertex */}
        <polygon
          points="89,84 102,76 102,87 58,111 58,100"
          fill="url(#exactEFront)"
        />
        {/* Base Bottom Underside Rim */}
        <polygon
          points="58,111 102,87 91,93 58,111"
          fill="url(#exactInnerShadow)"
        />

        {/* ============================================================ */}
        {/* 4. CRISP SILVER-WHITE SPECULAR HIGHLIGHT RIDGES              */}
        {/* ============================================================ */}
        {/* Top Peak Crest Highlight (Apex line) */}
        <polyline
          points="14,38 58,13 102,38"
          stroke="url(#exactSilverEdge)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Vertical Crease Chamfer Highlight */}
        <line
          x1="58"
          y1="13"
          x2="58"
          y2="25"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Inner Central Ridge Specular Line */}
        <line
          x1="61"
          y1="26.5"
          x2="61"
          y2="38"
          stroke="#E2F1FE"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Left Vertical Ridge Accent */}
        <line
          x1="14"
          y1="38"
          x2="14"
          y2="84.5"
          stroke="#93C5FD"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Right Vertical Corner Accent */}
        <line
          x1="102"
          y1="38"
          x2="102"
          y2="87"
          stroke="#60A5FA"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* E Middle Arm Ridge Gleam */}
        <line
          x1="61"
          y1="52"
          x2="94"
          y2="70"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          opacity="0.7"
        />
      </g>
    </svg>
  );

  if (variant === 'mark-only') {
    return <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>{LogoMark}</div>;
  }

  // Exact Brand Lockup matching user's uploaded reference:
  // [3D Isometric PE Cube] + [Plann (White)] + [Eng (Corporate Blue)]
  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      {LogoMark}
      <div className="flex flex-col justify-center select-none">
        <div className={`font-bold tracking-tight leading-none ${textClass} flex items-baseline font-sans`}>
          {/* "Plann" in Pure White as in official logo */}
          <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Plann
          </span>
          {/* "Eng" in Corporate Blue #4E88DF as in official logo */}
          <span className="text-[#4E88DF] drop-shadow-[0_1px_3px_rgba(78,136,223,0.3)]">
            Eng
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-400 font-semibold tracking-wider uppercase mt-0.5 ${subClass}`}>
            Engineering. Inc
          </span>
        )}
      </div>
    </div>
  );
};
