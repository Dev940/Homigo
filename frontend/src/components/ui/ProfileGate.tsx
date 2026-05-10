import MaterialIcon from "./MaterialIcon";
import { isOnboardingComplete } from "../../lib/registrationDraft";

type ProfileGateProps = {
  /** Human-readable action label, e.g. "send a message" or "book a viewing" */
  action: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
};

/**
 * Wraps any interactive element that requires a completed profile.
 * Renders children when onboarding is done; otherwise shows a CTA prompt.
 */
export default function ProfileGate({ action, onNavigate, children }: ProfileGateProps) {
  if (isOnboardingComplete()) return <>{children}</>;

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <MaterialIcon name="lock" className="text-2xl text-primary" />
      </div>
      <p className="font-headline text-lg font-bold text-on-surface">
        Complete your profile to {action}
      </p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-on-surface-variant">
        Setting up your profile takes less than 2 minutes and helps us find better matches for you.
      </p>
      <button
        onClick={() => onNavigate("role")}
        className="btn-primary mt-5"
      >
        Complete profile
      </button>
      <button
        onClick={() => onNavigate("dashboard")}
        className="mt-3 block w-full text-center text-sm text-on-surface-variant underline-offset-2 hover:underline"
      >
        Maybe later
      </button>
    </div>
  );
}