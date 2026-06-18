package com.autoskola.demo.repository;

import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.TheoryClass;
import com.autoskola.demo.model.TheoryClassAttendance;
import com.autoskola.demo.model.TheoryClassAttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TheoryClassAttendanceRepository extends JpaRepository<TheoryClassAttendance, Long> {

    Optional<TheoryClassAttendance> findByCandidateAndTheoryClass(Candidate candidate, TheoryClass theoryClass);

    @Query(" SELECT COUNT(a) > 0 FROM TheoryClassAttendance a WHERE a.candidate = :candidate AND a.theoryClass = :theoryClass")
    boolean existsAttendance(@Param("candidate") Candidate candidate, @Param("theoryClass") TheoryClass theoryClass);

    Integer countByTheoryClassAndStatus(TheoryClass theoryClass, TheoryClassAttendanceStatus theoryClassAttendanceStatus);
}