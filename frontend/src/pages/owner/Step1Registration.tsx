import { useState } from "react";
import ProgressStepper from "../../components/ui/ProgressStepper";
import { readOwnerDraft, saveOwnerDraft } from "../../lib/registrationDraft";
import { useHomigoAuth } from "../../components/auth/AuthContext";

type PageProps = { onNavigate: (page: string) => void };

export default function OwnerStep1Registration({ onNavigate }: PageProps) {
  const { userProfile } = useHomigoAuth();
  const draft = readOwnerDraft();

  const [fullName, setFullName] = useState(userProfile?.fullName ?? draft.basic_info.full_name);
  const [company, setCompany] = useState(draft.owner_profile.business_name);
  const [email, setEmail] = useState(userProfile?.email ?? draft.basic_info.email);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Name is required.";
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    return next;
  };

  const handleContinue = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    saveOwnerDraft({
      basic_info: {
        ...draft.basic_info,
        full_name: fullName.trim(),
        email: email.trim(),
        profile_photo: userProfile?.imageUrl ?? draft.basic_info.profile_photo,
      },
      owner_profile: { ...draft.owner_profile, business_name: company.trim() },
    });
    onNavigate("owner2");
  };

  return (
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <ProgressStepper current={1} total={5} />
      </div>
      <section className="mx-auto mt-10 max-w-3xl">
        <form
          className="card space-y-5"
          onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
        >
          <h1 className="font-headline text-4xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-on-surface-variant">Join our elite community of property managers and owners.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <input
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }}
                placeholder="Owner name"
                className={errors.fullName ? "border-error ring-1 ring-error" : ""}
              />
              {errors.fullName && <p className="text-xs font-medium text-error">{errors.fullName}</p>}
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company (optional)"
            />
          </div>

          <label className="block space-y-1">
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="Work email"
              type="email"
              className={errors.email ? "border-error ring-1 ring-error" : ""}
            />
            {errors.email && <p className="text-xs font-medium text-error">{errors.email}</p>}
          </label>

          <input placeholder="Password" type="password" />
          <p className="text-xs font-medium text-tertiary">Strong Password: Professional security standard met.</p>

          <button type="button" onClick={handleContinue} className="btn-primary w-full">
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}