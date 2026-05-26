package com.autoskola.demo.service;

import com.autoskola.demo.dto.VehicleCreateDto;
import com.autoskola.demo.dto.VehicleProfileDto;
import com.autoskola.demo.dto.VehicleUpdateDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VehicleService {

    List<VehicleProfileDto> getAllVehicles(boolean activeOnly);
    VehicleProfileDto createVehicle(VehicleCreateDto dto);
    VehicleProfileDto updateVehicle(Long id, VehicleUpdateDto dto);
    VehicleProfileDto updateVehicleStatus(Long id, String status);
    VehicleProfileDto deleteVehicle(Long id);
}
