package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.exception.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.CandidateRepository;
import com.autoskola.demo.repository.CategoryPackageRepository;
import com.autoskola.demo.repository.UserRepository;
import com.autoskola.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final CategoryPackageRepository categoryPackageRepository;

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
                "Login successful!"
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
        //dodato - kategorija se cita iz paketa kategorije(tu su mi cena itd..)
        CategoryPackage categoryPackage =
                categoryPackageRepository
                        .findByCategory(
                                registrationDto.getCategory()
                        )
                        .orElseThrow();

        Candidate candidate = Candidate.builder()
                .firstName(registrationDto.getFirstName())
                .lastName(registrationDto.getLastName())
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .password(registrationDto.getPassword())
                .contact(registrationDto.getContact())
                //.targetCategory(registrationDto.getCategory())
                .categoryPackage(categoryPackage)
                .registrationDate(LocalDate.now())
                .role(Role.CANDIDATE)
                .theoryClassesCount(0)
                .theoryAttemptsCount(0)
                .practiceClassesCount(0)
                .practiceAttemptsCount(0)
                .status(CandidateStatus.THEORY)
                .build();

        candidateRepository.save(candidate);
        return "User registered successfully";
    }

    @Override
    public AdminProfileDto getAdminProfile(HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");

        if(sessionUser == null) {
            throw new RuntimeException("User not logged in");
        }

        return new AdminProfileDto(
                sessionUser.getFirstName(),
                sessionUser.getLastName(),
                sessionUser.getUsername(),
                sessionUser.getEmail(),
                sessionUser.getContact()
        );
    }

    @Override
    public ProfessorProfileDto getProfessorProfile(HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");

        if(sessionUser == null) {
            throw new RuntimeException("User not logged in");
        }

        return new ProfessorProfileDto(
                sessionUser.getId(),
                sessionUser.getFirstName(),
                sessionUser.getLastName(),
                sessionUser.getUsername(),
                sessionUser.getEmail(),
                sessionUser.getContact()
        );
    }


    public List<ProfessorProfileDto> getAllProfessors() {
        List<User> professors = userRepository.findByRole(Role.PROFESSOR);

        return professors.stream().map(prof -> new ProfessorProfileDto(
                prof.getId(),
                prof.getFirstName(),
                prof.getLastName(),
                prof.getUsername(),
                prof.getEmail(),
                prof.getContact()
        )).collect(Collectors.toList());
    }

    @Override
    public String updateProfile(UpdateUserDto dto, HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");

        sessionUser.setFirstName(dto.getFirstName());
        sessionUser.setLastName(dto.getLastName());
        sessionUser.setUsername(dto.getUsername());
        sessionUser.setEmail(dto.getEmail());
        sessionUser.setContact(dto.getContact());

        userRepository.save(sessionUser);

        return "Profile updated!";
    }


}
