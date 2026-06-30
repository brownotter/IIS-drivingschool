package com.autoskola.demo.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticalClassResponseDto {

    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String meetingPoint;
    private String status;
    private String candidateName;
    private String topicName;
    private String vehicleName;
}
