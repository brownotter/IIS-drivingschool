package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.NotificationService;
import com.autoskola.demo.service.TheoryClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TheoryClassServiceImpl implements TheoryClassService {

    private final TheoryClassRepository theoryClassRepository;
    private final TheoryClassAttendanceRepository attendanceRepository;
    private final CandidateRepository candidateRepository;
    private final ProfessorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;
    private final NotificationService notificationService;

    @Override
    public void createTheoryClass(CreateTheoryClassDto dto) {

        User professor = getProfessor(dto.getProfessorId());
        Domain domain = getDomain(dto.getDomainId());
        checkProfessorAvailability(professor, dto);
        checkProfessorClassOverlap(professor, dto.getTheoryDate(), dto.getTheoryStartTime(), dto.getTheoryEndTime());

        TheoryClass theoryClass = createTheoryClassObject(dto, professor, domain);
        TheoryClass savedClass = theoryClassRepository.save(theoryClass);
        enrollInitialCandidates(savedClass, dto.getCandidateIds());
        theoryClassRepository.save(savedClass);
    }

    private User getProfessor(Long professorId) {

        User professor = userRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));
        if (professor.getRole() != Role.PROFESSOR) {
            throw new RuntimeException("User is not a professor");
        }
        return professor;
    }

    private Domain getDomain(Long domainId) {
        return domainRepository.findById(domainId).orElseThrow(() -> new RuntimeException("Domain not found"));
    }

    private void checkProfessorAvailability(User professor, CreateTheoryClassDto dto) {

        List<ProfessorAvailability> availabilities = availabilityRepository.getProfessorAvailabilitiesForPeriod(professor, dto.getTheoryDate(), dto.getTheoryDate());
        boolean hasAvailability = false;
        for (ProfessorAvailability availability : availabilities) {
            boolean startsAfterAvailability = !dto.getTheoryStartTime().isBefore(availability.getStartTime());
            boolean endsBeforeAvailability = !dto.getTheoryEndTime().isAfter(availability.getEndTime());
            if (startsAfterAvailability && endsBeforeAvailability) {
                hasAvailability = true;
                break;
            }
        }
        if (!hasAvailability) {
            throw new RuntimeException("Professor is not available");
        }
    }

    private void checkProfessorClassOverlap(User professor, LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime) {

        boolean overlap = theoryClassRepository.hasOverlappingClass(professor, date, endTime, startTime);
        if (overlap) {
            throw new RuntimeException("Professor already has class");
        }
    }

    private TheoryClass createTheoryClassObject(CreateTheoryClassDto dto, User professor, Domain domain) {

        TheoryClass theoryClass = new TheoryClass();
        theoryClass.setTheoryDate(dto.getTheoryDate());
        theoryClass.setTheoryStartTime(dto.getTheoryStartTime());
        theoryClass.setTheoryEndTime(dto.getTheoryEndTime());
        theoryClass.setCapacity(dto.getCapacity());
        theoryClass.setCurrentEnrolled(0);
        theoryClass.setProfessor(professor);
        theoryClass.setDomain(domain);
        theoryClass.setAttendances(new ArrayList<>());
        return theoryClass;
    }

    private void enrollInitialCandidates(TheoryClass theoryClass, List<Long> candidateIds) {

        for (Long candidateId : candidateIds) {
            Candidate candidate = getCandidate(candidateId);
            boolean alreadyExists = attendanceRepository.existsAttendance(candidate, theoryClass);
            if (alreadyExists) {
                continue;
            }
            TheoryClassAttendance attendance = new TheoryClassAttendance();
            attendance.setCandidate(candidate);
            attendance.setTheoryClass(theoryClass);
            attendance.setProfessor(theoryClass.getProfessor());
            attendance.setStatus(TheoryClassAttendanceStatus.ENROLLED);
            attendanceRepository.save(attendance);
            theoryClass.getAttendances().add(attendance);
            theoryClass.setCurrentEnrolled(theoryClass.getCurrentEnrolled() + 1);

            notificationService.createNotification(
                    candidate,
                    "Theory class scheduled",
                    "You have been enrolled in a theory class on "
                            + theoryClass.getTheoryDate()
                            + " at "
                            + theoryClass.getTheoryStartTime()
            );
        }
    }

    private Candidate getCandidate(Long candidateId) {
        return candidateRepository.findById(candidateId).orElseThrow(() -> new RuntimeException("Candidate not found"));
    }


    @Override
    @Transactional(readOnly = true)
    public List<AdminTheoryScheduleDto> getAdminSchedule() {

        LocalDate monday = getCurrentWeekMonday();
        LocalDate sunday = monday.plusDays(6);
        List<TheoryClass> classes = theoryClassRepository.findWeeklyScheduleWithAttendances(monday, sunday);
        List<AdminTheoryScheduleDto> result = new ArrayList<>();
        for (TheoryClass theoryClass : classes) {
            result.add(createAdminScheduleDto(theoryClass));
        }
        return result;
    }

    private LocalDate getCurrentWeekMonday() {

        LocalDate today = LocalDate.now();
        return today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    private AdminTheoryScheduleDto createAdminScheduleDto(TheoryClass theoryClass) {

        List<CandidateInfoDto> enrolledCandidates = new ArrayList<>();
        for (TheoryClassAttendance attendance : theoryClass.getAttendances()) {
            if (attendance.getStatus() == TheoryClassAttendanceStatus.ENROLLED) {
                Candidate candidate = attendance.getCandidate();
                enrolledCandidates.add(new CandidateInfoDto(candidate.getId(), candidate.getFirstName(), candidate.getLastName()));
            }
        }
        return new AdminTheoryScheduleDto(
                theoryClass.getTheoryId(),
                theoryClass.getTheoryDate(),
                theoryClass.getTheoryStartTime(),
                theoryClass.getTheoryEndTime(),
                theoryClass.getCapacity(),
                theoryClass.getCurrentEnrolled(),
                getFullName(theoryClass.getProfessor()),
                theoryClass.getDomain().getDomainName(),
                enrolledCandidates
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateTheoryScheduleDto> getCandidateSchedule(Long candidateId) {
        getCandidate(candidateId);
        LocalDate monday = getCurrentWeekMonday();
        LocalDate sunday = monday.plusDays(6);
        List<TheoryClass> classes = theoryClassRepository.findByTheoryDateBetween(monday, sunday);
        List<CandidateTheoryScheduleDto> result = new ArrayList<>();
        for (TheoryClass theoryClass : classes) {
            result.add(createCandidateScheduleDto(theoryClass, candidateId));
        }
        return result;
    }

    private CandidateTheoryScheduleDto createCandidateScheduleDto(TheoryClass theoryClass, Long candidateId) {

        String status = getCandidateClassStatus(theoryClass, candidateId);
        return new CandidateTheoryScheduleDto(
                theoryClass.getTheoryId(),
                theoryClass.getDomain().getDomainName(),
                theoryClass.getTheoryDate(),
                theoryClass.getTheoryStartTime(),
                theoryClass.getTheoryEndTime(),
                getFullName(theoryClass.getProfessor()),
                status
        );
    }

    private String getCandidateClassStatus(TheoryClass theoryClass, Long candidateId) {

        for (TheoryClassAttendance attendance : theoryClass.getAttendances()) {
            boolean sameCandidate = attendance.getCandidate().getId().equals(candidateId);
            boolean enrolled = attendance.getStatus() == TheoryClassAttendanceStatus.ENROLLED;
            if (sameCandidate && enrolled) {
                return "ENROLLED";
            }
        }
        if (theoryClass.getCurrentEnrolled() >= theoryClass.getCapacity()) {
            return "FULL";
        }
        return "AVAILABLE";
    }

    private String getFullName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorTheoryScheduleDto> getProfessorSchedule(Long professorId) {

        User professor = getProfessor(professorId);
        LocalDate monday = getCurrentWeekMonday();
        LocalDate sunday = monday.plusDays(6);
        List<TheoryClass> classes = theoryClassRepository.findByProfessorAndTheoryDateBetween(professor, monday, sunday);
        List<ProfessorTheoryScheduleDto> result = new ArrayList<>();
        for (TheoryClass theoryClass : classes) {
            result.add(new ProfessorTheoryScheduleDto(
                    theoryClass.getTheoryId(),
                    theoryClass.getDomain().getDomainName(),
                    theoryClass.getTheoryDate(),
                    theoryClass.getTheoryStartTime(),
                    theoryClass.getTheoryEndTime(),
                    theoryClass.getCurrentEnrolled(),
                    theoryClass.getCapacity()
            ));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorClassDetailsDto getClassDetailsForProfessor(Long theoryClassId) {

        TheoryClass theoryClass = getTheoryClass(theoryClassId);
        List<CandidateTheoryAttendanceInfoDto> candidateList = new ArrayList<>();
        long presentCount = 0;
        for (TheoryClassAttendance attendance : theoryClass.getAttendances()) {
            if (attendance.getStatus() == TheoryClassAttendanceStatus.ATTENDED) {
                presentCount++;
            }
            if (attendance.getStatus() != TheoryClassAttendanceStatus.CANCELLED) {
                Candidate candidate = attendance.getCandidate();
                candidateList.add(new CandidateTheoryAttendanceInfoDto(
                        attendance.getAttendanceId(),
                        candidate.getId(),
                        candidate.getFirstName(),
                        candidate.getLastName(),
                        attendance.getStatus().name()
                ));
            }
        }
        return new ProfessorClassDetailsDto(
                theoryClass.getTheoryId(),
                theoryClass.getDomain().getDomainName(),
                theoryClass.getTheoryDate(),
                theoryClass.getTheoryStartTime(),
                theoryClass.getTheoryEndTime(),
                getFullName(theoryClass.getProfessor()),
                presentCount,
                candidateList
        );
    }

    @Override
    @Transactional
    public void submitAttendance(Long theoryClassId, List<TheoryAttendanceRecordDto> records) {

        getTheoryClass(theoryClassId);
        for (TheoryAttendanceRecordDto record : records) {
            TheoryClassAttendance attendance = attendanceRepository.findById(record.getAttendanceId()).orElseThrow(() -> new RuntimeException("Attendance record not found"));
            TheoryClassAttendanceStatus oldStatus = attendance.getStatus();
            TheoryClassAttendanceStatus newStatus = TheoryClassAttendanceStatus.valueOf(record.getStatus().toUpperCase());
            attendance.setStatus(newStatus);
            if (oldStatus != TheoryClassAttendanceStatus.ATTENDED && newStatus == TheoryClassAttendanceStatus.ATTENDED) {
                increaseCandidateTheoryClassCount(attendance.getCandidate());
            }
            attendanceRepository.save(attendance);
        }
    }


    private TheoryClass getTheoryClass(Long theoryClassId) {
        return theoryClassRepository.findById(theoryClassId).orElseThrow(() -> new RuntimeException("Theory class not found"));
    }

    private void increaseCandidateTheoryClassCount(Candidate candidate) {

        candidate.setTheoryClassesCount(candidate.getTheoryClassesCount() + 1);
        candidateRepository.save(candidate);
    }

    @Override
    public void cancelAttendance(Long candidateId, Long theoryClassId) {

        Candidate candidate = getCandidate(candidateId);
        TheoryClass theoryClass = getTheoryClass(theoryClassId);
        TheoryClassAttendance attendance = attendanceRepository.findByCandidateAndTheoryClass(candidate, theoryClass).orElseThrow(() -> new RuntimeException("Attendance not found"));
        attendance.setStatus(TheoryClassAttendanceStatus.CANCELLED);
        attendanceRepository.save(attendance);
        updateCurrentEnrolled(theoryClass);
    }

    private void updateCurrentEnrolled(TheoryClass theoryClass) {

        Integer enrolledCount = attendanceRepository.countByTheoryClassAndStatus(theoryClass, TheoryClassAttendanceStatus.ENROLLED);
        theoryClass.setCurrentEnrolled(enrolledCount);
        theoryClassRepository.save(theoryClass);
    }

    @Override
    public void enrollCandidate(Long candidateId, Long theoryClassId) {

        Candidate candidate = getCandidate(candidateId);
        TheoryClass theoryClass = getTheoryClass(theoryClassId);
        if (theoryClass.getCurrentEnrolled() >= theoryClass.getCapacity()) {
            throw new RuntimeException("Class is full");
        }
        TheoryClassAttendance existingAttendance = attendanceRepository.findByCandidateAndTheoryClass(candidate, theoryClass).orElse(null);
        if (existingAttendance != null) {
            handleExistingAttendance(existingAttendance, candidate, theoryClass);
            return;
        }
        TheoryClassAttendance attendance = new TheoryClassAttendance();
        attendance.setCandidate(candidate);
        attendance.setTheoryClass(theoryClass);
        attendance.setProfessor(theoryClass.getProfessor());
        attendance.setStatus(TheoryClassAttendanceStatus.ENROLLED);
        attendanceRepository.save(attendance);
        updateCurrentEnrolled(theoryClass);
        sendTheoryEnrollmentNotification(candidate, theoryClass);
    }

    private void handleExistingAttendance(TheoryClassAttendance attendance, Candidate candidate, TheoryClass theoryClass) {

        if (attendance.getStatus() == TheoryClassAttendanceStatus.CANCELLED) {
            attendance.setStatus(TheoryClassAttendanceStatus.ENROLLED);
            attendanceRepository.save(attendance);
            updateCurrentEnrolled(theoryClass);
            sendTheoryEnrollmentNotification(candidate, theoryClass);
            return;
        }
        throw new RuntimeException("Candidate already has attendance record for this class");
    }

    private void sendTheoryEnrollmentNotification(Candidate candidate, TheoryClass theoryClass) {

        notificationService.createNotification(
                candidate,
                "Theory class enrollment",
                "You have successfully enrolled in a theory class on "
                        + theoryClass.getTheoryDate()
                        + " at "
                        + theoryClass.getTheoryStartTime()
        );
    }

    @Override
    public List<DomainDto> getAllDomains() {

        List<Domain> domains = domainRepository.findAll();
        List<DomainDto> result = new ArrayList<>();
        for (Domain domain : domains) {
            result.add(new DomainDto(domain.getDomainId(), domain.getDomainName(), domain.getDomainOrderNumber()));
        }
        return result;
    }
}