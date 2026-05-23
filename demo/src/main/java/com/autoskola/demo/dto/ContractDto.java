package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractDto {
    @NotBlank private String docsTitle;
    @NotNull  private DocumentStatus docsStatus;
    @NotBlank private String contNumb;
    @NotNull  private LocalDate contStartDate;
    @NotNull  private BigDecimal ammountCont;
}