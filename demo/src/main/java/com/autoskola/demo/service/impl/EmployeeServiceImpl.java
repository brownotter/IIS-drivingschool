package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.EmployeeProfileDto;
import com.autoskola.demo.dto.UpdateEmployeeDto;
import com.autoskola.demo.model.Employee;
import com.autoskola.demo.model.User;
import com.autoskola.demo.repository.EmployeeRepository;
import com.autoskola.demo.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeProfileDto getProfile(HttpSession session) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("Not logged in.");
        }

        Employee employee = employeeRepository.findById(sessionUser.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found."));

        EmployeeProfileDto dto = new EmployeeProfileDto();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setUsername(employee.getUsername());
        dto.setEmail(employee.getEmail());
        dto.setContact(employee.getContact());
        return dto;
    }

    @Override
    public String updateProfile(UpdateEmployeeDto dto, HttpSession session) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("Not logged in.");
        }

        Employee employee = employeeRepository.findById(sessionUser.getId())
                .orElseThrow(() -> new RuntimeException("Employee not found."));

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setUsername(dto.getUsername());
        employee.setEmail(dto.getEmail());
        employee.setContact(dto.getContact());

        employeeRepository.save(employee);
        return "Profile updated successfully.";
    }
}