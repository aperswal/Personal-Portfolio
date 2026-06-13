import { describe, it, expect } from "vitest";
import { decideIconClick, DOUBLE_CLICK_MS, type IconClick } from "./icon-click-decision";

const click = (id: string, time: number): IconClick => ({ id, time });

describe("decideIconClick", () => {
  it("selects on the first click when there is no previous click", () => {
    expect(decideIconClick(null, click("a", 1000))).toBe("select");
  });

  it("opens on a second click of the same icon within the threshold", () => {
    const previous = click("a", 1000);
    expect(decideIconClick(previous, click("a", 1200))).toBe("open");
  });

  it("opens when the delta is exactly equal to the threshold", () => {
    const previous = click("a", 1000);
    expect(decideIconClick(previous, click("a", 1000 + DOUBLE_CLICK_MS))).toBe("open");
  });

  it("selects when the delta is just over the threshold", () => {
    const previous = click("a", 1000);
    expect(decideIconClick(previous, click("a", 1000 + DOUBLE_CLICK_MS + 1))).toBe(
      "select",
    );
  });

  it("selects when the second click is on a different icon within the threshold", () => {
    const previous = click("a", 1000);
    expect(decideIconClick(previous, click("b", 1100))).toBe("select");
  });

  it("opens when the delta is zero on the same icon", () => {
    const previous = click("a", 1000);
    expect(decideIconClick(previous, click("a", 1000))).toBe("open");
  });

  it("honors a custom threshold", () => {
    const previous = click("a", 0);
    expect(decideIconClick(previous, click("a", 90), 100)).toBe("open");
    expect(decideIconClick(previous, click("a", 110), 100)).toBe("select");
  });

  it("uses the default threshold when none is provided", () => {
    const previous = click("a", 0);
    expect(decideIconClick(previous, click("a", DOUBLE_CLICK_MS))).toBe("open");
    expect(decideIconClick(previous, click("a", DOUBLE_CLICK_MS + 1))).toBe("select");
  });
});
