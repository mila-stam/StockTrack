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
@CrossOrigin(origins = "http://localhost:8080") // Дозволи CORS за твојата фронтенд апликација
public class StockDataController {

    private final StockDataServiceImpl stockDataService;

    public StockDataController(StockDataServiceImpl stockDataService) {
        this.stockDataService = stockDataService;
    }

    /**
     * REST ендпоинт за добивање дневни историски податоци за даден симбол.
     * @param symbol Симбол на акцијата.
     * @return ResponseEntity со листа од StockDailyData објекти или 404 ако нема податоци.
     */
    @GetMapping("/daily/{symbol}")
    public ResponseEntity<List<StockDailyData>> getDailyStockData(@PathVariable String symbol) {
        List<StockDailyData> data = stockDataService.getDailyStockData(symbol);
        if (data.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }

    /**
     * REST ендпоинт за добивање "најнови" податоци за акција (од последниот завршен трговски ден).
     * @param symbol Симбол на акцијата.
     * @return ResponseEntity со StockCurrentData објект или 404 ако нема податоци.
     */
    @GetMapping("/current/{symbol}")
    public ResponseEntity<StockCurrentData> getLatestStockPrice(@PathVariable String symbol) {
        // Повикуваме го методот кој ги користи дневните податоци
        StockCurrentData data = stockDataService.getLatestDailyStockDataAsCurrent(symbol);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }
}