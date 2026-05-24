package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "documents")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Documents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "documents_id")
    private Long documentsId;

    @Column(name = "docs_title", nullable = false)
    private String docsTitle;

    @Column(name = "docs_create_date", nullable = false)
    private LocalDate docsCreateDate;

    @Column(name = "docs_expire_date")
    private LocalDate docsExpireDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "docs_status", nullable = false)
    private DocumentStatus docsStatus;

    @Column(name = "current_version")
    private Integer currentVersion;

    @Column(name = "docs_modf_date")
    private LocalDate docsModfDate;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}