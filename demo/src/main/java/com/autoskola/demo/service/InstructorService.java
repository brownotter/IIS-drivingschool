package com.autoskola.demo.service;

import com.autoskola.demo.dto.InstructorCreateDto;
import com.autoskola.demo.dto.InstructorProfileDto;
import com.autoskola.demo.dto.InstructorUpdateDto;

import java.util.List;

public interface InstructorService {

    List<InstructorProfileDto> getAllInstructors();
    InstructorProfileDto updateInstructorStatus(Long id, String status);
    InstructorProfileDto createInstructor(InstructorCreateDto dto);
    InstructorProfileDto updateInstructor(Long id, InstructorUpdateDto dto);
    InstructorProfileDto deleteInstructor(Long id);
    List<InstructorProfileDto> getAllActiveInstructors();
}
