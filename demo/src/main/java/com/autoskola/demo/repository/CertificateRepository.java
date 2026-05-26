package com.autoskola.demo.repository;

import com.autoskola.demo.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByCandidateId(Long candidateId);
}