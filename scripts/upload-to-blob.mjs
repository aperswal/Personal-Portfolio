// Thin CLI wrapper around src/lib/blob-upload.ts.
//
// Uploads a local file to the project's Vercel Blob store and prints ONLY the
// resulting public URL (never the token). Used for share-card / OG images and
// any other static asset we want served from the Blob CDN rather than /public.
//
// Usage:
//   node --env-file=.env.local scripts/upload-to-blob.mjs <local-file> [dest-pathname]
//
// Example:
//   node --env-file=.env.local scripts/upload-to-blob.mjs public/wallpaper.png og/share-card.png
//
// The token is read from BLOB_READ_WRITE_TOKEN (loaded via --env-file). All real
// logic — arg parsing, file read, the put call, and the token-never-logged
// invariant — lives in the unit-tested core module. Node v23 strips the .ts
// types from the import natively. Keep this file .mjs so the app tsconfig does
// not try to resolve the .ts-extension import.

import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import { parseArgs, uploadFile } from "../src/lib/blob-upload.ts";

try {
  const args = parseArgs(process.argv.slice(2));
  await uploadFile(args, {
    put,
    readFile,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    log: console.log,
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
