import Image from 'next/image';

function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export default function BackgroundSticker({ src, x, y, rotation }) {
  if (!src) return null;

  const positionX = clamp(x, 4, 96, 88);
  const positionY = clamp(y, 4, 96, 72);
  const angle = clamp(rotation, -30, 30, 8);

  return (
    <Image
      className="board-sticker"
      src={src}
      alt=""
      aria-hidden="true"
      width={320}
      height={320}
      sizes="(max-width: 560px) 72px, 142px"
      style={{ left: `${positionX}%`, top: `${positionY}%`, transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
    />
  );
}
