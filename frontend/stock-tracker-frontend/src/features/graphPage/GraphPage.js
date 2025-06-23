// src/features/graphPage/GraphPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import StockChart from './components/StockChart';
import StockSearchForm from './components/StockSearchForm';
import styles from './GraphPage.module.css';

function GraphPage({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const initialSymbolFromUrl = new URLSearchParams(location.search).get('symbol');
    const [stockSymbol, setStockSymbol] = useState(initialSymbolFromUrl || 'AAPL');
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockData = async (symbol) => {
        setLoading(true);
        setError(null);
        setStockData([]);
        console.log(`Frontend: Fetching data for symbol: ${symbol}`);

        try {
            const response = await fetch(`http://localhost:8082/api/stock/daily/${symbol}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setError("Authentication required to view stock data. Please log in.");
                } else if (response.status === 404) {
                    setError(`No historical data found for symbol: ${symbol}.`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                if (data.length === 0) {
                    setError(`No data available for ${symbol}. Please try another symbol.`);
                }
                setStockData(data);
            }
        } catch (e) {
            console.error("Frontend: Error fetching stock data:", e);
            setError(`Failed to fetch stock data for ${symbol}. Please ensure the backend is running and you are logged in.`);
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
        } else if (!newSymbolFromUrl && stockSymbol !== 'AAPL') {
            setStockSymbol('AAPL');
        }
    }, [location.search]);

    const handleSeePredictionsClick = () => {
        navigate('/predictions');
    };

    return (
        <div className={styles.graphPageContainer}>
            <AppHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Stock Price & Volume Chart</h1>
                <p className={styles.pageDescription}>Enter a stock symbol to view its historical data.</p>

                <StockSearchForm onSearch={setStockSymbol} initialSymbol={stockSymbol} />

                {loading && <p className={styles.loadingMessage}>Loading chart data for {stockSymbol}...</p>}
                {error && <p className={`${styles.errorMessage} ${styles.infoMessage}`}>{error}</p>}

                {!loading && !error && stockData.length > 0 && (
                    <div className={styles.chartContainer}>
                        <StockChart data={stockData} symbol={stockSymbol} />
                    </div>
                )}
                {!loading && !error && stockData.length === 0 && stockSymbol && !error && (
                    <p className={styles.infoMessage}>No data available for {stockSymbol} from the API. Try 'AAPL', 'GOOGL', or 'MSFT' (if supported by your backend).</p>
                )}
                {!loading && !error && stockData.length === 0 && !stockSymbol && (
                    <p className={styles.infoMessage}>Enter a symbol to view its chart.</p>
                )}

                {!loading && !error && (stockData.length > 0 || stockSymbol) && (
                    <button
                        onClick={handleSeePredictionsClick}
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
