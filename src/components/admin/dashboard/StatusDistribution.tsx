interface SegmentData {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

interface StatusDistributionProps {
  title: string;
  total: number;
  segments: SegmentData[];
}

export function StatusDistribution({ title, total, segments }: StatusDistributionProps) {
  const nonZero = segments.filter((s) => s.value > 0);

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#17171B] mb-4">{title}</h3>

      {total > 0 && (
        <div className="flex rounded-full overflow-hidden h-2 mb-4 gap-px">
          {nonZero.map((s) => (
            <div
              key={s.label}
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.value.toLocaleString()}`}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[#666672]">{s.label}</span>
            </div>
            <div className="flex items-center gap-2 tabular-nums">
              <span className="font-medium text-[#17171B]">{s.value.toLocaleString()}</span>
              {total > 0 && (
                <span className="text-[#9CA3AF]">
                  {((s.value / total) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
