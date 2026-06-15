import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';

import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type CompassMarkProps = {
  size?: number;
  color?: string;
};

/**
 * Lift Atlas brand mark — a compass rose fused with a mountain peak and a
 * barbell on the east–west axis. Single-stroke, gold by default.
 */
export function CompassMark({ size = 40, color }: CompassMarkProps) {
  const { c } = useAtlasTheme();
  const gold = color ?? c.gold;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* outer ring */}
      <Circle cx={50} cy={50} r={37} stroke={gold} strokeWidth={2.2} fill="none" />

      {/* north marker */}
      <Polygon points="50,2 45,13 55,13" fill={gold} />

      {/* compass star — 4 long cardinal kites */}
      <G fill={gold}>
        <Polygon points="50,50 46,24 50,14 54,24" />
        <Polygon points="50,50 46,76 50,86 54,76" />
        <Polygon points="50,50 76,46 86,50 76,54" opacity={0.85} />
        <Polygon points="50,50 24,46 14,50 24,54" opacity={0.85} />
      </G>

      {/* short diagonal points */}
      <G stroke={gold} strokeWidth={1.2}>
        <Path d="M50 50 L66 34" />
        <Path d="M50 50 L66 66" />
        <Path d="M50 50 L34 66" />
        <Path d="M50 50 L34 34" />
      </G>

      {/* barbell across the E–W axis */}
      <G stroke={gold} fill={gold}>
        <Path d="M8 50 L92 50" strokeWidth={2.4} />
        <Rect x={4} y={42} width={5} height={16} rx={1} />
        <Rect x={91} y={42} width={5} height={16} rx={1} />
        <Rect x={13} y={45} width={3} height={10} rx={1} />
        <Rect x={84} y={45} width={3} height={10} rx={1} />
      </G>

      {/* central mountain peak */}
      <Path
        d="M50 36 L62 60 L38 60 Z"
        fill={c.bg}
        stroke={gold}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M45 51 L50 44 L55 51" stroke={gold} strokeWidth={1.4} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}
