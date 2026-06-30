package com.autoskola.demo.dto;

import com.autoskola.demo.model.Domain;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheorySimulationProgressDto {

    private int theoryClassesCount;
    private int theorySimulationsCount;
    private double averageSimulationScore;
    private List<Domain> domainsToImprove;
}
