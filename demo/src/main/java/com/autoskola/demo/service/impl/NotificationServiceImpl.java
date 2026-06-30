package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.NotificationDto;
import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.Notification;
import com.autoskola.demo.model.Role;
import com.autoskola.demo.model.User;
import com.autoskola.demo.repository.CandidateRepository;
import com.autoskola.demo.repository.NotificationRepository;
import com.autoskola.demo.service.NotificationService;

import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CandidateRepository candidateRepository;

    @Override
    public void createNotification(
            Candidate candidate,
            String title,
            String message
    ) {

        Notification notification =
                Notification.builder()
                        .candidate(candidate)
                        .title(title)
                        .message(message)
                        .createdAt(LocalDateTime.now())
                        .read(false)
                        .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getMyNotifications(HttpSession session) {

        User sessionUser =
                (User) session.getAttribute("user");

        List<Notification> notifications;

        if (sessionUser.getRole() == Role.PROFESSOR) {

            notifications = notificationRepository
                    .findByUserIdOrderByCreatedAtDesc(
                            sessionUser.getId()
                    );

        } else {

            Candidate candidate =
                    candidateRepository
                            .findById(sessionUser.getId())
                            .orElseThrow();

            notifications = notificationRepository
                    .findByCandidateIdOrderByCreatedAtDesc(
                            candidate.getId()
                    );
        }

        return notifications
                .stream()
                .map(notification ->
                        NotificationDto.builder()
                                .id(notification.getId())
                                .title(notification.getTitle())
                                .message(notification.getMessage())
                                .createdAt(notification.getCreatedAt())
                                .read(notification.isRead())
                                .build()
                )
                .toList();
    }

    @Override
    public String markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow();

        notification.setRead(true);

        notificationRepository.save(notification);

        return "Notification marked as read.";
    }

    @Override
    public void createProfessorsNotification(User user, String title, String message) {
        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(title)
                        .message(message)
                        .createdAt(LocalDateTime.now())
                        .read(false)
                        .build();

        notificationRepository.save(notification);
    }
}