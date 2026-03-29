// src/utils/packingExporter.js

/**
 * Exports packing list state to a versioned JSON file (v2 format) and
 * triggers a browser download.
 */
export function exportToJson(categories, filename) {
    const exportDate = new Date().toISOString();
    const payload = { version: 2, exportDate, categories: {} };

    for (const cat of categories) {
        payload.categories[cat.name] = {
            source: cat.isCustomCategory ? 'custom' : 'default',
            items: cat.items.map((item) => ({
                name: item.name,
                source: item.isCustomItem ? 'custom' : 'default',
                selected: item.selected
            }))
        };
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file from a FileList input event and returns a Promise
 * that resolves to the parsed object.
 */
export function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                resolve(JSON.parse(e.target.result));
            } catch {
                reject(new Error('Invalid JSON file.'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
}

/**
 * Merges imported JSON data (v2 or legacy raw format) into the current
 * categories structure. Returns the updated categories array.
 *
 * @param {Array} currentCategories - The current categories array from state.
 * @param {object} imported - The parsed JSON object from the file.
 * @returns {Array} New categories array with selections and custom items applied.
 */
export function mergeImportedData(currentCategories, imported) {
    const isV2 = imported && imported.version === 2 && imported.categories;
    const raw = isV2 ? null : imported;
    const v2cats = isV2 ? imported.categories : null;

    const toKey = (s) => s.toLowerCase().trim();

    const updatedCategories = currentCategories.map((cat) => {
        const catKey = toKey(cat.name);

        let selectedSet = new Set();
        let extraItems = [];

        if (isV2) {
            const match = Object.entries(v2cats).find(([k]) => toKey(k) === catKey);
            if (match) {
                const [, data] = match;
                selectedSet = new Set(
                    data.items.filter((i) => i.selected).map((i) => toKey(i.name))
                );
                extraItems = data.items
                    .filter((i) => i.source === 'custom')
                    .map((i) => ({ name: i.name, isCustomItem: true, selected: i.selected }));
            }
        } else if (raw && Array.isArray(raw[cat.name])) {
            selectedSet = new Set(raw[cat.name].map(toKey));
        }

        const baseItems = cat.items.map((item) => ({
            ...item,
            selected: selectedSet.has(toKey(item.name))
        }));

        const existingKeys = new Set(baseItems.map((i) => toKey(i.name)));
        const newCustom = extraItems.filter((i) => !existingKeys.has(toKey(i.name)));

        return { ...cat, items: [...baseItems, ...newCustom] };
    });

    if (isV2) {
        const existingKeys = new Set(currentCategories.map((c) => toKey(c.name)));
        const toAdd = Object.entries(v2cats)
            .filter(([k, v]) => !existingKeys.has(toKey(k)) && v.source === 'custom')
            .map(([name, data]) => ({
                name,
                isCustomCategory: true,
                items: data.items.map((i) => ({
                    name: i.name,
                    isCustomItem: true,
                    selected: i.selected
                }))
            }));
        return [...updatedCategories, ...toAdd];
    }

    return updatedCategories;
}
