package com.autoskola.demo.service;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.TheoryClass;

import java.util.List;

public interface TheoryClassService {

    void createTheoryClass(CreateTheoryClassDto dto);
    void autoGenerateSchedule(com.autoskola.demo.dto.AutoGenerateTheoryScheduleDto dto);
    List<AdminTheoryScheduleDto> getAdminSchedule();
    List<CandidateTheoryScheduleDto> getCandidateSchedule(Long candidateId);
    List<ProfessorTheoryScheduleDto> getProfessorSchedule(Long professorId);
    ProfessorClassDetailsDto getClassDetailsForProfessor(Long theoryClassId);
    void submitAttendance(Long theoryClassId, List<TheoryAttendanceRecordDto> records);
    void cancelAttendance(Long candidateId, Long theoryClassId);
    void enrollCandidate(Long candidateId, Long theoryClassId);
}