package com.autoskola.demo.dto;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminTheoryScheduleDto {

    private Long theoryId;
    private LocalDate theoryDate;
    private LocalTime theoryStartTime;
    private LocalTime theoryEndTime;
    private Integer capacity;
    private Integer currentEnrolled;
    private String professorName;
    private String domainName;
    private List<CandidateInfoDto> enrolledCandidates;
}
