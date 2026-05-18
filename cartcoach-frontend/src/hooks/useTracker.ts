import { useState, useEffect, useRef } from 'react';

interface TrackerData {
  idleTimeSeconds: number;
  isRiskHigh: boolean;
  mouseMovements: number;
}

export function useTracker(idleThresholdSeconds: number = 5): TrackerData {
  const [idleTime, setIdleTime] = useState(0);
  const [isRiskHigh, setIsRiskHigh] = useState(false);
  const [mouseMovements, setMouseMovements] = useState(0);
  
  const idleTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fare hareket ettiğinde idle süresini sıfırla ve hareket sayısını artır
    const handleMouseMove = () => {
      idleTimeRef.current = 0;
      setIdleTime(0);
      setMouseMovements((prev) => prev + 1);
      
      // Eğer kullanıcı tekrar hareket ederse, riski geçici olarak sıfırlayabiliriz 
      // (veya risk bir kere tetiklendiyse pop-up açık kalabilir, burada pop-up açık kalması için kapatmıyoruz).
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleMouseMove);
    window.addEventListener('scroll', handleMouseMove);

    // Her saniye idle süresini artır
    intervalRef.current = setInterval(() => {
      idleTimeRef.current += 1;
      setIdleTime(idleTimeRef.current);

      if (idleTimeRef.current >= idleThresholdSeconds) {
        setIsRiskHigh(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleMouseMove);
      window.removeEventListener('scroll', handleMouseMove);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idleThresholdSeconds]);

  return {
    idleTimeSeconds: idleTime,
    isRiskHigh,
    mouseMovements
  };
}
