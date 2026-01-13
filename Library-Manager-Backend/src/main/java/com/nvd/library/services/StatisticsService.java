package com.nvd.library.services;

import com.nvd.library.dto.StatisticsDTO;
import com.nvd.library.services.Impl.StatisticsServiceImpl;

import java.time.LocalDate;
import java.util.List;

public interface StatisticsService {
    StatisticsDTO getLibraryStatistics();
    StatisticsDTO getStatisticsByDateRange(LocalDate startDate, LocalDate endDate);
    List<StatisticsServiceImpl.TopBookDTO> getTop5MostBorrowedBooks();
}
