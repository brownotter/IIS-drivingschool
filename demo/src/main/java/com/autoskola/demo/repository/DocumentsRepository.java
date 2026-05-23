package com.autoskola.demo.repository;

import com.autoskola.demo.model.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface DocumentsRepository extends JpaRepository<Documents, Long>,
        JpaSpecificationExecutor<Documents> {
    List<Documents> findByCandidateId(Long candidateId);
}