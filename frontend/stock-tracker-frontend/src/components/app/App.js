//
// import React, { useState } from 'react';
// import axios from 'axios';
// import StockChart from '../stockChart/StockChart';
// import './App.css';
//
// function App() {
//   const [symbol, setSymbol] = useState('');
//   const [stockData, setStockData] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//
//   const API_BASE_URL = "http://localhost:8082/api/stock";
//
//   const fetchStockData = async () => {
//     if (!symbol) {
//       setError('Ве молиме внесете симбол.');
//       setStockData([]);
//       return;
//     }
//
//     setLoading(true);
//     setError('');
//     setStockData([]);
//
//
//     try {
//       const response = await axios.get(`${API_BASE_URL}/daily/${symbol}`);
//       if (response.data && response.data.length > 0) {
//         setStockData(response.data);
//       } else {
//         setError("Не се пронајдени податоци за симболот.");
//         setStockData([]);
//       }
//     } catch (err) {
//       console.error("Грешка при преземање на податоците:", err);
//       setError("Настана грешка при поврзување со серверот.");
//       setStockData([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//       <div className="App">
//         <h1>Stock Track App - Chart</h1>
//
//         <div className="input-section">
//           <input
//               type="text"
//               placeholder="Внесете симбол (пр. IBM, MSFT)"
//               value={symbol}
//               onChange={(e) => setSymbol(e.target.value)}
//           />
//           <button onClick={fetchStockData} disabled={loading}>
//             {loading ? 'Вчитувам...' : 'Прикажи график'}
//           </button>
//         </div>
//
//         {error && <p className="error-message">{error}</p>}
//         {loading && <p>Вчитувам податоци...</p>}
//
//         <div className="chart-container">
//           <StockChart data={stockData} symbol={symbol.toUpperCase()} />
//         </div>
//
//         <p style={{marginTop: '20px'}}>
//           <small>Забелешка: Ова е пример за график на затворање цени. D3.js овозможува многу покомплексни визуелизации (свеќници, волумен итн.)</small>
//         </p>
//       </div>
//   );
// }
//
// export default App;


// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import StockChart from '../stockChart/StockChart';
import './App.css'; // Додај го App.css

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockDailyData, setStockDailyData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [indicator, setIndicator] = useState('RSI'); // Стандардно RSI
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(''); // За чување на прикажаниот симбол

  const handleFetchDailyData = async () => {
    if (!symbol) {
      setError('Ве молиме внесете симбол на акција.');
      setStockDailyData([]);
      return;
    }
    setLoading(true);
    setError(null);
    setStockDailyData([]);
    setSelectedStockSymbol(symbol.toUpperCase());

    try {
      // Повикај го твојот Spring Boot API за дневни податоци
      // Овој ендпоинт сега треба да ги врати податоците со пресметан RSI
      const response = await axios.get(`http://localhost:8082/api/stock/daily/${symbol}`);
      setStockDailyData(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      // Провери дали е AxiosError и дали има response за подетална порака
      if (axios.isAxiosError(err) && err.response) {
        setError(`Грешка при повлекување податоци: ${err.response.status} - ${err.response.statusText || 'Непозната грешка'}.`);
        console.error('Backend response:', err.response.data);
      } else {
        setError('Грешка при повлекување податоци: Проверете ја мрежната конекција или серверот.');
      }
      setStockDailyData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Stock Track App - Chart Analyzer</h1>
        </header>

        <div className="input-section">
          <input
              type="text"
              placeholder="Внесете симбол (на пр. IBM)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
          />
          <button onClick={handleFetchDailyData} disabled={loading}>
            {loading ? 'Вчитувам...' : 'Прикажи график'}
          </button>
        </div>

        <div className="indicator-selection">
          <label htmlFor="indicator-select">Изберете Индикатор:</label>
          <select
              id="indicator-select"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
          >
            <option value="RSI">Relative Strength Index (RSI)</option>
            <option value="EMA" disabled>Exponential Moving Average (EMA) - наскоро</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading && <p>Вчитувам податоци...</p>}

        {stockDailyData.length > 0 ? (
            <StockChart data={stockDailyData} symbol={selectedStockSymbol} indicator={indicator} />
        ) : (
            !loading && !error && <p className="info-message">Внесете симбол и пребарајте за да видите график.</p>
        )}

        {/* Останатиот дел од твојата апликација може да оди овде (на пр. табели, други компоненти) */}
      </div>
  );
}

export default App;