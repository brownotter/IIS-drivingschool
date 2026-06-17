package com.autoskola.demo.repository;

import com.autoskola.demo.model.PracticalClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalClassRepository extends JpaRepository<PracticalClass, Long> {

    List<PracticalClass> findByCandidateIdOrderByDateDescStartTimeDesc(Long candidateId);
}
