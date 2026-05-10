import { useEffect } from "react";
import MaterialIcon from "../../components/ui/MaterialIcon";
import { markOnboardingComplete, readRegistrationDraft } from "../../lib/registrationDraft";

type PageProps = { onNavigate: (page: string) => void };

const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDbtWDZRKTNgJY5qZRkUgT9xD8Vmtp4NKyy2Bo13lrCTE1F4w3mnfsuTagLIJ5C8gngL5n1nmuGVD1ZDBTkb_17XIQkkyG680ZOXRYpEqJY74d8uB4B_KMgb90GuyVMyqh5T_GvcuPgiluhmrAa7I-CeZLdwFzQ08DxV5-1WaxEE2rsuXfGXgsY_qYL2IWCOI6gVPNrpmSWmw-RspgCdYxuoEj4LRPX_yvokbb7jHr468GHrnSbr1uGgW3v8T1AwYWwwX1u-UofF9zq";

export default function Step4Complete({ onNavigate }: PageProps) {
  const draft = readRegistrationDraft();

  useEffect(() => {
    markOnboardingComplete("seeker");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden bg-surface text-on-surface">
      <nav className="w-full max-w-2xl px-6 pb-8 pt-12">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">Step 4 of 4</span>
          <span className="text-sm font-medium text-on-surface-variant">Completion</span>
        </div>
        <div className="flex h-1.5 w-full gap-2">
          {[1, 2, 3, 4].map((step) => <div key={step} className="flex-1 rounded-full bg-primary" />)}
        </div>
      </nav>
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-xl bg-surface-container-low md:aspect-[21/9]">
          <img alt="Celebratory home interior" className="h-full w-full object-cover opacity-90 mix-blend-multiply" src={heroImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center">
            <div className="rounded-full border-4 border-surface bg-secondary p-4 shadow-[0px_12px_32px_rgba(24,28,28,0.12)]">
              <MaterialIcon name="check_circle" className="text-4xl text-white" fill />
            </div>
          </div>
        </div>
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h1 className="mb-6 font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-6xl">You're all set!</h1>
          <p className="text-lg leading-relaxed text-on-surface-variant">Your profile is ready. Now, let's find your perfect match and help you settle into a home you'll love.</p>
        </div>
        <div className="mb-12 flex animate-pulse items-center gap-3 rounded-full bg-secondary-fixed px-6 py-3 text-on-secondary-fixed">
          <MaterialIcon name="bolt" className="text-lg" fill />
          <span className="text-sm font-bold uppercase tracking-wide">AI Matching Engine Activated</span>
        </div>
        <button onClick={() => onNavigate("dashboard")} className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-10 py-4 font-headline text-lg font-bold text-on-primary shadow-lg active:scale-95">
          Go to Dashboard <MaterialIcon name="arrow_forward" />
        </button>
      </main>
      <div className="pointer-events-none fixed bottom-0 left-0 flex w-full items-center justify-center px-8 py-8">
        <div className="pointer-events-auto flex w-full max-w-4xl justify-between">
          <button onClick={() => onNavigate("onboarding3")} className="flex items-center gap-2 rounded-full bg-surface-container-high px-8 py-3 text-sm font-semibold text-on-surface-variant active:scale-95"><MaterialIcon name="arrow_back" className="text-sm" />Back</button>
          <div className="hidden items-center gap-4 rounded-full bg-surface-container-lowest p-2 pr-6 shadow-sm md:flex">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary-fixed">
              {draft.basic_info.profile_photo ? <img alt="User profile" className="h-full w-full object-cover" src={draft.basic_info.profile_photo} /> : <span className="font-bold text-on-secondary-fixed">{draft.basic_info.full_name[0]}</span>}
            </div>
            <div><p className="text-xs font-bold text-on-surface">Profile Complete</p><p className="text-[10px] text-on-surface-variant">Visibility: Public</p></div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed -left-24 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
    </div>
  );
}
