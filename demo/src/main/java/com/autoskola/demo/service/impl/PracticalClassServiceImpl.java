package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.PracticalClassResponseDto;
import com.autoskola.demo.dto.PracticalSchedulingDto;
import com.autoskola.demo.exception.InvalidDataException;
import com.autoskola.demo.exception.ResourceAlreadyExistsException;
import com.autoskola.demo.exception.ResourceNotFoundException;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.PracticalClassService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticalClassServiceImpl implements PracticalClassService {

    private final PracticalClassRepository practicalClassRepository;
    private final CandidateRepository candidateRepository;
    private final InstructorRepository instructorRepository;
    private final TopicRepository topicRepository;
    private final VehicleRepository vehicleRepository;


    @Override
    @Transactional
    public PracticalClassResponseDto scheduleClass(PracticalSchedulingDto dto, Long instructorId) {

        LocalTime startTime = dto.getStartTime();
        LocalTime endTime = dto.getStartTime().plusMinutes(dto.getDurationMinutes());

        LocalDateTime requestedStart = LocalDateTime.of(dto.getDate(), startTime);

        if(requestedStart.isBefore(LocalDateTime.now())) {
            throw new InvalidDataException("You cannot schedule a class in the past!");
        }

        List<PracticalClass> relevantClasses = practicalClassRepository
                .findByDateAndInstructorIdOrCandidateIdOrVehicleId(dto.getDate(), instructorId, dto.getCandidateId(), dto.getVehicleId());

        int newClassesCount = dto.getDurationMinutes() / 45;
        int alreadyScheduledClassesCount = 0;

        for (PracticalClass pc : relevantClasses) {
            if (pc.getCandidate().getId().equals(dto.getCandidateId()) && (pc.getStatus() == PracticalClassStatus.PENDING || pc.getStatus() == PracticalClassStatus.SCHEDULED || pc.getStatus() == PracticalClassStatus.IN_PROGRESS)){
                long durationMinutes = Duration.between(pc.getStartTime(), pc.getEndTime()).toMinutes();
                alreadyScheduledClassesCount += (int) (durationMinutes / 45);
            }
        }

        if(alreadyScheduledClassesCount + newClassesCount > 2) {
            throw new InvalidDataException(String.format("Legal limit exceeded! The candidate already has %d class(es) scheduled for this day. You cannot add %d more.", alreadyScheduledClassesCount, newClassesCount));
        }

        for(PracticalClass pc : relevantClasses) {

            boolean isClassActive = pc.getStatus() == PracticalClassStatus.PENDING || pc.getStatus() == PracticalClassStatus.SCHEDULED || pc.getStatus() == PracticalClassStatus.IN_PROGRESS;

            if (isClassActive) {
                boolean isTimeOverlapping = startTime.isBefore(pc.getEndTime()) && endTime.isAfter(pc.getStartTime());

                if(isTimeOverlapping) {
                    if(pc.getInstructor().getId().equals(instructorId)) {
                        throw new ResourceAlreadyExistsException("You already have an active class scheduled in this time period!");
                    }
                    if(pc.getCandidate().getId().equals(dto.getCandidateId())) {
                        throw new ResourceAlreadyExistsException("The candidate already has an active class scheduled in this time period!");
                    }
                    if(pc.getVehicle().getId().equals(dto.getVehicleId())) {
                        throw new ResourceAlreadyExistsException("The selected vehicle has just been booked by another instructor!");
                    }
                }
            }
        }

        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found!"));

        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found!"));

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found!"));

        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found!"));


        PracticalClass practicalClass = PracticalClass.builder()
                .date(dto.getDate())
                .startTime(startTime)
                .endTime(endTime)
                .meetingPoint(dto.getMeetingPoint())
                .status(PracticalClassStatus.PENDING)
                .candidate(candidate)
                .instructor(instructor)
                .vehicle(vehicle)
                .topic(topic)
                .build();

        PracticalClass savedClass = practicalClassRepository.save(practicalClass);

        return PracticalClassResponseDto.builder()
                .id(savedClass.getId())
                .date(savedClass.getDate())
                .startTime(savedClass.getStartTime())
                .endTime(savedClass.getEndTime())
                .meetingPoint(savedClass.getMeetingPoint())
                .status(savedClass.getStatus().name())
                .candidateName(savedClass.getCandidate().getFirstName() + " " + savedClass.getCandidate().getLastName())
                .topicName("(" + savedClass.getTopic().getArea() + ") " + savedClass.getTopic().getName())
                .vehicleName(savedClass.getVehicle().getBrand() + " " + savedClass.getVehicle().getModel() + " (" + savedClass.getVehicle().getRegistrationPlate() + ")")
                .build();
    }
}
