package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "theory_classes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TheoryClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long theoryId;

    private LocalDate theoryDate;

    private LocalTime theoryStartTime;

    private LocalTime theoryEndTime;

    private Integer capacity;

    private Integer currentEnrolled;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private User professor;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @OneToMany(mappedBy = "theoryClass")
    private List<TheoryClassAttendance> attendances;
}
