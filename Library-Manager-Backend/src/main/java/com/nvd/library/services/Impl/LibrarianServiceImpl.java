package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Librarian;
import com.nvd.library.repository.LibrarianRepository;
import com.nvd.library.services.LibrarianService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibrarianServiceImpl implements LibrarianService {
    @Autowired
    private LibrarianRepository librarianRepository;

    public Page<Librarian> getLibrarians(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return librarianRepository.findAll(pageable);
        }
        return librarianRepository.searchByKeyword(keyword, pageable);
    }
    @Override
    public Librarian getLibrarianById(int id) {
        return librarianRepository.findById(id).orElse(null) ;
    }

    @Override
    @Transactional
    public Librarian addLibrarian(Librarian librarian) {
        return this.librarianRepository.save(librarian);
    }

    @Override
    @Transactional
    public Librarian updateLibrarian(Librarian librarian) {
        return this.librarianRepository.save(librarian);
    }

    @Override
    @Transactional
    public void deleteLibrarianById(int id) {
        this.librarianRepository.deleteById(id);
    }
}
