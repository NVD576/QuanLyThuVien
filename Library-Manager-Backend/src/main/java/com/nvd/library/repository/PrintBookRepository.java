package com.nvd.library.repository;

import com.nvd.library.pojo.Librarian;
import com.nvd.library.pojo.PrintBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintBookRepository extends JpaRepository<PrintBook, Integer> {
    List<PrintBook> findPrintBookByBook_Id(Integer id);
}
