import MaterialIcon from "../ui/MaterialIcon";

type BottomNavBarProps = {
  onNavigate?: (page: string) => void;
};

const items = [
  ["dashboard", "dashboard"],
  ["roommates", "group"],
  ["accommodation", "apartment"],
  ["messages", "chat"],
  ["profile", "person"],
];

export default function BottomNavBar({ onNavigate }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-5 bg-white/90 px-3 py-2 shadow-ambient backdrop-blur-xl lg:hidden">
      {items.map(([page, icon]) => (
        <button key={page} onClick={() => onNavigate?.(page)} className="rounded-lg py-2 text-outline hover:bg-surface-container-low hover:text-primary">
          <MaterialIcon name={icon} />
        </button>
      ))}
    </nav>
  );
}
