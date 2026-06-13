/**
 * In-game cap breaker calibration samples (build max + increment rows from CB screen).
 * Source: user-provided NBA 2K26 screenshots, June 2026.
 */
export interface CapBreakerCalibrationSample {
  label: string;
  buildMax: number;
  increments: number[];
}

export const CAP_BREAKER_CALIBRATION_SAMPLES: CapBreakerCalibrationSample[] =
  [
    { label: "SF 6'9\" — close shot", buildMax: 73, increments: [2, 2, 2, 2, 2] },
    { label: "SF 6'9\" — driving layup", buildMax: 70, increments: [2, 2, 1, 1, 1] },
    { label: "SF 6'9\" — driving dunk", buildMax: 89, increments: [1, 1, 1, 1] },
    { label: "SF 6'9\" — standing dunk", buildMax: 54, increments: [7, 6, 5, 5, 4] },
    { label: "SF 6'9\" — post control", buildMax: 50, increments: [10, 8, 6, 5, 5] },
    { label: "SF 6'9\" — off reb", buildMax: 51, increments: [11, 8, 5] },
    { label: "SF 6'7\" — standing dunk", buildMax: 41, increments: [12, 10, 8, 7, 5] },
    { label: "SF 6'7\" — block", buildMax: 50, increments: [8, 7, 6, 5, 5] },
    { label: "SF 6'7\" — off reb", buildMax: 45, increments: [11, 10, 8, 6, 2] },
    { label: "C 6'9\" — post control", buildMax: 43, increments: [10, 9, 7, 6, 5] },
    { label: "C 6'9\" — speed w ball", buildMax: 54, increments: [7, 6, 5] },
    { label: "C 7'1\" 290 — three point", buildMax: 34, increments: [11, 9, 8, 6, 5] },
    { label: "C 7'1\" 290 — speed w ball", buildMax: 25, increments: [13, 5] },
    { label: "PF 7'0\" — perimeter def", buildMax: 36, increments: [10, 9, 7, 6] },
    { label: "PF 7'0\" — speed w ball", buildMax: 49, increments: [10, 3] },
    { label: "PG 5'10\" — driving dunk", buildMax: 25, increments: [14, 12, 10, 8, 7] },
    { label: "PG 5'10\" — post control", buildMax: 25, increments: [14, 12, 9] },
    { label: "PG 5'10\" — interior def", buildMax: 35, increments: [11] },
    { label: "PG 5'10\" — steal", buildMax: 90, increments: [2, 2, 2, 2, 1] },
  ];
