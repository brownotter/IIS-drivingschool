package com.autoskola.demo.dto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryExamAttemptDto {

    private Long theoryTestId;
    private Integer score;
    private Boolean passed;
    private LocalDateTime submittedAt;
}
