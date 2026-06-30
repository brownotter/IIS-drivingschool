package com.autoskola.demo.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleAvailabilityRequestDto {

    private LocalDate date;
    private LocalTime startTime;
    private int durationMinutes;
}
