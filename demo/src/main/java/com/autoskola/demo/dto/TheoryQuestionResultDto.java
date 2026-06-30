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
public class TheoryQuestionResultDto {
    private Long questionId;
    private String questionText;
    private String imageUrl;

    private Long selectedAnswerId;
    private String selectedAnswerText;

    private Long correctAnswerId;
    private String correctAnswerText;

    private Boolean correct;
}
