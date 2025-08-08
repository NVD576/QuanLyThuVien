package com.nvd.library.controllers;

import com.nvd.library.dto.BorrowDTO;
import com.nvd.library.pojo.Borrow;
import com.nvd.library.pojo.PrintBook;
import com.nvd.library.pojo.User;
import com.nvd.library.services.BorrowService;
import com.nvd.library.services.PrintBookService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiBorrowController {
    @Autowired
    private BorrowService borrowService;
    @Autowired
    private UserService userService;

    @Autowired
    PrintBookService printBookService;
    @GetMapping("/borrows")
    public ResponseEntity<List<BorrowDTO>> getAllBorrows() {
        List<BorrowDTO> dtos = borrowService.getAllBorrow().stream().map(b -> {
            String userFullName = b.getUser().getFirstName() + " " + b.getUser().getLastName();
            String bookTitle = b.getPrintBook().getBook().getTitle(); // nếu printBook liên kết với Book
            return new BorrowDTO(
                    b.getId(),
                    b.getUser().getId(), // <- thêm userId
                    b.getPrintBook().getId(),
                    userFullName,
                    bookTitle,
                    b.getBorrowDate(),
                    b.getDueDate(),
                    b.getReturnDate(),
                    b.getStatus()
            );
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/borrow/search")
    public ResponseEntity<Page<BorrowDTO>> searchBorrows(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BorrowDTO> result = borrowService.searchBorrows(keyword, pageable);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/borrow/{id}")
    public ResponseEntity<Borrow> getBorrowById(@PathVariable int id){
        return ResponseEntity.ok(this.borrowService.getBorrowById(id));
    }

    @GetMapping("/borrow/{id}/userid")
    public ResponseEntity<List<Borrow>> getAllBorrowByUserId(@PathVariable int id){
        return ResponseEntity.ok(this.borrowService.getBorrowByUserId(id));
    }

    @PostMapping("/borrow/add")
    public ResponseEntity<Borrow> addBorrow(@RequestBody BorrowDTO  borrowDTO) {
        // Đảm bảo bạn lấy user từ DB và gán vào borrow
        Borrow borrow = new Borrow();
        User user =userService.getUserById(borrowDTO.getUserId());
        borrow.setUser(user);
        PrintBook printBook = printBookService.getPrintBookById(borrowDTO.getPrintBookId());
        borrow.setPrintBook(printBook);
        borrow.setDueDate(borrowDTO.getDueDate());
        borrow.setReturnDate(borrowDTO.getReturnDate());
        borrow.setStatus(borrowDTO.getStatus());
        borrow.setBorrowDate(borrowDTO.getBorrowDate());
        return ResponseEntity.ok(this.borrowService.addBorrow(borrow));
    }

    @PatchMapping("/borrow/update")
    public ResponseEntity<Borrow> updateBorrow(@RequestBody BorrowDTO  borrowDTO) {
        // Đảm bảo bạn lấy user từ DB và gán vào borrow
        Borrow borrow = borrowService.getBorrowById(borrowDTO.getId());
        User user =userService.getUserById(borrowDTO.getUserId());

        borrow.setUser(user);

        // Tương tự cho printBook
        PrintBook printBook = printBookService.getPrintBookById(borrowDTO.getPrintBookId());
        borrow.setPrintBook(printBook);
        borrow.setDueDate(borrowDTO.getDueDate());
        borrow.setReturnDate(borrowDTO.getReturnDate());
        borrow.setStatus(borrowDTO.getStatus());
        borrow.setBorrowDate(borrowDTO.getBorrowDate());
        return ResponseEntity.ok(this.borrowService.updateBorrow(borrow));
    }



    @DeleteMapping("/borrow/{id}/delete")
    public ResponseEntity<String> deleteBorrow(@PathVariable int id){
        Borrow borrow = this.borrowService.getBorrowById(id);
        this.borrowService.deleteBorrowById(borrow.getId());

        return ResponseEntity.ok("ok");
    }
}
