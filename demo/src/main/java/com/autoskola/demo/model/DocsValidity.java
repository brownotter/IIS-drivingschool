package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "docs_validity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocsValidity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "docs_valid_id")
    private Long docsValidId;

    private LocalDate validFrom;

    private LocalDate validUntil;

    private Integer validityDays;

    private Boolean isExpired;

    private LocalDate lastCheck;

    @Enumerated(EnumType.STRING)
    private DocumentStatus validityStatus;

    private Integer daysUntilExpiry;

    private LocalDate nextCheckDate;

    @Builder.Default
    private Boolean isRead = false;

    @OneToOne
    @JoinColumn(name = "documents_id", nullable = false)
    private Documents document;
}