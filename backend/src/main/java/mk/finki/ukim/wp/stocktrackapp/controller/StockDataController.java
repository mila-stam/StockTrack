package mk.finki.ukim.wp.stocktrackapp.controller;

import mk.finki.ukim.wp.stocktrackapp.models.StockCurrentData;
import mk.finki.ukim.wp.stocktrackapp.models.StockDailyData;
import mk.finki.ukim.wp.stocktrackapp.service.impl.StockDataServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
//@CrossOrigin(origins = "http://localhost:8080")

@CrossOrigin(origins = "http://localhost:3000")
public class StockDataController {

    private final StockDataServiceImpl stockDataService;

    public StockDataController(StockDataServiceImpl stockDataService) {
        this.stockDataService = stockDataService;
    }


    @GetMapping("/daily/{symbol}")
    public ResponseEntity<List<StockDailyData>> getDailyStockData(@PathVariable String symbol) {
        List<StockDailyData> data = stockDataService.getDailyStockData(symbol);
        if (data.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }


    @GetMapping("/current/{symbol}")
    public ResponseEntity<StockCurrentData> getLatestStockPrice(@PathVariable String symbol) {

        StockCurrentData data = stockDataService.getLatestDailyStockDataAsCurrent(symbol);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }
}