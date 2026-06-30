package com.autoskola.demo.repository;

import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.TheoryTest;
import com.autoskola.demo.model.TheoryTestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface TheoryTestRepository extends JpaRepository<TheoryTest, Long> {
    @Query(" SELECT tt FROM TheoryTest tt WHERE tt.candidate.id = :candidateId AND tt.testType = :testType AND tt.submittedAt IS NOT NULL ORDER BY tt.submittedAt DESC")
    List<TheoryTest> getRecentTests(@Param("candidateId") Long candidateId, @Param("testType") TheoryTestType testType);

    List<TheoryTest> findByCandidateAndTestType(Candidate candidate, TheoryTestType theoryTestType);

    boolean existsByCandidateAndTestTypeAndPassed(Candidate candidate, TheoryTestType theoryTestType, boolean b);
}
