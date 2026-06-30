package com.autoskola.demo.service;

import com.autoskola.demo.dto.NotificationDto;
import com.autoskola.demo.model.Candidate;

import com.autoskola.demo.model.User;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface NotificationService {

    void createNotification(
            Candidate candidate,
            String title,
            String message
    );

    List<NotificationDto> getMyNotifications(
            HttpSession session
    );

    String markAsRead(Long notificationId);

    void createProfessorsNotification(
            User user,
            String title,
            String message
    );
}