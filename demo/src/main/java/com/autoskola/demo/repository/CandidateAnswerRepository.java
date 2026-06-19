package com.autoskola.demo.repository;

import com.autoskola.demo.model.CandidateAnswer;
import com.autoskola.demo.model.TheoryTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CandidateAnswerRepository extends JpaRepository<CandidateAnswer, Long> {

    List<CandidateAnswer> findByTheoryTest(TheoryTest theoryTest);
    @Query(" SELECT ca FROM CandidateAnswer ca WHERE ca.theoryTest IN :theoryTests AND ca.isCorrect = false")
    List<CandidateAnswer> getWrongAnswers(@Param("theoryTests") List<TheoryTest> theoryTests);
}
