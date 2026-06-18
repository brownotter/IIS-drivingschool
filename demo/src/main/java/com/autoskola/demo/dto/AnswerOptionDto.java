package com.autoskola.demo.dto;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerOptionDto {
    private Long answerOptionId;

    private String answerText;
}
