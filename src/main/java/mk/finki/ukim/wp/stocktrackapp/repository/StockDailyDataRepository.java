package mk.finki.ukim.wp.stocktrackapp.repository;

import mk.finki.ukim.wp.stocktrackapp.models.StockDailyData;
import mk.finki.ukim.wp.stocktrackapp.models.StockDailyDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StockDailyDataRepository extends JpaRepository<StockDailyData, StockDailyDataId> {
    List<StockDailyData> findBySymbolOrderByDateAsc(String symbol);


    List<StockDailyData> findBySymbolAndDateBetweenOrderByDateAsc(String symbol, LocalDate startDate, LocalDate endDate);

}
