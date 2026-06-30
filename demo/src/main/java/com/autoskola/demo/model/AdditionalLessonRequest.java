package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="additional_lesson_request")
public class AdditionalLessonRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Candidate candidate;
    private String weakness;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private RecommendationStatus status;
}
