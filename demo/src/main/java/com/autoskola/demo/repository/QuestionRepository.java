package com.autoskola.demo.repository;

import com.autoskola.demo.model.Question;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.domain.domainId = :domainId ORDER BY RANDOM()")
    List<Question> findRandomByDomain(@Param("domainId") Long domainId);
}
