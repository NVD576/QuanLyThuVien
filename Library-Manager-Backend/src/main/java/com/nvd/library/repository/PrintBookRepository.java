package com.nvd.library.repository;

import com.nvd.library.pojo.Librarian;
import com.nvd.library.pojo.PrintBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintBookRepository extends JpaRepository<PrintBook, Integer> {
    List<PrintBook> findPrintBookByBook_Id(Integer id);

    Page<PrintBook> findByBookId(Long bookId, Pageable pageable);

    Page<PrintBook> findByBookTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<PrintBook> findByBookIdAndBookTitleContainingIgnoreCase(Long bookId, String title, Pageable pageable);

}
