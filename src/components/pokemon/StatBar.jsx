import { motion } from 'framer-motion';
import { STAT_COLORS, STAT_NAMES } from '../../data/constants';

export default function StatBar({ stat, value, maxValue = 255, delay = 0 }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = STAT_COLORS[stat] || '#ffd700';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-20 text-right font-medium">
        {STAT_NAMES[stat] || stat}
      </span>
      <div className="flex-1 h-3 bg-poke-dark-4 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
        </motion.div>
      </div>
      <span className="text-sm font-bold text-white w-8">{value}</span>
    </div>
  );
}

export function StatRadar({ stats }) {
  const size = 200;
  const center = size / 2;
  const maxStat = 255;
  const angleStep = (2 * Math.PI) / stats.length;

  const points = stats.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (s.base_stat / maxStat) * (center - 20);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: STAT_NAMES[s.stat.name] || s.stat.name,
      value: s.base_stat,
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={stats
            .map((_, i) => {
              const angle = angleStep * i - Math.PI / 2;
              const r = (center - 20) * scale;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            })
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      <motion.path
        d={pathD}
        fill="rgba(255, 215, 0, 0.2)"
        stroke="#ffd700"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#ffd700" />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            className="fill-gray-400 text-[8px]"
          >
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
