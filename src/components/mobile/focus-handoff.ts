/**
 * Hands the id of the just-opened mobile app from the app view to the home grid
 * so focus can return to the originating icon across the soft (?app=) route
 * transition, which unmounts one view and mounts the other.
 *
 * A module-level, consume-once value (not React state or a ref) so it can be
 * read inside an effect without touching a ref during render, and so a fresh
 * page load — where nothing was opened — restores focus to nothing.
 */
let pendingFocusAppId: string | null = null;

export function setReturnFocusAppId(id: string | null): void {
  pendingFocusAppId = id;
}

/** Read and clear the pending id (so it only restores focus once). */
export function consumeReturnFocusAppId(): string | null {
  const id = pendingFocusAppId;
  pendingFocusAppId = null;
  return id;
}
