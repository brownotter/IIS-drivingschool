package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleProfileDto {
    private Long id;
    private String brand;
    private String model;
    private String registrationPlate;
    private int manufactureYear;
    private String status;
    private String category;
}
