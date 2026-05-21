package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "theory_class_attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TheoryClassAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "theory_class_id")
    private TheoryClass theoryClass;

    @Enumerated(EnumType.STRING)
    private TheoryClassAttendanceStatus status;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private User professor;
}