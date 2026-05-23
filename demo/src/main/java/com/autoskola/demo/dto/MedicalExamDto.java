package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalExamDto {
    private String docsTitle;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate docsExpireDate;
    private DocumentStatus docsStatus;
    private String institution;
    private String doctorName;
    private String medResult;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate medExamDate;
}