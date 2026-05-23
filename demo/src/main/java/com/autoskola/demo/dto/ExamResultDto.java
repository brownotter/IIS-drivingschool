package com.autoskola.demo.dto;

import com.autoskola.demo.model.DocumentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamResultDto {
    @NotBlank private String docsTitle;
    @NotNull  private DocumentStatus docsStatus;
    @NotNull  private LocalDate issueDate;
    @NotBlank private String examType;
    @NotBlank private String examRefNum;
    private Integer examScore;
}