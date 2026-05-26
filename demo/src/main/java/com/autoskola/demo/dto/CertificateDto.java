package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateDto {
    private String docsTitle;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private String cerfNumb;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate cerfDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate validDate;
}