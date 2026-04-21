import { useEffect, useRef } from "react";
import { DeviceMotion } from "expo-sensors";

const SHAKE_THRESHOLD = 1.65;

export function useFocusShake(onShake: () => void) {
  const cooldown = useRef(false);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(140);
    const sub = DeviceMotion.addListener((motion) => {
      const accel = motion.accelerationIncludingGravity;
      if (!accel || cooldown.current) return;
      const magnitude = Math.sqrt((accel.x ?? 0) ** 2 + (accel.y ?? 0) ** 2 + (accel.z ?? 0) ** 2);
      if (magnitude >= SHAKE_THRESHOLD) {
        cooldown.current = true;
        onShake();
        setTimeout(() => {
          cooldown.current = false;
        }, 900);
      }
    });

    return () => sub.remove();
  }, [onShake]);
}
