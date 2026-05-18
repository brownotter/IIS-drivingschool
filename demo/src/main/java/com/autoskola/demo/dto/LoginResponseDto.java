package com.autoskola.demo.dto;

import com.autoskola.demo.model.Role;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {

    private Long id;
    private String username;
    private Role role;
    private String message;
}