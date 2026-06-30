package com.autoskola.demo.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryTestQuestionDto {
    private Long questionId;

    private String questionText;

    private String imageUrl;

    private List<AnswerOptionDto> answers;
}
