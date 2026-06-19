package com.autoskola.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ArchiveDto {
    private Long archiveId;
    private LocalDate archiveDate;
    private String archComment;
    private Long documentId;
    private String documentTitle;
    private String documentType;
    private String candidateName;
}