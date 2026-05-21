package com.autoskola.demo.dto;

import com.autoskola.demo.model.CandidateStatus;
import com.autoskola.demo.model.Category;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateDetailsDto {

    private Long id;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;

    private CandidateStatus status;

    private int theoryClassesCount;
    private int theoryAttemptsCount;
    private Integer theoryScore;

    private int practiceClassesCount;
    private int practiceAttemptsCount;
    private Integer drivingScore;

    private Category category;
    private double categoryPrice;
    private double totalPaid;
    private double remainingAmount;


}