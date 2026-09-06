'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ummah-hub:home-mosque-id';
export const DEFAULT_HOME_MOSQUE_ID = 'darul-islah';

/** The user's chosen "home mosque" for prayer-time display, persisted in
 *  the browser so it works for every visitor without requiring sign-in.
 *  `hydrated` is false until the localStorage read completes, so callers
 *  can avoid a server/client render mismatch. */
export function useHomeMosque() {
  const [mosqueId, setMosqueIdState] = useState<string>(DEFAULT_HOME_MOSQUE_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Deliberate exception to react-hooks/set-state-in-effect: localStorage
    // isn't available during SSR, so the initial render must use the
    // default value on both server and client to avoid a hydration
    // mismatch. Syncing the real stored value can only happen after mount.
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setMosqueIdState(saved);
    } catch {
      // localStorage unavailable (private mode, etc.) — just keep the default
    }
    setHydrated(true);
  }, []);

  function setMosqueId(id: string) {
    setMosqueIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore — selection still works for the rest of this session
    }
  }

  return { mosqueId, setMosqueId, hydrated };
}
