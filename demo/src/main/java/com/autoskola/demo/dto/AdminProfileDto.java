package com.autoskola.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminProfileDto {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;
}