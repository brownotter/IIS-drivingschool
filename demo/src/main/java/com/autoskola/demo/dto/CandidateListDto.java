package com.autoskola.demo.dto;

import com.autoskola.demo.model.CandidateStatus;
import com.autoskola.demo.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateListDto {

    private Long id;

    private String firstName;

    private String lastName;

    private Category category;

    private CandidateStatus status;
}