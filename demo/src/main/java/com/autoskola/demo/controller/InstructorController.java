package com.autoskola.demo.controller;

import com.autoskola.demo.dto.InstructorCreateDto;
import com.autoskola.demo.dto.InstructorProfileDto;
import com.autoskola.demo.dto.InstructorUpdateDto;
import com.autoskola.demo.exception.AccessDeniedException;
import com.autoskola.demo.model.User;
import com.autoskola.demo.service.InstructorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    private void checkAdminAccess(HttpSession session) {

        User loggedUser = (User) session.getAttribute("user");

        if(loggedUser == null || !loggedUser.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException();
        }
    }

    private void checkInstructorAccess(HttpSession session) {

        User loggedUser = (User) session.getAttribute("user");

        if(loggedUser == null || !loggedUser.getRole().name().equals("INSTRUCTOR")) {
            throw new AccessDeniedException();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<InstructorProfileDto> getInstructorProfile(HttpSession session) {
        checkInstructorAccess(session);
        return ResponseEntity.ok(instructorService.getInstructorProfile(session));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InstructorProfileDto>> getAllInstructors(HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(instructorService.getAllInstructors());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InstructorProfileDto> updateInstructorStatus(@PathVariable Long id, @RequestParam String status, HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(instructorService.updateInstructorStatus(id, status));
    }

    @PostMapping
    public ResponseEntity<InstructorProfileDto> createInstructor(@Valid @RequestBody InstructorCreateDto dto, HttpSession session) {
        checkAdminAccess(session);
        return new ResponseEntity<>(instructorService.createInstructor(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstructorProfileDto> updateInstructor(@PathVariable Long id, @Valid @RequestBody InstructorUpdateDto dto, HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(instructorService.updateInstructor(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<InstructorProfileDto> deleteInstructor(@PathVariable Long id, HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(instructorService.deleteInstructor(id));
    }
}

