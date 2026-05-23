package com.autoskola.demo.service;

import com.autoskola.demo.dto.EmployeeProfileDto;
import com.autoskola.demo.dto.UpdateEmployeeDto;
import jakarta.servlet.http.HttpSession;

public interface EmployeeService {
    EmployeeProfileDto getProfile(HttpSession session);
    String updateProfile(UpdateEmployeeDto dto, HttpSession session);
}