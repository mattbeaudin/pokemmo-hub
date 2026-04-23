import { GatsbyImage } from 'gatsby-plugin-image';
import React from 'react';
import { Form } from 'react-bootstrap';
import { RarityLabel } from './RarityLabel';
import * as styles from './PokemonRow.module.css';

export const PokemonRow = ({ pkmn, encounters, isCaught, onToggle, sprite, timeOfDay }) => {
    const enc = encounters[0];
    const lvl = enc.min_level === enc.max_level
        ? `Lv.${enc.min_level}`
        : `Lv.${enc.min_level}–${enc.max_level}`;

    return (
        <div className={`${styles.row}${isCaught ? ` ${styles.caught}` : ''}`} onClick={onToggle}>
            <Form.Check
                type="checkbox"
                checked={isCaught}
                onChange={onToggle}
                onClick={e => e.stopPropagation()}
                style={{ flexShrink: 0 }}
            />
            <div className={styles.sprite}>
                {sprite && (
                    <GatsbyImage
                        image={sprite.node.childImageSharp.gatsbyImageData}
                        alt={pkmn.name}
                        className={isCaught ? styles.spriteCaught : undefined}
                        style={{ width: 36, height: 36 }}
                    />
                )}
            </div>
            <span className={`${styles.name}${isCaught ? ` ${styles.nameCaught}` : ''}`}>
                <span className={styles.id}>#{pkmn.id}</span>
                {pkmn.name}
            </span>
            <div className={styles.meta}>
                {timeOfDay && <span className={styles.timeOfDay}>{timeOfDay}</span>}
                <RarityLabel rarity={enc.rarity} />
                <span className={styles.metaText}>{enc.type}</span>
                <span className={styles.metaText}>{lvl}</span>
            </div>
        </div>
    );
};
