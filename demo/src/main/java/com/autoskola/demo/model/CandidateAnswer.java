package com.autoskola.demo.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long candidateAnswerId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "theory_test_id")
    private TheoryTest theoryTest;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "selected_answer_id")
    private AnswerOption selectedAnswer;

    private boolean isCorrect;
}
