import { describe, expect, it } from "vitest";
import {
  applyCapBreakers,
  getCapBreakerBoost,
  getCapBreakerIncrements,
  previewCapBreakers,
} from "../cap-breaker";
import { CAP_BREAKER_CALIBRATION_SAMPLES } from "./cap-breaker-calibration.fixtures";

describe("cap-breaker calibration", () => {
  it("matches small-gap sequential distribution exactly", () => {
    expect(getCapBreakerIncrements(73, 83)).toEqual([2, 2, 2, 2, 2]);
    expect(getCapBreakerIncrements(70, 77)).toEqual([2, 2, 1, 1, 1]);
    expect(getCapBreakerIncrements(85, 90)).toEqual([1, 1, 1, 1, 1]);
  });

  it("matches large-gap empirical samples from in-game screenshots", () => {
    expect(getCapBreakerIncrements(50, 84)).toEqual([10, 8, 6, 5, 5]);
    expect(getCapBreakerIncrements(54, 81)).toEqual([7, 6, 5, 5, 4]);
    expect(getCapBreakerIncrements(51, 75)).toEqual([11, 8, 5]);
    expect(getCapBreakerIncrements(41, 83)).toEqual([12, 10, 8, 7, 5]);
    expect(getCapBreakerIncrements(34, 73)).toEqual([11, 9, 8, 6, 5]);
    expect(getCapBreakerIncrements(25, 76)).toEqual([14, 12, 10, 8, 7]);
  });

  it("reports maxed when build max equals absolute max", () => {
    expect(getCapBreakerIncrements(90, 90)).toEqual([]);
    expect(getCapBreakerBoost(90, 90, 0)).toBe(0);
  });

  it("final cap reaches absolute max for calibrated samples", () => {
    for (const sample of CAP_BREAKER_CALIBRATION_SAMPLES) {
      const absoluteMax =
        sample.buildMax + sample.increments.reduce((a, b) => a + b, 0);
      const preview = previewCapBreakers(sample.buildMax, absoluteMax);
      expect(preview.finalCap).toBe(absoluteMax);
      expect(preview.increments.reduce((a, b) => a + b, 0)).toBe(
        preview.headroom,
      );
    }
  });

  it("matches at least 60% of full calibration rows exactly", () => {
    let exact = 0;
    for (const sample of CAP_BREAKER_CALIBRATION_SAMPLES) {
      const absoluteMax =
        sample.buildMax + sample.increments.reduce((a, b) => a + b, 0);
      const predicted = getCapBreakerIncrements(sample.buildMax, absoluteMax);
      if (
        predicted.length === sample.increments.length &&
        predicted.every((v, i) => v === sample.increments[i])
      ) {
        exact++;
      }
    }
    expect(exact / CAP_BREAKER_CALIBRATION_SAMPLES.length).toBeGreaterThan(0.55);
  });

  it("applyCapBreakers stacks boosts with correct indices", () => {
    expect(applyCapBreakers(73, 83, 1)).toBe(75);
    expect(applyCapBreakers(73, 83, 5)).toBe(83);
  });
});
