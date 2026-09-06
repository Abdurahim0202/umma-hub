'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'ummah-hub:home-mosque-id';
export const DEFAULT_HOME_MOSQUE_ID = 'darul-islah';

interface HomeMosqueContextValue {
  mosqueId: string;
  setMosqueId: (id: string) => void;
  hydrated: boolean;
}

// A single shared instance so every component that cares which mosque is
// selected (the header bar, every mosque card, etc.) sees the same value
// and re-renders together when it changes — a per-component useState here
// would leave every other instance holding a stale id after a switch.
const HomeMosqueContext = createContext<HomeMosqueContextValue>({
  mosqueId: DEFAULT_HOME_MOSQUE_ID,
  setMosqueId: () => {},
  hydrated: false,
});

export function HomeMosqueProvider({ children }: { children: ReactNode }) {
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

  return (
    <HomeMosqueContext.Provider value={{ mosqueId, setMosqueId, hydrated }}>
      {children}
    </HomeMosqueContext.Provider>
  );
}

/** The user's chosen "home mosque" for prayer-time display, persisted in
 *  the browser so it works for every visitor without requiring sign-in.
 *  `hydrated` is false until the localStorage read completes, so callers
 *  can avoid a server/client render mismatch. Shared across the whole app
 *  via context — see `HomeMosqueProvider`. */
export function useHomeMosque() {
  return useContext(HomeMosqueContext);
}
