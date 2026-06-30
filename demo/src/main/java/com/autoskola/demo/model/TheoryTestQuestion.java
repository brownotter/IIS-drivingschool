package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "theory_test_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TheoryTestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long theoryTestQuestionId;

    @ManyToOne
    @JoinColumn(name = "theory_test_id")
    private TheoryTest theoryTest;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

}
