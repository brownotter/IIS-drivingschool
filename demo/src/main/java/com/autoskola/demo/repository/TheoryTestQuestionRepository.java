package com.autoskola.demo.repository;

import com.autoskola.demo.model.TheoryTest;
import com.autoskola.demo.model.TheoryTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheoryTestQuestionRepository extends JpaRepository<TheoryTestQuestion, Long> {
    List<TheoryTestQuestion> findByTheoryTest(TheoryTest test);
}
