package com.nvd.library.services;


import com.nvd.library.pojo.Librarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LibrarianService {
    Page<Librarian> getLibrarians(String keyword, Pageable pageable);
    Librarian getLibrarianById(int id);
    Librarian addLibrarian(Librarian librarian);
    Librarian updateLibrarian(Librarian librarian);
    void deleteLibrarianById(int id);


}
