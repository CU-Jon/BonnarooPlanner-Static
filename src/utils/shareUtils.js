import LZString from 'lz-string';

export function encodeSelections(selections, year) {
  const minified = selections.map(sel => [
    sel.type,
    sel.day,
    sel.location,
    sel.event.name,
    sel.event.start,
    sel.event.end
  ]);
  const payload = JSON.stringify({ y: year, s: minified });
  return LZString.compressToEncodedURIComponent(payload);
}

export function decodeSelections(encoded) {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(encoded);
    if (!raw) return null;
    const { y, s } = JSON.parse(raw);
    if (!y || !Array.isArray(s)) return null;
    const selections = s.map(([type, day, location, name, start, end]) => ({
      type,
      day,
      location,
      event: { name, start, end }
    }));
    return { year: y, selections };
  } catch {
    return null;
  }
}

export function buildShareURL(selections, year) {
  const encoded = encodeSelections(selections, year);
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('share', encoded);
  return url.toString();
}
