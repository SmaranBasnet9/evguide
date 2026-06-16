import { evModels } from "@/data/evModels";

export interface ExtractedTrip {
  origin: string;
  destination: string;
  roundTrip: boolean;
  vehicle: string;
}

const ROUND_TRIP_RE = /\b(there and back|round[\s-]?trip|return trip|and back|both ways|round journey)\b/i;

const LEADING_QUESTION_RE =
  /^\s*how\s+(?:far|much|many)\b[\w\s]*?\b(?:is|would|will|does|do)\b\s*/i;

const TRAILING_STOP_WORDS = new Set([
  "would", "will", "battery", "use", "uses", "using", "take", "takes",
  "consume", "consumes", "need", "needs", "require", "requires",
  "cost", "costs", "how", "much", "consumption", "left", "remaining",
]);

// A few dozen major UK cities/towns commonly typed in trip queries — used to
// auto-correct minor spelling mistakes (e.g. "Manchster" -> "Manchester").
// This is a spell-check aid only; the real geocoding still goes through
// postcodes.io in lib/range-fit/engine.ts, which also matches smaller places.
const UK_PLACES = [
  "London", "Manchester", "Birmingham", "Leeds", "Sheffield", "Bristol",
  "Liverpool", "Newcastle", "Nottingham", "Leicester", "Coventry", "Bradford",
  "Stoke-on-Trent", "Wolverhampton", "Plymouth", "Southampton", "Reading",
  "Derby", "Luton", "Northampton", "Portsmouth", "Preston", "Milton Keynes",
  "Sunderland", "Norwich", "Walsall", "Bournemouth", "Swindon", "Huddersfield",
  "Poole", "Oxford", "Middlesbrough", "Blackpool", "Bolton", "Ipswich",
  "York", "Cambridge", "Exeter", "Gloucester", "Brighton", "Hull",
  "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness", "Stirling",
  "Cardiff", "Swansea", "Newport", "Bangor", "Belfast", "Derry",
  "Bath", "Canterbury", "Chester", "Lincoln", "Worcester", "Carlisle",
  "Durham", "Lancaster", "Salisbury", "Truro", "Wakefield", "Warrington",
  "Watford", "Slough", "Crawley", "Maidstone", "Chelmsford", "Colchester",
  "Peterborough", "Stockport", "Rotherham", "Barnsley", "Doncaster",
  "Telford", "Basildon", "Eastbourne", "Hastings", "Guildford", "Woking",
  "Sheffield", "Birkenhead", "Wigan", "St Albans", "Harrogate", "Scarborough",
  "Sheffield", "Shrewsbury", "Taunton", "Yeovil", "Dover", "Folkestone",
  "Bury", "Rochdale", "Oldham", "Salford", "Solihull", "Dudley",
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Classic dynamic-programming edit distance — used to auto-correct minor
// typos in both place names and vehicle names without needing an external AI.
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;

// Correct small typos in a place name against the UK_PLACES list (e.g.
// "Manchster" -> "Manchester", "Bristl" -> "Bristol"). Leaves postcodes,
// exact/unknown matches, and anything too different alone.
function correctPlaceName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || UK_POSTCODE_RE.test(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();
  if (UK_PLACES.some((place) => place.toLowerCase() === lower)) return trimmed;

  let best: { place: string; dist: number } | null = null;
  for (const place of UK_PLACES) {
    const dist = levenshtein(lower, place.toLowerCase());
    const threshold = Math.max(1, Math.floor(place.length / 4));
    if (dist <= threshold && (!best || dist < best.dist)) {
      best = { place, dist };
    }
  }
  return best ? best.place : trimmed;
}

function findVehicleMention(text: string): { vehicle: string; cleaned: string } {
  const lower = text.toLowerCase();
  for (const v of evModels) {
    const candidates = [`${v.brand} ${v.model}`, v.model];
    for (const name of candidates) {
      if (lower.includes(name.toLowerCase())) {
        const re = new RegExp(escapeRegex(name), "i");
        return { vehicle: `${v.brand} ${v.model}`, cleaned: text.replace(re, " ") };
      }
    }
  }

  // Fuzzy fallback: catch typos like "Tesla Modle Y" or "BYD Dolphn" by
  // sliding a word-window over the text and comparing edit distance.
  const words = text.split(/\s+/).filter(Boolean);
  let best: { vehicle: string; start: number; len: number; dist: number } | null = null;
  for (const v of evModels) {
    const candidates = [`${v.brand} ${v.model}`, v.model];
    for (const name of candidates) {
      // Skip very short names (e.g. "i4", "EV6") — a 1-edit fuzzy match on
      // 2-3 character names matches too many unrelated words.
      if (name.length < 6) continue;
      const nameWordCount = name.split(/\s+/).length;
      for (let i = 0; i + nameWordCount <= words.length; i++) {
        const window = words.slice(i, i + nameWordCount).join(" ");
        const dist = levenshtein(window.toLowerCase(), name.toLowerCase());
        const threshold = Math.max(1, Math.floor(name.length / 4));
        if (dist <= threshold && (!best || dist < best.dist)) {
          best = { vehicle: `${v.brand} ${v.model}`, start: i, len: nameWordCount, dist };
        }
      }
    }
  }
  if (best) {
    const newWords = [...words];
    newWords.splice(best.start, best.len, " ");
    return { vehicle: best.vehicle, cleaned: newWords.join(" ") };
  }

  return { vehicle: "", cleaned: text };
}

function trimTrailingStopWords(phrase: string): string {
  let words = phrase.trim().split(/\s+/).filter(Boolean);
  while (words.length > 1) {
    const last = words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "");
    if (TRAILING_STOP_WORDS.has(last)) {
      words = words.slice(0, -1);
    } else {
      break;
    }
  }
  return words.join(" ").replace(/[,.?!]+$/, "").trim();
}

/**
 * Local, offline rule-based extraction — no external AI calls.
 * Handles phrasing like:
 *   "From Manchester to Sheffield in a Kia EV6, there and back"
 *   "Leeds to York and back in a Tesla Model Y"
 *   "How far is London to Bristol in a BYD Dolphin"
 */
export function extractTripLocally(message: string): ExtractedTrip {
  let text = message.trim().replace(LEADING_QUESTION_RE, "");

  const roundTrip = ROUND_TRIP_RE.test(text);
  text = text.replace(ROUND_TRIP_RE, " ");

  const { vehicle, cleaned } = findVehicleMention(text);
  text = cleaned;

  // Drop leftover "in a", "using my", "with the", etc. left behind once the vehicle name is removed.
  text = text.replace(/\b(in|using|with|via|by|driving|drive|on)\s+(a|an|my|the)\b/gi, " ");
  text = text.replace(/,/g, " ");

  let origin = "";
  let destination = "";

  const fromToMatch = text.match(/from\s+(.+?)\s+to\s+(.+)/i);
  if (fromToMatch) {
    [, origin, destination] = fromToMatch;
  } else {
    const toMatch = text.match(/([a-z0-9' ]+?)\s+to\s+([a-z0-9' ]+)/i);
    if (toMatch) {
      [, origin, destination] = toMatch;
    }
  }

  origin = correctPlaceName(trimTrailingStopWords(origin));
  destination = correctPlaceName(trimTrailingStopWords(destination));

  return {
    origin: origin.replace(/\s{2,}/g, " ").trim(),
    destination: destination.replace(/\s{2,}/g, " ").trim(),
    roundTrip,
    vehicle,
  };
}
