package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "exam_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExamResult extends Documents {

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "exam_ref_num", nullable = false, unique = true)
    private String examRefNum;

    @Column(name = "exam_score")
    private Integer examScore;
}