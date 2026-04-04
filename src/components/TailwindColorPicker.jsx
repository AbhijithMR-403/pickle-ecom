// Tailwind color swatches with their CSS hex equivalents for display
// The `value` is the tailwind class string sent to the backend
export const COLORS = [
  // Reds
  { value: 'red-400',    hex: '#f87171' },
  { value: 'red-600',    hex: '#dc2626' },
  { value: 'rose-500',   hex: '#f43f5e' },
  // Oranges
  { value: 'orange-400', hex: '#fb923c' },
  { value: 'orange-500', hex: '#f97316' },
  { value: 'orange-600', hex: '#ea580c' },
  { value: 'orange-700', hex: '#c2410c' },
  { value: 'amber-400',  hex: '#fbbf24' },
  { value: 'amber-500',  hex: '#f59e0b' },
  { value: 'amber-600',  hex: '#d97706' },
  // Yellows
  { value: 'yellow-400', hex: '#facc15' },
  { value: 'yellow-500', hex: '#eab308' },
  { value: 'yellow-600', hex: '#ca8a04' },
  // Greens
  { value: 'lime-500',   hex: '#84cc16' },
  { value: 'green-400',  hex: '#4ade80' },
  { value: 'green-500',  hex: '#22c55e' },
  { value: 'green-600',  hex: '#16a34a' },
  { value: 'emerald-500',hex: '#10b981' },
  { value: 'teal-500',   hex: '#14b8a6' },
  // Blues
  { value: 'cyan-500',   hex: '#06b6d4' },
  { value: 'sky-500',    hex: '#0ea5e9' },
  { value: 'blue-500',   hex: '#3b82f6' },
  { value: 'blue-600',   hex: '#2563eb' },
  { value: 'indigo-500', hex: '#6366f1' },
  { value: 'indigo-600', hex: '#4f46e5' },
  // Purples
  { value: 'violet-500', hex: '#8b5cf6' },
  { value: 'purple-500', hex: '#a855f7' },
  { value: 'purple-600', hex: '#9333ea' },
  { value: 'fuchsia-500',hex: '#d946ef' },
  { value: 'pink-500',   hex: '#ec4899' },
  // Neutrals
  { value: 'stone-500',  hex: '#78716c' },
  { value: 'gray-500',   hex: '#6b7280' },
  { value: 'slate-600',  hex: '#475569' },
];

export default function TailwindColorPicker({ value, onChange }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {COLORS.map(c => (
          <button
            key={c.value}
            type="button"
            title={c.value}
            onClick={() => onChange(c.value)}
            style={{ backgroundColor: c.hex }}
            className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${
              value === c.value
                ? 'border-white scale-110 ring-2 ring-white/50 shadow-lg'
                : 'border-transparent opacity-80 hover:opacity-100'
            }`}
          />
        ))}
      </div>
      {value && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span
            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
            style={{ backgroundColor: COLORS.find(c => c.value === value)?.hex || '#888' }}
          />
          <span className="font-mono">{value}</span>
        </div>
      )}
    </div>
  );
}
