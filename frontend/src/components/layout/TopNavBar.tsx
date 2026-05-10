import { useClerk } from "@clerk/clerk-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useHomigoAuth } from "../auth/AuthContext";
import MaterialIcon from "../ui/MaterialIcon";

type TopNavBarProps = {
  onNavigate?: (page: string) => void;
};

const links = [
  ["Roommates", "roommates"],
  ["Homes", "accommodation"],
  ["Dashboard", "dashboard"],
  ["Messages", "messages"],
];

/** Only mount under ClerkProvider when signed in with Clerk */
function ClerkSignOutMenuItem({
  onNavigate,
  onClose,
}: {
  onNavigate?: (page: string) => void;
  onClose: () => void;
}) {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      onClick={() =>
        signOut(() => {
          onClose();
          onNavigate?.("login");
        })
      }
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-headline text-sm font-bold text-error transition hover:bg-error-container/50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error/10">
        <MaterialIcon name="logout" className="text-lg" />
      </span>
      Sign out
    </button>
  );
}

export default function TopNavBar({ onNavigate }: TopNavBarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const titleId = useId();
  const { userProfile, isClerkEnabled } = useHomigoAuth();
  const isSignedIn = isClerkEnabled && Boolean(userProfile?.fullName ?? userProfile?.email);
  const displayName = userProfile?.fullName ?? userProfile?.email ?? "Account";

  useEffect(() => {
    if (!accountOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountOpen]);

  const closeAndGo = (page: string) => {
    setAccountOpen(false);
    onNavigate?.(page);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 shadow-ambient backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <button onClick={() => onNavigate?.("landing")} className="font-headline text-2xl font-black italic tracking-tight text-primary">
          Homigo
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, page]) => (
            <button key={page} onClick={() => onNavigate?.(page)} className="font-headline text-sm font-bold text-on-surface-variant hover:text-primary">
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <button type="button" onClick={() => onNavigate?.("messages")} aria-label="Messages">
            <MaterialIcon name="mail" />
          </button>
          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            aria-label="Account menu"
            aria-expanded={accountOpen}
            aria-haspopup="dialog"
          >
            <MaterialIcon name="account_circle" />
          </button>
        </div>
      </nav>

      {accountOpen &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[200] flex items-start justify-end p-3 pt-16 sm:p-4 sm:pt-[4.5rem]"
            role="presentation"
          >
            {/* Portal to document.body so fixed layers are not clipped by header backdrop-filter */}
            <button
              type="button"
              className="pointer-events-auto fixed inset-0 z-0"
              aria-label="Close account menu"
              onClick={() => setAccountOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="pointer-events-auto relative z-10 w-[min(100%,18rem)] overflow-hidden rounded-xl border border-outline-variant/35 bg-surface-container-lowest shadow-[0_12px_40px_rgba(24,28,28,0.11)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={titleId} className="sr-only">
                Account menu
              </h2>
              <button
                type="button"
                className="absolute right-2 top-2 z-20 rounded-full p-1 text-on-surface-variant transition hover:bg-surface-container"
                aria-label="Close"
                onClick={() => setAccountOpen(false)}
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>

              {isSignedIn ? (
                <>
                  <div className="px-4 pb-0.5 pt-3.5 pr-10">
                    <div className="flex gap-3">
                      {userProfile?.imageUrl ? (
                        <div className="relative shrink-0">
                          <img
                            src={userProfile.imageUrl}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover shadow-sm ring-2 ring-white"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 via-surface-container-high to-primary-fixed-dim/40 shadow-sm ring-1 ring-outline-variant/40">
                          <MaterialIcon name="account_circle" className="text-[2.25rem] text-primary" fill />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-headline text-sm font-bold leading-tight text-on-surface">
                          {userProfile?.fullName || displayName}
                        </p>
                        {userProfile?.email && (
                          <p className="mt-0.5 truncate text-xs leading-snug text-on-surface-variant">{userProfile.email}</p>
                        )}
                        {userProfile?.phone && (
                          <p className="mt-0.5 truncate text-[11px] leading-snug text-outline">{userProfile.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 border-t border-outline-variant/25 py-1">
                    <button
                      type="button"
                      onClick={() => closeAndGo("profile")}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-headline text-sm font-bold text-primary transition hover:bg-primary/8"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MaterialIcon name="person" className="text-lg" fill />
                      </span>
                      View profile details
                    </button>
                    <ClerkSignOutMenuItem onNavigate={onNavigate} onClose={() => setAccountOpen(false)} />
                  </div>
                </>
              ) : (
                <div className="px-4 pb-4 pt-3.5 pr-10">
                  <p className="text-xs leading-relaxed text-on-surface-variant">
                    Sign in to save matches, message roommates, and manage your profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => closeAndGo("login")}
                    className="mt-3 w-full rounded-lg bg-primary px-4 py-2 font-headline text-sm font-bold text-on-primary shadow-sm transition hover:opacity-95"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
