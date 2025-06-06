
import React, { useState } from 'react';
import axios from 'axios';
import StockChart from '../stockChart/StockChart';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8082/api/stock";

  const fetchStockData = async () => {
    if (!symbol) {
      setError('Ве молиме внесете симбол.');
      setStockData([]);
      return;
    }

    setLoading(true);
    setError('');
    setStockData([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/daily/${symbol.toUpperCase()}`);
      if (response.data && response.data.length > 0) {
        setStockData(response.data);
      } else {
        setError(`Нема пронајдени податоци за симболот: ${symbol}. Проверете го симболот или API лимитот.`);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      if (err.response && err.response.status === 404) {
        setError(`Нема пронајдени податоци за симболот: ${symbol}.`);
      } else {
        setError(`Грешка при повлекување податоци: ${err.message}. Проверете ја конзолата.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
        <h1>Stock Track App - Chart</h1>

        <div className="input-section">
          <input
              type="text"
              placeholder="Внесете симбол (пр. IBM, MSFT)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
          />
          <button onClick={fetchStockData} disabled={loading}>
            {loading ? 'Вчитувам...' : 'Прикажи график'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p>Вчитувам податоци...</p>}

        <div className="chart-container">
          <StockChart data={stockData} symbol={symbol.toUpperCase()} />
        </div>

        <p style={{marginTop: '20px'}}>
          <small>Забелешка: Ова е пример за график на затворање цени. D3.js овозможува многу покомплексни визуелизации (свеќници, волумен итн.)</small>
        </p>
      </div>
  );
}

export default App;