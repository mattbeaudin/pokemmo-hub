import catchRatesData from '../../data/catchRates.json';
import { POKEMON } from '../../utils/pokemon';
import { PHENO_ONLY_IDS, RARITY_ORDER } from './constants';

const catchRateMap = Object.fromEntries(catchRatesData.map(r => [r.id, r.rate]));

// Removes time of day/season suffixes from location names to group them together
// e.g. "Route 1 (Day)" and "Route 1 (Night/SEASON0)" both become "Route 1"
const getBaseLocation = name => name.replace(/\s*\(.*\)$/, '').trim();

const TIME_TOKENS = new Set(['Day', 'Morning', 'Night']);
const extractTimeParts = locationName => {
    const m = locationName.match(/\(([^)]+)\)/);
    if (!m) return [];
    return m[1].split('/').filter(p => TIME_TOKENS.has(p));
};

export const TOTAL_POKEMON = POKEMON.length;

const EXCLUDED_LOCATIONS = [
    { region: 'Johto', location: 'Mt. Silver' },
    { region: 'Johto', location: 'Route 28' },
    { location: 'Altering Cave' },
];

const isExcluded = (regionName, baseLocation) => {
    const loc = baseLocation.toLowerCase();
    const region = regionName.toLowerCase();
    return EXCLUDED_LOCATIONS.some(e =>
        loc.includes(e.location.toLowerCase()) &&
        (e.region === undefined || region === e.region.toLowerCase())
    );
};

export const LOCATION_MAP = (() => {
    const map = {};
    POKEMON.forEach(pkmn => {
        pkmn.locations.forEach(loc => {
            if (isExcluded(loc.region_name, getBaseLocation(loc.location))) return;
            if (loc.rarity === 'Horde') return;
            if (!PHENO_ONLY_IDS.has(pkmn.id) && loc.rarity === 'Special') return;
            const baseLocation = getBaseLocation(loc.location);
            const isTimeSuffix = baseLocation !== loc.location;
            const key = `${loc.region_name}|${baseLocation}`;
            if (!map[key]) {
                map[key] = { key, region: loc.region_name, location: baseLocation, pokemon: [] };
            }
            const timeParts = isTimeSuffix ? extractTimeParts(loc.location) : [];
            const existing = map[key].pokemon.find(e => e.pkmn.id === pkmn.id);
            if (existing) {
                existing.encounters.push(loc);
                timeParts.forEach(t => existing._timeParts.add(t));
            } else {
                map[key].pokemon.push({ pkmn, encounters: [loc], catchRate: catchRateMap[pkmn.id] ?? 0, _timeParts: new Set(timeParts) });
            }
        });
    });
    const TIME_OF_DAY = { 'Day': '☀️', 'Morning': '🌅', 'Night': '🌙' };
    Object.values(map).forEach(loc => {
        loc.pokemon.forEach(entry => {
            const parts = Object.keys(TIME_OF_DAY).filter(t => entry._timeParts.has(t));
            entry.timeOfDay = parts.length > 0 ? parts.map(t => TIME_OF_DAY[t]).join('') : null;
            delete entry._timeParts;
        });
    });
    Object.values(map).forEach(loc => {
        loc.pokemon.sort((a, b) => {
            const ra = RARITY_ORDER[a.encounters[0]?.rarity] ?? 99;
            const rb = RARITY_ORDER[b.encounters[0]?.rarity] ?? 99;
            return ra - rb;
        });
    });
    return map;
})();
