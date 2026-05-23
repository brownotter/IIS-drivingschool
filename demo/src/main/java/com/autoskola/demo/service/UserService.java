package com.autoskola.demo.service;

import com.autoskola.demo.dto.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface UserService {
    LoginResponseDto login(LoginDto loginDto, HttpSession session);

    String register(RegistrationDto registrationDto);
    AdminProfileDto getAdminProfile(HttpSession session);
    ProfessorProfileDto getProfessorProfile(HttpSession session);
    List<ProfessorProfileDto> getAllProfessors();
}
