export const MOTION = {
  parallax: {
    maxTiltDeg: 8,
    maxTranslate: 10,
  },
  taskCard: {
    enterDurationMs: 420,
    completeDurationMs: 380,
    spring: {
      damping: 16,
      stiffness: 180,
      mass: 0.7,
    },
  },
  momentum: {
    decayPerHour: 1,
    glowPulseMs: 1400,
    completeBurstMs: 700,
  },
  focus: {
    hapticPulseMs: 60000,
  },
  ui: {
    softTransitionMs: 260,
  },
} as const;
