package com.autoskola.demo.repository;

import com.autoskola.demo.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByCandidateId(Long candidateId);
}