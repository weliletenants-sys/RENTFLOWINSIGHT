interface FunderInvestCTAProps {
  onStartInvesting?: () => void;
}

export default function FunderInvestCTA({ onStartInvesting }: FunderInvestCTAProps) {
  return (
    <section
      className="bg-white rounded-2xl p-8 relative overflow-hidden flex flex-col lg:flex-row items-start border"
      style={{
        borderColor: 'var(--color-primary-border)',
        boxShadow: '0 10px 40px var(--color-primary-shadow)',
      }}
    >
      {/* Text Content */}
      <div className="relative z-10 lg:flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Grow Your<br />Wealth
        </h3>
        <ul className="mb-6 space-y-2">
          {['Up to 20% ROI', 'Zero Default Risk', 'Monthly Payouts'].map((point) => (
            <li key={point} className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              {point}
            </li>
          ))}
        </ul>
        <button
          onClick={onStartInvesting}
          className="text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors"
          style={{
            background: 'var(--color-primary)',
            boxShadow: '0 8px 20px var(--color-primary-shadow)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-dark)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)')}
        >
          Start Investing
        </button>
      </div>

      {/* Decorative Bar Chart */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 lg:opacity-100 lg:relative lg:w-auto flex items-end justify-end pointer-events-none lg:pr-4 pr-6 pb-6">
        <div className="flex items-end gap-2">
          {[10, 16, 14, 24, 32].map((h, i) => (
            <div
              key={i}
              className="w-4 rounded-full"
              style={{ height: `${h * 4}px`, background: 'var(--color-primary)' }}
            />
          ))}
        </div>
        <div
          className="absolute right-[-20%] bottom-[-20%] w-48 h-48 border-4 rounded-full"
          style={{ borderColor: 'var(--color-primary-light)' }}
        />
      </div>
    </section>
  );
}
