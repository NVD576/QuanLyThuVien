package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Reader;
import com.nvd.library.repository.ReaderRepository;
import com.nvd.library.services.ReaderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ReaderServiceImpl implements ReaderService {
    @Autowired
    private ReaderRepository readerRepository;
    @Override
    public List<Reader> getAllReaders() {
        return readerRepository.findAll();
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
}
