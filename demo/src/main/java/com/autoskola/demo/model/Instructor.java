package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "instructors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Instructor extends User{

    @Column
    private String teachingCategory;

    @Column
    private String licenceNumber;

    @Column
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
