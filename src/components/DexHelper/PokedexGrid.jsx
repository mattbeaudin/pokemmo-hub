import { GatsbyImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { useTranslations } from '../../context/TranslationsContext';
import { POKEMON } from '../../utils/pokemon';
import * as styles from './PokedexGrid.module.css';

export const PokedexGrid = ({ caught, onToggleCaught, getSprite, hiddenIds, onToggleHidden }) => {
    const { t } = useTranslations();
    const [showHidden, setShowHidden] = useState(false);
    const [nameFilter, setNameFilter] = useState('');

    const visiblePokemon = POKEMON.filter(p => {
        if (!showHidden && hiddenIds.includes(p.id)) return false;
        if (nameFilter) {
            const q = nameFilter.toLowerCase();
            return p.name.toLowerCase().includes(q) || String(p.id).includes(q);
        }
        return true;
    });

    return (
        <div>
            <Stack direction="horizontal" gap={2} className="mb-3 flex-wrap align-items-center">
                <Form.Control
                    placeholder={t('Search by name or #...')}
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                    style={{ flex: '1 1 180px', minWidth: 140 }}
                />
                <Form.Check
                    type="checkbox"
                    id="show-hidden"
                    label={`${t('Show hidden')} (${hiddenIds.length})`}
                    checked={showHidden}
                    onChange={e => setShowHidden(e.target.checked)}
                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                />
            </Stack>
            <div className={styles.grid}>
                {visiblePokemon.map(pkmn => {
                    const isCaught = caught.includes(pkmn.id);
                    const isHidden = hiddenIds.includes(pkmn.id);
                    const sprite = getSprite(pkmn.id);
                    const cellClass = [
                        styles.cell,
                        isCaught ? styles.cellCaught : styles.cellUncaught,
                        isHidden ? styles.cellHidden : '',
                    ].filter(Boolean).join(' ');
                    return (
                        <div
                            key={pkmn.id}
                            className={cellClass}
                            onClick={() => onToggleCaught(pkmn.id)}
                            onContextMenu={e => { e.preventDefault(); onToggleHidden(pkmn.id); }}
                            title={`#${pkmn.id} ${pkmn.name}${isHidden ? ` (${t('hidden')})` : ''}`}
                        >
                            {sprite
                                ? <GatsbyImage
                                    image={sprite.node.childImageSharp.gatsbyImageData}
                                    alt={pkmn.name}
                                    style={{ width: '100%', aspectRatio: '1 / 1' }}
                                />
                                : <div className={styles.spritePlaceholder} />
                            }
                            <div className={styles.cellLabel}>
                                <span className={styles.cellId}>#{pkmn.id}</span>
                                <span className={styles.cellName}>{pkmn.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
