import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type TopoBackgroundProps = {
  /** Overall opacity of the contour layer. Defaults per scheme. */
  opacity?: number;
  /** Where the summit rings sit. */
  peak?: { x: number; y: number };
};

const W = 400;
const H = 820;

function contourPath(baseY: number, amp: number, phase: number): string {
  const pts: string[] = [];
  for (let x = -20; x <= W + 20; x += 18) {
    const y = baseY + amp * Math.sin(x / 70 + phase) + amp * 0.4 * Math.sin(x / 31 + phase * 1.7);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

/**
 * Topographic contour backdrop — the texture of the whole app. Sits behind
 * screen content at low opacity; a cluster of concentric rings forms a "summit".
 */
export function TopoBackground({ opacity, peak = { x: 312, y: 150 } }: TopoBackgroundProps) {
  const { c, scheme } = useAtlasTheme();
  const layerOpacity = opacity ?? (scheme === 'dark' ? 0.5 : 0.6);

  const lines = Array.from({ length: 12 }, (_, i) => {
    const baseY = (H / 11) * i;
    const amp = 12 + (i % 3) * 9;
    const phase = i * 0.85;
    return { d: contourPath(baseY, amp, phase), near: i % 2 === 0 };
  });

  const rings = [20, 46, 76, 110, 148];

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: layerOpacity }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => (
          <Path key={`c${i}`} d={l.d} stroke={l.near ? c.contourNear : c.contourFar} strokeWidth={1} fill="none" />
        ))}
        <G transform={`rotate(-18 ${peak.x} ${peak.y})`}>
          {rings.map((r, i) => (
            <Ellipse
              key={`r${i}`}
              cx={peak.x}
              cy={peak.y}
              rx={r}
              ry={r * 0.66}
              stroke={i < 2 ? c.contourNear : c.contourFar}
              strokeWidth={1}
              fill="none"
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}
