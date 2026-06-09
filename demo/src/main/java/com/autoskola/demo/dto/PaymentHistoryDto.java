package com.autoskola.demo.dto;

import com.autoskola.demo.model.PaymentMethod;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryDto {

    private Double amount;
    private LocalDate paymentDate;
    private PaymentMethod method;
}