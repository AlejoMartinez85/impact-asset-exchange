import { useState, useEffect, useRef, useCallback } from "react";

export interface IoTDataPayload {
  temperature: number;
  humidity: number;
  pm25: number;
  timestamp: string;
}

const BASELINE = {
  temperature: 32,
  humidity: 75,
  pm25: 20,
};

/** Small random drift between -0.5 and +0.5 */
const drift = () => (Math.random() - 0.5); // range [-0.5, 0.5)

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export function useIoTDataStream() {
  const [live, setLive] = useState({
    temperature: BASELINE.temperature,
    humidity: BASELINE.humidity,
    pm25: BASELINE.pm25,
  });

  const [payload, setPayload] = useState<IoTDataPayload | null>(null);
  const liveRef = useRef(live);
  liveRef.current = live;

  // Every 3s: fluctuate baselines slightly so numbers look alive
  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => ({
        temperature: clamp(+((prev.temperature + drift()).toFixed(1)), 20, 50),
        humidity: clamp(+((prev.humidity + drift()).toFixed(1)), 30, 100),
        pm25: clamp(+((prev.pm25 + drift()).toFixed(1)), 0, 200),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Every 10s: emit a full payload snapshot
  useEffect(() => {
    const id = setInterval(() => {
      const current = liveRef.current;
      setPayload({
        temperature: current.temperature,
        humidity: current.humidity,
        pm25: current.pm25,
        timestamp: new Date().toISOString(),
      });
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const reset = useCallback(() => {
    setLive(BASELINE);
  }, []);

  return { ...live, payload, reset };
}
