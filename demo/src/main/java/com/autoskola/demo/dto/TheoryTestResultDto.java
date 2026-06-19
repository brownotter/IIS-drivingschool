package com.autoskola.demo.dto;
import java.util.List;

import com.autoskola.demo.model.TheoryTestType;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryTestResultDto {
    private Long theoryTestId;
    private TheoryTestType testType;
    private Integer score;
    private Boolean passed;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private List<String> domainsToImprove;
    private List<TheoryQuestionResultDto> questions;
}
