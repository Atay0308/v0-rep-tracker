import { useRef } from "react";

export function useSwipe(onSwipeLeft: () => void) {
 // speichert Startposition vom Finger (für Swipe)
  const startX = useRef<number | null>(null);

  // 🟢 wird ausgelöst wenn Finger den Screen berührt
  const handleTouchStart = (e: React.TouchEvent) => {
    // X Position vom ersten Finger
    startX.current = e.touches[0].clientX;
  };

  // 🔵 wird ausgelöst wenn Finger wieder losgelassen wird
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;

    // Endposition vom Finger
    const endX = e.changedTouches[0].clientX;

    // Differenz = wie weit gewischt wurde
    const diff = endX - startX.current;

    // wenn negativ → nach links gewischt
    // (Sidebar schließen)
    if (diff < -50) {
      onSwipeLeft();
    }

    // reset
    startX.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}