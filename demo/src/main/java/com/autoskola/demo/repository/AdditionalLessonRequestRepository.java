package com.autoskola.demo.repository;

import com.autoskola.demo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdditionalLessonRequestRepository
        extends JpaRepository<AdditionalLessonRequest, Long> {

    Optional<AdditionalLessonRequest>
    findByCandidateIdAndStatus(
            Long candidateId,
            RecommendationStatus status
    );
}