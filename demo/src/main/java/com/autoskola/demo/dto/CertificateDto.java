package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateDto {
    @NotBlank private String docsTitle;
    @NotNull  private DocumentStatus docsStatus;
    @NotBlank private String cerfNumb;
    @NotNull  private LocalDate cerfDate;
    private LocalDate validDate;
}