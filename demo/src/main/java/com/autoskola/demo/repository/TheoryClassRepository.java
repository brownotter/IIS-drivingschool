package com.autoskola.demo.repository;

import com.autoskola.demo.model.TheoryClass;
import com.autoskola.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TheoryClassRepository
        extends JpaRepository<TheoryClass, Long> {

    @Query("SELECT DISTINCT tc FROM TheoryClass tc " +
            "LEFT JOIN FETCH tc.attendances a " +
            "LEFT JOIN FETCH a.candidate " +
            "JOIN FETCH tc.professor " +
            "JOIN FETCH tc.domain " +
            "WHERE tc.theoryDate BETWEEN :start AND :end " +
            "ORDER BY tc.theoryDate ASC, tc.theoryStartTime ASC")
    List<TheoryClass> findWeeklyScheduleWithAttendances(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    List<TheoryClass> findByTheoryDateBetween(
            LocalDate start,
            LocalDate end
    );

    boolean existsByProfessorAndTheoryDateAndTheoryStartTimeLessThanAndTheoryEndTimeGreaterThan(
            User professor,
            LocalDate theoryDate,
            LocalTime theoryEndTime,
            LocalTime theoryStartTime
    );

    List<TheoryClass> findByProfessorAndTheoryDateBetween(User professor, LocalDate monday, LocalDate sunday);
}