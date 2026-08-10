export const TOTAL_FRAMES = 194;

const FRAME_BASE = '/furniture/frames/';

/** Returns the public URL for a 1-based frame number (1–194). */
export function getFrameSrc(frameNumber) {
  const num = String(frameNumber).padStart(8, '0');
  return `${FRAME_BASE}${num}.webp`;
}

/** Returns the public URL for a 0-based frame index (0–193). */
export function getFrameSrcByIndex(index) {
  return getFrameSrc(index + 1);
}