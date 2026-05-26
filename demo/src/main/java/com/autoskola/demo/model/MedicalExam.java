package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "medical_exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MedicalExam extends Documents {

    @Column(name = "institution", nullable = false)
    private String institution;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(name = "med_result", nullable = false)
    private String medResult;

    @Column(name = "med_exam_date", nullable = false)
    private LocalDate medExamDate;
}