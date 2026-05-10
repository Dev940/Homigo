import { useEffect } from "react";
import MaterialIcon from "../../components/ui/MaterialIcon";
import { markOnboardingComplete } from "../../lib/registrationDraft";

type PageProps = { onNavigate: (page: string) => void };

export default function Step5Complete({ onNavigate }: PageProps) {
  useEffect(() => {
    markOnboardingComplete("owner");
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 py-12">
      <section className="card max-w-2xl text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-primary"><MaterialIcon name="verified" className="text-6xl" fill /></div>
        <h1 className="mt-8 font-headline text-5xl font-extrabold tracking-tight">Your owner profile is live.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-on-surface-variant">Your listing has everything needed for Homigo to recommend it to compatible seekers.</p>
        <button onClick={() => onNavigate("dashboard")} className="btn-primary mt-10">Open dashboard</button>
      </section>
    </main>
  );
}
