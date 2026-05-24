package com.autoskola.demo.dto;

import lombok.Data;

@Data
public class EmployeeProfileDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;
}