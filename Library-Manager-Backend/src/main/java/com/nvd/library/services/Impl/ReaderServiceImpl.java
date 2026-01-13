package com.nvd.library.services.Impl;

import com.nvd.library.dto.UpgradeRequestDTO;
import com.nvd.library.pojo.Payment;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.repository.PaymentRepository;
import com.nvd.library.repository.ReaderRepository;
import com.nvd.library.services.ReaderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
@Service
public class ReaderServiceImpl implements ReaderService {
    @Autowired
    private ReaderRepository readerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Page<Reader> getReaders(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return readerRepository
                    .findByUser_FirstNameContainingIgnoreCaseOrUser_LastNameContainingIgnoreCaseOrUser_EmailContainingIgnoreCaseOrUser_PhoneContainingIgnoreCaseOrUser_AddressContainingIgnoreCase(
                            keyword, keyword, keyword, keyword, keyword, pageable
                    );
        }
        return readerRepository.findAll(pageable);
    }
    @Override
    @Transactional
    public void addReader(Reader reader) {
        this.readerRepository.save(reader);
    }

    @Override
    @Transactional
    public Reader updateReader(Reader reader) {
        return  this.readerRepository.save(reader);
    }

    @Override
    public Reader getReaderById(int id) {
        return  readerRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteReaderById(int id) {
        readerRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void upgradeMembershipWithPayment(UpgradeRequestDTO request) {

        Reader user = readerRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        user.setMembershipLevel(request.getNewLevel());
        readerRepository.save(user);

        Payment payment = new Payment();
        payment.setUser(user.getUser());
        payment.setPaymentType("Membership");
        payment.setAmount(BigDecimal.valueOf(50000));
        payment.setPaymentMethod(request.getPayMethod());
        payment.setPaymentDate(LocalDate.now());
        payment.setNote("Nâng hạng thành viên");
        payment.setStatus("Successful");
        paymentRepository.save(payment);
    }

}
