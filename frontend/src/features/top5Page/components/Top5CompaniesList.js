import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Top5CompaniesList.module.css';

function Top5CompaniesList() {
    const navigate = useNavigate();
    const topCompanies = [
        { id: 1, name: 'Apple Inc.', ticker: 'AAPL', marketCap: '$3.2 Trillion' },
        { id: 2, name: 'Microsoft Corp.', ticker: 'MSFT', marketCap: '$3.1 Trillion' },
        { id: 3, name: 'NVIDIA Corp.', ticker: 'NVDA', marketCap: '$2.9 Trillion' },
        { id: 4, name: 'Alphabet Inc. (GOOGL)', ticker: 'GOOGL', marketCap: '$2.2 Trillion' },
        { id: 5, name: 'Amazon.com Inc.', ticker: 'AMZN', marketCap: '$1.9 Trillion' },
    ];

    const handleCompanyClick = (ticker) => {
        navigate(`/graph?symbol=${ticker}`);
    };

    return (
        <section className={styles.companiesSection}>
            <h2 className={styles.sectionTitle}>Top 5 Global Companies</h2>
            <ul className={styles.companyList}>
                {topCompanies.map(company => (
                    <li
                        key={company.id}
                        className={styles.companyItem}
                        onClick={() => handleCompanyClick(company.ticker)}
                        tabIndex="0"
                        role="button"
                        aria-label={`View graph for ${company.name} (${company.ticker})`}
                    >
                        <div className={styles.companyInfo}>
                            <span className={styles.companyName}>{company.name}</span>
                            <span className={styles.companyTicker}>{company.ticker}</span>
                        </div>
                        <span className={styles.companyMarketCap}>{company.marketCap}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Top5CompaniesList;
