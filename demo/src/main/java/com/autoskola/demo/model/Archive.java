package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "archive")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Archive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "archive_id")
    private Long archiveId;

    private LocalDate archiveDate;

    @Column(length = 500)
    private String archComment;

    @OneToOne
    @JoinColumn(name = "documents_id", nullable = false)
    private Documents document;
}