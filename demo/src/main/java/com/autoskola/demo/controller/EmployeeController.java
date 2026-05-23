package com.autoskola.demo.controller;

import com.autoskola.demo.dto.EmployeeProfileDto;
import com.autoskola.demo.dto.UpdateEmployeeDto;
import com.autoskola.demo.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileDto> getProfile(HttpSession session) {
        return ResponseEntity.ok(employeeService.getProfile(session));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateEmployeeDto dto,
            HttpSession session
    ) {
        return ResponseEntity.ok(employeeService.updateProfile(dto, session));
    }
}