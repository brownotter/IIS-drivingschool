package com.autoskola.demo.repository;
import com.autoskola.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    long countByCandidateIdAndReadFalse(Long candidateId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long id);
}