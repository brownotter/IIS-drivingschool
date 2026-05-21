package com.autoskola.demo.repository;

import com.autoskola.demo.model.ProfessorAvailability;
import com.autoskola.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ProfessorAvailabilityRepository extends JpaRepository<ProfessorAvailability, Long> {

    List<ProfessorAvailability>
    findByProfessor(User professor);

    List<ProfessorAvailability>
    findByProfessorAndAvailableDateBetween(
            User professor,
            LocalDate startDate,
            LocalDate endDate
    );

    boolean existsByProfessorAndAvailableDateAndStartTimeLessThanAndEndTimeGreaterThan(
            User professor,
            LocalDate availableDate,
            LocalTime endTime,
            LocalTime startTime
    );

    List<ProfessorAvailability> findByAvailableDateBetween(LocalDate start, LocalDate end);
}