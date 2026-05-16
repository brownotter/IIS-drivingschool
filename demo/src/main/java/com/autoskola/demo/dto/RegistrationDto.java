package com.autoskola.demo.dto;

import com.autoskola.demo.model.Category;
import com.autoskola.demo.model.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
public class RegistrationDto {

    private String firstName;

    private String lastName;

    @NotNull(message = "Username cannot be null.")
    @NotEmpty(message = "Username cannot be empty.")
    private String username;

    @Email
    @NotNull(message = "Email cannot be null.")
    @NotEmpty(message = "Email cannot be empty.")
    private String email;

    private String contact;

    @NotBlank(message = "Password cannot be blank.")
    @NotEmpty(message = "Password cannot be empty.")
    private String password;

    @NotBlank(message = "Confirm Password cannot be blank.")
    @NotEmpty(message = "Confirm Password cannot be empty.")
    private String confirmPassword;

    private Category category;
}
