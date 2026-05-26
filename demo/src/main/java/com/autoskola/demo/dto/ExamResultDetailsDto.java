package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamResultDetailsDto {
    private Long documentsId;
    private String docsTitle;
    private LocalDate docsCreateDate;
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private Integer currentVersion;
    private LocalDate docsModfDate;
    private LocalDate issueDate;
    private String examType;
    private String examRefNum;
    private Integer examScore;
    private String documentType = "EXAMRESULT";
}