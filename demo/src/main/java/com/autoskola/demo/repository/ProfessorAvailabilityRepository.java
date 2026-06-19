package com.autoskola.demo.repository;

import com.autoskola.demo.model.ProfessorAvailability;
import com.autoskola.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ProfessorAvailabilityRepository extends JpaRepository<ProfessorAvailability, Long> {

    List<ProfessorAvailability> findByProfessor(User professor);

    @Query("SELECT pa FROM ProfessorAvailability pa WHERE pa.professor = :professor AND pa.availableDate BETWEEN :startDate AND :endDate")
    List<ProfessorAvailability> getProfessorAvailabilitiesForPeriod(
            @Param("professor") User professor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
    SELECT COUNT(pa) > 0
    FROM ProfessorAvailability pa
    WHERE pa.professor = :professor
    AND pa.availableDate = :availableDate
    AND pa.startTime < :endTime
    AND pa.endTime > :startTime
    """)
    boolean existsOverlappingAvailability(@Param("professor") User professor, @Param("availableDate") LocalDate availableDate, @Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime);
}