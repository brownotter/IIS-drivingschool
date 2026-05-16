package com.autoskola.demo.service;

import com.autoskola.demo.dto.LoginDto;
import com.autoskola.demo.dto.RegistrationDto;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;

public interface UserService {

    String login(LoginDto loginDto, HttpSession session);

    String register(RegistrationDto registrationDto);
}
