import LZString from 'lz-string';

const DAY_CODES = {
  Sunday: '0', Monday: '1', Tuesday: '2', Wednesday: '3',
  Thursday: '4', Friday: '5', Saturday: '6'
};

const CODE_TO_DAY = Object.fromEntries(
  Object.entries(DAY_CODES).map(([k, v]) => [v, k])
);

export function encodeSelections(selections, year) {
  const minified = selections.map(sel => [
    sel.type.charAt(0),
    DAY_CODES[sel.day] ?? sel.day,
    sel.location,
    sel.event.start,
    sel.event.name
  ]);
  const payload = JSON.stringify({ y: year, s: minified });
  return LZString.compressToEncodedURIComponent(payload);
}

export function decodeSelections(encoded, schedule) {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(encoded);
    if (!raw) return null;
    const { y, s } = JSON.parse(raw);
    if (!y || !Array.isArray(s)) return null;
    const selections = s.map(([typeCode, dayCode, location, start, name]) => {
      const type = typeCode === 'C' ? 'Centeroo' : 'Outeroo';
      const day = CODE_TO_DAY[dayCode] ?? dayCode;
      const slots = schedule?.[type]?.[day]?.[location];
      const event = (slots && (
        (name && slots.find(e => e.start === start && e.name === name)) ||
        slots.find(e => e.start === start)
      )) ?? { name: name || '(Unknown)', start, end: start };
      return { type, day, location, event };
    });
    return { year: y, selections };
  } catch {
    return null;
  }
}

export function buildShareURL(selections, year) {
  const encoded = encodeSelections(selections, year);
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = 'share=' + encoded;
  return url.toString();
}
