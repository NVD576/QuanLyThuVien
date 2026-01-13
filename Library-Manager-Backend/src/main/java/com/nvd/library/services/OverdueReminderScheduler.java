package com.nvd.library.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.nvd.library.pojo.Borrow;
import com.nvd.library.repository.BorrowRepository;

@Service
public class OverdueReminderScheduler {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private EmailService emailService;

    // Chạy lúc 8h sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendOverdueEmails() {
        LocalDate today = LocalDate.now();

        List<Borrow> overdueBorrows = borrowRepository.findByDueDateBeforeAndReturnDateIsNull(today);

        for (Borrow b : overdueBorrows) {
            String email = b.getUser().getEmail();
            String username = b.getUser().getFirstName();
            String bookTitle = b.getPrintBook().getBook().getTitle();
            LocalDate dueDate = b.getDueDate();

            emailService.sendOverdueReminder(email, username, bookTitle, dueDate);
        }

           // String email = "2251012038duc@ou.edu.vn";
           // String username = "Duc";
           // String bookTitle = "Đắc nhân tâm";
           // LocalDate dueDate = today;
           // emailService.sendOverdueReminder(email, username, bookTitle, dueDate);
    }

    // Gọi ngay sau khi app khởi động
   // @PostConstruct
   // public void runAfterStartup() {
   //     sendOverdueEmails();
   // }
}
