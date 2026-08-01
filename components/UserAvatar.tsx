// Renders a unique, generated avatar for a person using DiceBear's public
// image API (https://www.dicebear.com/). No package install required — it's
// just an <img> pointed at their hosted SVG endpoint, seeded so the same
// person always gets the same avatar.
export function UserAvatar({
  seed,
  size = 40,
  ring = false,
}: {
  seed: string;
  size?: number;
  ring?: boolean;
}) {
  const src = `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(
    seed || "guest"
  )}&backgroundType=gradientLinear`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-2xl shrink-0 bg-bg object-cover ${
        ring ? "ring-2 ring-white shadow-soft" : ""
      }`}
      aria-hidden="true"
    />
  );
}
