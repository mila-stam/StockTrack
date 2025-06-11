package mk.finki.ukim.wp.stocktrackapp.service.impl;
import mk.finki.ukim.wp.stocktrackapp.service.interfaces.StockDataService;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mk.finki.ukim.wp.stocktrackapp.models.StockCurrentData;
import mk.finki.ukim.wp.stocktrackapp.models.StockDailyData;
import mk.finki.ukim.wp.stocktrackapp.repository.StockDailyDataRepository;
import mk.finki.ukim.wp.stocktrackapp.service.interfaces.StockDataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class StockDataServiceImpl implements StockDataService {

    @Value("alphavantage.stock.api.key")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final StockDailyDataRepository stockDailyDataRepository;

    public StockDataServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper,
                                StockDailyDataRepository stockDailyDataRepository) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.stockDailyDataRepository = stockDailyDataRepository;
        objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public List<StockDailyData> getDailyStockData(String symbol) {

        List<StockDailyData> cachedData = stockDailyDataRepository.findBySymbolOrderByDateAsc(symbol);
        if (!cachedData.isEmpty()) {
            System.out.println("Returning cached daily data for " + symbol);
            return cachedData;
        }


        String url = String.format("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=%s&outputsize=full&apikey=%s", symbol, apiKey);
        String jsonResponse = restTemplate.getForObject(url, String.class);

        List<StockDailyData> dailyDataList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode timeSeries = root.path("Time Series (Daily)");

            if (timeSeries.isMissingNode() || timeSeries.isEmpty()) {
                System.err.println("Error: No 'Time Series (Daily)' data found for symbol: " + symbol);
                System.err.println("Full response: " + jsonResponse);
                return dailyDataList;
            }


            timeSeries.fields().forEachRemaining(entry -> {
                String dateStr = entry.getKey();
                JsonNode dayDataNode = entry.getValue();

                try {
                    LocalDate date = LocalDate.parse(dateStr);
                    StockDailyData dataPoint = new StockDailyData(
                            symbol,
                            date,
                            dayDataNode.path("1. open").asDouble(),
                            dayDataNode.path("2. high").asDouble(),
                            dayDataNode.path("3. low").asDouble(),
                            dayDataNode.path("4. close").asDouble(),
                            dayDataNode.path("5. volume").asLong()
                    );
                    dailyDataList.add(dataPoint);
                } catch (DateTimeParseException e) {
                    System.err.println("Error parsing date: " + dateStr + " - " + e.getMessage());
                }
            });

            dailyDataList.sort(Comparator.comparing(StockDailyData::getDate));

            stockDailyDataRepository.saveAll(dailyDataList);
            System.out.println("Saved " + dailyDataList.size() + " daily data points to DB for " + symbol);

        } catch (IOException e) {
            System.err.println("Error parsing JSON response for daily data: " + e.getMessage());
            e.printStackTrace();
        }
        return dailyDataList;
    }

    @Override
    public StockCurrentData getLatestDailyStockDataAsCurrent(String symbol) {

        List<StockDailyData> dailyData = getDailyStockData(symbol);

        if (dailyData == null || dailyData.isEmpty()) {
            System.err.println("No daily data found for symbol: " + symbol + " to extract latest.");
            return null;
        }


        StockDailyData latestData = dailyData.get(dailyData.size() - 1);


        StockCurrentData currentData = new StockCurrentData();
        currentData.setSymbol(symbol);
        currentData.setOpen(latestData.getOpen());
        currentData.setHigh(latestData.getHigh());
        currentData.setLow(latestData.getLow());
        currentData.setPrice(latestData.getClose());
        currentData.setVolume(latestData.getVolume());
        currentData.setLatestTradingDay(latestData.getDate().toString());


        if (dailyData.size() >= 2) {
            StockDailyData previousDayData = dailyData.get(dailyData.size() - 2);
            currentData.setPreviousClose(previousDayData.getClose());
            double change = latestData.getClose() - previousDayData.getClose();
            currentData.setChange(change);
            if (previousDayData.getClose() != 0) {
                double changePercent = (change / previousDayData.getClose()) * 100;
                currentData.setChangePercent(String.format("%.2f%%", changePercent));
            } else {
                currentData.setChangePercent("N/A");
            }
        } else {
            currentData.setPreviousClose(0.0);
            currentData.setChange(0.0);
            currentData.setChangePercent("N/A");
        }

        return currentData;
    }
}