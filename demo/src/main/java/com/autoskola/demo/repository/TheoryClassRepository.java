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

    List<TheoryClass> findByTheoryDateBetween(LocalDate start, LocalDate end);

    @Query("""
    SELECT COUNT(tc) > 0
    FROM TheoryClass tc
    WHERE tc.professor = :professor
    AND tc.theoryDate = :theoryDate
    AND tc.theoryStartTime < :endTime
    AND tc.theoryEndTime > :startTime
    """)
    boolean hasOverlappingClass(
            @Param("professor") User professor,
            @Param("theoryDate") LocalDate theoryDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    List<TheoryClass> findByProfessorAndTheoryDateBetween(User professor, LocalDate monday, LocalDate sunday);
}