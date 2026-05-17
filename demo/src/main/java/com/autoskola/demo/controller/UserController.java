package com.autoskola.demo.controller;

import com.autoskola.demo.dto.LoginDto;
import com.autoskola.demo.dto.RegistrationDto;
import com.autoskola.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("user")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5174/",
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDto loginDto, HttpSession session) {
        return ResponseEntity.ok(userService.login(loginDto, session));
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        if(session.getAttribute("user") != null) {
            session.invalidate();
            return ResponseEntity.ok("Logout successful!");
        }
        throw new RuntimeException("Logout failed");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.register(registrationDto));
    }
}
