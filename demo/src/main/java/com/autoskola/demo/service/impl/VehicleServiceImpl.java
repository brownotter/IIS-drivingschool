package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.VehicleCreateDto;
import com.autoskola.demo.dto.VehicleProfileDto;
import com.autoskola.demo.dto.VehicleUpdateDto;
import com.autoskola.demo.exception.InvalidDataException;
import com.autoskola.demo.exception.ResourceAlreadyExistsException;
import com.autoskola.demo.exception.ResourceNotFoundException;
import com.autoskola.demo.model.Category;
import com.autoskola.demo.model.Vehicle;
import com.autoskola.demo.model.VehicleStatus;
import com.autoskola.demo.repository.VehicleRepository;
import com.autoskola.demo.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private void validateVehicleYear(int manufactureYear) {
        int currentYear = Year.now().getValue();
        int minYear = currentYear - 10;

        if(manufactureYear < minYear || manufactureYear > currentYear) {
            throw new InvalidDataException("Invalid manufacture year!");
        }
    }

    @Override
    public List<VehicleProfileDto> getAllVehicles(boolean activeOnly) {

        List<Vehicle> vehicles = activeOnly ? vehicleRepository.findAllActiveVehicles() : vehicleRepository.findAll();

        return vehicles.stream()
                .map(vehicle -> VehicleProfileDto.builder()
                        .id(vehicle.getId())
                        .brand(vehicle.getBrand())
                        .model(vehicle.getModel())
                        .registrationPlate(vehicle.getRegistrationPlate())
                        .manufactureYear(vehicle.getManufactureYear())
                        .status(vehicle.getStatus().name())
                        .category(vehicle.getCategory().name())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public VehicleProfileDto createVehicle(VehicleCreateDto dto) {

        if(vehicleRepository.existsVehicleByRegistrationPlate(dto.getRegistrationPlate())) {
            throw new ResourceAlreadyExistsException("Registration plate already exists!");
        }

        validateVehicleYear(dto.getManufactureYear());

        Vehicle newVehicle = Vehicle.builder()
                .brand(dto.getBrand())
                .model(dto.getModel())
                .registrationPlate(dto.getRegistrationPlate())
                .manufactureYear(dto.getManufactureYear())
                .status(VehicleStatus.RUNNING)
                .category(Category.valueOf(dto.getCategory().toUpperCase()))
                .build();

        Vehicle vehicle = vehicleRepository.save(newVehicle);

        return VehicleProfileDto.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationPlate(vehicle.getRegistrationPlate())
                .manufactureYear(vehicle.getManufactureYear())
                .status(vehicle.getStatus().name())
                .category(vehicle.getCategory().name())
                .build();
    }

    @Override
    @Transactional
    public VehicleProfileDto updateVehicle(Long id, VehicleUpdateDto dto) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found!"));

        if(vehicleRepository.existsVehicleByRegistrationPlateAndIdNot(dto.getRegistrationPlate(), id)) {
            throw new ResourceAlreadyExistsException("Registration plate already exists!");
        }

        validateVehicleYear(dto.getManufactureYear());

        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setRegistrationPlate(dto.getRegistrationPlate());
        vehicle.setManufactureYear(dto.getManufactureYear());
        vehicle.setCategory(Category.valueOf(dto.getCategory().toUpperCase()));

        vehicleRepository.save(vehicle);

        return VehicleProfileDto.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationPlate(vehicle.getRegistrationPlate())
                .manufactureYear(vehicle.getManufactureYear())
                .status(vehicle.getStatus().name())
                .category(vehicle.getCategory().name())
                .build();
    }

    @Override
    @Transactional
    public VehicleProfileDto updateVehicleStatus(Long id, String status) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found!"));

        vehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
        vehicleRepository.save(vehicle);

        return VehicleProfileDto.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationPlate(vehicle.getRegistrationPlate())
                .manufactureYear(vehicle.getManufactureYear())
                .status(vehicle.getStatus().name())
                .category(vehicle.getCategory().name())
                .build();
    }

    @Override
    @Transactional
    public VehicleProfileDto deleteVehicle(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found!"));

        vehicle.setStatus(VehicleStatus.ARCHIVED);
        vehicleRepository.save(vehicle);

        return VehicleProfileDto.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationPlate(vehicle.getRegistrationPlate())
                .manufactureYear(vehicle.getManufactureYear())
                .status(vehicle.getStatus().name())
                .category(vehicle.getCategory().name())
                .build();
    }
}
