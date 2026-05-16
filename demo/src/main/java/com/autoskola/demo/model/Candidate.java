package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "candidates")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Candidate extends User{

    @Column
    private String targetCategory;

    @Column
    private LocalDate registrationDate;

    @Column
    private boolean isPriority;

    @Column
    private int theoryClassesCount;

    @Column
    private int theoryAttemptsCount;

    @Column
    private int practiceClassesCount;

    @Column
    private int practiceAttemptsCount;

    @Enumerated(EnumType.STRING)
    private CandidateStatus status;
}
