import Image from "next/image";

/** A real app screenshot (390×844 @2x, captured from the DevPay app) in a phone frame. */
export function Phone({
  src,
  alt,
  width = 260,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`phone ${className}`} style={{ width }}>
      <Image
        src={src}
        alt={alt}
        width={780}
        height={1688}
        priority={priority}
        sizes={`${width}px`}
        className="h-auto w-full"
      />
    </div>
  );
}
