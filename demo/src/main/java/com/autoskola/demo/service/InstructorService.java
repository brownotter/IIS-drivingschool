package com.autoskola.demo.service;

import com.autoskola.demo.dto.CandidateLogSummaryDto;
import com.autoskola.demo.dto.InstructorCreateDto;
import com.autoskola.demo.dto.InstructorProfileDto;
import com.autoskola.demo.dto.InstructorUpdateDto;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface InstructorService {

    InstructorProfileDto getInstructorProfile(HttpSession session);
    List<InstructorProfileDto> getAllInstructors();
    InstructorProfileDto updateInstructorStatus(Long id, String status);
    InstructorProfileDto createInstructor(InstructorCreateDto dto);
    InstructorProfileDto updateInstructor(Long id, InstructorUpdateDto dto);
    InstructorProfileDto deleteInstructor(Long id);
    CandidateLogSummaryDto getCandidateLogSummary(Long candidateId);
}
