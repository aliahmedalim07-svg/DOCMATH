import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../lib/utils";

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
}

export function SafeImage({ src, alt = "", className, wrapperClassName }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("inline-flex items-center justify-center rounded border border-ziad-line bg-ziad-light/50 text-ziad-ink/40", wrapperClassName)}>
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
