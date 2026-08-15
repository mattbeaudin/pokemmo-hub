import React, { useMemo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Search, Button, Typography } from '../Atoms'
import { useTranslations } from '../../context/TranslationsContext'
import { SHINY_TIER_LABELS } from '../../utils/hordeFinder'
import { getAllSeasonsInUse } from '../../utils/location'

export const HordeFinderFilters = ({ season, tier, nameSearch, onSeasonChange, onTierChange, onNameSearchChange, onClear }) => {
    const { t } = useTranslations()

    const seasonOptions = useMemo(() => (
        getAllSeasonsInUse().map(s => ({ value: s, label: t(s) }))
    ), [t])

    const tierOptions = useMemo(() => (
        Object.entries(SHINY_TIER_LABELS).map(([tierNumber, label]) => ({ value: Number(tierNumber), label: t(label) }))
    ), [t])

    return (
        <Row className="g-3 align-items-end mb-3">
            <Col sm={6} md={3}>
                <Typography as="label" className="mb-1">{t('Season')}</Typography>
                <Search
                    items={seasonOptions}
                    value={season ? { value: season, label: t(season) } : null}
                    onChange={selected => onSeasonChange(selected ? selected.value : null)}
                    placeholder={t('Season')}
                    hasEmpty
                />
            </Col>
            <Col sm={6} md={3}>
                <Typography as="label" className="mb-1">{t('Shiny Tier')}</Typography>
                <Search
                    items={tierOptions}
                    value={tier !== null ? { value: tier, label: t(SHINY_TIER_LABELS[tier]) } : null}
                    onChange={selected => onTierChange(selected ? selected.value : null)}
                    placeholder={t('Shiny Tier')}
                    hasEmpty
                />
            </Col>
            <Col sm={8} md={4}>
                <Typography as="label" className="mb-1">{t('Pokemon Name')}</Typography>
                <input
                    className="form-control"
                    type="text"
                    value={nameSearch}
                    placeholder={t('Search by name')}
                    onChange={e => onNameSearchChange(e.target.value)}
                />
            </Col>
            <Col sm={4} md={2}>
                <Button variant="outline-danger" onClick={onClear} className="btn-sm">{t('Clear')}</Button>
            </Col>
        </Row>
    )
}
