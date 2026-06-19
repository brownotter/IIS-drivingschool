package com.autoskola.demo.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "theory_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TheoryTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long theoryTestId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    private TheoryTestType testType;

    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    private Integer score;

    private Boolean passed;
}