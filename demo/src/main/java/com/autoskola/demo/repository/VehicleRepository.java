package com.autoskola.demo.repository;

import com.autoskola.demo.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v WHERE v.status != com.autoskola.demo.model.VehicleStatus.ARCHIVED")
    List<Vehicle> findAllActiveVehicles();
    boolean existsVehicleByRegistrationPlate(String registrationPlate);
    boolean existsVehicleByRegistrationPlateAndIdNot(String registrationPlate, Long id);
}
