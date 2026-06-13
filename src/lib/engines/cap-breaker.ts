import capBreakerLookup from "@/data/cap-breaker-lookup.json";

export const MAX_CAP_BREAKERS_PER_ATTRIBUTE =
  capBreakerLookup.maxPerAttribute;
export const MAX_SINGLE_CAP_BREAKER_BOOST = capBreakerLookup.maxSingleBoost;

/** Small-gap exact distribution (matches in-game for remaining ≤ 10). */
const SMALL_GAP_THRESHOLD = 10;

const lookupMap = new Map<string, number>(
  capBreakerLookup.entries.map((e) => [
    `${e.remaining}:${e.slotsLeft}`,
    e.boost,
  ]),
);

/**
 * Total attribute headroom above the user build max (sum of all cap breaker increments).
 */
export function getCapBreakerHeadroom(
  buildMax: number,
  absoluteMax: number,
): number {
  return Math.max(0, absoluteMax - buildMax);
}

/**
 * Whether build max already equals the body absolute max (no cap breakers possible).
 */
export function isCapBreakerMaxed(
  buildMax: number,
  absoluteMax: number,
): boolean {
  return buildMax >= absoluteMax;
}

/**
 * Boost for the next cap breaker application.
 *
 * Model (from in-game calibration):
 * - `absoluteMax` is the body ceiling (height/weight/wingspan/position).
 * - `currentCap` is the active cap (starts at build max, rises as CBs are applied).
 * - Each CB adds a chunk based on **remaining headroom** and **slots left** (max 5).
 * - Small gaps (≤10) use even sequential ceil; larger gaps use empirical lookup + ceil fallback.
 */
export function getCapBreakerBoost(
  currentCap: number,
  absoluteMax: number,
  breakersApplied = 0,
): number {
  const remaining = absoluteMax - currentCap;
  const slotsLeft = MAX_CAP_BREAKERS_PER_ATTRIBUTE - breakersApplied;

  if (remaining <= 0 || slotsLeft <= 0) return 0;

  const lookupKey = `${remaining}:${slotsLeft}`;
  let boost =
    lookupMap.get(lookupKey) ??
    Math.ceil(remaining / Math.max(1, slotsLeft));

  if (remaining <= SMALL_GAP_THRESHOLD && !lookupMap.has(lookupKey)) {
    boost = Math.ceil(remaining / slotsLeft);
  }

  boost = Math.max(1, Math.min(MAX_SINGLE_CAP_BREAKER_BOOST, boost));
  return Math.min(boost, remaining);
}

/** Preview all cap breaker increments from build max to absolute max (in-game CB screen). */
export function getCapBreakerIncrements(
  buildMax: number,
  absoluteMax: number,
): number[] {
  if (buildMax >= absoluteMax) return [];

  const increments: number[] = [];
  let cap = buildMax;

  for (let used = 0; used < MAX_CAP_BREAKERS_PER_ATTRIBUTE; used++) {
    const boost = getCapBreakerBoost(cap, absoluteMax, used);
    if (boost <= 0) break;
    increments.push(boost);
    cap += boost;
    if (cap >= absoluteMax) break;
  }

  return increments;
}

/** New cap ceiling after applying one cap breaker. */
export function applyCapBreaker(
  currentCap: number,
  absoluteMax: number,
  breakersApplied = 0,
): number {
  const boost = getCapBreakerBoost(currentCap, absoluteMax, breakersApplied);
  if (boost <= 0) return currentCap;
  return Math.min(absoluteMax, currentCap + boost);
}

/** Final cap after applying N cap breakers (capped at absolute max). */
export function applyCapBreakers(
  buildMax: number,
  absoluteMax: number,
  count: number,
): number {
  let cap = buildMax;
  for (let i = 0; i < count; i++) {
    cap = applyCapBreaker(cap, absoluteMax, i);
    if (cap >= absoluteMax) break;
  }
  return cap;
}

export interface CapBreakerPreview {
  buildMax: number;
  absoluteMax: number;
  headroom: number;
  increments: number[];
  /** Cap after all increments (should equal absoluteMax when fully usable). */
  finalCap: number;
  slotsAvailable: number;
}

export function previewCapBreakers(
  buildMax: number,
  absoluteMax: number,
): CapBreakerPreview {
  const increments = getCapBreakerIncrements(buildMax, absoluteMax);
  const finalCap = buildMax + increments.reduce((s, n) => s + n, 0);
  return {
    buildMax,
    absoluteMax,
    headroom: getCapBreakerHeadroom(buildMax, absoluteMax),
    increments,
    finalCap,
    slotsAvailable: increments.length,
  };
}
