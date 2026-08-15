import React from 'react'
import { Table } from '../Atoms'
import { useTranslations } from '../../context/TranslationsContext'

export const HordeLocationsTable = ({ encounters }) => {
    const { t } = useTranslations()

    if (!encounters.length) {
        return <p className="text-muted">{t('No known horde locations yet.')}</p>
    }

    return (
        <Table responsive hover size="sm">
            <thead>
                <tr>
                    <th>{t('Location')}</th>
                    <th>{t('Region')}</th>
                    <th>{t('Type')}</th>
                    <th>{t('Level')}</th>
                    <th>{t('Season')}</th>
                    <th>{t('Time of Day')}</th>
                </tr>
            </thead>
            <tbody>
                {
                    encounters.map(encounter => {
                        const level = encounter.min_level === encounter.max_level
                            ? encounter.min_level
                            : `${encounter.min_level} - ${encounter.max_level}`
                        return (
                            <React.Fragment key={encounter.key}>
                                <tr>
                                    <td className="text-capitalize">{t(encounter.name)}</td>
                                    <td className="text-capitalize">{t(encounter.region_name)}</td>
                                    <td className="text-capitalize">{t(encounter.type)}</td>
                                    <td>{level}</td>
                                    <td>{encounter.season ? t(encounter.season) : '—'}</td>
                                    <td>{encounter.timesOfDay.length ? encounter.timesOfDay.map(time => t(time)).join(', ') : '—'}</td>
                                </tr>
                                {
                                    encounter.others.length > 0
                                        ? <tr>
                                            <td colSpan={6} className="text-muted small">
                                                {t('Also in this horde:')} {encounter.others.map(other => t(other.name)).join(', ')}
                                            </td>
                                        </tr>
                                        : false
                                }
                            </React.Fragment>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}
