package com.autoskola.demo.dto;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitTheoryTestDto {
    private Long theoryTestId;
    private List<SubmitTestAnswerDto> answers;
}
