package com.autoskola.demo.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticalSchedulingDto {

    private Long candidateId;
    private LocalDate date;
    private LocalTime startTime;
    private int durationMinutes;
    private String meetingPoint;
    private Long topicId;
    private Long vehicleId;
}
