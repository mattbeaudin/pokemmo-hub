import React, { useCallback, useMemo, useState } from 'react';
import { Form, Nav, ProgressBar } from 'react-bootstrap';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { POKEMON } from '../../utils/pokemon';
import { useTranslations } from '../../context/TranslationsContext';
import { Button, Typography } from '../Atoms';
import { REGIONS, SORT_OPTIONS } from './constants';
import { LOCATION_MAP, TOTAL_POKEMON } from './LocationMap';
import { LocationCard } from './LocationCard';
import { PokedexGrid } from './PokedexGrid';
import * as styles from './DexHelper.module.css';

const POKEMON_IDS = new Set(POKEMON.map(p => p.id));

export const DexHelper = ({ sprites }) => {
    const { t } = useTranslations();
    const [caughtIds, setCaughtIds] = useLocalStorage('dex-helper-caught', []);
    const [hiddenIds, setHiddenIds] = useLocalStorage('dex-helper-hidden', []);
    const [nameFilter, setNameFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [hideCompleted, setHideCompleted] = useState(false);
    const [hideCaught, setHideCaught] = useState(true);
    const [sortBy, setSortBy] = useState('uncaught');
    const [openKey, setOpenKey] = useState(null);
    const [activeTab, setActiveTab] = useState('routes');

    const caught = caughtIds ?? [];
    const hidden = hiddenIds ?? [];

    const spriteMap = useMemo(() => {
        const m = new Map();
        sprites?.forEach(s => m.set(s.node.name, s));
        return m;
    }, [sprites]);

    const getSprite = useCallback(id => spriteMap.get(String(id).padStart(3, '0')), [spriteMap]);

    const toggleCaught = useCallback(id => {
        setCaughtIds(prev => {
            const list = prev ?? [];
            return list.includes(id) ? list.filter(i => i !== id) : [...list, id];
        });
    }, [setCaughtIds]);

    const catchAll = useCallback(ids => {
        setCaughtIds(prev => [...new Set([...(prev ?? []), ...ids])]);
    }, [setCaughtIds]);

    const clearAll = useCallback(ids => {
        setCaughtIds(prev => (prev ?? []).filter(id => !ids.includes(id)));
    }, [setCaughtIds]);

    const toggleHidden = useCallback(id => {
        setHiddenIds(prev => {
            const list = prev ?? [];
            return list.includes(id) ? list.filter(i => i !== id) : [...list, id];
        });
    }, [setHiddenIds]);

    const caughtSet = useMemo(() => new Set(caught), [caught]);

    const filteredLocations = useMemo(() => {
        const searchLower = nameFilter.toLowerCase();
        return Object.values(LOCATION_MAP)
            .filter(loc => {
                if (regionFilter && loc.region.toLowerCase() !== regionFilter.toLowerCase()) return false;
                if (nameFilter) {
                    const locMatch = loc.location.toLowerCase().includes(searchLower);
                    const pkmnMatch = loc.pokemon.some(e => e.pkmn.name.toLowerCase().includes(searchLower));
                    if (!locMatch && !pkmnMatch) return false;
                }
                if (hideCompleted && !loc.pokemon.some(e => !caughtSet.has(e.pkmn.id))) return false;
                return true;
            })
            .map(loc => ({
                ...loc,
                uncaughtCount: loc.pokemon.filter(e => !caughtSet.has(e.pkmn.id)).length,
            }))
            .sort((a, b) => {
                if (sortBy === 'alpha') return a.location.localeCompare(b.location);
                return b.uncaughtCount - a.uncaughtCount;
            });
    }, [nameFilter, regionFilter, hideCompleted, sortBy, caughtSet]);

    const caughtCount = useMemo(() => caught.filter(id => POKEMON_IDS.has(id)).length, [caught]);
    const progressPct = Math.round((caughtCount / TOTAL_POKEMON) * 100);

    return (
        <div>
            <div className={styles.progress}>
                <Typography className={styles.progressText}>
                    {caughtCount} / {TOTAL_POKEMON} {t('caught')} ({progressPct}%)
                </Typography>
                <ProgressBar now={progressPct} variant="success" style={{ height: 6 }} />
            </div>

            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Nav.Item>
                    <Nav.Link eventKey="routes">{t('Routes')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="pokedex">{t('Pokédex')}</Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === 'routes' && (
                <>
                    <div className={styles.filters}>
                        <Form.Control
                            className={styles.filterSearch}
                            placeholder={t('Search route or pokemon...')}
                            value={nameFilter}
                            onChange={e => { setNameFilter(e.target.value); setOpenKey(null); }}
                        />
                        <Form.Select
                            value={regionFilter}
                            onChange={e => { setRegionFilter(e.target.value); setOpenKey(null); }}
                            style={{ width: 'auto' }}
                        >
                            <option value="">{t('All')}</option>
                            {REGIONS.map(r => <option key={r} value={r}>{t(r)}</option>)}
                        </Form.Select>
                        <div className={styles.sortGroup}>
                            <span className={styles.sortLabel}>{t('Sort:')}</span>
                            <Form.Select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                            </Form.Select>
                        </div>
                        <Form.Check
                            className={styles.filterCheck}
                            type="checkbox"
                            id="hide-completed"
                            label={t('Hide completed routes')}
                            checked={hideCompleted}
                            onChange={e => setHideCompleted(e.target.checked)}
                        />
                        <Form.Check
                            className={styles.filterCheck}
                            type="checkbox"
                            id="hide-caught"
                            label={t('Hide caught')}
                            checked={hideCaught}
                            onChange={e => setHideCaught(e.target.checked)}
                        />
                    </div>

                    {filteredLocations.map(loc => (
                        <LocationCard
                            key={loc.key}
                            loc={loc}
                            caught={caught}
                            onCatchAll={catchAll}
                            onClearAll={clearAll}
                            onToggleCaught={toggleCaught}
                            getSprite={getSprite}
                            isOpen={openKey === loc.key}
                            onToggleOpen={() => setOpenKey(prev => prev === loc.key ? null : loc.key)}
                            nameFilter={nameFilter}
                            hideCaught={hideCaught}
                        />
                    ))}

                    {filteredLocations.length === 0 && (
                        <p className={styles.empty}>{t('No locations match your search.')}</p>
                    )}
                </>
            )}

            {activeTab === 'pokedex' && (
                <PokedexGrid
                    caught={caught}
                    onToggleCaught={toggleCaught}
                    getSprite={getSprite}
                    hiddenIds={hidden}
                    onToggleHidden={toggleHidden}
                />
            )}

            {caught.length > 0 && (
                <div className={styles.reset}>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                            if (window.confirm(t('Reset all caught Pokemon?'))) {
                                setCaughtIds([]);
                            }
                        }}
                    >
                        {t('Reset progress')}
                    </Button>
                </div>
            )}
        </div>
    );
};
