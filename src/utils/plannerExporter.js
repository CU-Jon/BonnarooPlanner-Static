import { SAVE_FILENAME_TEMPLATE } from '../config';

export function savePlan(selections, year) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = SAVE_FILENAME_TEMPLATE
    .replace('{year}', year)
    .replace('{date}', today);

  const data = {
    version: 1,
    savedDate: new Date().toISOString(),
    year,
    selections
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function loadPlan(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== 'object') {
          reject('Invalid file: not a valid JSON object.');
          return;
        }
        if (!Array.isArray(data.selections) || !data.year) {
          reject('Invalid file: missing selections or year.');
          return;
        }
        const isValidSelection = sel =>
          sel &&
          typeof sel.type === 'string' &&
          typeof sel.day === 'string' &&
          typeof sel.location === 'string' &&
          sel.event &&
          typeof sel.event.name === 'string' &&
          typeof sel.event.start === 'string' &&
          typeof sel.event.end === 'string';
        if (!data.selections.every(isValidSelection)) {
          reject('Invalid file: one or more selections have an unexpected format.');
          return;
        }
        resolve({ year: data.year, selections: data.selections });
      } catch {
        reject('Invalid file: could not parse JSON.');
      }
    };
    reader.onerror = () => reject('Could not read the file.');
    reader.readAsText(file);
  });
}
