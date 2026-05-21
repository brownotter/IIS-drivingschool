package com.autoskola.demo.dto;

import com.autoskola.demo.model.CandidateStatus;

import com.autoskola.demo.model.Category;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateProfileDto {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;
    private Category category; //umesto targetCategory

    private CandidateStatus status;

    private int theoryClassesCount;
    private int theoryAttemptsCount;

    private int practiceClassesCount;
    private int practiceAttemptsCount;
}