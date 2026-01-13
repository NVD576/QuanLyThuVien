package com.nvd.library.services;

import java.time.LocalDate;

public interface EmailService {
    void sendOverdueReminder(String to, String username, String bookTitle, LocalDate dueDate);
}
