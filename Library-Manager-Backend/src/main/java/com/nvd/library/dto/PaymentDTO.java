package com.nvd.library.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentDTO {
    private Integer id;
    private Integer userId;
    private Integer fineId;
    private String paymentType;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDate paymentDate;
    private String status;
    private String note;
}
