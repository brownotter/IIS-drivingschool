package com.autoskola.demo.service;

import com.autoskola.demo.dto.PracticalClassResponseDto;
import com.autoskola.demo.dto.PracticalSchedulingDto;
import org.springframework.stereotype.Service;

@Service
public interface PracticalClassService {

    PracticalClassResponseDto scheduleClass(PracticalSchedulingDto dto, Long instructorId);
}
