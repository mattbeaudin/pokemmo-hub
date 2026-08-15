import { POKEMON, getPokemon } from './pokemon.js'

const generateRoutes = (region_id) => {
    const locations = POKEMON.map(p => p.locations.filter(l => l.region_id === region_id)).flat();
    const routes = []
    const newLocations = []
    locations.forEach(location => {
        if (!routes.includes(location.location_name_full)) {
            routes.push(location.location_name_full)
            newLocations.push(location)
        }
    });
    return newLocations
}

export const ROUTES = {
    kanto: generateRoutes(0),
    hoenn: generateRoutes(1),
    unova: generateRoutes(2),
    sinnoh: generateRoutes(3),
    johto: generateRoutes(4),
}

export const REGIONS = [
    'kanto',
    'johto',
    'hoenn',
    'sinnoh',
    'unova'
]

export const SEASONS = [
    { key: "Spring", label: "Spring", icon: "🌸" },
    { key: "Summer", label: "Summer", icon: "☀️" },
    { key: "Autumn", label: "Autumn", icon: "🍂" },
    { key: "Winter", label: "Winter", icon: "❄️" },
]

export const getCurrentSeason = () => {
    const month = new Date().getMonth() // 0-11
    return SEASONS[month % 4].key
}

export const ENCOUNTER_TYPE = [
    "Grass",
    "Water",
    "Cave",
    "Rocks",
    "Inside",
    "Old Rod",
    "Good Rod",
    "Super Rod",
    "Honey Tree",
    "Dark Grass",
    "Fishing",
    "Shadow",
    "Dust Cloud",
    "Headbutt"
]

export const TYPE = [
    "Normal",
    "Fighting",
    "Flying",
    "Poison",
    "Ground",
    "Rock",
    "Bug",
    "Ghost",
    "Steel",
    // 10: "???",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Psychic",
    "Ice",
    "Dragon",
    "Dark",
    // 18: "None"
]

export const getRegions = () => {
    return REGIONS.map(id => ({ key: id, label: id }))
}

export const getEncounterType = () => {
    return ENCOUNTER_TYPE
        .map(id => ({ key: id, label: id }))
}

export const getTypes = () => {
    return TYPE
        .map(id => ({ key: id.toUpperCase(), label: id }))
}

export const getType = (type_id) => ENCOUNTER_TYPE[type_id]

export const getRoute = (route) => {
    if (!route) return []
    return ROUTES[route.toLowerCase()].map(location => ({ key: location.location, label: location.location }))
}

export const TIME_OF_DAY = ['Morning', 'Day', 'Night']

export const parseLocationName = (rawLocation) => {
    const match = rawLocation.match(/^(.*?)\s*\(([^()]+)\)\s*$/)
    if (!match) return { name: rawLocation, timesOfDay: [], season: null }
    const tokens = match[2].split('/')
    const seasonToken = tokens.find(token => token.startsWith('SEASON'))
    return {
        name: match[1],
        timesOfDay: tokens.filter(token => TIME_OF_DAY.includes(token)),
        season: seasonToken ? SEASONS[Number(seasonToken.replace('SEASON', ''))].key : null,
    }
}

// Generic, rarity-based helpers - not Horde-specific, reusable by future "rarity finder" style tools.
export const getPokemonIdsByRarity = (rarity) =>
    new Set(POKEMON.filter(pkmn => (pkmn.locations || []).some(l => l.rarity === rarity)).map(pkmn => pkmn.id))

export const getPokemonLocationsByRarity = (id, rarity) => {
    const pkmn = getPokemon(id)
    if (!pkmn) return []
    return (pkmn.locations || []).filter(l => l.rarity === rarity)
}

export const getOtherPokemonAtLocation = (pokemonId, regionId, location, rarity = 'Horde') =>
    POKEMON
        .filter(pkmn => pkmn.id !== pokemonId)
        .filter(pkmn => (pkmn.locations || []).some(l =>
            l.rarity === rarity && l.region_id === regionId && l.location === location
        ))
        .map(pkmn => ({ id: pkmn.id, name: pkmn.name }))

export const getSeasonsForPokemon = (id, rarity = 'Horde') =>
    [...new Set(
        getPokemonLocationsByRarity(id, rarity)
            .map(l => parseLocationName(l.location).season)
            .filter(Boolean)
    )]

export const getAllSeasonsInUse = (rarity = 'Horde') => {
    const seasons = new Set()
    POKEMON.forEach(pkmn => (pkmn.locations || []).forEach(l => {
        if (l.rarity === rarity) {
            const season = parseLocationName(l.location).season
            if (season) seasons.add(season)
        }
    }))
    return [...seasons]
}

// Horde-specific conveniences built on the generic helpers above.
export const getHordeEligiblePokemonIds = () => getPokemonIdsByRarity('Horde')

export const getHordeLocationsForPokemon = (id) => getPokemonLocationsByRarity(id, 'Horde')

// Modal-ready list of a Pokemon's horde spots: location info straight from monster.json,
// the parsed time-of-day/season, and the other Pokemon sharing each spot. No percentage or
// group-size (3x/5x) - monster.json has no such fields anywhere.
export const getHordeEncounterDetails = (id) =>
    getHordeLocationsForPokemon(id).map(location => {
        const parsed = parseLocationName(location.location)
        return {
            key: `${location.region_id}-${location.location}`,
            region_name: location.region_name,
            location: location.location,
            name: parsed.name,
            timesOfDay: parsed.timesOfDay,
            season: parsed.season,
            type: location.type,
            min_level: location.min_level,
            max_level: location.max_level,
            others: getOtherPokemonAtLocation(id, location.region_id, location.location),
        }
    })
