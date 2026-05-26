package com.autoskola.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleCreateDto {

    @NotBlank(message = "Brand is required!")
    private String brand;

    @NotBlank(message = "Model is required!")
    private String model;

    @NotBlank(message = "Registration plate is required!")
    private String registrationPlate;

    private int manufactureYear;

    @NotBlank(message = "Category is required!")
    private String category;
}
