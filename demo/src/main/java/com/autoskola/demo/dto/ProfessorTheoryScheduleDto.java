package com.autoskola.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfessorTheoryScheduleDto {
    private Long theoryId;
    private String domainName;
    private LocalDate theoryDate;
    private LocalTime theoryStartTime;
    private LocalTime theoryEndTime;
    private Integer currentEnrolled;
    private Integer capacity;
}