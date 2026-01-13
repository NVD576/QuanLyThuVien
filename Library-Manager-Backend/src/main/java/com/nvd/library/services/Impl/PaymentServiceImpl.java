package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Payment;
import com.nvd.library.repository.PaymentRepository;
import com.nvd.library.services.PaymentService;
import com.nvd.library.services.ReaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Page<Payment> getPayments(Long userId, LocalDate startDate, LocalDate endDate, String search, int page, int size) {
        return paymentRepository.findByFilters(userId, startDate, endDate,search, PageRequest.of(page, size, Sort.by("id").descending()));
    }

    @Override
    public Payment getPaymentsById(Integer id) {
        return paymentRepository.findById(id).get();
    }

    @Override
    public Payment addPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public void deletePaymentById(Integer id) {
        this.paymentRepository.deleteById(id);
    }
}
