import Footer from "../components/layout/Footer";
import { useHomigoAuth } from "../components/auth/AuthContext";
import MaterialIcon from "../components/ui/MaterialIcon";
import ProgressStepper from "../components/ui/ProgressStepper";

type PageProps = { onNavigate: (page: string) => void };

export default function RoleSelection({ onNavigate }: PageProps) {
  const { isClerkEnabled, userProfile } = useHomigoAuth();
  const isSignedIn = isClerkEnabled && Boolean(userProfile?.fullName ?? userProfile?.email);
  return (
    <>
      <div className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4"><ProgressStepper current={1} total={3} /></div>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-12 pt-28">
        <div className="mb-14 max-w-2xl text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">Tell us who you are</h1>
          <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">Help us personalize your experience for finding a home or sharing yours.</p>
        </div>
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
          {[
            ["Find a Roommate", "I am looking for a place to live and someone compatible to share it with.", "person_search", "Get Started", "onboarding1", "primary"],
            ["List My Space", "I have a room or apartment and want the perfect co-living partner.", "apartment", "List Property", "owner1", "secondary"],
          ].map(([title, text, icon, cta, page, color]) => (
            <button key={title} onClick={() => onNavigate(page)} className="group rounded-xl p-1 text-left focus:outline-none focus:ring-2 focus:ring-primary/30">
              <div className="card flex h-full flex-col p-8">
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-full ${color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                  <MaterialIcon name={icon} className="text-4xl" fill />
                </div>
                <h2 className="font-headline text-2xl font-bold">{title}</h2>
                <p className="mt-3 leading-relaxed text-on-surface-variant">{text}</p>
                <div className={`mt-auto flex items-center pt-8 text-sm font-bold uppercase tracking-wide ${color === "primary" ? "text-primary" : "text-secondary"}`}>
                  {cta}<MaterialIcon name="arrow_forward" className="ml-2 group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
        {!isSignedIn && (
          <button onClick={() => onNavigate("login")} className="mt-10 text-sm font-bold text-primary">Already have an account? Sign in here</button>
        )}
        <button onClick={() => onNavigate("dashboard")} className={`flex items-center gap-1 text-sm text-on-surface-variant underline-offset-2 hover:text-primary hover:underline ${isSignedIn ? "mt-10" : "mt-3"}`}>
          Explore the app first &rarr;
        </button>
      </main>
      <Footer />
    </>
  );
}
