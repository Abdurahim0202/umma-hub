'use client';

import { useState } from 'react';

/** Some mosque sites hotlink-protect their media (blocks direct browser
 *  requests from other origins) even though a plain server-side fetch works
 *  fine — so the poster occasionally 403s only in the browser. Hide it
 *  rather than showing a broken-image icon. */
export function EventPoster({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="h-1 bg-emerald-500" />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className="w-full h-32 object-cover"
      onError={() => setFailed(true)}
    />
  );
}
