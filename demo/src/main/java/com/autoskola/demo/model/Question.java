package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @Column(length = 1000)
    private String questionText;

    private String difficulty;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    private Domain domain;
}