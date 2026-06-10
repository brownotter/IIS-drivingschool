package com.autoskola.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocsVersionDto {
    private Long versionId;
    private Integer versionNum;
    private LocalDateTime changeTime;
    private String changedBy;
    private String changeDescription;
    private Long documentId;
    private String snapshotData;
}