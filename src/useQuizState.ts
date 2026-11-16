import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { initialState, State } from './scheduler';

/** Loads quiz progress from storage, drops stale review keys, and saves on change. */
export function useQuizState(storageKey: string, validKeys: ReadonlySet<string>) {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    (async () => {
      let loaded = initialState;
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) loaded = { ...initialState, ...JSON.parse(raw) };
      } catch {}
      loaded.review = Object.fromEntries(
        Object.entries(loaded.review).filter(([k]) => validKeys.has(k)),
      );
      setState(loaded);
    })();
  }, [storageKey, validKeys]);

  useEffect(() => {
    if (state) AsyncStorage.setItem(storageKey, JSON.stringify(state)).catch(() => {});
  }, [storageKey, state]);

  return [state, setState] as const;
}
