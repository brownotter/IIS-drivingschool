package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String instructorNote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Impression impression;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practical_class_id", nullable = false)
    private PracticalClass practicalClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;
}
