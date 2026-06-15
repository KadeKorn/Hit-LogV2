import { useMemo } from 'react';
import Svg, { Circle, G, Path, Polygon, Polyline } from 'react-native-svg';

import { useAtlasTheme } from '@/hooks/use-atlas-theme';

export type RouteLineProps = {
  width: number;
  height: number;
  /** 0..1 completed fraction. When set, the line splits gold (done) / faint (ahead). */
  progress?: number;
  /** Stable seed so each route gets a distinct-but-consistent ridge. */
  seed?: string;
  /** Explicit normalized heights (0 bottom … 1 top). Overrides the generated ridge. */
  points?: number[];
  /** Climbing ridge (true) vs rolling hills (false). */
  climbing?: boolean;
  showWaypoints?: boolean;
  showSummit?: boolean;
  /** Soft mountain silhouette under the line. */
  fill?: boolean;
  /** Color for the decorative (no-progress) line. Defaults to steel. */
  lineColor?: string;
  pad?: number;
};

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function makeRng(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateRidge(seed: string, n: number, climbing: boolean): number[] {
  const rng = makeRng(hashSeed(seed));
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = i / (n - 1);
    const trend = climbing ? 0.22 + t * 0.62 : 0.45 + 0.18 * Math.sin(t * Math.PI * 1.4);
    const noise = (rng() - 0.5) * 0.22;
    out.push(Math.max(0.1, Math.min(0.96, trend + noise)));
  }
  return out;
}

function interpY(ys: number[], xs: number[], xAt: number): number {
  for (let i = 0; i < xs.length - 1; i += 1) {
    if (xAt >= xs[i] && xAt <= xs[i + 1]) {
      const f = (xAt - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + f * (ys[i + 1] - ys[i]);
    }
  }
  return ys[ys.length - 1];
}

export function RouteLine({
  width,
  height,
  progress,
  seed = 'atlas',
  points,
  climbing = true,
  showWaypoints = true,
  showSummit = true,
  fill = false,
  lineColor,
  pad = 10,
}: RouteLineProps) {
  const { c } = useAtlasTheme();
  const n = points?.length ?? 7;

  const heights = useMemo(
    () => points ?? generateRidge(seed, n, climbing),
    [points, seed, n, climbing]
  );

  const xs = useMemo(
    () => heights.map((_, i) => pad + (i * (width - pad * 2)) / (n - 1)),
    [heights, width, pad, n]
  );
  const ys = useMemo(
    () => heights.map((h) => pad + (1 - h) * (height - pad * 2)),
    [heights, height, pad]
  );

  const done = lineColor ? lineColor : c.routeDone;
  const ahead = c.routeUpcoming;

  const hasProgress = typeof progress === 'number';
  const px = pad + (hasProgress ? Math.max(0, Math.min(1, progress!)) : 1) * (width - pad * 2);
  const pyDone = interpY(ys, xs, px);

  const donePts: string[] = [];
  const aheadPts: string[] = [];
  xs.forEach((x, i) => {
    if (x <= px) donePts.push(`${x},${ys[i]}`);
    else aheadPts.push(`${x},${ys[i]}`);
  });
  donePts.push(`${px},${pyDone}`);
  aheadPts.unshift(`${px},${pyDone}`);

  const fullArea = `${xs.map((x, i) => `${x},${ys[i]}`).join(' ')} ${width - pad},${height} ${pad},${height}`;

  return (
    <Svg width={width} height={height}>
      {fill ? (
        <Polygon points={fullArea} fill={hasProgress ? c.goldTint : c.steelTint} />
      ) : null}

      {hasProgress ? (
        <>
          <Polyline
            points={donePts.join(' ')}
            fill="none"
            stroke={done}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Polyline
            points={aheadPts.join(' ')}
            fill="none"
            stroke={ahead}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 7"
          />
        </>
      ) : (
        <Polyline
          points={xs.map((x, i) => `${x},${ys[i]}`).join(' ')}
          fill="none"
          stroke={lineColor ?? c.steel}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {showWaypoints
        ? xs.map((x, i) => {
            const isLast = i === xs.length - 1;
            if (isLast && showSummit) return null;
            const reached = x <= px;
            return (
              <Circle
                key={`wp${i}`}
                cx={x}
                cy={ys[i]}
                r={3.4}
                fill={reached ? done : c.dotEmpty}
                stroke={reached ? done : c.dotEmptyBorder}
                strokeWidth={1.5}
              />
            );
          })
        : null}

      {showSummit ? (
        <G>
          <Path
            d={`M${xs[n - 1]} ${ys[n - 1] - 18} L${xs[n - 1] + 9} ${ys[n - 1] - 14} L${xs[n - 1]} ${ys[n - 1] - 10} Z`}
            fill={done}
          />
          <Path
            d={`M${xs[n - 1]} ${ys[n - 1]} L${xs[n - 1]} ${ys[n - 1] - 18}`}
            stroke={done}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <Circle cx={xs[n - 1]} cy={ys[n - 1]} r={3} fill={done} />
        </G>
      ) : null}
    </Svg>
  );
}
