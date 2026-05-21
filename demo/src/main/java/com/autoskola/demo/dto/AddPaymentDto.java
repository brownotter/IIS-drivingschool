package com.autoskola.demo.dto;

import com.autoskola.demo.model.PaymentMethod;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddPaymentDto {

    private Double amount;

    private LocalDate paymentDate;

    private PaymentMethod method;
}