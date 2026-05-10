import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

type PageProps = { onNavigate: (page: string) => void };

// Redirects away from login if Clerk already has an active session
function AlreadySignedInRedirect({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  useEffect(() => {
    if (isLoaded && isSignedIn) onNavigate("dashboard");
  }, [isLoaded, isSignedIn, onNavigate]);
  return null;
}

// ─── Sign In Form ──────────────────────────────────────────────────────────

function SignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
       await setActive({ session: result.createdSessionId });
        // AuthBridge detects isSignedIn → handles navigation automatically
      } else {
        setError("Additional verification required. Please check your email.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message;
      setError(msg ?? "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-on-surface">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold text-on-surface">Password</label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-primary hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

// ─── Sign Up Form ──────────────────────────────────────────────────────────

type SignUpStep = "details" | "verify";

function SignUpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [step, setStep] = useState<SignUpStep>("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    const parts = fullName.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || undefined;
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message;
      setError(msg ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // AuthBridge detects isSignedIn → handles navigation automatically
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message;
      setError(msg ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <form onSubmit={submitCode} className="space-y-4">
        <div className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-on-surface">{email}</span>. Check your inbox.
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-on-surface">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="text-center tracking-[0.4em]"
            disabled={loading}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying…
            </span>
          ) : (
            "Verify & Continue"
          )}
        </button>

        <button
          type="button"
          onClick={() => { setStep("details"); setCode(""); setError(""); }}
          className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface"
        >
          ← Change email or password
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submitDetails} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-on-surface">Full name</label>
        <input
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Priya Sharma"
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-on-surface">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold text-on-surface">Password</label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-primary hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

// ─── Demo fallback (no Clerk key) ─────────────────────────────────────────

function DemoForm({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
        Add{" "}
        <code className="rounded bg-surface-container-highest px-1 py-0.5 font-mono text-xs">
          VITE_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        to <code className="font-mono text-xs">frontend/.env</code> to enable authentication.
      </div>
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="btn-primary w-full"
      >
        Continue in demo mode
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function LoginSignup({ onNavigate }: PageProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  return (
    <main className="grid min-h-screen bg-surface md:grid-cols-2">
      {clerkEnabled && <AlreadySignedInRedirect onNavigate={onNavigate} />}
      {/* Left branding panel */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-primary-container p-12 text-white md:flex md:flex-col md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-black italic tracking-tight">Homigo</h1>
          <p className="mt-4 max-w-xs font-headline text-lg text-white/80">
            Where curated people meet curated places.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-on-surface shadow-ambient">
          <p className="font-headline text-lg font-bold italic text-primary">
            "The perfect roommate is curated."
          </p>
          <p className="mt-2 text-sm text-on-surface-variant">Sarah K., Resident since 2023</p>
        </div>
      </section>

      {/* Right form panel */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => onNavigate("landing")}
            className="mb-10 font-headline text-2xl font-black italic text-primary md:hidden"
          >
            Homigo
          </button>

          <h2 className="font-headline text-3xl font-extrabold tracking-tight">
            {mode === "sign-in" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {mode === "sign-in"
              ? "Sign in to access your matches, messages, and listings."
              : "Join Homigo to find your ideal roommate or tenant."}
          </p>

          {/* Sign in / Sign up toggle */}
          <div className="mt-6 grid grid-cols-2 rounded-full bg-surface-container-high p-1 text-sm font-bold">
            <button
              onClick={() => setMode("sign-in")}
              className={`rounded-full py-2 transition ${
                mode === "sign-in"
                  ? "bg-white text-primary shadow-ambient"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("sign-up")}
              className={`rounded-full py-2 transition ${
                mode === "sign-up"
                  ? "bg-white text-primary shadow-ambient"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="mt-8">
            {clerkEnabled ? (
              mode === "sign-in" ? <SignInForm /> : <SignUpForm />
            ) : (
              <DemoForm onNavigate={onNavigate} />
            )}
          </div>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Continue onboarding?{" "}
            <button
              onClick={() => onNavigate("role")}
              className="font-bold text-primary hover:underline"
            >
              Choose role
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
