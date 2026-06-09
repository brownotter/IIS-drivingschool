package com.autoskola.demo.dto;

import com.autoskola.demo.model.Category;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateFinancialsDto {

    private Category category;

    private Double totalPrice;
    private Double totalPaid;
    private Double remainingAmount;

    private List<PaymentHistoryDto> payments;

    private LocalDate nextPaymentDate;
    private Double nextPaymentAmount;

    private Boolean fullyPaid;
}