export const RARITY_ORDER = {
    'Very Common': 0,
    'Common':      1,
    'Uncommon':    2,
    'Rare':        3,
    'Very Rare':   4,
    'Special':     5,
    'Horde':       6,
    'Lure':        7,
};

export const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova'];

export const REGION_COLOR = {
    Kanto: '#dc3545',
    Johto: '#e0a800',
    Hoenn: '#198754',
    Sinnoh: '#0d6efd',
    Unova: '#0dcaf0',
};

export const RARITY_BADGE = {
    'Very Common': { bg: '#adb5bd' },
    'Common':      { bg: '#6c757d' },
    'Uncommon':    { bg: '#198754' },
    'Rare':        { bg: '#e0a800' },
    'Very Rare':   { bg: '#dc3545' },
    'Special':     { bg: '#6f42c1' },
    'Horde':       { bg: '#6c757d' },
    'Lure':        { bg: '#0dcaf0' },
};

// Pokemon IDs that should only appear in route cards when they have a "Special" rarity encounter.
// Any encounter for these IDs that isn't "Special" will be hidden from the routes view.
export const PHENO_ONLY_IDS = new Set([
    529, // Drilbur
    530, // Excadrill
    531, // Audino
    580, // Ducklett
    581, // Swanna
    587, // Emolga
    594, // Alomomola
]);

export const SORT_OPTIONS = [
    { value: 'uncaught', label: 'Most uncaught' },
    { value: 'alpha', label: 'Alphabetical' },
];

export const toTitleCase = str => str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
