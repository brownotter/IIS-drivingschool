package com.autoskola.demo.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean read;
}