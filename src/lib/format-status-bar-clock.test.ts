import { describe, it, expect } from "vitest";
import { formatStatusBarClock } from "./format-status-bar-clock";

/** Build a Date at a known local hour/minute (date component is irrelevant). */
function at(hours: number, minutes: number): Date {
  return new Date(2024, 0, 1, hours, minutes, 0, 0);
}

describe("formatStatusBarClock", () => {
  it("renders midnight as 12:00", () => {
    expect(formatStatusBarClock(at(0, 0))).toBe("12:00");
  });

  it("renders noon as 12:00", () => {
    expect(formatStatusBarClock(at(12, 0))).toBe("12:00");
  });

  it("drops the leading zero on a single-digit morning hour", () => {
    expect(formatStatusBarClock(at(9, 5))).toBe("9:05");
  });

  it("converts a 24-hour afternoon time to 12-hour form", () => {
    expect(formatStatusBarClock(at(13, 30))).toBe("1:30");
  });

  it("renders one minute before midnight as 11:59", () => {
    expect(formatStatusBarClock(at(23, 59))).toBe("11:59");
  });
});
