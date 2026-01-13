package com.nvd.library.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FineDTO {
    private int id;
    private int borrowId;
    private BigDecimal amount;
    private String reason;
    private LocalDate issueDate;
    private LocalDate paidDate;
    private String status;
    private String payMethod;
}
