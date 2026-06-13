import { describe, it, expect } from "vitest";
import { parseAppParam } from "./app-param";
import { APP_IDS } from "@/data/apps";

describe("parseAppParam", () => {
  it("accepts a valid non-hidden app id", () => {
    expect(parseAppParam(APP_IDS.PROJECTS)).toBe(APP_IDS.PROJECTS);
  });

  it("accepts a valid HIDDEN app id so Media sub-apps stay deep-linkable", () => {
    expect(parseAppParam(APP_IDS.MOVIES)).toBe(APP_IDS.MOVIES);
  });

  it("rejects an unknown id, failing closed to null", () => {
    expect(parseAppParam("definitely-not-an-app")).toBeNull();
  });

  it("rejects null, empty, and garbage input", () => {
    expect(parseAppParam(null)).toBeNull();
    expect(parseAppParam("")).toBeNull();
    expect(parseAppParam("../../etc/passwd")).toBeNull();
  });
});
