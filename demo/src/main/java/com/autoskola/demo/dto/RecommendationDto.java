package com.autoskola.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {

    private boolean visible;

    private String weakness;

    private String recommendationText;

    private String message;
}