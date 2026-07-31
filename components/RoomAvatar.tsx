const PALETTE = ["#3E7BFA", "#8B5CF6", "#F2994A", "#27AE60", "#EC4899", "#14B8A6"];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export function RoomAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const color = PALETTE[hashName(name) % PALETTE.length];
  const initial = name.trim()[0]?.toUpperCase() ?? "R";
  return (
    <div
      style={{ width: size, height: size, backgroundColor: `${color}1F`, color }}
      className="rounded-2xl flex items-center justify-center font-semibold shrink-0"
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
