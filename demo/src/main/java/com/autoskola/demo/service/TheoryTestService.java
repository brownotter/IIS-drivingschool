package com.autoskola.demo.service;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.TheoryTest;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface TheoryTestService {

    TheoryTest startSimulationTest(HttpSession session);
    List<TheoryTestQuestionDto> getQuestionsForTest(Long testId, HttpSession session);
    //TheoryTest startFinalExam(Long candidateId);
    TheoryTest submitTest(SubmitTheoryTestDto dto, HttpSession session);
    TheoryTestResultDto getTheoryTestResult(Long testId, HttpSession session);
    TheorySimulationProgressDto getMySimulationProgress(HttpSession httpSession);
    TheoryTest startFinalExam(HttpSession session);
    TheoryExamProgressDto getMyFinalExamProgress(HttpSession httpSession);
    TheoryExamTimerDto getFinalExamTimer(Long testId, HttpSession session);
    CandidateTheoryReportDto getCandidateTheoryReport(HttpSession session);
}
