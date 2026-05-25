package com.autoskola.demo.dto;

import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorCreateDto {

    @NotBlank(message = "Username is required!")
    private String username;

    @NotBlank(message = "First name is required!")
    private String firstName;

    @NotBlank(message = "Last name is required!")
    private String lastName;

    @NotBlank(message = "Password is required!")
    private String password;

    @Email(message = "Email should be valid!")
    @NotBlank(message = "Email is required!")
    private String email;

    @NotBlank(message = "Contact is required!")
    private String contact;

    @NotBlank(message = "Teaching category is required!")
    private String teachingCategory;

    @NotBlank(message = "Licence number is required!")
    private String licenceNumber;

}
