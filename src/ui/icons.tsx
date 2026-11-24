import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

/** WhatsApp glyph (lucide has none) — same path as the website's icons.tsx. */
export function WhatsAppIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </Svg>
  )
}

/** Brand infinity watermark (site: InfinityMark) for dark bands. */
export function InfinityMark({ width = 400, strokeWidth = 10, opacity = 1 }: { width?: number; strokeWidth?: number; opacity?: number }) {
  return (
    <Svg width={width} height={(width * 180) / 400} viewBox="0 0 400 180" fill="none" opacity={opacity}>
      <Defs>
        <LinearGradient id="aa-inf" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#843F96" />
          <Stop offset="0.55" stopColor="#563D96" />
          <Stop offset="1" stopColor="#3CB4E8" />
        </LinearGradient>
      </Defs>
      <Path
        d="M200 90 C 160 40, 120 20, 90 20 C 45 20, 15 52, 15 90 C 15 128, 45 160, 90 160 C 120 160, 160 140, 200 90 C 240 40, 280 20, 310 20 C 355 20, 385 52, 385 90 C 385 128, 355 160, 310 160 C 280 160, 240 140, 200 90 Z"
        stroke="url(#aa-inf)"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
