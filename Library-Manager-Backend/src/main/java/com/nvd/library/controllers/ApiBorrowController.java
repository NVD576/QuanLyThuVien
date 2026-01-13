package com.nvd.library.controllers;

import com.nvd.library.dto.BorrowDTO;
import com.nvd.library.pojo.*;
import com.nvd.library.repository.BorrowRepository;
import com.nvd.library.services.*;
import com.nvd.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ApiBorrowController {
    @Autowired
    private BorrowService borrowService;
    @Autowired
    private BorrowRepository borrowRepository;
    @Autowired
    private UserService userService;
    @Autowired
    PrintBookService printBookService;
    @Autowired
    private FineService fineService;
    @Autowired
    private BookService bookService;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private ReaderService readerService;

    @GetMapping("/borrows")
    public ResponseEntity<List<BorrowDTO>> getAllBorrows() {
        List<BorrowDTO> dtos = borrowService.getAllBorrow().stream().map(b -> {
            String userFullName = b.getUser().getFirstName() + " " + b.getUser().getLastName();
            String bookTitle = b.getPrintBook().getBook().getTitle();
            return new BorrowDTO(
                    b.getId(),
                    b.getUser().getId(),
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

    @GetMapping("/borrow/user/{userId}/register")
    public ResponseEntity<List<BorrowDTO>> getCurrentBorrowsByUser(@PathVariable int userId) {

        List<Borrow> borrows = borrowService.getBorrowByUserId(userId);
        List<BorrowDTO> currentBorrows = borrows.stream()
                .filter(b -> "Borrowed".equalsIgnoreCase(b.getStatus())
                        || "Pending".equalsIgnoreCase(b.getStatus()))
                .map(b -> new BorrowDTO(
                        b.getId(),
                        b.getUser().getId(),
                        b.getPrintBook().getId(),
                        b.getUser().getFirstName() + " " + b.getUser().getLastName(),
                        b.getPrintBook().getBook().getTitle(),
                        b.getBorrowDate(),
                        b.getDueDate(),
                        b.getReturnDate(),
                        b.getStatus()
                ))
                .toList();

        return ResponseEntity.ok(currentBorrows);
    }

    @GetMapping("/borrow/search")
    public ResponseEntity<Page<BorrowDTO>> searchBorrows(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "5") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<BorrowDTO> result = borrowService.searchBorrows(keyword,status, pageable);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/fine/{borrowId}/borrow")
    public ResponseEntity<?> getFineByBorrowId(@PathVariable int borrowId) {
        Borrow borrow = borrowService.getBorrowById(borrowId);
        if (borrow == null) {
            return ResponseEntity.notFound().build();
        }

        Fine fine = fineService.getFineByBorrowId(borrowId);

        if (fine == null) {
            return ResponseEntity.ok("Không có fine cho borrow này");
        }

        return ResponseEntity.ok(fine);
    }


    @GetMapping("/borrow/{id}")
    public ResponseEntity<Borrow> getBorrowById(@PathVariable int id){
        return ResponseEntity.ok(this.borrowService.getBorrowById(id));
    }

    @GetMapping("/borrow/{id}/userid")
    public ResponseEntity<List<BorrowDTO>> getAllBorrowByUserId(@PathVariable int id){
        List<Borrow> borrows = borrowService.getBorrowByUserId(id);

        List<BorrowDTO> currentBorrows = borrows.stream()
                .map(b -> new BorrowDTO(
                        b.getId(),
                        b.getUser().getId(),
                        b.getPrintBook().getId(),
                        b.getUser().getFirstName() + " " + b.getUser().getLastName(),
                        b.getPrintBook().getBook().getTitle(),
                        b.getBorrowDate(),
                        b.getDueDate(),
                        b.getReturnDate(),
                        b.getStatus()
                ))
                .toList();

        return ResponseEntity.ok(currentBorrows);
    }

    @PostMapping("/borrow/add")
    public ResponseEntity<?> addBorrow(@RequestBody BorrowDTO borrowDTO) {
        User user = userService.getUserById(borrowDTO.getUserId());
        if (user == null) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }


        if(Objects.equals(user.getRole(), "Reader")){
            Reader reader =readerService.getReaderById(user.getId());

            if ("Basic".equalsIgnoreCase(reader.getMembershipLevel())) {
                int currentBorrowCount = borrowService.countActiveBorrowsByUser(user.getId());
                if (currentBorrowCount >= 10) {
                    return ResponseEntity
                            .badRequest()
                            .body("Người dùng Basic chỉ được mượn tối đa 10 cuốn sách cùng lúc");
                }
            }
            if ("Premium".equalsIgnoreCase(reader.getMembershipLevel())) {
                int currentBorrowCount = borrowService.countActiveBorrowsByUser(user.getId());
                if (currentBorrowCount >= 15) {
                    return ResponseEntity
                            .badRequest()
                            .body("Người dùng chỉ được mượn tối đa 15 cuốn sách cùng lúc");
                }
            }

            // Nếu mượn cùng một loại sách thì ko cho mượn (hiện thông báo)

            List<Borrow> userBorrows = this.borrowService.getBorrowByUserId(user.getId());
            PrintBook pBook = this.printBookService.getPrintBookById(borrowDTO.getPrintBookId());

            for (Borrow i : userBorrows) {
                if (i.getPrintBook().getBook().getId().equals(pBook.getBook().getId())
                        && Set.of("Borrowed", "Pending").contains(i.getStatus())) {
                    return ResponseEntity
                            .badRequest()
                            .body("Người dùng đã mượn cuốn sách này và chưa trả, không thể mượn lại.");
                }
            }

        }

        PrintBook printBook = this.printBookService.getPrintBookById(borrowDTO.getPrintBookId());


        if (Objects.equals(borrowDTO.getStatus(), "Borrowed")) {
            printBook.setStatus("Borrowed");
            printBook.getBook().setAvailableCopies(printBook.getBook().getAvailableCopies() - 6);
        }

        Borrow borrow = new Borrow();
        borrow.setUser(user);

        borrow.setPrintBook(printBook);
        borrow.setDueDate(borrowDTO.getDueDate());
        borrow.setReturnDate(borrowDTO.getReturnDate());
        borrow.setStatus(borrowDTO.getStatus());
        borrow.setBorrowDate(borrowDTO.getBorrowDate());

        Borrow saved = borrowService.addBorrow(borrow);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/borrow/{id}/cancel")
    public ResponseEntity<?> cancelBorrow(@PathVariable int id) {
        Optional<Borrow> borrowOpt = borrowRepository.findById(id);
        if (borrowOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Borrow borrow = borrowOpt.get();
        if (!"Pending".equalsIgnoreCase(borrow.getStatus().trim())) {
            return ResponseEntity.badRequest().body("Chỉ có thể hủy khi trạng thái là Pending");
        }

        PrintBook printBook = printBookService.getPrintBookById(borrow.getPrintBook().getId());
        printBook.setStatus("Available");
        printBookService.updatePrintBook(printBook);


        borrow.setStatus("Cancelled");
        borrowRepository.save(borrow);
        return ResponseEntity.ok("Đã hủy đăng ký mượn");
    }


    @PatchMapping("/borrow/update")
    public ResponseEntity<?> updateBorrow(@RequestBody BorrowDTO  borrowDTO) {
        Borrow borrow = borrowService.getBorrowById(borrowDTO.getId());
        User user =userService.getUserById(borrowDTO.getUserId());

        PrintBook printBook = printBookService.getPrintBookById(borrowDTO.getPrintBookId());
        PrintBook pb= new PrintBook();

        pb.setId(printBook.getId());
        pb.setBook(printBook.getBook());
        borrow.setUser(user);
        borrow.setPrintBook(printBook);
        borrow.setDueDate(borrowDTO.getDueDate());
        borrow.setReturnDate(borrowDTO.getReturnDate());
        borrow.setStatus(borrowDTO.getStatus());
        borrow.setBorrowDate(borrowDTO.getBorrowDate());
        Borrow b=this.borrowService.updateBorrow(borrow);

        Book book= bookService.getBookById(printBook.getBook().getId());
        if("Borrowed".equals(borrowDTO.getStatus())){
            pb.setStatus(borrowDTO.getStatus());
        }
        else if(Set.of("Returned", "Cancelled").contains(borrowDTO.getStatus())){
            pb.setStatus("Available");
        }else if(Objects.equals(borrowDTO.getStatus(), "Overdue")){
            pb.setStatus("Available");
            Fine fine= new Fine();
            fine.setBorrow(b);
            fine.setIssueDate(borrowDTO.getReturnDate());
            LocalDate dueDate = borrowDTO.getDueDate();
            LocalDate returnDate = borrowDTO.getReturnDate();
            long daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);
            if (daysLate < 5) daysLate = 0;
            BigDecimal amount = BigDecimal.valueOf(daysLate * 1005L + 10000);
            fine.setAmount(amount);
            fine.setReason("Quá hạn " + daysLate + " ngày");
            fine.setStatus("Pending");
            fineService.addFine(fine);
        }
        printBookService.updatePrintBook(pb);
        return ResponseEntity.ok("Successfully updated");
    }



    @DeleteMapping("/borrow/{id}/delete")
    public ResponseEntity<String> deleteBorrow(@PathVariable int id){
        Borrow borrow = this.borrowService.getBorrowById(id);
        this.borrowService.deleteBorrowById(borrow.getId());

        return ResponseEntity.ok("ok");
    }
}
