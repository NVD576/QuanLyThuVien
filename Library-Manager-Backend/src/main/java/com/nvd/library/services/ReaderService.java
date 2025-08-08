package com.nvd.library.services;

import com.nvd.library.pojo.Reader;

import java.util.List;


public interface ReaderService {
    List<Reader> getAllReaders();
    void addReader(Reader reader);
    Reader updateReader(Reader reader);
    Reader getReaderById(int id);
    void deleteReaderById(int id);

}
