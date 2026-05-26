package com.autoskola.demo.repository;

import com.autoskola.demo.model.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByCandidateId(Long candidateId);
}