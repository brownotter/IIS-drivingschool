package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalExamDto {
    @NotBlank private String docsTitle;
    @NotNull  private LocalDate docsExpireDate;
    @NotNull  private DocumentStatus docsStatus;
    @NotBlank private String institution;
    @NotBlank private String doctorName;
    @NotBlank private String medResult;
    @NotNull  private LocalDate medExamDate;
}