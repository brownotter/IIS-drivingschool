package com.autoskola.demo.service;

import com.autoskola.demo.dto.ProfessorAvailabilityDto;
import com.autoskola.demo.model.ProfessorAvailability;

import java.time.LocalDate;
import java.util.List;

public interface ProfessorAvailabilityService {

    ProfessorAvailability createAvailability(
            ProfessorAvailabilityDto dto
    );

    List<ProfessorAvailability> getProfessorAvailabilities(
            Long professorId
    );

    List<LocalDate> getNextWeekDates();
}