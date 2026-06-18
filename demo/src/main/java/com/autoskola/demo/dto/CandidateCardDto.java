package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateCardDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String targetCategory;
    private int practiceClassesCount;
}
