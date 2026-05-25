package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Table(name = "instructors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Instructor extends User{

    @Enumerated(EnumType.STRING)
    private Category teachingCategory;

    @Column(unique = true, nullable = false)
    private String licenceNumber;

    @Enumerated(EnumType.STRING)
    private InstructorStatus status;

    @Column
    private boolean hasCapacity;

    @Column
    private double averageRate;

    @Column
    private double averageCalmness;

    @Column
    private double averageDirectness;

    @Column
    private double averageStrictness;
}
