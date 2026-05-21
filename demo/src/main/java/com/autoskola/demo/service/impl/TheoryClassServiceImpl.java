package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.TheoryClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class TheoryClassServiceImpl implements TheoryClassService {

    private final TheoryClassRepository theoryClassRepository;
    private final TheoryClassAttendanceRepository attendanceRepository;
    private final CandidateRepository candidateRepository;
    private final ProfessorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;

    @Override
    public void createTheoryClass(CreateTheoryClassDto dto) {

        User professor = userRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (professor.getRole() != Role.PROFESSOR) {
            throw new RuntimeException("User is not a professor");
        }

        Domain domain = domainRepository.findById(dto.getDomainId())
                .orElseThrow(() -> new RuntimeException("Domain not found"));

        boolean hasAvailability =
                availabilityRepository.findByProfessorAndAvailableDateBetween(
                                professor,
                                dto.getTheoryDate(),
                                dto.getTheoryDate()
                        )
                        .stream()
                        .anyMatch(a ->
                                !dto.getTheoryStartTime().isBefore(a.getStartTime())
                                        && !dto.getTheoryEndTime().isAfter(a.getEndTime())
                        );

        if (!hasAvailability) {
            throw new RuntimeException("Professor is not available");
        }

        boolean overlap =
                theoryClassRepository
                        .existsByProfessorAndTheoryDateAndTheoryStartTimeLessThanAndTheoryEndTimeGreaterThan(
                                professor,
                                dto.getTheoryDate(),
                                dto.getTheoryEndTime(),
                                dto.getTheoryStartTime()
                        );

        if (overlap) {
            throw new RuntimeException("Professor already has class");
        }

        TheoryClass theoryClass = new TheoryClass();

        theoryClass.setTheoryDate(dto.getTheoryDate());
        theoryClass.setTheoryStartTime(dto.getTheoryStartTime());
        theoryClass.setTheoryEndTime(dto.getTheoryEndTime());
        theoryClass.setCapacity(dto.getCapacity());
        theoryClass.setCurrentEnrolled(0);
        theoryClass.setProfessor(professor);
        theoryClass.setDomain(domain);

        theoryClass.setAttendances(new ArrayList<>());

        TheoryClass savedClass = theoryClassRepository.save(theoryClass);

        for (Long candidateId : dto.getCandidateIds()) {

            Candidate candidate = candidateRepository.findById(candidateId)
                    .orElseThrow(() ->
                            new RuntimeException("Candidate not found"));

            TheoryClassAttendance attendance = new TheoryClassAttendance();

            attendance.setCandidate(candidate);
            attendance.setTheoryClass(savedClass);
            attendance.setProfessor(professor);
            attendance.setStatus(TheoryClassAttendanceStatus.ENROLLED);

            attendanceRepository.save(attendance);

            savedClass.getAttendances().add(attendance);

            savedClass.setCurrentEnrolled(
                    savedClass.getCurrentEnrolled() + 1
            );
        }

        theoryClassRepository.save(savedClass);
    }

    @Override
    @Transactional
    public void autoGenerateSchedule(com.autoskola.demo.dto.AutoGenerateTheoryScheduleDto dto) {
        Domain domain = domainRepository.findById(dto.getDomainId())
                .orElseThrow(() -> new RuntimeException("Domain not found"));

        List<ProfessorAvailability> availabilities = availabilityRepository
                .findByAvailableDateBetween(dto.getStartDate(), dto.getEndDate());

        int createdClassesCount = 0;

        for (ProfessorAvailability availability : availabilities) {
            User professor = availability.getProfessor();
            LocalDate date = availability.getAvailableDate();

            boolean overlap = theoryClassRepository
                    .existsByProfessorAndTheoryDateAndTheoryStartTimeLessThanAndTheoryEndTimeGreaterThan(
                            professor,
                            date,
                            availability.getEndTime(),
                            availability.getStartTime());

            if (!overlap) {
                TheoryClass theoryClass = new TheoryClass();
                theoryClass.setTheoryDate(date);
                theoryClass.setTheoryStartTime(availability.getStartTime());
                theoryClass.setTheoryEndTime(availability.getEndTime());
                theoryClass.setCapacity(dto.getDefaultCapacity());
                theoryClass.setCurrentEnrolled(0);
                theoryClass.setProfessor(professor);
                theoryClass.setDomain(domain);
                theoryClass.setAttendances(new ArrayList<>());

                theoryClassRepository.save(theoryClass);
                createdClassesCount++;
            }
        }

        if (createdClassesCount == 0) {
            throw new RuntimeException("Nije generisan nijedan novi čas. Ili nema unetih slobodnih termina profesora, ili su svi termini već zauzeti postojećim časovima.");
        }
    }


    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<AdminTheoryScheduleDto> getAdminSchedule() {

        LocalDate today = LocalDate.now();

        LocalDate monday =
                today.with(
                        TemporalAdjusters.previousOrSame(
                                DayOfWeek.MONDAY
                        )
                );

        LocalDate sunday = monday.plusDays(6);

        List<TheoryClass> classes =
                theoryClassRepository
                        .findWeeklyScheduleWithAttendances(
                                monday,
                                sunday
                        );

        return classes.stream()
                .map(tc -> {

                    List<CandidateInfoDto> enrolledCandidates =
                            tc.getAttendances()
                                    .stream()
                                    .filter(a ->
                                            a.getStatus() ==
                                                    TheoryClassAttendanceStatus.ENROLLED
                                    )
                                    .map(a ->
                                            new CandidateInfoDto(
                                                    a.getCandidate().getId(),
                                                    a.getCandidate().getFirstName(),
                                                    a.getCandidate().getLastName()
                                            )
                                    )
                                    .toList();

                    return new AdminTheoryScheduleDto(
                            tc.getTheoryId(),
                            tc.getTheoryDate(),
                            tc.getTheoryStartTime(),
                            tc.getTheoryEndTime(),
                            tc.getCapacity(),
                            tc.getCurrentEnrolled(),
                            tc.getProfessor().getFirstName()
                                    + " "
                                    + tc.getProfessor().getLastName(),
                            tc.getDomain().getDomainName(),
                            enrolledCandidates
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateTheoryScheduleDto> getCandidateSchedule(
            Long candidateId
    ) {

        candidateRepository.findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        LocalDate today = LocalDate.now();

        LocalDate monday =
                today.with(
                        TemporalAdjusters.previousOrSame(
                                DayOfWeek.MONDAY
                        )
                );

        LocalDate sunday = monday.plusDays(6);

        List<TheoryClass> allClasses =
                theoryClassRepository.findByTheoryDateBetween(
                        monday,
                        sunday
                );

        return allClasses.stream()
                .map(tc -> {

                    String status = "AVAILABLE";

                    boolean isEnrolled =
                            tc.getAttendances()
                                    .stream()
                                    .anyMatch(a ->
                                            a.getCandidate().getId()
                                                    .equals(candidateId)
                                                    && a.getStatus() ==
                                                    TheoryClassAttendanceStatus.ENROLLED
                                    );

                    if (isEnrolled) {
                        status = "ENROLLED";
                    } else if (
                            tc.getCurrentEnrolled()
                                    >= tc.getCapacity()
                    ) {
                        status = "FULL";
                    }

                    return new CandidateTheoryScheduleDto(
                            tc.getTheoryId(),
                            tc.getDomain().getDomainName(),
                            tc.getTheoryDate(),
                            tc.getTheoryStartTime(),
                            tc.getTheoryEndTime(),
                            tc.getProfessor().getFirstName()
                                    + " "
                                    + tc.getProfessor().getLastName(),
                            status
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorTheoryScheduleDto> getProfessorSchedule(Long professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (professor.getRole() != Role.PROFESSOR) {
            throw new RuntimeException("User is not a professor");
        }

        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = monday.plusDays(6);

        List<TheoryClass> classes = theoryClassRepository
                .findByProfessorAndTheoryDateBetween(professor, monday, sunday);

        return classes.stream()
                .map(tc -> new ProfessorTheoryScheduleDto(
                        tc.getTheoryId(),
                        tc.getDomain().getDomainName(),
                        tc.getTheoryDate(),
                        tc.getTheoryStartTime(),
                        tc.getTheoryEndTime(),
                        tc.getCurrentEnrolled(),
                        tc.getCapacity()
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorClassDetailsDto getClassDetailsForProfessor(Long theoryClassId) {
        TheoryClass tc = theoryClassRepository.findById(theoryClassId)
                .orElseThrow(() -> new RuntimeException("Theory class not found"));

        // Koristi se izmenjeni CandidateTheoryAttendanceInfoDto šablon
        List<CandidateTheoryAttendanceInfoDto> candidateList = tc.getAttendances().stream()
                .filter(a -> a.getStatus() != TheoryClassAttendanceStatus.CANCELLED)
                .map(a -> new CandidateTheoryAttendanceInfoDto(
                        a.getAttendanceId(),
                        a.getCandidate().getId(),
                        a.getCandidate().getFirstName(),
                        a.getCandidate().getLastName(),
                        a.getStatus().name()
                ))
                .toList();

        long presentCount = tc.getAttendances().stream()
                .filter(a -> a.getStatus() == TheoryClassAttendanceStatus.ATTENDED)
                .count();

        String professorFullName = tc.getProfessor().getFirstName() + " " + tc.getProfessor().getLastName();

        return new ProfessorClassDetailsDto(
                tc.getTheoryId(),
                tc.getDomain().getDomainName(),
                tc.getTheoryDate(),
                tc.getTheoryStartTime(),
                tc.getTheoryEndTime(),
                professorFullName,
                presentCount,
                candidateList
        );
    }

    @Override
    @Transactional
    public void submitAttendance(Long theoryClassId, List<TheoryAttendanceRecordDto> records) { // Izmenjeno ime DTO-a
        theoryClassRepository.findById(theoryClassId)
                .orElseThrow(() -> new RuntimeException("Theory class not found"));

        for (TheoryAttendanceRecordDto record : records) {
            TheoryClassAttendance attendance = attendanceRepository.findById(record.getAttendanceId())
                    .orElseThrow(() -> new RuntimeException("Attendance record not found for ID: " + record.getAttendanceId()));

            TheoryClassAttendanceStatus newStatus = TheoryClassAttendanceStatus.valueOf(record.getStatus().toUpperCase());
            attendance.setStatus(newStatus);

            attendanceRepository.save(attendance);
        }
    }

    @Override
    public void cancelAttendance(
            Long candidateId,
            Long theoryClassId
    ) {

        Candidate candidate =
                candidateRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException("Candidate not found"));

        TheoryClass theoryClass =
                theoryClassRepository.findById(theoryClassId)
                        .orElseThrow(() ->
                                new RuntimeException("Theory class not found"));

        TheoryClassAttendance attendance =
                attendanceRepository
                        .findByCandidateAndTheoryClass(
                                candidate,
                                theoryClass
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Attendance not found"));

        attendance.setStatus(
                TheoryClassAttendanceStatus.CANCELLED
        );

        attendanceRepository.save(attendance);

        Integer enrolledCount = attendanceRepository
                .countByTheoryClassAndStatus(
                        theoryClass,
                        TheoryClassAttendanceStatus.ENROLLED
                );

        theoryClass.setCurrentEnrolled(enrolledCount);

        theoryClassRepository.save(theoryClass);
    }

    @Override
    public void enrollCandidate(
            Long candidateId,
            Long theoryClassId
    ) {

        Candidate candidate =
                candidateRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException("Candidate not found"));

        TheoryClass theoryClass =
                theoryClassRepository.findById(theoryClassId)
                        .orElseThrow(() ->
                                new RuntimeException("Theory class not found"));

        if (
                theoryClass.getCurrentEnrolled()
                        >= theoryClass.getCapacity()
        ) {
            throw new RuntimeException("Class is full");
        }

        boolean alreadyExists =
                attendanceRepository
                        .existsByCandidateAndTheoryClassAndStatus(
                                candidate,
                                theoryClass,
                                TheoryClassAttendanceStatus.ENROLLED
                        );

        if (alreadyExists) {
            throw new RuntimeException("Candidate already enrolled");
        }

        TheoryClassAttendance attendance =
                new TheoryClassAttendance();

        attendance.setCandidate(candidate);
        attendance.setTheoryClass(theoryClass);
        attendance.setProfessor(theoryClass.getProfessor());
        attendance.setStatus(
                TheoryClassAttendanceStatus.ENROLLED
        );

        attendanceRepository.save(attendance);

        //theoryClass.getAttendances().add(attendance);

        Integer enrolledCount = attendanceRepository
                .countByTheoryClassAndStatus(
                        theoryClass,
                        TheoryClassAttendanceStatus.ENROLLED
                );

        theoryClass.setCurrentEnrolled(enrolledCount);

        theoryClassRepository.save(theoryClass);
    }
}