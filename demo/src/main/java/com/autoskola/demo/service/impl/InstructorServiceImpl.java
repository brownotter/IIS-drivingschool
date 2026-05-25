package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.InstructorCreateDto;
import com.autoskola.demo.dto.InstructorProfileDto;
import com.autoskola.demo.dto.InstructorUpdateDto;
import com.autoskola.demo.exception.UserNotFoundException;
import com.autoskola.demo.model.Category;
import com.autoskola.demo.model.Instructor;
import com.autoskola.demo.model.InstructorStatus;
import com.autoskola.demo.model.Role;
import com.autoskola.demo.repository.InstructorRepository;
import com.autoskola.demo.service.InstructorService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;


    @Override
    public List<InstructorProfileDto> getAllInstructors() {

        List<Instructor> instructors = instructorRepository.findAll();

        return instructors.stream()
                .map(instructor -> InstructorProfileDto.builder()
                        .id(instructor.getId())
                        .firstName(instructor.getFirstName())
                        .lastName(instructor.getLastName())
                        .email(instructor.getEmail())
                        .contact(instructor.getContact())
                        .teachingCategory(instructor.getTeachingCategory().name())
                        .licenceNumber(instructor.getLicenceNumber())
                        .status(instructor.getStatus().name())
                        .averageRate((instructor.getAverageRate()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InstructorProfileDto updateInstructorStatus(Long id, String status) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        InstructorStatus newStatus = InstructorStatus.valueOf(status.toUpperCase());
        instructor.setStatus(newStatus);
        instructorRepository.save(instructor);

        return InstructorProfileDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getFirstName())
                .lastName(instructor.getLastName())
                .email(instructor.getEmail())
                .contact(instructor.getContact())
                .teachingCategory(instructor.getTeachingCategory().name())
                .licenceNumber(instructor.getLicenceNumber())
                .status(instructor.getStatus().name())
                .averageRate((instructor.getAverageRate()))
                .build();
    }

    @Override
    public InstructorProfileDto createInstructor(InstructorCreateDto dto) {

        Instructor newInstructor = Instructor.builder()
                .username(dto.getUsername())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .contact(dto.getContact())
                .password(dto.getPassword())
                .role(Role.INSTRUCTOR)
                .teachingCategory(Category.valueOf(dto.getTeachingCategory().toUpperCase()))
                .licenceNumber(dto.getLicenceNumber())
                .status(InstructorStatus.WORKING)
                .hasCapacity(true)
                .averageRate(0.0)
                .averageCalmness(0.0)
                .averageDirectness(0.0)
                .averageStrictness(0.0)
                .build();

        Instructor instructor = instructorRepository.save(newInstructor);

        return InstructorProfileDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getFirstName())
                .lastName(instructor.getLastName())
                .email(instructor.getEmail())
                .contact(instructor.getContact())
                .teachingCategory(instructor.getTeachingCategory().name())
                .licenceNumber(instructor.getLicenceNumber())
                .status(instructor.getStatus().name())
                .averageRate((instructor.getAverageRate()))
                .build();
    }

    @Override
    @Transactional
    public InstructorProfileDto updateInstructor(Long id, InstructorUpdateDto dto) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        instructor.setFirstName(dto.getFirstName());
        instructor.setLastName(dto.getLastName());
        instructor.setEmail(dto.getEmail());
        instructor.setContact(dto.getContact());
        instructor.setTeachingCategory(Category.valueOf(dto.getTeachingCategory().toUpperCase()));
        instructor.setLicenceNumber(dto.getLicenceNumber());

        instructorRepository.save(instructor);

        return InstructorProfileDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getFirstName())
                .lastName(instructor.getLastName())
                .email(instructor.getEmail())
                .contact(instructor.getContact())
                .teachingCategory(instructor.getTeachingCategory().name())
                .licenceNumber(instructor.getLicenceNumber())
                .status(instructor.getStatus().name())
                .averageRate((instructor.getAverageRate()))
                .build();
    }

    @Override
    @Transactional
    public InstructorProfileDto deleteInstructor(Long id) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        instructor.setStatus(InstructorStatus.ARCHIVED);
        instructor.setHasCapacity(false);
        instructorRepository.save(instructor);

        return InstructorProfileDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getFirstName())
                .lastName(instructor.getLastName())
                .email(instructor.getEmail())
                .contact(instructor.getContact())
                .teachingCategory(instructor.getTeachingCategory().name())
                .licenceNumber(instructor.getLicenceNumber())
                .status(instructor.getStatus().name())
                .averageRate((instructor.getAverageRate()))
                .build();
    }

    @Override
    public List<InstructorProfileDto> getAllActiveInstructors() {

        List<Instructor> activeInstructors = instructorRepository.findAllActiveInstructors();

        return activeInstructors.stream()
                .map(instructor -> InstructorProfileDto.builder()
                        .id(instructor.getId())
                        .firstName(instructor.getFirstName())
                        .lastName(instructor.getLastName())
                        .email(instructor.getEmail())
                        .contact(instructor.getContact())
                        .teachingCategory(instructor.getTeachingCategory().name())
                        .licenceNumber(instructor.getLicenceNumber())
                        .status(instructor.getStatus().name())
                        .averageRate(instructor.getAverageRate())
                        .build())
                .collect(Collectors.toList());
    }

}
