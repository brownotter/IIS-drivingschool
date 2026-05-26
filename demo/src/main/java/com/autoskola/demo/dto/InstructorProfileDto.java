package com.autoskola.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorProfileDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String contact;
    private String teachingCategory;
    private String licenceNumber;
    private String status;
    private double averageRate;

}
