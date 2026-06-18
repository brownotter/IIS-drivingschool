package com.autoskola.demo.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateLogSummaryDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String targetCategory;
    private int practiceClassesCount;
    private String assignedInstructor;
    private String recommendation;
    private List<PracticalClassDto> classes;
}
