package com.autoskola.demo.controller;

import com.autoskola.demo.dto.NotificationDto;
import com.autoskola.demo.service.NotificationService;

import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationDto>>
    getMyNotifications(HttpSession session) {

        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications(session)
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String>
    markAsRead(@PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

}