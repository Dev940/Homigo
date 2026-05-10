import { useState } from "react";
import { useHomigoAuth } from "../../components/auth/AuthContext";
import MaterialIcon from "../../components/ui/MaterialIcon";
import RegistrationShell from "../../components/ui/RegistrationShell";
import { readRegistrationDraft, saveRegistrationDraft } from "../../lib/registrationDraft";

type PageProps = { onNavigate: (page: string) => void };
type Role = "seeker" | "owner" | "both";

const roleCards: Array<[Role, string, string, string]> = [
  ["seeker", "Seeker", "I am looking for a room or roommate", "search"],
  ["owner", "Owner", "I have a space available to rent", "home"],
  ["both", "Both", "I'm flexible and open to anything", "group"],
];

export default function Step1Registration({ onNavigate }: PageProps) {
  const { userProfile } = useHomigoAuth();
  const draft = readRegistrationDraft();

  const [fullName, setFullName] = useState(userProfile?.fullName ?? draft.basic_info.full_name);
  const [email, setEmail] = useState(userProfile?.email ?? draft.basic_info.email);
  const [phone, setPhone] = useState(userProfile?.phone ?? draft.basic_info.phone);
  const [role, setRole] = useState<Role>(draft.basic_info.role);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; role?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!role) next.role = "Please select a role to continue.";
    return next;
  };

  const saveAndContinue = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    saveRegistrationDraft({
      basic_info: {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        profile_photo: userProfile?.imageUrl ?? draft.basic_info.profile_photo,
      },
    });
    // Route owners to owner flow, seekers/both to seeker flow
    onNavigate(role === "owner" ? "owner1" : "onboarding2");
  };

  return (
    <RegistrationShell
      currentStep={1}
      title="Create account"
      subtitle="Start your journey to the perfect home."
      onBack={() => onNavigate("role")}
      onContinue={saveAndContinue}
    >
      <section className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-sm md:p-12">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); saveAndContinue(); }}>
          <div className="space-y-6">
            <h2 className="font-headline text-xl font-bold text-on-surface">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="ml-1 text-sm font-semibold text-on-surface-variant">Full Name</span>
                <input
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrors((prev) => ({ ...prev, fullName: undefined })); }}
                  placeholder="Cameron Williamson"
                  type="text"
                  className={errors.fullName ? "border-error ring-1 ring-error" : ""}
                />
                {errors.fullName && <p className="ml-1 text-xs font-medium text-error">{errors.fullName}</p>}
              </label>
              <label className="space-y-2">
                <span className="ml-1 text-sm font-semibold text-on-surface-variant">Email Address</span>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                    className={`${errors.email ? "border-error ring-1 ring-error" : "border-r-4 border-tertiary"}`}
                    placeholder="cameron@example.com"
                    type="email"
                  />
                  {!errors.email && email && <MaterialIcon name="check_circle" className="absolute right-3 top-3 text-sm text-tertiary" fill />}
                </div>
                {errors.email && <p className="ml-1 text-xs font-medium text-error">{errors.email}</p>}
              </label>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="ml-1 text-sm font-semibold text-on-surface-variant">Phone Number</span>
                <div className="flex gap-2">
                  <select className="w-32 cursor-pointer rounded-lg border-none bg-surface-container-highest px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-primary/40">
                    <option>IN +91</option>
                    <option>US +1</option>
                    <option>UK +44</option>
                  </select>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" placeholder="9876543210" type="tel" />
                </div>
              </label>
              <label className="space-y-2">
                <span className="ml-1 text-sm font-semibold text-on-surface-variant">Password</span>
                <input placeholder="••••••••••••" type="password" />
                <div className="flex h-1 w-full gap-1">
                  <div className="h-full flex-1 rounded-full bg-tertiary" />
                  <div className="h-full flex-1 rounded-full bg-tertiary" />
                  <div className="h-full flex-1 rounded-full bg-tertiary" />
                  <div className="h-full flex-1 rounded-full bg-surface-container-highest" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Strong Password</p>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-on-surface">Identify your role</h2>
              <span className="rounded-full bg-secondary-fixed px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-secondary-fixed">
                Required
              </span>
            </div>
            {errors.role && (
              <p className="flex items-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-sm font-medium text-error">
                <MaterialIcon name="error" className="text-base" /> {errors.role}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {roleCards.map(([value, title, description, icon]) => {
                const active = role === value;
                return (
                  <button
                    key={value}
                    onClick={() => { setRole(value); setErrors((prev) => ({ ...prev, role: undefined })); }}
                    className={`group relative flex flex-col items-center rounded-xl p-6 text-center transition-all ${
                      active
                        ? "border-2 border-secondary bg-surface-container-lowest shadow-[0px_0px_20px_rgba(112,67,194,0.15)] ring-1 ring-secondary/20"
                        : "border-2 border-transparent bg-surface-container-low hover:border-primary/20 hover:bg-surface-bright"
                    }`}
                    type="button"
                  >
                    {active && <MaterialIcon name="check_circle" className="absolute right-3 top-3 text-xl text-secondary" fill />}
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                        active ? "bg-secondary-fixed" : "bg-primary-container/20 group-hover:scale-110"
                      } transition-transform`}
                    >
                      <MaterialIcon name={icon} className={`text-3xl ${active ? "text-secondary" : "text-primary"}`} />
                    </div>
                    <h3 className="font-headline font-bold text-on-surface">{title}</h3>
                    <p className="mt-2 text-xs text-on-surface-variant">{description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </section>
      <div className="mt-12 flex items-center gap-4 text-on-surface-variant">
        <MaterialIcon name="shield" className="text-lg" />
        <p className="text-sm">Your data is encrypted and never shared with third parties without consent.</p>
      </div>
    </RegistrationShell>
  );
}