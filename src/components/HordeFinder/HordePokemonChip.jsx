import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { useTranslations } from '../../context/TranslationsContext'
import * as styles from './hordeFinder.module.css'

// A bare <button>, not the Card atom - Card's Bootstrap padding/border is too heavy
// once many of these are packed per row.
export const HordePokemonChip = ({ pokemon, sprite, onClick }) => {
    const { t } = useTranslations()
    return (
        <button type="button" className={styles.chip} onClick={onClick}>
            {
                sprite
                    ? <GatsbyImage image={sprite.node.childImageSharp.gatsbyImageData} alt={pokemon.name} className={styles.chipImage} />
                    : false
            }
            <span className={styles.chipName}>{t(pokemon.name)}</span>
        </button>
    )
}
