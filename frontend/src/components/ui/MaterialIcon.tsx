type MaterialIconProps = {
  name: string;
  className?: string;
  fill?: boolean;
};

export default function MaterialIcon({ name, className = "", fill = false }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined align-middle ${className}`}
      style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24` }}
    >
      {name}
    </span>
  );
}
