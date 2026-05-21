package com.autoskola.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfessorClassDetailsDto {
    private Long theoryId;
    private String domainName;
    private LocalDate theoryDate;
    private LocalTime theoryStartTime;
    private LocalTime theoryEndTime;
    private String professorName;
    private long presentCount;
    private List<CandidateTheoryAttendanceInfoDto> candidates;
}