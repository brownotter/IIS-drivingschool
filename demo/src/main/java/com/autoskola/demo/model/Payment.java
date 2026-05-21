package com.autoskola.demo.model;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "payments")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    @ManyToOne

    @JoinColumn(name = "candidate_id")

    private Candidate candidate;

    private Double amount;

    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)

    private PaymentMethod method;
}