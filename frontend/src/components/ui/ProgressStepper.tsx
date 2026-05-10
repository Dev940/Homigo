type ProgressStepperProps = {
  current: number;
  total: number;
  labels?: string[];
};

export default function ProgressStepper({ current, total, labels = [] }: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between">
        <span className="font-headline text-xl font-black italic tracking-tight text-primary">Homigo</span>
        <span className="text-xs font-bold uppercase tracking-widest text-outline">Step {current} of {total}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-container">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      {labels.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {labels.map((label, index) => {
            const done = index + 1 <= current;
            return (
              <div key={label} className={`rounded-lg p-3 ${done ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider">Step {index + 1}</p>
                <p className="font-headline text-sm font-bold">{label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
