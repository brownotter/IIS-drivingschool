package com.autoskola.demo.controller;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.TheoryClass;
import com.autoskola.demo.service.TheoryClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theory-classes")
@RequiredArgsConstructor
public class TheoryClassController {

    private final TheoryClassService theoryClassService;

    @PostMapping
    public ResponseEntity<String> createTheoryClass(@RequestBody CreateTheoryClassDto dto) {
        theoryClassService.createTheoryClass(dto);
        return ResponseEntity.ok("Čas je uspešno kreiran!");
    }

    @PostMapping("/auto-generate")
    public ResponseEntity<String> autoGenerateSchedule(@RequestBody AutoGenerateTheoryScheduleDto dto) {
        theoryClassService.autoGenerateSchedule(dto);
        return ResponseEntity.ok("Automatski raspored je uspešno generisan na osnovu slobodnih termina profesora!");
    }

    @GetMapping("/admin-weekly-schedule")
    public List<AdminTheoryScheduleDto> getAdminSchedule() {return theoryClassService.getAdminSchedule();
    }

    @GetMapping("/candidate/{candidateId}")
    public List<CandidateTheoryScheduleDto> getCandidateSchedule(@PathVariable Long candidateId) {
        return theoryClassService.getCandidateSchedule(candidateId);
    }

    @PutMapping("/{theoryClassId}/cancel/{candidateId}")
    public void cancelAttendance(@PathVariable Long theoryClassId, @PathVariable Long candidateId) {
        theoryClassService.cancelAttendance(candidateId, theoryClassId);
    }

    @PutMapping("/{theoryClassId}/enroll/{candidateId}")
    public void enrollCandidate(@PathVariable Long theoryClassId, @PathVariable Long candidateId) {
        theoryClassService.enrollCandidate(candidateId, theoryClassId);
    }

    @GetMapping("/professor/{professorId}/weekly-schedule")
    public List<ProfessorTheoryScheduleDto> getProfessorSchedule(@PathVariable Long professorId) {
        return theoryClassService.getProfessorSchedule(professorId);
    }

    @GetMapping("/{theoryClassId}/professor-details")
    public ProfessorClassDetailsDto getClassDetailsForProfessor(@PathVariable Long theoryClassId) {
        return theoryClassService.getClassDetailsForProfessor(theoryClassId);
    }

    @PutMapping("/professor/{theoryClassId}/submit-attendance")
    public ResponseEntity<String> submitAttendance(
            @PathVariable Long theoryClassId,
            @RequestBody List<TheoryAttendanceRecordDto> records) {
        theoryClassService.submitAttendance(theoryClassId, records);
        return ResponseEntity.ok("Prisustvo uspešno zabeleženo!");
    }

    @GetMapping("/domains")
    public ResponseEntity<List<DomainDto>> getAllProfessors() {
        return ResponseEntity.ok(theoryClassService.getAllDomains());
    }
}