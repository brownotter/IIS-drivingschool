package com.autoskola.demo.repository;

import com.autoskola.demo.model.Impression;
import com.autoskola.demo.model.LessonLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonLogRepository
        extends JpaRepository<LessonLog, Long> {

    List<LessonLog>
    findByPracticalClass_Candidate_IdAndImpression(
            Long candidateId,
            Impression impression
    );
}