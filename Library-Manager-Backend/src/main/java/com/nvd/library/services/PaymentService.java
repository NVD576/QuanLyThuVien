package com.nvd.library.services;

import com.nvd.library.pojo.Payment;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface PaymentService {
    Page<Payment> getPayments(Long userId, LocalDate startDate, LocalDate endDate,String search, int page, int size);
    Payment getPaymentsById(Integer id);
    Payment addPayment(Payment payment);
    Payment updatePayment(Payment payment);
    void deletePaymentById(Integer id);
}
