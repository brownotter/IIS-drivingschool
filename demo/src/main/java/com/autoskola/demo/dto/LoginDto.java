package com.autoskola.demo.dto;

import com.autoskola.demo.model.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
public class LoginDto {

    @NotNull(message = "Username cannot be null.")
    @NotEmpty(message = "Username cannot be empty.")
    private String username;

    @NotNull(message = "Password cannot be null.")
    @NotEmpty(message = "Password cannot be empty.")
    private String password;

    private Role role;
}
