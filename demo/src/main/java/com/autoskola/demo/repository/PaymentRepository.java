package com.autoskola.demo.repository;

import com.autoskola.demo.model.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {
    List<Payment> findByCandidateId(Long candidateId);
}