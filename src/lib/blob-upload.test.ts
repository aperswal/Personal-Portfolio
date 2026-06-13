import { describe, it, expect, vi } from "vitest";
import { parseArgs, uploadFile } from "./blob-upload";

const SAMPLE_TOKEN = "vercel_blob_rw_SAMPLE_SECRET_VALUE_1234567890";
const UPLOADED_URL = "https://example.public.blob.vercel-storage.com/og/share-card.png";

describe("parseArgs", () => {
  it("throws a usage error when no file path is given", () => {
    expect(() => parseArgs([])).toThrow(/usage/i);
  });

  it("defaults pathname to the file's basename", () => {
    expect(parseArgs(["public/wallpaper.png"])).toEqual({
      filePath: "public/wallpaper.png",
      pathname: "wallpaper.png",
    });
  });

  it("uses an explicit destination pathname when provided", () => {
    expect(parseArgs(["public/wallpaper.png", "og/share-card.png"])).toEqual({
      filePath: "public/wallpaper.png",
      pathname: "og/share-card.png",
    });
  });
});

describe("uploadFile", () => {
  it("calls put once with the right pathname and options, and returns its url", async () => {
    const body = Buffer.from("file-bytes");
    const put = vi.fn(async () => ({ url: UPLOADED_URL }));
    const readFile = vi.fn(async () => body);
    const log = vi.fn();

    const url = await uploadFile(
      { filePath: "public/wallpaper.png", pathname: "og/share-card.png" },
      { put, readFile, token: SAMPLE_TOKEN, log },
    );

    expect(url).toBe(UPLOADED_URL);
    expect(readFile).toHaveBeenCalledExactlyOnceWith("public/wallpaper.png");
    expect(put).toHaveBeenCalledExactlyOnceWith("og/share-card.png", body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: SAMPLE_TOKEN,
    });
  });

  it("throws when the token is undefined, without leaking a token value", async () => {
    const put = vi.fn(async () => ({ url: UPLOADED_URL }));
    const readFile = vi.fn(async () => Buffer.from("file-bytes"));
    const log = vi.fn();

    await expect(
      uploadFile(
        { filePath: "public/wallpaper.png", pathname: "og/share-card.png" },
        { put, readFile, token: undefined, log },
      ),
    ).rejects.toThrow(/BLOB_READ_WRITE_TOKEN/);

    try {
      await uploadFile(
        { filePath: "public/wallpaper.png", pathname: "og/share-card.png" },
        { put, readFile, token: undefined, log },
      );
    } catch (error) {
      expect(String(error)).not.toContain(SAMPLE_TOKEN);
    }

    expect(put).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  it("only ever logs the url, never the token, across a successful run", async () => {
    const put = vi.fn(async () => ({ url: UPLOADED_URL }));
    const readFile = vi.fn(async () => Buffer.from("file-bytes"));
    const log = vi.fn();

    await uploadFile(
      { filePath: "public/wallpaper.png", pathname: "og/share-card.png" },
      { put, readFile, token: SAMPLE_TOKEN, log },
    );

    expect(log).toHaveBeenCalledExactlyOnceWith(UPLOADED_URL);
    for (const call of log.mock.calls) {
      for (const arg of call) {
        expect(String(arg)).not.toContain(SAMPLE_TOKEN);
      }
    }
  });
});
