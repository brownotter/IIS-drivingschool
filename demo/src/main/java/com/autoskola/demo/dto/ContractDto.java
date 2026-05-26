package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractDto {
    private String docsTitle;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private String contNumb;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate contStartDate;
    private BigDecimal ammountCont;
}