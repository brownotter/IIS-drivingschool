package com.autoskola.demo.service;

import com.autoskola.demo.dto.SubmitTheoryTestDto;
import com.autoskola.demo.dto.TheoryTestQuestionDto;
import com.autoskola.demo.dto.TheoryTestResultDto;
import com.autoskola.demo.model.TheoryTest;

import java.util.List;

public interface TheoryTestService {

    TheoryTest startSimulationTest(Long candidateId);
    List<TheoryTestQuestionDto> getQuestionsForTest(Long testId);
    //TheoryTest startFinalExam(Long candidateId);
    TheoryTest submitTest(SubmitTheoryTestDto dto);
    TheoryTestResultDto getTheoryTestResult(Long testId);
}
