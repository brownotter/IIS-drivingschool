package com.autoskola.demo.repository;

import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.TheoryClass;
import com.autoskola.demo.model.TheoryClassAttendance;
import com.autoskola.demo.model.TheoryClassAttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TheoryClassAttendanceRepository extends JpaRepository<TheoryClassAttendance, Long> {

    List<TheoryClassAttendance>
    findByCandidate(Candidate candidate);

    List<TheoryClassAttendance>
    findByTheoryClass(TheoryClass theoryClass);

    Optional<TheoryClassAttendance>
    findByCandidateAndTheoryClass(
            Candidate candidate,
            TheoryClass theoryClass
    );

    boolean existsByCandidateAndTheoryClassAndStatus(
            Candidate candidate,
            TheoryClass theoryClass,
            TheoryClassAttendanceStatus status
    );

    Integer countByTheoryClassAndStatus(TheoryClass theoryClass, TheoryClassAttendanceStatus theoryClassAttendanceStatus);
}