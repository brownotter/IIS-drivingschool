package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.ProfessorAvailabilityDto;
import com.autoskola.demo.model.ProfessorAvailability;
import com.autoskola.demo.model.Role;
import com.autoskola.demo.model.User;
import com.autoskola.demo.repository.ProfessorAvailabilityRepository;
import com.autoskola.demo.repository.UserRepository;
import com.autoskola.demo.service.ProfessorAvailabilityService;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorAvailabilityServiceImpl implements ProfessorAvailabilityService {

    private final ProfessorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    @Override
    public ProfessorAvailability createAvailability(ProfessorAvailabilityDto dto) {

        if (dto.getAvailableDate() == null) {
            throw new RuntimeException("Available date is required");
        }
        User professor = userRepository.findById(dto.getProfessorId()).orElseThrow(() -> new RuntimeException("User not found"));
        if (professor.getRole() != Role.PROFESSOR) {
            throw new RuntimeException("User is not a professor");
        }
        validateNextWeek(dto.getAvailableDate());
        validateTime(dto);
        boolean overlap = availabilityRepository.existsOverlappingAvailability(professor, dto.getAvailableDate(), dto.getEndTime(), dto.getStartTime());
        if (overlap) {
            throw new RuntimeException("Professor already has availability in this period");
        }
        ProfessorAvailability availability =
                ProfessorAvailability.builder()
                        .availableDate(dto.getAvailableDate())
                        .startTime(dto.getStartTime())
                        .endTime(dto.getEndTime())
                        .professor(professor)
                        .build();

        return availabilityRepository.save(availability);
    }

    @Override
    public List<ProfessorAvailability> getProfessorAvailabilities(Long professorId) {
        User professor = userRepository.findById(professorId).orElseThrow(() -> new RuntimeException("User not found"));
        if (professor.getRole() != Role.PROFESSOR) {
            throw new RuntimeException("User is not a professor");
        }
        return availabilityRepository.findByProfessor(professor);
    }

    @Override
    public List<LocalDate> getNextWeekDates() {
        LocalDate today = LocalDate.now();
        LocalDate nextMonday = today.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        List<LocalDate> dates = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            dates.add(nextMonday.plusDays(i));
        }
        return dates;
    }

    private void validateTime(ProfessorAvailabilityDto dto) {

        if (dto.getEndTime().isBefore(dto.getStartTime()) || dto.getEndTime().equals(dto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
    }

    private void validateNextWeek(LocalDate date) {
        LocalDate today = LocalDate.now();
        LocalDate nextMonday = today.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDate weekAfterSunday = nextMonday.plusDays(13);
        if (date.isBefore(nextMonday) || date.isAfter(weekAfterSunday)) {
            throw new RuntimeException("Availability must be for next week or the week after!");
        }
    }
}