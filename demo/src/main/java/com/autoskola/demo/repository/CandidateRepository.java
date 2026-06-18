package com.autoskola.demo.repository;

import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.CandidateStatus;
import com.autoskola.demo.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository
        extends JpaRepository<Candidate, Long> {

    List<Candidate> findByCategoryPackage_Category(Category category);

    List<Candidate> findByStatus(CandidateStatus status);

    List<Candidate> findByCategoryPackage_CategoryAndStatus(
            Category category,
            CandidateStatus status
    );
}