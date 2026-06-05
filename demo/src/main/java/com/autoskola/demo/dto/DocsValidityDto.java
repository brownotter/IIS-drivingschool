package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DocsValidityDto {
    private Long docsValidId;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private Integer validityDays;
    private Boolean isExpired;
    private LocalDate lastCheck;
    private DocumentStatus validityStatus;
    private Integer daysUntilExpiry;
    private LocalDate nextCheckDate;
    private Long documentId;
    private String documentTitle;
    private Boolean isRead;
}