package com.autoskola.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AutoGenerateTheoryScheduleDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long domainId;
    private Integer defaultCapacity;
}