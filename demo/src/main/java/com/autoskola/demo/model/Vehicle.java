package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String brand;

    @Column
    private String model;

    @Column(unique = true, nullable = false)
    private String registrationPlate;

    @Column
    private int manufactureYear;

    @Column(nullable = false)
    private VehicleStatus status;

    @Column
    private Category category;
}
