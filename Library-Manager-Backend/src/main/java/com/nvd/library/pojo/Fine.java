package com.nvd.library.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "fine")
public class Fine {
    @Id
    @Column(name = "fine_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "borrow_id", nullable = false)
    private Borrow borrow;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Size(max = 255)
    @Column(name = "reason")
    private String reason;

    @ColumnDefault("(curdate())")
    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @ColumnDefault("'Pending'")
    @Lob
    @Column(name = "status")
    private String status;

}