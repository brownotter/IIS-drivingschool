package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateTheoryReportDto {

    private Long candidateId;
    private String candidateName;

    private Integer theoryClassesCount;

    private Integer simulationTestsCompleted;
    private Double averageSimulationScore;

    private Integer finalExamAttempts;
    private Boolean finalExamPassed;
    private Integer bestFinalExamScore;
}
