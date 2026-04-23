import React, { useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import { useTranslations } from '../../context/TranslationsContext';
import { Button, Card } from '../Atoms';
import { REGION_COLOR, toTitleCase } from './constants';
import { PokemonRow } from './PokemonRow';
import * as styles from './LocationCard.module.css';

export const LocationCard = ({ loc, caught, onCatchAll, onClearAll, onToggleCaught, getSprite, isOpen, onToggleOpen, nameFilter, hideCaught }) => {
    const { t } = useTranslations();
    const total = loc.pokemon.length;
    const caughtHere = loc.pokemon.filter(e => caught.includes(e.pkmn.id)).length;
    const complete = caughtHere === total;

    const visiblePokemon = useMemo(() => {
        const searchLower = nameFilter.toLowerCase();
        const locationNameMatches = !nameFilter || loc.location.toLowerCase().includes(searchLower);
        let list = loc.pokemon;
        if (nameFilter && !locationNameMatches) {
            list = list.filter(e => e.pkmn.name.toLowerCase().includes(searchLower));
        }
        if (hideCaught) {
            list = list.filter(e => !caught.includes(e.pkmn.id));
        }
        return list;
    }, [loc, caught, nameFilter, hideCaught]);

    return (
        <Card className="mb-2" bodyClassName="p-0">
            <button className={styles.header} onClick={onToggleOpen}>
                <div className={styles.headerInner}>
                    <span className={styles.chevron}>{isOpen ? '▼' : '▶︎'}</span>
                    <span className={styles.locationName}>{toTitleCase(loc.location)}</span>
                    <span className={styles.regionTag} style={{ color: REGION_COLOR[loc.region] ?? '#888' }}>
                        {loc.region.toUpperCase()}
                    </span>
                    {complete ? (
                        <span className={styles.countComplete}>{total} / {total}</span>
                    ) : (
                        <span className={styles.countPartial}>
                            <strong>{total - caughtHere}</strong>
                            <span className={styles.countMuted}> / {total}</span>
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className={styles.body}>
                    <div className={styles.bodyHeader}>
                        <Stack direction="horizontal" gap={2}>
                            <Button size="sm" variant="outline-success" onClick={() => onCatchAll(loc.pokemon.map(e => e.pkmn.id))}>
                                {t('Catch all')}
                            </Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => onClearAll(loc.pokemon.map(e => e.pkmn.id))}>
                                {t('Clear all')}
                            </Button>
                        </Stack>
                        <span className={styles.caughtSummary}>
                            {caughtHere} / {total} {t('caught')}
                        </span>
                    </div>

                    {visiblePokemon.map(({ pkmn, encounters, timeOfDay }) => (
                        <PokemonRow
                            key={pkmn.id}
                            pkmn={pkmn}
                            encounters={encounters}
                            isCaught={caught.includes(pkmn.id)}
                            onToggle={() => onToggleCaught(pkmn.id)}
                            sprite={getSprite(pkmn.id)}
                            timeOfDay={timeOfDay}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};
