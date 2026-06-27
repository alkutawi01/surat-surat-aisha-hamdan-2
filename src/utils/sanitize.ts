/**
 * Sanitasi rentetan teks daripada unsur contentEditable untuk mengelakkan suntikan tag HTML,
 * membuang ruang putih berlebihan, dan melakukan .trim().
 */
export function sanitizeText(val: string | null | undefined): string {
  if (!val) return "";
  
  // 1. Buang tag HTML tersuntik (menggunakan regex untuk menapis tag)
  let clean = val.replace(/<\/?[^>]+(>|$)/g, "");
  
  // 2. Buang ruang putih berlebihan (menukar berbilang ruang mendatar kepada satu ruang)
  clean = clean.replace(/[ \t]+/g, " ");
  
  // 3. Menukar berbilang baris kosong berturut-turut kepada maksima dua baris baharu
  clean = clean.replace(/\n\s*\n/g, "\n\n");
  
  // 4. Melakukan kemasan hujung (.trim)
  return clean.trim();
}

/**
 * Menyembuhkan ralat pengekodan (mojibake) seperti "â€”", "â€“", "â▢▢" kembali kepada karakter asal (—, –, ’).
 */
export function healMojibake(text: string): string {
  if (!text) return "";
  return text
    // Menggantikan jujukan bait UTF-8 yang tersalah tafsir sebagai ISO-8859-1 / Windows-1252
    .replace(/â\u0080\u0094/g, "—") // em dash
    .replace(/â€”/g, "—")           // em dash (bentuk alternatif)
    .replace(/â\u0080\u0093/g, "–") // en dash
    .replace(/â€“/g, "–")           // en dash (bentuk alternatif)
    .replace(/â\u0080\u0099/g, "’") // right single quote / apostrophe
    .replace(/â€™/g, "’")           // right single quote / apostrophe (alternatif)
    .replace(/â\u0080\u009c/g, "“") // left double quote
    .replace(/â€œ/g, "“")           // left double quote (alternatif)
    .replace(/â\u0080\u009d/g, "”") // right double quote
    .replace(/â€\u009d/g, "”")       // right double quote (alternatif)
    .replace(/â\u0080\u00a2/g, "•") // bullet
    .replace(/â€¢/g, "•")           // bullet (alternatif)
    .replace(/â\u0080\u00a6/g, "…") // ellipsis
    .replace(/â€¦/g, "…")           // ellipsis (alternatif)
    ;
}

/**
 * Memperbetulkan mojibake secara mendalam (deeply) pada objek, array atau rentetan teks.
 */
export function healMojibakeDeep<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    return healMojibake(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => healMojibakeDeep(item)) as unknown as T;
  }
  if (typeof obj === "object") {
    const res: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = healMojibakeDeep(obj[key]);
      }
    }
    return res as T;
  }
  return obj;
}

