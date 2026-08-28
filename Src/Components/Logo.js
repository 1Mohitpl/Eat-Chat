/**
 * BeYuumi brand logo — orange app icon (fork & spoon) + wordmark + tagline.
 * Inline SVG so it stays crisp at any size and needs no image asset.
 */
const Logo = ({ height = 38, className = "", dark = false }) => (
  <svg
    data-testid="logo"
    className={className}
    viewBox="0 0 316 96"
    height={height}
    style={{ width: "auto" }}
    role="img"
    aria-label="BeYuumi — food delivers joy"
  >
    {/* app icon */}
    <rect x="0" y="8" width="80" height="80" rx="24" fill="#ff6b00" />
    {/* fork */}
    <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none">
      <path d="M27 22v8a6 6 0 0 0 12 0v-8" />
      <path d="M33 24v10" />
      <path d="M33 36v22" />
    </g>
    {/* spoon */}
    <ellipse cx="53" cy="30.5" rx="7.5" ry="9.5" fill="#fff" />
    <path d="M53 41v17" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
    {/* wordmark */}
    <text
      x="96"
      y="54"
      fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="800"
      fontSize="42"
      letterSpacing="-1"
    >
      <tspan fill={dark ? "#ffffff" : "#282c3f"}>Be</tspan>
      <tspan fill="#ff6b00">Yuumi</tspan>
    </text>
    {/* tagline */}
    <text
      x="98"
      y="77"
      fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="600"
      fontSize="12.5"
      letterSpacing="4.5"
      fill={dark ? "#9aa4b2" : "#7b8494"}
    >
      FOOD DELIVERS JOY
    </text>
  </svg>
);

export default Logo;
