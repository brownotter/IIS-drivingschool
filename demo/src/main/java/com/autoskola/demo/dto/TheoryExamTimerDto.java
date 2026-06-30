package com.autoskola.demo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryExamTimerDto {

    private LocalDateTime startedAt;
    private Integer timePerFinalExam;
}
