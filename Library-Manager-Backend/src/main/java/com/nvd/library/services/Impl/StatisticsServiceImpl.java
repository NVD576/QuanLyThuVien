package com.nvd.library.services.Impl;

import com.nvd.library.dto.StatisticsDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.repository.BookRepository;
import com.nvd.library.repository.BorrowRepository;
import com.nvd.library.repository.FineRepository;
import com.nvd.library.repository.UserRepository;
import com.nvd.library.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BorrowRepository borrowRepository;
    @Autowired
    private FineRepository fineRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public StatisticsDTO getLibraryStatistics() {
        StatisticsDTO stats = new StatisticsDTO();
        stats.setTotalBooks(bookRepository.countByIsActiveTrue());
        stats.setTotalCopies(bookRepository.sumTotalCopies());
        stats.setAvailableCopies(bookRepository.sumAvailableCopies());
        stats.setBorrowedBooks(borrowRepository.countByStatus("Borrowed"));
        stats.setOverdueBooks(borrowRepository.countOverdueBorrows());
        stats.setTotalFines(fineRepository.sumPendingFines());
        stats.setTotalFinesReturned(fineRepository.sumPaidFines());
        stats.setTotalReaders(userRepository.countByRole("Reader"));
        stats.setTotalLibrarians(userRepository.countByRole("Librarian"));
        return stats;
    }

    /**
     * Thống kê với filter theo khoảng ngày
     * @param startDate ngày bắt đầu (bao gồm)
     * @param endDate ngày kết thúc (bao gồm)
     */
    @Override
    public StatisticsDTO getStatisticsByDateRange(LocalDate startDate, LocalDate endDate) {
        StatisticsDTO stats = new StatisticsDTO();

        // Sách
        stats.setTotalBooks(bookRepository.countByIsActiveTrue());
        stats.setTotalCopies(bookRepository.sumTotalCopies());
        stats.setAvailableCopies(bookRepository.sumAvailableCopies());

        // Borrows
        stats.setBorrowedBooks(borrowRepository.countByStatusAndDateRange("Borrowed", startDate, endDate));
        stats.setOverdueBooks(borrowRepository.countOverdueByDateRange(startDate, endDate));

        // Fines
        stats.setTotalFines(fineRepository.sumPendingFinesByDateRange(startDate, endDate));
        stats.setTotalFinesReturned(fineRepository.sumPaidFinesByDateRange(startDate, endDate));

        // Users
        stats.setTotalReaders(userRepository.countByRole("Reader"));
        stats.setTotalLibrarians(userRepository.countByRole("Librarian"));

        return stats;
    }

    @Override
    public List<TopBookDTO> getTop5MostBorrowedBooks() {
        List<Object[]> results = borrowRepository.findTopMostBorrowedBooks();
        return results.stream()
                .map(obj -> new TopBookDTO(
                        ((Book) obj[0]).getTitle(),
                        ((Long) obj[1]).intValue()))
                .limit(5)
                .collect(Collectors.toList());
    }
    public static class TopBookDTO {
        private String title;
        private int borrowCount;

        public TopBookDTO(String title, int borrowCount) {
            this.title = title;
            this.borrowCount = borrowCount;
        }

        public String getTitle() { return title; }
        public int getBorrowCount() { return borrowCount; }
    }
}
