package com.autoskola.demo.controller;

import com.autoskola.demo.dto.ProfessorAvailabilityDto;
import com.autoskola.demo.model.ProfessorAvailability;
import com.autoskola.demo.service.ProfessorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/professor-availabilities")
@RequiredArgsConstructor
public class ProfessorAvailabilityController {

    private final ProfessorAvailabilityService
            availabilityService;

    @PostMapping
    public ProfessorAvailability createAvailability(
            @RequestBody ProfessorAvailabilityDto dto
    ) {

        return availabilityService
                .createAvailability(dto);
    }

    @GetMapping("/professor/{professorId}")
    public List<ProfessorAvailability>
    getProfessorAvailabilities(
            @PathVariable Long professorId
    ) {

        return availabilityService
                .getProfessorAvailabilities(professorId);
    }

    @GetMapping("/next-week")
    public List<LocalDate> getNextWeekDates() {

        return availabilityService
                .getNextWeekDates();
    }
}