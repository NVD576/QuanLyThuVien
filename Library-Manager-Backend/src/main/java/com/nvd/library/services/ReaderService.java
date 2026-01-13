package com.nvd.library.services;

import com.nvd.library.dto.UpgradeRequestDTO;
import com.nvd.library.pojo.Reader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ReaderService {
    Page<Reader> getReaders(String keyword, Pageable pageable);
    void addReader(Reader reader);
    Reader updateReader(Reader reader);
    Reader getReaderById(int id);
    void deleteReaderById(int id);
    void upgradeMembershipWithPayment(UpgradeRequestDTO request);
}
