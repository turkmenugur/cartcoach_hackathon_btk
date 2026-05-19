import { useState, useEffect, useRef, useCallback } from 'react';

interface TrackerData {
  idleTimeSeconds: number;
  isRiskHigh: boolean;
  mouseMovements: number;
  reset: () => void;
}

export function useTracker(idleThresholdSeconds: number = 5): TrackerData {
  const [idleTime, setIdleTime] = useState(0);
  const [isRiskHigh, setIsRiskHigh] = useState(false);
  const [mouseMovements, setMouseMovements] = useState(0);

  const idleTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    idleTimeRef.current = 0;
    setIdleTime(0);
    setIsRiskHigh(false);
    setMouseMovements(0);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      idleTimeRef.current = 0;
      setIdleTime(0);
      setIsRiskHigh(false);
      setMouseMovements((prev) => prev + 1);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    intervalRef.current = setInterval(() => {
      idleTimeRef.current += 1;
      setIdleTime(idleTimeRef.current);

      if (idleTimeRef.current >= idleThresholdSeconds) {
        setIsRiskHigh(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idleThresholdSeconds]);

  return {
    idleTimeSeconds: idleTime,
    isRiskHigh,
    mouseMovements,
    reset,
  };
}
