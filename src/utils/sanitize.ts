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
