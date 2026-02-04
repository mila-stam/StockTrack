// src/features/graphPage/GraphPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import StockChart from './components/StockChart';
import StockSearchForm from './components/StockSearchForm';
import styles from './GraphPage.module.css';
import StockDetailsPanel from './components/StockDetailsPanel';


function GraphPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialSymbolFromUrl = new URLSearchParams(location.search).get('symbol');
    const [stockSymbol, setStockSymbol] = useState(initialSymbolFromUrl || 'AAPL');
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedData, setSelectedData] = useState(null);


    const fetchStockData = async (symbol) => {
        setLoading(true);
        setError(null);
        setStockData([]);

        try {
            const response = await fetch(`http://localhost:8082/api/stock/daily/${symbol}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError(`No historical data found for symbol: ${symbol}.`);
                } else {
                    throw new Error(`HTTP error ${response.status}`);
                }
            } else {
                const data = await response.json();
                if (data.length === 0) {
                    setError(`No data available for ${symbol}.`);
                }
                setStockData(data);
            }
        } catch (e) {
            console.error("Error fetching stock data:", e);
            setError(`Failed to fetch stock data for ${symbol}.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockData(stockSymbol);
    }, [stockSymbol]);

    useEffect(() => {
        const newSymbolFromUrl = new URLSearchParams(location.search).get('symbol');
        if (newSymbolFromUrl && newSymbolFromUrl.toUpperCase() !== stockSymbol.toUpperCase()) {
            setStockSymbol(newSymbolFromUrl.toUpperCase());
        }
    }, [location.search]);

    return (
        <div className={styles.graphPageContainer}>
            <AppHeader />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Stock Price & Volume Chart</h1>
                <p className={styles.pageDescription}>
                    Enter a stock symbol to view its historical data.
                </p>

                <StockSearchForm onSearch={setStockSymbol} initialSymbol={stockSymbol} />

                {loading && <p>Loading data for {stockSymbol}...</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}

                


                {!loading && !error && stockData.length > 0 && (
                    <div className={styles.chartWithPanel}>
    <div className={styles.chartArea}>
        <StockChart
            data={stockData}
            symbol={stockSymbol}
            onDataClick={setSelectedData}
        />
    </div>

    <StockDetailsPanel
        data={selectedData}
        symbol={stockSymbol}
    />
</div>

                )}

                {!loading && !error && stockData.length > 0 && (
                    <button
                        onClick={() => navigate('/predictions')}
                        className={styles.predictionsButton}
                    >
                        See Predictions
                    </button>
                )}
            </main>

            <AppFooter />
        </div>
    );
}

export default GraphPage;
