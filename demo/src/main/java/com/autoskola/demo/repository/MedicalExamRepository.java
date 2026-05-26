package com.autoskola.demo.repository;

import com.autoskola.demo.model.MedicalExam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalExamRepository extends JpaRepository<MedicalExam, Long> {
    List<MedicalExam> findByCandidateId(Long candidateId);
}