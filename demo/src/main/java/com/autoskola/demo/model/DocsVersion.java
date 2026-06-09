package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "docs_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocsVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "version_id")
    private Long versionId;

    private Integer versionNum;

    private LocalDateTime changeTime;

    @ManyToOne
    @JoinColumn(name = "documents_id", nullable = false)
    private Documents document;

    @ManyToOne
    @JoinColumn(name = "changed_by", nullable = false)
    private Employee changedBy;

    @Column(length = 500)
    private String changeDescription;

    @Column(columnDefinition = "TEXT")
    private String snapshotData;

}