import React, { useMemo } from 'react'
import { Modal } from '../Atoms'
import { useTranslations } from '../../context/TranslationsContext'
import { getPokemon } from '../../utils/pokemon'
import { getHordeEncounterDetails } from '../../utils/location'
import { HordeLocationsTable } from './HordeLocationsTable'

export const HordeDetailModal = ({ pokemonId, onHide }) => {
    const { t } = useTranslations()
    const pokemon = pokemonId ? getPokemon(pokemonId) : null
    const encounters = useMemo(() => pokemonId ? getHordeEncounterDetails(pokemonId) : [], [pokemonId])

    return (
        <Modal show={pokemonId !== null} onHide={onHide} title={pokemon ? t(pokemon.name) : ''}>
            <HordeLocationsTable encounters={encounters} />
        </Modal>
    )
}
