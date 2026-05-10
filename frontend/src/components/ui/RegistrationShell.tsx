import MaterialIcon from "./MaterialIcon";

type RegistrationShellProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  title?: string;
  subtitle?: string;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  loading?: boolean;
  onSkip?: () => void;
  sideTimeline?: boolean;
  footerExtra?: React.ReactNode;
};

const steps = [
  ["Registration", "check_circle"],
  ["Photo Upload", "add_a_photo"],
  ["Preferences", "tune"],
  ["Completion", "rocket_launch"],
];

export default function RegistrationShell({
  children,
  currentStep,
  totalSteps = 4,
  title,
  subtitle,
  onBack,
  onContinue,
  continueLabel = "Save & Continue",
  loading = false,
  onSkip,
  sideTimeline = false,
  footerExtra,
}: RegistrationShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="fixed top-0 z-50 w-full bg-slate-50/80 shadow-sm backdrop-blur-xl">
        <div className="flex max-w-full items-center justify-between px-6 py-4">
          <span className="font-headline text-2xl font-black italic tracking-tight text-teal-700">Homigo</span>
          <div className="hidden items-center gap-8 md:flex">
            <span className="border-b-2 border-teal-700 font-headline font-bold tracking-tight text-teal-700">
              {sideTimeline ? "Onboarding" : "Registration"}
            </span>
            <span className="rounded px-2 py-1 font-headline font-bold tracking-tight text-slate-500">Help</span>
          </div>
          <MaterialIcon name="account_circle" className="text-teal-600" />
        </div>
      </header>

      <div className={sideTimeline ? "mx-auto flex max-w-[1440px]" : ""}>
        {sideTimeline && (
          <aside className="sticky top-0 hidden h-screen w-80 flex-col border-r border-surface-container px-12 pb-32 pt-32 lg:flex">
            <div className="relative space-y-0">
              <div className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-surface-container-highest" />
              {steps.map(([label, icon], index) => {
                const step = index + 1;
                const done = step < currentStep;
                const active = step === currentStep;
                return (
                  <div key={label} className="relative flex items-center gap-4 pb-12 last:pb-0">
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                        done || active ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"
                      } ${active ? "shadow-lg ring-4 ring-primary-fixed" : ""}`}
                    >
                      <MaterialIcon name={done ? "check" : icon} className="text-xl" fill={done} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${active ? "text-primary" : "text-outline"}`}>
                        Step {step}
                      </p>
                      <p className={`font-bold ${active ? "text-on-surface" : step > currentStep ? "text-outline" : "text-on-surface"}`}>
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <main
          className={
            sideTimeline
              ? "flex-1 px-4 pb-32 pt-24 md:px-8"
              : "mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pb-32 pt-24 md:px-6"
          }
        >
          {title && (
            <div className={sideTimeline ? "mb-12" : "mb-10 w-full"}>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
                  {subtitle && <p className="mt-1 text-on-surface-variant">{subtitle}</p>}
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${sideTimeline ? "rounded-full bg-secondary-fixed px-4 py-1.5 text-secondary lg:hidden" : "text-primary"}`}
                >
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              </div>
            </div>
          )}
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between rounded-t-3xl bg-white/90 px-8 py-6 shadow-[0px_-12px_32px_rgba(24,28,28,0.06)] backdrop-blur-md">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-8 py-3 text-sm font-semibold text-slate-600 active:scale-[0.98] disabled:opacity-50"
        >
          <MaterialIcon name="arrow_back" className="text-sm" /> Back
        </button>

        {footerExtra}

        <div className="flex items-center gap-4">
          {onSkip && (
            <button
              onClick={onSkip}
              disabled={loading}
              className="text-sm font-semibold text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline disabled:opacity-50"
            >
              Skip for now
            </button>
          )}
          <button
            onClick={onContinue}
            disabled={loading}
            className="flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving…
              </>
            ) : (
              <>
                {continueLabel}
                <MaterialIcon name="arrow_forward" className="text-sm" />
              </>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}