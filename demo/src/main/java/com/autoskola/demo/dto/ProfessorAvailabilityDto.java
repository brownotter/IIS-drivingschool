package com.autoskola.demo.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorAvailabilityDto {

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate availableDate;

    private Long professorId;
}