package com.autoskola.demo.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateTheoryScheduleDto {
    private Long theoryId;
    private String domainName;
    private LocalDate theoryDate;
    private LocalTime theoryStartTime;
    private LocalTime theoryEndTime;
    private String professorName;
    private String status;
}