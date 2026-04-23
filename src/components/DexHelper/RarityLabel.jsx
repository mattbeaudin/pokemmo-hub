import React from 'react';
import { RARITY_BADGE } from './constants';
import * as styles from './RarityLabel.module.css';

export const RarityLabel = ({ rarity }) => {
    const badge = RARITY_BADGE[rarity];
    if (!badge) {
        return <span className={styles.fallback}>{rarity}</span>;
    }
    return (
        <span className={styles.badge} style={{ color: badge.bg, borderColor: badge.bg }}>
            {rarity}
        </span>
    );
};
