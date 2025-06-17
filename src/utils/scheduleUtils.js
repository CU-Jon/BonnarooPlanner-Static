import { jsonBase } from '../config';

export async function fetchSchedule(year) {
  const [centerooResp, outerooResp] = await Promise.all([
    fetch(`${jsonBase}/centeroo_${year}.json`),
    fetch(`${jsonBase}/outeroo_${year}.json`)
  ]);

  let centeroo = {};
  let outeroo = {};

  if (centerooResp.ok) {
    try {
      centeroo = await centerooResp.json();
    } catch {
      centeroo = {};
    }
  }

  if (outerooResp.ok) {
    try {
      outeroo = await outerooResp.json();
    } catch {
      outeroo = {};
    }
  }

  const exists =
    centerooResp.ok &&
    outerooResp.ok &&
    Object.keys(centeroo).length > 0 &&
    Object.keys(outeroo).length > 0;

  // Get latest Last-Modified
  const lmCent = centerooResp.headers.get('Last-Modified');
  const lmOut = outerooResp.headers.get('Last-Modified');
  let lastModified = null;
  if (lmCent || lmOut) {
    const dCent = lmCent ? new Date(lmCent) : null;
    const dOut = lmOut ? new Date(lmOut) : null;
    let latest = dCent;
    if (!latest || (dOut && dOut > latest)) latest = dOut;
    if (latest) lastModified = latest.toLocaleString();
  }

  return { exists, centeroo, outeroo, lastModified };
}