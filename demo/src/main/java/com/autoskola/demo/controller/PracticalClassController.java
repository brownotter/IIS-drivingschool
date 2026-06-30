package com.autoskola.demo.controller;

import com.autoskola.demo.dto.PracticalClassResponseDto;
import com.autoskola.demo.dto.PracticalSchedulingDto;
import com.autoskola.demo.exception.AccessDeniedException;
import com.autoskola.demo.model.User;
import com.autoskola.demo.service.PracticalClassService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class PracticalClassController {

    private final PracticalClassService practicalClassService;

    private void checkInstructorAccess(HttpSession session) {

        User loggedUser = (User) session.getAttribute("user");

        if(loggedUser == null || !loggedUser.getRole().name().equals("INSTRUCTOR")) {
            throw new AccessDeniedException();
        }
    }

    @PostMapping("/schedule")
    public ResponseEntity<PracticalClassResponseDto> scheduleClass(@Valid @RequestBody PracticalSchedulingDto dto, HttpSession session) {
        checkInstructorAccess(session);
        User loggedUser = (User) session.getAttribute("user");
        return ResponseEntity.ok(practicalClassService.scheduleClass(dto, loggedUser.getId()));
    }
    
}
