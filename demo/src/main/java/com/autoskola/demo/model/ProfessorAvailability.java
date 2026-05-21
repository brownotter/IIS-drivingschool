package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Table(name = "professor_availabilities")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProfessorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long availabilityId;

    @Column
    private LocalTime startTime;

    @Column
    private LocalTime endTime;

    @Column
    private LocalDate availableDate;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private User professor;
}
