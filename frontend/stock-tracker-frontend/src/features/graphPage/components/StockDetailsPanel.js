import React from 'react';
import styles from './StockDetailsPanel.module.css';

function StockDetailsPanel({ data, symbol }) {
    if (!data) {
        return (
            <aside className={styles.panel}>
                <h3 className={styles.title}>Stock Details</h3>
                <p className={styles.placeholder}>
                    Click on a candlestick to see details.
                </p>
            </aside>
        );
    }

    return (
        <aside className={styles.panel}>
            <h3 className={styles.title}>
                {symbol} — {data.date}
            </h3>

            <div className={styles.row}>
                <span>Open</span>
                <strong>${data.open.toFixed(2)}</strong>
            </div>

            <div className={styles.row}>
                <span>High</span>
                <strong>${data.high.toFixed(2)}</strong>
            </div>

            <div className={styles.row}>
                <span>Low</span>
                <strong>${data.low.toFixed(2)}</strong>
            </div>

            <div className={styles.row}>
                <span>Close</span>
                <strong>${data.close.toFixed(2)}</strong>
            </div>

            <div className={styles.row}>
                <span>Volume</span>
                <strong>{data.volume.toLocaleString()}</strong>
            </div>
        </aside>
    );
}

export default StockDetailsPanel;
