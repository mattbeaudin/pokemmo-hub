import React from 'react'
import { Badge, Typography } from '../Atoms'
import { useTranslations } from '../../context/TranslationsContext'
import { SHINY_TIER_LABELS, SHINY_TIER_POINTS } from '../../utils/hordeFinder'
import { HordePokemonChip } from './HordePokemonChip'
import * as styles from './hordeFinder.module.css'

const findSprite = (sprites, id) => sprites.find(({ node }) => parseInt(node.name) === id)

export const HordeTierSection = ({ tier, pokemonList, sprites, onSelect }) => {
    const { t } = useTranslations()

    if (!pokemonList.length) return false

    const label = tier === 'unassigned' ? 'Unassigned' : (SHINY_TIER_LABELS[tier] ?? `Tier ${tier}`)
    const points = tier === 'unassigned' ? null : SHINY_TIER_POINTS[tier]

    return (
        <section className={styles.tierSection}>
            <div className={styles.tierHeader}>
                <Typography as="h4" className="mb-0">{label}</Typography>
                <Badge>{`${pokemonList.length} ${t('Pokemon')}`}</Badge>
                {points ? <Badge>{`${points} ${t('points')}`}</Badge> : false}
            </div>
            <div className={styles.chipGrid}>
                {
                    pokemonList.map(pkmn => (
                        <HordePokemonChip
                            key={pkmn.id}
                            pokemon={pkmn}
                            sprite={findSprite(sprites, pkmn.id)}
                            onClick={() => onSelect(pkmn.id)}
                        />
                    ))
                }
            </div>
        </section>
    )
}
