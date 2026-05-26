package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DocumentsDto {
    private Long documentsId;
    private String docsTitle;
    private String documentType;
    private LocalDate docsCreateDate;
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private Integer currentVersion;
    private LocalDate docsModfDate;
}