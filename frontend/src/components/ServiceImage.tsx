import { useEffect, useState } from 'react';

export const DEFAULT_IMAGE = '/DefaultImage.jpg';

export function ServiceImage({ src, alt, className }: {
  src: string | null; alt: string; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <img className={className} src={!failed && src ? src : DEFAULT_IMAGE}
    alt={alt} onError={() => setFailed(true)} />;
}
