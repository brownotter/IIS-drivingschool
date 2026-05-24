package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateDetailsDto {
    private Long documentsId;
    private String docsTitle;
    private LocalDate docsCreateDate;
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private Integer currentVersion;
    private LocalDate docsModfDate;
    private String cerfNumb;
    private LocalDate cerfDate;
    private LocalDate validDate;
    private String documentType = "CERTIFICATE";
}