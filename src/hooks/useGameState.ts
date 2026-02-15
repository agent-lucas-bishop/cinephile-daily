import { useState, useCallback } from 'react';
import { getDailyState, saveDailyState } from '../utils/storage';
import type { DailyState } from '../utils/storage';

export function useGameState() {
  const [state, setState] = useState<DailyState>(getDailyState);

  const update = useCallback((updater: (s: DailyState) => DailyState) => {
    setState(prev => {
      const next = updater(prev);
      saveDailyState(next);
      return next;
    });
  }, []);

  return { state, update };
}
