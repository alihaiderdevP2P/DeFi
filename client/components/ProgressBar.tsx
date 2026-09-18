interface Props {
  current: number;
  goal: number;
}

export function ProgressBar({ current, goal }: Props) {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-700">
        <div
          className="h-2 rounded bg-blue-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
        {pct.toFixed(1)}% funded
      </p>
    </div>
  );
}
