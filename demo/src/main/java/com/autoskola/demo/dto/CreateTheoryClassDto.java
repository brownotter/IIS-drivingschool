package com.autoskola.demo.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTheoryClassDto {
    private LocalDate theoryDate;

    private LocalTime theoryStartTime;

    private LocalTime theoryEndTime;

    private Long professorId;

    private Long domainId;

    private Integer capacity;

    private List<Long> candidateIds;
}
