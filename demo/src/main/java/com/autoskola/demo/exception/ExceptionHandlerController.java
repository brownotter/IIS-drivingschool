package com.autoskola.demo.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.time.LocalDateTime;

@ControllerAdvice
@Slf4j
public class ExceptionHandlerController {

    private ResponseEntity<ExceptionResponse> preparedResponse(HttpStatus httpStatus, String message) {
        ExceptionResponse response = new ExceptionResponse(httpStatus, LocalDateTime.now(), message);
        log.info("Exception: {}", response);
        return new ResponseEntity<>(response, httpStatus);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    static class ExceptionResponse {
        private HttpStatus httpStatus;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
        private LocalDateTime timestamp;
        private String message;
    }
}
