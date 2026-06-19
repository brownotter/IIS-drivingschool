package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.exception.ResourceAlreadyExistsException;
import com.autoskola.demo.exception.UserNotFoundException;
import com.autoskola.demo.exception.UsernameAlreadyExistsException;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.CandidateRepository;
import com.autoskola.demo.repository.InstructorRepository;
import com.autoskola.demo.repository.PracticalClassRepository;
import com.autoskola.demo.service.InstructorService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;
    private final CandidateRepository candidateRepository;
    private final PracticalClassRepository practicalClassRepository;


    @Override
    public InstructorProfileDto getInstructorProfile(HttpSession session) {

        User user = (User) session.getAttribute("user");

        Instructor instructor = instructorRepository.findById(user.getId())
                .orElseThrow(UserNotFoundException::new);

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

        if (instructorRepository.existsByUsername(dto.getUsername())) {
            throw new UsernameAlreadyExistsException(dto.getUsername());
        }
        if (instructorRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists!");
        }
        if (instructorRepository.existsByLicenceNumber(dto.getLicenceNumber())) {
            throw new ResourceAlreadyExistsException("Licence number already exists!");
        }
        if (instructorRepository.existsByContact(dto.getContact())) {
            throw new ResourceAlreadyExistsException("Contact already exists!");
        }

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

        if(instructorRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new ResourceAlreadyExistsException("Email already exists!");
        }
        if(instructorRepository.existsByLicenceNumberAndIdNot(dto.getLicenceNumber(), id)) {
            throw new ResourceAlreadyExistsException("Licence number already exists!");
        }
        if(instructorRepository.existsByContactAndIdNot(dto.getContact(), id)) {
            throw new ResourceAlreadyExistsException("Contact already exists!");
        }

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
    @Transactional
    public CandidateLogSummaryDto getCandidateLogSummary(Long candidateId) {

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(UserNotFoundException::new);

        List<PracticalClass> classes = practicalClassRepository
                .findByCandidateIdOrderByDateDescStartTimeDesc(candidateId);

        List<PracticalClassDto> dtoClasses = new ArrayList<>();
        int completedClassesCount = 0;

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        int totalClasses = classes.size();

        String instructorName = (candidate.getInstructor() != null)
                ? candidate.getInstructor().getFirstName() + " " + candidate.getInstructor().getLastName()
                : "None";

        for (int i = 0; i < totalClasses; i++) {
            PracticalClass practicalClass = classes.get(i);
            int orderNum = totalClasses - i;

            String noteText = "";
            if (practicalClass.getLessonLog() != null) {
                noteText = practicalClass.getLessonLog().getInstructorNote();
            }

            if (PracticalClassStatus.COMPLETED.equals(practicalClass.getStatus())) {
                completedClassesCount++;
            }

            PracticalClassDto dto = PracticalClassDto.builder()
                    .orderNum(orderNum)
                    .topicName(practicalClass.getTopic() != null ? practicalClass.getTopic().getName() : "Not defined.")
                    .classDate(practicalClass.getDate() != null ? practicalClass.getDate().format(dateFormatter) : "DD/MM/YYYY")
                    .startTime(practicalClass.getStartTime() != null ? practicalClass.getStartTime().format(timeFormatter) : "XX:XX")
                    .endTime(practicalClass.getEndTime() != null ? practicalClass.getEndTime().format(timeFormatter) : "XX:XX")
                    .note(noteText)
                    .status(practicalClass.getStatus().name())
                    .build();

            dtoClasses.add(dto);
        }

        String systemRecommendation = "No active recommendations. The system is waiting for the next class to be completed.";

        return CandidateLogSummaryDto.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .targetCategory(candidate.getCategoryPackage().getCategory().name())
                .practiceClassesCount(completedClassesCount)
                .assignedInstructor(instructorName)
                .recommendation(systemRecommendation)
                .classes(dtoClasses)
                .build();
    }
}
