import { DEFAULT_CAFE_LETTERS } from '../data/letters.ts';
import type { CafeLetter } from '../types/game';

const VALID_TINTS: ReadonlyArray<NonNullable<CafeLetter['paperTint']>> = [
  'cream',
  'blush',
  'mint',
  'lavender',
];

/**
 * Validates and normalizes a local `content/letters.json` payload.
 * Guarantees stable unique IDs and safe fallbacks so custom parent-authored letters never crash the app.
 */
export function sanitizeLettersCatalog(raw: unknown): CafeLetter[] {
  const rawList = Array.isArray(raw)
    ? raw
    : raw &&
        typeof raw === 'object' &&
        'letters' in raw &&
        Array.isArray((raw as { letters?: unknown }).letters)
      ? (raw as { letters: unknown[] }).letters
      : null;

  if (!rawList) return DEFAULT_CAFE_LETTERS;

  const seenIds = new Set<string>();
  const result: CafeLetter[] = [];

  for (const item of rawList) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const c = item as Partial<CafeLetter>;
    const id = typeof c.id === 'string' ? c.id.trim().slice(0, 64) : '';
    const title = typeof c.title === 'string' ? c.title.trim().slice(0, 80) : '';
    const body = typeof c.body === 'string' ? c.body.trim().slice(0, 500) : '';
    if (!id || !title || !body || seenIds.has(id)) continue;
    seenIds.add(id);

    const fromName =
      typeof c.fromName === 'string' && c.fromName.trim()
        ? c.fromName.trim().slice(0, 50)
        : 'Друг кав’ярні';
    const fromEmoji =
      typeof c.fromEmoji === 'string' && c.fromEmoji.trim()
        ? c.fromEmoji.trim().slice(0, 4)
        : '💌';
    const stampEmoji =
      typeof c.stampEmoji === 'string' && c.stampEmoji.trim()
        ? c.stampEmoji.trim().slice(0, 4)
        : '✨';
    const unlockMinDay =
      typeof c.unlockMinDay === 'number' &&
      Number.isFinite(c.unlockMinDay) &&
      c.unlockMinDay >= 1
        ? Math.floor(c.unlockMinDay)
        : 1;
    const unlockMinServed =
      typeof c.unlockMinServed === 'number' &&
      Number.isFinite(c.unlockMinServed) &&
      c.unlockMinServed >= 0
        ? Math.floor(c.unlockMinServed)
        : undefined;
    const paperTint =
      c.paperTint && VALID_TINTS.includes(c.paperTint) ? c.paperTint : 'cream';

    result.push({
      id,
      fromName,
      fromEmoji,
      title,
      body,
      stampEmoji,
      unlockMinDay,
      unlockMinServed,
      paperTint,
    });
  }

  return result.length > 0 ? result : DEFAULT_CAFE_LETTERS;
}

/** Returns letters unlocked for the player's current day & served count (newest first). */
export function getUnlockedLetters(
  catalog: CafeLetter[],
  dayNumber: number,
  servedCount: number
): CafeLetter[] {
  return catalog
    .filter(
      (letter) =>
        dayNumber >= letter.unlockMinDay &&
        (letter.unlockMinServed === undefined ||
          servedCount >= letter.unlockMinServed)
    )
    .sort((a, b) => b.unlockMinDay - a.unlockMinDay);
}

export function getUnreadLettersCount(
  unlocked: CafeLetter[],
  readLetterIds: string[]
): number {
  const readSet = new Set(readLetterIds);
  return unlocked.filter((l) => !readSet.has(l.id)).length;
}

/** Fetches `public/content/letters.json` cleanly with automatic fallback to `DEFAULT_CAFE_LETTERS`. */
export async function loadLocalLettersCatalog(): Promise<CafeLetter[]> {
  if (typeof fetch !== 'function') return DEFAULT_CAFE_LETTERS;
  try {
    const res = await fetch('/content/letters.json', { cache: 'no-cache' });
    if (!res.ok) return DEFAULT_CAFE_LETTERS;
    const json: unknown = await res.json();
    return sanitizeLettersCatalog(json);
  } catch {
    return DEFAULT_CAFE_LETTERS;
  }
}
