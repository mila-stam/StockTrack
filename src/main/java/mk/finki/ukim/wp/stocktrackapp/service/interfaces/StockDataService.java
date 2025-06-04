package mk.finki.ukim.wp.stocktrackapp.service.interfaces;

import mk.finki.ukim.wp.stocktrackapp.models.StockCurrentData;
import mk.finki.ukim.wp.stocktrackapp.models.StockDailyData;

import java.util.List;

public interface StockDataService {
    List<StockDailyData> getDailyStockData(String symbol);
    StockCurrentData getLatestDailyStockDataAsCurrent(String symbol);

}
