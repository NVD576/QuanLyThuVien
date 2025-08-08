package com.nvd.library.repository;

import com.nvd.library.pojo.Borrow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository  extends JpaRepository<Borrow, Integer> {
    List<Borrow> findByUserId(Integer userId);
    List<Borrow> findByPrintBookId(Integer bookId);
    List<Borrow> findByUser_IdAndPrintBook_Book_Id(Integer userId, Integer bookId);
    @Query("""
    SELECT b FROM Borrow b
    WHERE LOWER(CONCAT(b.user.firstName, ' ', b.user.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(b.printBook.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))""")
    Page<Borrow> searchByUserOrBook(@Param("keyword") String keyword, Pageable pageable);

}
