package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.LoginDto;
import com.autoskola.demo.dto.LoginResponseDto;
import com.autoskola.demo.dto.RegistrationDto;
import com.autoskola.demo.exception.*;
import com.autoskola.demo.model.Candidate;
import com.autoskola.demo.model.Role;
import com.autoskola.demo.model.User;
import com.autoskola.demo.repository.CandidateRepository;
import com.autoskola.demo.repository.UserRepository;
import com.autoskola.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;

    @Override
    public LoginResponseDto login(LoginDto loginDto, HttpSession session) {

        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(UserNotFoundException::new);

        if(!user.getPassword().equals(loginDto.getPassword())) {
            throw new IncorrectPasswordException();
        }

        session.setAttribute("user", user);

        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                "Login successful"
        );
    }
    @Override
    public String register(RegistrationDto registrationDto) {
        for (User user : userRepository.findAll()) {

            if (user.getUsername().equals(registrationDto.getUsername())) {
                throw new UsernameAlreadyExistsException(registrationDto.getUsername());
            }
            else if (user.getEmail().equals(registrationDto.getEmail())) {
                throw new EmailAlreadyExistsException(registrationDto.getEmail());
            }
        }

        if(!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Candidate candidate = Candidate.builder()
                .firstName(registrationDto.getFirstName())
                .lastName(registrationDto.getLastName())
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .password(registrationDto.getPassword())
                .contact(registrationDto.getContact())
                .targetCategory(registrationDto.getCategory())
                .role(Role.CANDIDATE)
                .build();

        candidateRepository.save(candidate);
        return "User registered successfully";
    }
}
