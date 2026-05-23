package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Table(name = "candidates")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Candidate extends User{
   @ManyToOne
   @JoinColumn(name = "package_id")
   private CategoryPackage categoryPackage;

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

    private Integer theoryScore;

    private Integer drivingScore;

}
