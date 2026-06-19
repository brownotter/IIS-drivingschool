package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitTestAnswerDto {
    private Long questionId;
    private Long selectedAnswerId;
}
