package mk.finki.ukim.wp.stocktrackapp.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stock_daily_data")
@IdClass(StockDailyDataId.class)
public class StockDailyData {

    @Id
    private String symbol;

    @Id
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonProperty("1. open")
    private double open;

    @JsonProperty("2. high")
    private double high;

    @JsonProperty("3. low")
    private double low;

    @JsonProperty("4. close")
    private double close;

    @JsonProperty("5. volume")
    private long volume;
}