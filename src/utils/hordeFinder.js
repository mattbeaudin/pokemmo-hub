import shinyTiers from '../data/pokemmo/shiny-tiers.json'
import hordeDetails from '../data/pokemmo/horde-details.json'
import { POKEMON, getPokemon } from './pokemon'

// Tier label + point value are properties of the tier itself, not of a Pokemon,
// so they're kept here in code rather than duplicated on every shiny-tiers.json row.
export const SHINY_TIER_LABELS = {
    0: 'Tier 0',
    1: 'Tier 1',
    2: 'Tier 2',
    3: 'Tier 3',
}

export const SHINY_TIER_POINTS = {
    0: 50,
    1: 40,
    2: 30,
    3: 20,
}

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter']

export const TIME_OF_DAY = ['Morning', 'Day', 'Night']

// A Pokemon is horde-eligible if monster.json lists at least one Horde-rarity
// location for it. monster.json is the source of truth for this - not horde-details.json,
// which only carries the extra fields (percentage/season/time/group size) monster.json lacks.
export const getHordeLocationsForPokemon = (id) => {
    const pkmn = getPokemon(id)
    if (!pkmn) return []
    return (pkmn.locations || []).filter(location => location.rarity === 'Horde')
}

export const getShinyTier = (id) => shinyTiers.find(entry => entry.id === id)

export const getHordeDetail = (pokemonId, regionId, location) =>
    hordeDetails.find(detail =>
        detail.pokemon_id === pokemonId &&
        detail.region_id === regionId &&
        detail.location === location
    ) || null

// Other Pokemon sharing the same horde spot, derived live from monster.json rather than
// stored redundantly in horde-details.json.
export const getOtherPokemonAtHordeLocation = (pokemonId, regionId, location) => {
    return POKEMON
        .filter(pkmn => pkmn.id !== pokemonId)
        .filter(pkmn => (pkmn.locations || []).some(l =>
            l.rarity === 'Horde' && l.region_id === regionId && l.location === location
        ))
        .map(pkmn => {
            const detail = getHordeDetail(pkmn.id, regionId, location)
            return { id: pkmn.id, name: pkmn.name, percentage: detail?.percentage ?? null }
        })
}

// Full, modal-ready list of a Pokemon's horde spots: base location info from monster.json,
// merged with whatever enrichment data (percentage/season/time/group size) exists so far,
// plus the other Pokemon sharing each spot.
export const getHordeEncounterDetails = (id) => {
    return getHordeLocationsForPokemon(id).map(location => {
        const detail = getHordeDetail(id, location.region_id, location.location)
        return {
            key: `${location.region_id}-${location.location}`,
            region_name: location.region_name,
            location: location.location,
            percentage: detail?.percentage ?? null,
            season: detail?.season ?? null,
            time_of_day: detail?.time_of_day ?? null,
            group_size: detail?.group_size ?? null,
            others: getOtherPokemonAtHordeLocation(id, location.region_id, location.location),
        }
    })
}

export const getHordeEligiblePokemonIds = () => {
    return new Set(
        POKEMON
            .filter(pkmn => getHordeLocationsForPokemon(pkmn.id).length > 0)
            .map(pkmn => pkmn.id)
    )
}

export const getHordeEligiblePokemon = () => {
    return [...getHordeEligiblePokemonIds()].map(id => {
        const pkmn = getPokemon(id)
        const tierInfo = getShinyTier(id)
        return {
            id: pkmn.id,
            name: pkmn.name,
            tier: tierInfo?.tier ?? null,
        }
    })
}

export const getSeasonsForPokemon = (id) => {
    return [...new Set(
        getHordeEncounterDetails(id)
            .map(encounter => encounter.season)
            .filter(Boolean)
    )]
}

export const getAllSeasonsInUse = () => {
    return [...new Set(hordeDetails.map(detail => detail.season).filter(Boolean))]
}
