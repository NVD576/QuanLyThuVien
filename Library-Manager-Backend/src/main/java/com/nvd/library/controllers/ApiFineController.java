package com.nvd.library.controllers;

import com.nvd.library.dto.FineDTO;
import com.nvd.library.pojo.Borrow;
import com.nvd.library.pojo.Fine;
import com.nvd.library.pojo.Payment;
import com.nvd.library.pojo.User;
import com.nvd.library.repository.FineRepository;
import com.nvd.library.services.BorrowService;
import com.nvd.library.services.FineService;
import com.nvd.library.services.PaymentService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class ApiFineController {
    @Autowired
    private FineService fineService;
    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private BorrowService borrowService;

    @GetMapping("/fines")
    public ResponseEntity<Page<Fine>> getAllFines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(fineService.getAllFines(pageable));
    }

    @GetMapping("/fine/{id}")
    public ResponseEntity<Fine> getFineById(@PathVariable int id){
        return ResponseEntity.ok(this.fineService.getFineById(id));
    }

    @GetMapping("/fine/{id}/user")
    public ResponseEntity<?>getFinebyUserId(@PathVariable int id){
        return ResponseEntity.ok(this.fineRepository.findByUserId(id));
    }

    @PostMapping("/fine/add")
    public ResponseEntity<?> addFine(@RequestBody FineDTO fineDTO) {
        try {
            Fine fine = new Fine();
            fine.setAmount(fineDTO.getAmount());
            fine.setStatus(fineDTO.getStatus());
            fine.setReason(fineDTO.getReason());
            fine.setIssueDate(fineDTO.getPaidDate());
            fine.setPaidDate(fineDTO.getPaidDate());

            Borrow borrow = borrowService.getBorrowById(fineDTO.getBorrowId());
            if (borrow == null) {
                return ResponseEntity.badRequest().body("Borrow with ID " + fineDTO.getBorrowId() + " not found");
            }
            fine.setBorrow(borrow);

            Fine savedFine = this.fineService.addFine(fine);
            return ResponseEntity.ok(savedFine);
        } catch (Exception e) {
            e.printStackTrace();  // hoặc log lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PatchMapping("/fine/update")
    public ResponseEntity<?> updateFine(@RequestBody FineDTO fineDTO) {
        Fine fine = this.fineService.getFineById(fineDTO.getId());
        fine.setAmount(fineDTO.getAmount());
        fine.setStatus(fineDTO.getStatus());
        fine.setReason(fineDTO.getReason());
        fine.setIssueDate(fineDTO.getIssueDate());
        fine.setPaidDate(fineDTO.getPaidDate());
        Fine f=this.fineService.updateFine(fine);
        if (!Objects.equals(fineDTO.getStatus(), "Pending")) {
            Payment payment = new Payment();
            payment.setAmount(fineDTO.getAmount());
            payment.setStatus("Successful");
            payment.setFine(f);
            payment.setUser(f.getBorrow().getUser());
            payment.setPaymentType("Fine");
            payment.setPaymentDate(fineDTO.getPaidDate());
            payment.setPaymentMethod(fineDTO.getPayMethod());
            payment.setNote(fineDTO.getReason());
            paymentService.addPayment(payment);
        }
        return ResponseEntity.ok("Successfully updated Fine with ID " + fineDTO.getId());
    }

    @DeleteMapping("/fine/{id}/delete")
    public ResponseEntity<Fine> deleteFine(@PathVariable int id) {
        this.fineService.deleteFine(id);
        return ResponseEntity.ok().build();
    }
}
