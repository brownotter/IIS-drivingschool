package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractDetailsDto {
    private Long documentsId;
    private String docsTitle;
    private LocalDate docsCreateDate;
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private Integer currentVersion;
    private LocalDate docsModfDate;
    private String contNumb;
    private LocalDate contStartDate;
    private BigDecimal ammountCont;
    private String documentType = "CONTRACT";
    private String candidateName;
}