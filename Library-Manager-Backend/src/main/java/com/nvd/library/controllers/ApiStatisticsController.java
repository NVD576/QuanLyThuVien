package com.nvd.library.controllers;

import com.nvd.library.dto.StatisticsDTO;
import com.nvd.library.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/statistics")
public class ApiStatisticsController {
    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<StatisticsDTO> getStatistics() {
        return ResponseEntity.ok(statisticsService.getLibraryStatistics());
    }
    @GetMapping("/range")
    public ResponseEntity<?> getStatisticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        try {
            // Kiểm tra startDate <= endDate
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().body("startDate phải nhỏ hơn hoặc bằng endDate");
            }

            StatisticsDTO stats = statisticsService.getStatisticsByDateRange(startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi lấy dữ liệu thống kê");
        }
    }

    @GetMapping("/top5-books")
    public ResponseEntity<?> getTop5Books() {
        try {
            return ResponseEntity.ok(statisticsService.getTop5MostBorrowedBooks());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi lấy top 5 sách mượn nhiều nhất");
        }
    }

}
