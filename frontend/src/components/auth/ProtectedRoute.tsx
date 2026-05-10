import { useAuth } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  clerkEnabled: boolean;
  onNavigate: (page: string) => void;
};

function ClerkGate({ children, onNavigate }: { children: React.ReactNode; onNavigate: (page: string) => void }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-on-surface-variant">Loading…</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <section className="card max-w-md">
          <p className="font-headline text-3xl font-extrabold">Sign in to continue</p>
          <p className="mt-3 text-on-surface-variant">
            Homigo uses Clerk to keep profiles, chats, listings, and dashboards private.
          </p>
          <button onClick={() => onNavigate("login")} className="btn-primary mt-8 w-full">
            Open sign in
          </button>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

export default function ProtectedRoute({ children, clerkEnabled, onNavigate }: ProtectedRouteProps) {
  if (!clerkEnabled) return <>{children}</>;
  return <ClerkGate onNavigate={onNavigate}>{children}</ClerkGate>;
}