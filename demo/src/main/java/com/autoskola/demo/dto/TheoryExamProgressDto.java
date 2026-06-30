package com.autoskola.demo.dto;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryExamProgressDto {

    private int theoryClassesCount;
    private int theoryAttemptsCount;
    private List<TheoryExamAttemptDto> attempts;
}
