import React, { useMemo, useState } from 'react'
import { useTranslations } from '../../context/TranslationsContext'
import { Typography } from '../Atoms'
import { getHordeEligiblePokemon, getSeasonsForPokemon } from '../../utils/hordeFinder'
import { HordeFinderFilters } from './HordeFinderFilters'
import { HordeTierSection } from './HordeTierSection'
import { HordeDetailModal } from './HordeDetailModal'

export const HordeFinder = ({ sprites }) => {
    const { t } = useTranslations()

    const [season, setSeason] = useState(null)
    const [tier, setTier] = useState(null)
    const [nameSearch, setNameSearch] = useState('')
    const [selectedPokemonId, setSelectedPokemonId] = useState(null)

    const eligiblePokemon = useMemo(() => getHordeEligiblePokemon(), [])

    const filteredPokemon = useMemo(() => {
        const query = nameSearch.trim().toLowerCase()
        return eligiblePokemon.filter(pkmn => {
            if (tier !== null && pkmn.tier !== tier) return false
            if (season && !getSeasonsForPokemon(pkmn.id).includes(season)) return false
            if (query) {
                const matchesRaw = pkmn.name.toLowerCase().includes(query)
                const matchesTranslated = t(pkmn.name).toLowerCase().includes(query)
                if (!matchesRaw && !matchesTranslated) return false
            }
            return true
        })
    }, [eligiblePokemon, tier, season, nameSearch, t])

    const grouped = useMemo(() => {
        const byTier = {}
        filteredPokemon.forEach(pkmn => {
            const key = pkmn.tier ?? 'unassigned'
            byTier[key] = byTier[key] || []
            byTier[key].push(pkmn)
        })
        Object.values(byTier).forEach(list => list.sort((a, b) => a.name.localeCompare(b.name)))
        return byTier
    }, [filteredPokemon])

    const tierKeys = useMemo(() => {
        const numericTiers = Object.keys(grouped)
            .filter(key => key !== 'unassigned')
            .map(Number)
            .sort((a, b) => a - b)
        return grouped.unassigned ? [...numericTiers, 'unassigned'] : numericTiers
    }, [grouped])

    const handleClear = () => {
        setSeason(null)
        setTier(null)
        setNameSearch('')
    }

    return (
        <div>
            <HordeFinderFilters
                season={season}
                tier={tier}
                nameSearch={nameSearch}
                onSeasonChange={setSeason}
                onTierChange={setTier}
                onNameSearchChange={setNameSearch}
                onClear={handleClear}
            />
            {
                filteredPokemon.length
                    ? tierKeys.map(tierKey => (
                        <HordeTierSection
                            key={tierKey}
                            tier={tierKey}
                            pokemonList={grouped[tierKey]}
                            sprites={sprites}
                            onSelect={setSelectedPokemonId}
                        />
                    ))
                    : <Typography className="text-muted">{t('No Pokemon match your search criteria')}</Typography>
            }
            <HordeDetailModal pokemonId={selectedPokemonId} onHide={() => setSelectedPokemonId(null)} />
        </div>
    )
}
