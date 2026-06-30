package com.autoskola.demo.controller;
import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.TheoryTest;
import com.autoskola.demo.service.TheoryTestService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theory-tests")
@RequiredArgsConstructor
public class TheoryTestController {

    private final TheoryTestService theoryTestService;

    @PostMapping("/simulation/start")
    public TheoryTest startSimulation(HttpSession session) {
        return theoryTestService.startSimulationTest(session);
    }

    @GetMapping("/{testId}/questions")
    public List<TheoryTestQuestionDto> getQuestions(@PathVariable Long testId, HttpSession session) {
        return theoryTestService.getQuestionsForTest(testId, session);
    }

    @PostMapping("/submit")
    public TheoryTest submitTest(@RequestBody SubmitTheoryTestDto dto, HttpSession session) {
        return theoryTestService.submitTest(dto, session);
    }

    @GetMapping("/{testId}/result")
    public TheoryTestResultDto getTheoryTestResult(@PathVariable Long testId, HttpSession session) {
        return theoryTestService.getTheoryTestResult(testId, session);
    }


    @PostMapping("/final-exam/start")
    public TheoryTest startFinalExam(HttpSession session) {
        return theoryTestService.startFinalExam(session);
    }


    @GetMapping("/simulations/progress")
    public ResponseEntity<TheorySimulationProgressDto> getMySimulationProgress(HttpSession httpSession){
        return ResponseEntity.ok(theoryTestService.getMySimulationProgress(httpSession));
    }

    @GetMapping("/final-exams/progress")
    public ResponseEntity<TheoryExamProgressDto> getMyFinalExamProgress(HttpSession httpSession){
        return ResponseEntity.ok(theoryTestService.getMyFinalExamProgress(httpSession));
    }

    @GetMapping("/{testId}/timer")
    public TheoryExamTimerDto getFinalExamTimer(@PathVariable Long testId, HttpSession session) {
        return theoryTestService.getFinalExamTimer(testId, session);
    }

    @GetMapping("/report")
    public CandidateTheoryReportDto getCandidateTheoryReport(HttpSession session) {
        return theoryTestService.getCandidateTheoryReport(session);
    }
}
