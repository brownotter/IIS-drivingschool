package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleInfoDto {

    private Long id;
    private String brand;
    private String model;
    private String registrationPlate;
    private String category;
}
