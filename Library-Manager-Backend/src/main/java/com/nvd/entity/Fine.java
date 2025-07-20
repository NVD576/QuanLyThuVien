package com.nvd.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FineID")
    private Integer fineId;

    @ManyToOne
    @JoinColumn(name = "BorrowID")
    private Borrow borrow;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private User user;

    @Column(name = "Amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "Reason", length = 255)
    private String reason;

    @Column(name = "IssueDate")
    private LocalDate issueDate;

    @Column(name = "PaidDate")
    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 20)
    private Status status;

    public enum Status {
        Pending, Paid, Waived
    }
} 