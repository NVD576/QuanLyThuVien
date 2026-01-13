package com.nvd.library.dto;

import lombok.Data;

@Data
public class UpgradeRequestDTO {
    private Integer memberId;
    private String newLevel;
    private String payMethod;
}