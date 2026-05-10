import MaterialIcon from "../ui/MaterialIcon";

type SideNavBarProps = {
  onNavigate?: (page: string) => void;
};

const items = [
  ["dashboard", "Dashboard", "dashboard"],
  ["roommates", "Roommates", "group"],
  ["accommodation", "Listings", "apartment"],
  ["messages", "Messages", "chat"],
  ["profile", "Profile", "person"],
];

export default function SideNavBar({ onNavigate }: SideNavBarProps) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 flex-col bg-surface-container-low p-6 lg:flex">
      <button onClick={() => onNavigate?.("landing")} className="mb-10 text-left">
        <h2 className="font-headline text-xl font-black text-primary">Homigo</h2>
        <p className="text-xs text-outline">Curated Living</p>
      </button>
      <nav className="space-y-2">
        {items.map(([page, label, icon]) => (
          <button key={page} onClick={() => onNavigate?.(page)} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-bold text-on-surface-variant hover:bg-white hover:text-primary">
            <MaterialIcon name={icon} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
