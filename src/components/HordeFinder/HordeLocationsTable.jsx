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
                    <th>{t('Chance')}</th>
                    <th>{t('Season')}</th>
                    <th>{t('Time of Day')}</th>
                    <th>{t('Group Size')}</th>
                </tr>
            </thead>
            <tbody>
                {
                    encounters.map(encounter => (
                        <React.Fragment key={encounter.key}>
                            <tr>
                                <td className="text-capitalize">{t(encounter.location)}</td>
                                <td className="text-capitalize">{t(encounter.region_name)}</td>
                                <td>{encounter.percentage !== null ? `${encounter.percentage}%` : '—'}</td>
                                <td>{encounter.season ? t(encounter.season) : '—'}</td>
                                <td>{encounter.time_of_day ? t(encounter.time_of_day) : '—'}</td>
                                <td>{encounter.group_size ? `${encounter.group_size}x` : '—'}</td>
                            </tr>
                            {
                                encounter.others.length > 0 && (encounter.percentage === null || encounter.percentage < 100)
                                    ? <tr>
                                        <td colSpan={6} className="text-muted small">
                                            {t('Also in this horde:')} {encounter.others.map(other => `${t(other.name)} (${other.percentage !== null ? `${other.percentage}%` : '?'})`).join(', ')}
                                        </td>
                                    </tr>
                                    : false
                            }
                        </React.Fragment>
                    ))
                }
            </tbody>
        </Table>
    )
}
