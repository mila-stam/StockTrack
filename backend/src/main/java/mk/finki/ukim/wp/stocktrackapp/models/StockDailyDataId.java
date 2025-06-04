package mk.finki.ukim.wp.stocktrackapp.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDailyDataId implements Serializable {
    private String symbol;
    private LocalDate date;
}