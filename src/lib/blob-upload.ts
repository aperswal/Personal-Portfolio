// Pure-ish core of the Vercel Blob uploader, split out from the CLI so it can be
// unit-tested without touching the network or the filesystem. Side effects (the
// real `put`, `readFile`, and `console.log`) are injected as `deps`, so tests can
// assert behavior — including the security invariant that the token never leaks
// into logs or thrown errors — by passing fakes.
//
// This module imports only `node:path` (no `@vercel/blob`, no `node:fs`) so the
// app's tsconfig and Vitest can resolve it with zero extra setup.

import { basename } from "node:path";

export interface UploadArgs {
  filePath: string;
  pathname: string;
}

export interface UploadDeps {
  put: (
    pathname: string,
    body: Buffer,
    options: {
      access: "public";
      addRandomSuffix: boolean;
      allowOverwrite: boolean;
      token: string;
    },
  ) => Promise<{ url: string }>;
  readFile: (filePath: string) => Promise<Buffer>;
  token: string | undefined;
  log: (line: string) => void;
}

const USAGE =
  "Usage: node --env-file=.env.local scripts/upload-to-blob.mjs <local-file> [dest-pathname]";

export function parseArgs(argv: readonly string[]): UploadArgs {
  const filePath = argv[0];
  if (!filePath) {
    throw new Error(USAGE);
  }
  const pathname = argv[1] ?? basename(filePath);
  return { filePath, pathname };
}

export async function uploadFile(args: UploadArgs, deps: UploadDeps): Promise<string> {
  // Fail closed before reading the file or calling put. The message names the
  // env var to fix but never echoes the token value.
  if (!deps.token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Run with: node --env-file=.env.local scripts/upload-to-blob.mjs <file>",
    );
  }

  const body = await deps.readFile(args.filePath);
  const { url } = await deps.put(args.pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: deps.token,
  });

  deps.log(url);
  return url;
}
