package com.autoskola.demo.controller;
import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.TheoryTest;
import com.autoskola.demo.service.TheoryTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theory-tests")
@RequiredArgsConstructor
public class TheoryTestController {

    private final TheoryTestService theoryTestService;

    @PostMapping("/simulation/start/{candidateId}")
    public TheoryTest startSimulation(@PathVariable Long candidateId) {
        return theoryTestService.startSimulationTest(candidateId);
    }

    @GetMapping("/{testId}/questions")
    public List<TheoryTestQuestionDto> getQuestions(@PathVariable Long testId) {
        return theoryTestService.getQuestionsForTest(testId);
    }

    @PostMapping("/submit")
    public TheoryTest submitTest(@RequestBody SubmitTheoryTestDto dto) {
        return theoryTestService.submitTest(dto);
    }

    @GetMapping("/{testId}/result")
    public TheoryTestResultDto getTheoryTestResult(@PathVariable Long testId) {
        return theoryTestService.getTheoryTestResult(testId);
    }

    /*
    @PostMapping("/final/start/{candidateId}")
    public TheoryTest startFinalExam(@PathVariable Long candidateId) {
        return theoryTestService.startFinalExam(candidateId);
    }
    */
}
