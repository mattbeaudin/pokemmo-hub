import shinyTiers from '../data/pokemmo/shiny-tiers.json'
import { getPokemon } from './pokemon'
import { getHordeEligiblePokemonIds } from './location'

// Tier label + point value are properties of the tier itself, not of a Pokemon,
// so they're kept here in code rather than duplicated on every shiny-tiers.json row.
// Matches the live tier/point scheme from https://alpha.pokemmotools.org/shiny-tiers ("Current" tab).
export const SHINY_TIER_LABELS = {
    0: 'Tier 0',
    1: 'Tier 1',
    2: 'Tier 2',
    3: 'Tier 3',
    4: 'Tier 4',
    5: 'Tier 5',
    6: 'Tier 6',
    7: 'Tier 7',
}

export const SHINY_TIER_POINTS = {
    0: 50,
    1: 40,
    2: 30,
    3: 20,
    4: 15,
    5: 10,
    6: 5,
    7: 3,
}

export const getShinyTier = (id) => shinyTiers.find(entry => entry.id === id)

// Which Pokemon/where a horde spot exists lives in utils/location.js (derived from monster.json);
// this just joins that eligibility set with each Pokemon's shiny tier.
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
