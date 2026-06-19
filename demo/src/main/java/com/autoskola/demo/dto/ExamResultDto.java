package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamResultDto {
    private String docsTitle;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;
    private String examType;
    private String examRefNum;
    private Integer examScore;
    private String changeDescription;
}