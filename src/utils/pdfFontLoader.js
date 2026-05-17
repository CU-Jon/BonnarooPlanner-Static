// src/utils/pdfFontLoader.js

// Full Noto Sans SC TTF served by the Fontsource CDN (cdn.jsdelivr.net/fontsource/fonts/).
// The CDN serves the original, un-subsetted font file (~10 MB) which covers Latin (U+0000-00FF)
// and all CJK Unified Ideographs — required for mixed Latin + Chinese text in jsPDF cells.
// (The same-named .woff2 in the npm package is a CJK-only subset and cannot be used here.)
// To update: change @5.2.9 to a newer @fontsource/noto-sans-sc npm version.
const FONT_CDN_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@5.2.9/chinese-simplified-400-normal.ttf';

const FONT_VFS_NAME = 'NotoSansSC-SC.ttf';
export const UNICODE_FONT_NAME = 'NotoSansSC';

let cachedBase64 = null;

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 8192;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  }
  return btoa(binary);
}

/**
 * Fetches Noto Sans SC from CDN and registers it with the given jsPDF document.
 * The font data is cached in memory after the first download.
 *
 * @param {import('jspdf').jsPDF} doc
 * @returns {Promise<string>} Font name to use ('NotoSansSC', or 'helvetica' on failure)
 */
export async function loadUnicodeFontForPDF(doc) {
  try {
    if (!cachedBase64) {
      const response = await fetch(FONT_CDN_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      cachedBase64 = arrayBufferToBase64(await response.arrayBuffer());
    }
    doc.addFileToVFS(FONT_VFS_NAME, cachedBase64);
    doc.addFont(FONT_VFS_NAME, UNICODE_FONT_NAME, 'normal');
    return UNICODE_FONT_NAME;
  } catch {
    return 'helvetica';
  }
}
