// src/features/graphPage/components/StockSearchForm.js
import React, { useState } from 'react';
import styles from './StockSearchForm.module.css';

function StockSearchForm({ onSearch, initialSymbol }) {
    const [symbolInput, setSymbolInput] = useState(initialSymbol || '');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (symbolInput.trim()) {
            onSearch(symbolInput.trim().toUpperCase());
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
                type="text"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className={styles.symbolInput}
                aria-label="Stock Symbol"
            />
            <button type="submit" className={styles.searchButton}>
                Search
            </button>
        </form>
    );
}

export default StockSearchForm;
