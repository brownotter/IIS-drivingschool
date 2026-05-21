package com.autoskola.demo.dto;
import com.autoskola.demo.model.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
public class CandidateInfoDto {

    private Long id;
    private String firstName;
    private String lastName;
}
