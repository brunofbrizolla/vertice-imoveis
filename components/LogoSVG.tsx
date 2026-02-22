// Final Redesign Version - 3D Logo and Sequential Video Hero
export default function LogoSVG({ size = 22 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Gold metallic gradient */}
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE08A" />
                    <stop offset="35%" stopColor="#D9A441" />
                    <stop offset="65%" stopColor="#C4832A" />
                    <stop offset="100%" stopColor="#F0C060" />
                </linearGradient>

                {/* Navy 3D gradient */}
                <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3A6090" />
                    <stop offset="50%" stopColor="#1A2E49" />
                    <stop offset="100%" stopColor="#0D1E30" />
                </linearGradient>

                {/* Side face of house (3D depth) */}
                <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D1E30" />
                    <stop offset="100%" stopColor="#1A2E49" />
                </linearGradient>

                {/* Drop shadow filter */}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.45" />
                </filter>

                {/* Gold glow */}
                <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#D9A441" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* ── House body (front face) ── */}
            <polygon
                points="14,46 14,88 86,88 86,46 50,16"
                fill="url(#navyGrad)"
                filter="url(#shadow)"
            />

            {/* ── 3D side wall (right face) ── */}
            <polygon
                points="86,46 96,56 96,96 86,88"
                fill="url(#sideGrad)"
                opacity="0.7"
            />

            {/* ── 3D roof overhang (right) ── */}
            <polygon
                points="50,16 60,8 96,56 86,46"
                fill="#C4832A"
                opacity="0.85"
            />

            {/* ── Roof frame (front) – gold stroke with glow ── */}
            <polyline
                points="4,50 50,10 96,50"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="6"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#goldGlow)"
            />

            {/* ── Gold accent line left column ── */}
            <line x1="20" y1="58" x2="20" y2="84" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="80" y1="58" x2="80" y2="84" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />

            {/* ── Vertex arrow – front, lit ── */}
            <polygon
                points="50,34 68,60 50,53 32,60"
                fill="#FFE08A"
                opacity="0.95"
            />
            {/* ── Vertex arrow – shadow side ── */}
            <polygon
                points="50,34 68,60 50,53"
                fill="#C4832A"
                opacity="0.6"
            />
            {/* ── Arrow body ── */}
            <rect x="44" y="53" width="12" height="18" rx="2" fill="#D9A441" />
        </svg>
    );
}
