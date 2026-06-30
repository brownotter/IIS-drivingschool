package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.TheoryTestService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TheoryTestServiceImpl implements TheoryTestService {

    private static final int QUESTIONS_PER_TEST = 10;
    private static final int QUESTIONS_PER_DOMAIN = 1;
    private static final int PASSING_SCORE = 80;

    private static final int WRONG_QUESTIONS_COUNT = 4;
    private static final int WEAK_DOMAIN_QUESTIONS_COUNT = 4;
    private static final int RECENT_SIMULATION_COUNT = 1;

    private final CandidateRepository candidateRepository;
    private final DomainRepository domainRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final TheoryTestRepository theoryTestRepository;
    private final CandidateAnswerRepository candidateAnswerRepository;
    private final TheoryTestQuestionRepository theoryTestQuestionRepository;
    private final MedicalExamRepository medicalExamRepository;

    @Override
    public TheoryTest startSimulationTest(HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        Candidate candidate = candidateRepository.findById(sessionUser.getId()).orElseThrow(() -> new RuntimeException("Candidate not found"));

        if (theoryTestRepository.existsByCandidateAndTestTypeAndPassed(candidate, TheoryTestType.FINAL_EXAM, true)) {
            throw new RuntimeException("Candidate has already passed the final exam.");
        }

        TheoryTest theoryTest = new TheoryTest();
        theoryTest.setCandidate(candidate);
        theoryTest.setTestType(TheoryTestType.SIMULATION);
        theoryTest.setStartedAt(LocalDateTime.now());
        theoryTest.setSubmittedAt(null);
        theoryTest.setScore(0);
        theoryTest.setPassed(false);

        TheoryTest savedTest = theoryTestRepository.save(theoryTest);
        List<Question> questions = generateAdaptiveSimulationQuestions(candidate.getId());
        for (Question question : questions) {
            TheoryTestQuestion theoryTestQuestion = new TheoryTestQuestion();
            theoryTestQuestion.setTheoryTest(savedTest);
            theoryTestQuestion.setQuestion(question);
            theoryTestQuestionRepository.save(theoryTestQuestion);
        }
        return savedTest;
    }

    private List<Question> generateAdaptiveSimulationQuestions(Long candidateId) {
        List<Question> selectedQuestions = new ArrayList<>();
        List<Question> recentlyWrongQuestions = getRecentlyWrongQuestions(candidateId);
        if (recentlyWrongQuestions.isEmpty()) {
            return generateRandomQuestions();
        }
        for (Question question : recentlyWrongQuestions) {
            if (selectedQuestions.size() >= WRONG_QUESTIONS_COUNT) {
                break;
            }
            if (!containsQuestion(selectedQuestions, question)) {
                selectedQuestions.add(question);
            }
        }
        List<Long> weakDomainIds = getWeakDomainsFromRecentTests(candidateId);
        int adaptiveQuestionLimit = WRONG_QUESTIONS_COUNT + WEAK_DOMAIN_QUESTIONS_COUNT;
        for (Long domainId : weakDomainIds) {
            List<Question> domainQuestions = questionRepository.findRandomByDomain(domainId);
            for (Question question : domainQuestions) {
                if (selectedQuestions.size() >= adaptiveQuestionLimit) {
                    break;
                }
                boolean alreadySelected = containsQuestion(selectedQuestions, question);
                boolean wasAlreadyWrong = containsQuestion(recentlyWrongQuestions, question);
                if (!alreadySelected && !wasAlreadyWrong) {
                    selectedQuestions.add(question);
                }
            }
            if (selectedQuestions.size() >= adaptiveQuestionLimit) {
                break;
            }
        }
        fillWithRandomQuestions(selectedQuestions);
        List<Question> finalQuestions = new ArrayList<>();
        for (Question question : selectedQuestions) {
            if (finalQuestions.size() >= QUESTIONS_PER_TEST) {
                break;
            }
            finalQuestions.add(question);
        }
        return finalQuestions;
    }


    private List<Question> getRecentlyWrongQuestions(Long candidateId) {
        List<TheoryTest> recentTests = getRecentSimulationTests(candidateId);
        if (recentTests.isEmpty()) {
            return new ArrayList<>();
        }
        List<CandidateAnswer> wrongAnswers = candidateAnswerRepository.getWrongAnswers(recentTests);
        wrongAnswers.sort((a, b) -> b.getTheoryTest().getSubmittedAt().compareTo(a.getTheoryTest().getSubmittedAt()));
        List<Question> wrongQuestions = new ArrayList<>();
        for (CandidateAnswer answer : wrongAnswers) {
            Question question = answer.getQuestion();
            if (!containsQuestion(wrongQuestions, question)) {
                wrongQuestions.add(question);
            }
        }
        return wrongQuestions;
    }

    private boolean containsQuestion(List<Question> questions, Question question) {
        for (Question q : questions) {
            if (q.getQuestionId().equals(question.getQuestionId())) {
                return true;
            }
        }
        return false;
    }

    private List<TheoryTest> getRecentSimulationTests(Long candidateId) {
        List<TheoryTest> allTests = theoryTestRepository.getRecentTests(candidateId, TheoryTestType.SIMULATION);
        List<TheoryTest> recentTests = new ArrayList<>();
        for (TheoryTest test : allTests) {
            if (recentTests.size() >= RECENT_SIMULATION_COUNT) {
                break;
            }
            recentTests.add(test);
        }
        return recentTests;
    }


    private List<Question> generateRandomQuestions() {
        List<Domain> domains = domainRepository.findAll();
        List<Question> questions = new ArrayList<>();
        for (Domain domain : domains) {
            List<Question> domainQuestions = questionRepository.findRandomByDomain(domain.getDomainId());
            int count = 0;
            for (Question question : domainQuestions) {
                if (count >= QUESTIONS_PER_DOMAIN) {
                    break;
                }
                if (!containsQuestion(questions, question)) {
                    questions.add(question);
                    count++;
                }
            }
        }
        fillWithRandomQuestions(questions);
        List<Question> finalQuestions = new ArrayList<>();
        for (Question question : questions) {
            if (finalQuestions.size() >= QUESTIONS_PER_TEST) {
                break;
            }
            finalQuestions.add(question);
        }
        return finalQuestions;
    }


    private void fillWithRandomQuestions(List<Question> selectedQuestions) {
        List<Domain> domains = domainRepository.findAll();
        Random random = new Random();
        while (selectedQuestions.size() < QUESTIONS_PER_TEST) {
            Domain randomDomain = domains.get(random.nextInt(domains.size()));
            List<Question> questions = questionRepository.findRandomByDomain(randomDomain.getDomainId());
            if (!questions.isEmpty()) {
                Question question = questions.get(0);
                if (!containsQuestion(selectedQuestions, question)) {
                    selectedQuestions.add(question);
                }
            }
        }
    }


    private List<Long> getWeakDomainsFromRecentTests(Long candidateId) {
        List<TheoryTest> recentTests = getRecentSimulationTests(candidateId);
        if (recentTests.isEmpty()) {
            return new ArrayList<>();
        }
        List<CandidateAnswer> wrongAnswers = candidateAnswerRepository.getWrongAnswers(recentTests);
        Map<Long, Integer> domainMistakes = new HashMap<>();
        for (CandidateAnswer answer : wrongAnswers) {
            Long domainId = answer.getQuestion().getDomain().getDomainId();
            Integer currentMistakes = domainMistakes.get(domainId);
            if (currentMistakes == null) {
                domainMistakes.put(domainId, 1);
            } else {
                domainMistakes.put(domainId, currentMistakes + 1);
            }
        }
        List<Map.Entry<Long, Integer>> entries = new ArrayList<>(domainMistakes.entrySet());
        entries.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        List<Long> weakDomainIds = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : entries) {
            weakDomainIds.add(entry.getKey());
        }
        return weakDomainIds;
    }


    @Override
    public List<TheoryTestQuestionDto> getQuestionsForTest(Long testId, HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        TheoryTest test = theoryTestRepository.findById(testId).orElseThrow(() ->
                new RuntimeException("Test not found"));
        if (!test.getCandidate().getId().equals(sessionUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        List<TheoryTestQuestion> testQuestions = theoryTestQuestionRepository.findByTheoryTest(test);
        List<TheoryTestQuestionDto> testQuestionDto = new ArrayList<>();
        for (TheoryTestQuestion testQuestion : testQuestions) {
            Question question = testQuestion.getQuestion();
            List<AnswerOption> answerOptions = answerOptionRepository.findByQuestion(question);
            List<AnswerOptionDto> answerDtos = new ArrayList<>();
            for (AnswerOption answer : answerOptions) {
                AnswerOptionDto answerDto = new AnswerOptionDto(answer.getOptionId(), answer.getOptionText());
                answerDtos.add(answerDto);
            }
            TheoryTestQuestionDto theoryTestDto = new TheoryTestQuestionDto(question.getQuestionId(), question.getQuestionText(), question.getImageUrl(), answerDtos);
            testQuestionDto.add(theoryTestDto);
        }
        return testQuestionDto;
    }

    @Override
    public TheoryTest submitTest(SubmitTheoryTestDto dto, HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        TheoryTest theoryTest = theoryTestRepository.findById(dto.getTheoryTestId())
                .orElseThrow(() -> new RuntimeException("Theory test not found"));
        if (!theoryTest.getCandidate().getId().equals(sessionUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        if (theoryTest.getSubmittedAt() != null) {
            throw new RuntimeException("Theory test already submitted");
        }
        int correctAnswers = 0;
        for (SubmitTestAnswerDto answerDto : dto.getAnswers()) {
            Question question = questionRepository.findById(answerDto.getQuestionId()).orElseThrow(() -> new RuntimeException("Question not found"));
            AnswerOption selectedAnswer = answerOptionRepository.findById(answerDto.getSelectedAnswerId()).orElseThrow(() -> new RuntimeException("Answer option not found"));
            if (!selectedAnswer.getQuestion().getQuestionId().equals(question.getQuestionId())) {
                throw new RuntimeException("Selected answer does not belong to this question");
            }
            boolean isCorrect = Boolean.TRUE.equals(selectedAnswer.getIsCorrect());
            if (isCorrect) {
                correctAnswers++;
            }
            CandidateAnswer candidateAnswer = new CandidateAnswer();
            candidateAnswer.setCandidate(theoryTest.getCandidate());
            candidateAnswer.setTheoryTest(theoryTest);
            candidateAnswer.setQuestion(question);
            candidateAnswer.setSelectedAnswer(selectedAnswer);
            candidateAnswer.setCorrect(isCorrect);
            candidateAnswerRepository.save(candidateAnswer);
        }
        int score = correctAnswers * 10;
        theoryTest.setScore(score);
        theoryTest.setPassed(score >= PASSING_SCORE);
        theoryTest.setSubmittedAt(LocalDateTime.now());
        theoryTestRepository.save(theoryTest);

        Candidate candidate = theoryTest.getCandidate();
        if (theoryTest.getTestType() == TheoryTestType.SIMULATION) {
            increaseSimulationCount(candidate);
            updateSimulationScore(candidate);
        }
        candidate.setTheoryAttemptsCount(candidate.getTheoryAttemptsCount() + 1);
        candidate.setTheoryScore(score);
        if(score >= PASSING_SCORE){
            candidate.setStatus(CandidateStatus.DRIVING);
        }
        candidateRepository.save(candidate);
        return theoryTest;
    }

    private void updateSimulationScore(Candidate candidate) {
        List<TheoryTest> allSimulationTest = theoryTestRepository.findAll();
        double totalScore = 0;
        int simulationCount = 0;

        for(TheoryTest test : allSimulationTest){
            if(test.getCandidate().getId().equals(candidate.getId()) && test.getTestType() == TheoryTestType.SIMULATION){
                totalScore += test.getScore();
                simulationCount++;
            }
        }
        double averageScore = 0;
        if (simulationCount > 0) {
            averageScore = totalScore / simulationCount;
        }
        candidate.setAverageSimulationScore(averageScore);
        candidateRepository.save(candidate);
    }

    private void increaseSimulationCount(Candidate candidate){
        candidate.setTheorySimulationsCount(candidate.getTheorySimulationsCount() + 1);
        candidateRepository.save(candidate);
    }

    @Override
    public TheoryTestResultDto getTheoryTestResult(Long testId, HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        TheoryTest theoryTest = theoryTestRepository.findById(testId).orElseThrow(() ->
                        new RuntimeException("Theory test not found"));
        if (!theoryTest.getCandidate().getId().equals(sessionUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        if (theoryTest.getSubmittedAt() == null) {
            throw new RuntimeException("Theory test is not submitted yet");
        }
        List<CandidateAnswer> candidateAnswers = candidateAnswerRepository.findByTheoryTest(theoryTest);
        List<TheoryQuestionResultDto> questionResults = new ArrayList<>();
        Set<String> domainsToImprove = new LinkedHashSet<>();
        int correctAnswers = 0;
        for (CandidateAnswer candidateAnswer : candidateAnswers) {
            Question question = candidateAnswer.getQuestion();
            AnswerOption selectedAnswer = candidateAnswer.getSelectedAnswer();
            List<AnswerOption> allAnswers = answerOptionRepository.findByQuestion(question);
            AnswerOption correctAnswer = null;
            for (AnswerOption answer : allAnswers) {
                if (Boolean.TRUE.equals(answer.getIsCorrect())) {
                    correctAnswer = answer;
                    break;
                }
            }

            if (correctAnswer == null) {
                throw new RuntimeException("Correct answer not found");
            }
            boolean isCorrect = Boolean.TRUE.equals(candidateAnswer.isCorrect());
            if (isCorrect) {
                correctAnswers++;
            } else {
                domainsToImprove.add(question.getDomain().getDomainName());
            }
            TheoryQuestionResultDto questionResultDto = new TheoryQuestionResultDto(
                            question.getQuestionId(),
                            question.getQuestionText(),
                            question.getImageUrl(),
                            selectedAnswer.getOptionId(),
                            selectedAnswer.getOptionText(),
                            correctAnswer.getOptionId(),
                            correctAnswer.getOptionText(),
                            isCorrect);
            questionResults.add(questionResultDto);
        }
        return new TheoryTestResultDto(
                theoryTest.getTheoryTestId(),
                theoryTest.getTestType(),
                theoryTest.getScore(),
                theoryTest.getPassed(),
                correctAnswers,
                candidateAnswers.size(),
                new ArrayList<>(domainsToImprove),
                questionResults,
                theoryTest.getStartedAt(),
                theoryTest.getSubmittedAt()
        );
    }

    @Override
    public TheorySimulationProgressDto getMySimulationProgress(HttpSession httpSession) {

        User sessionUser = (User) httpSession.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        Candidate candidate = candidateRepository.findById(sessionUser.getId()).orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<Long> domainIds = getWeakDomainsFromRecentTests(candidate.getId());
        List<Domain> domains = domainRepository.findAllById(domainIds);
        return TheorySimulationProgressDto.builder()
                .theoryClassesCount(candidate.getTheoryClassesCount())
                .theorySimulationsCount(candidate.getTheorySimulationsCount())
                .averageSimulationScore(candidate.getAverageSimulationScore() != null ? candidate.getAverageSimulationScore() : 0.0)
                .domainsToImprove(domains)
                .build();
    }

    @Override
    public TheoryTest startFinalExam(HttpSession session){
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        Candidate candidate = candidateRepository.findById(sessionUser.getId()).orElseThrow(() -> new RuntimeException("Candidate not found"));

        if (candidate.getTheoryClassesCount() < 40) {
            throw new RuntimeException("Candidate must attend all 40 theory classes before starting the final exam");
        }
        if (!hasValidMedicalExam(candidate)) {
            throw new RuntimeException("Candidate must have a valid medical examination before starting the final exam.");
        }

        if (theoryTestRepository.existsByCandidateAndTestTypeAndPassed(candidate, TheoryTestType.FINAL_EXAM, true)) {
            throw new RuntimeException("Candidate has already passed the final exam.");
        }

        TheoryTest theoryTest = new TheoryTest();
        theoryTest.setCandidate(candidate);
        theoryTest.setTestType(TheoryTestType.FINAL_EXAM);
        theoryTest.setStartedAt(LocalDateTime.now());
        theoryTest.setSubmittedAt(null);
        theoryTest.setTimePerFinalExam(30);
        theoryTest.setScore(0);
        theoryTest.setPassed(false);

        TheoryTest savedTest = theoryTestRepository.save(theoryTest);
        List<Question> questions = generateRandomQuestions();
        for (Question question : questions) {
            TheoryTestQuestion theoryTestQuestion = new TheoryTestQuestion();
            theoryTestQuestion.setTheoryTest(savedTest);
            theoryTestQuestion.setQuestion(question);
            theoryTestQuestionRepository.save(theoryTestQuestion);
        }
        return savedTest;
    }

    private boolean hasValidMedicalExam(Candidate candidate) {

        List<MedicalExam> medicalExams = medicalExamRepository.findByCandidateId(candidate.getId());
        return medicalExams.stream().anyMatch(exam -> "FIT".equals(exam.getMedResult())
                        && exam.getDocsStatus() == DocumentStatus.ACTIVE
                        && (exam.getDocsExpireDate() == null
                        || !exam.getDocsExpireDate().isBefore(LocalDate.now()))
        );
    }

    @Override
    public TheoryExamProgressDto getMyFinalExamProgress(HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }

        Candidate candidate = candidateRepository.findById(sessionUser.getId()).orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<TheoryTest> finalExams = theoryTestRepository.findByCandidateAndTestType(candidate, TheoryTestType.FINAL_EXAM);

        List<TheoryExamAttemptDto> attempts = new ArrayList<>();
        for (TheoryTest exam : finalExams) {
            attempts.add(TheoryExamAttemptDto.builder()
                            .theoryTestId(exam.getTheoryTestId())
                            .score(exam.getScore())
                            .passed(exam.getPassed())
                            .submittedAt(exam.getSubmittedAt())
                            .build()
            );
        }

        return TheoryExamProgressDto.builder()
                .theoryClassesCount(candidate.getTheoryClassesCount())
                .theoryAttemptsCount(finalExams.size())
                .attempts(attempts)
                .build();
    }


    @Override
    public TheoryExamTimerDto getFinalExamTimer(Long testId, HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        TheoryTest test = theoryTestRepository.findById(testId).orElseThrow(() -> new RuntimeException("Test not found"));
        if (!test.getCandidate().getId().equals(sessionUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        if (test.getTestType() != TheoryTestType.FINAL_EXAM) {
            throw new RuntimeException("Timer is available only for final exam");
        }
        return TheoryExamTimerDto.builder()
                .startedAt(test.getStartedAt())
                .timePerFinalExam(test.getTimePerFinalExam())
                .build();
    }

    @Override
    public CandidateTheoryReportDto getCandidateTheoryReport(HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            throw new RuntimeException("User is not logged in");
        }
        Candidate candidate = candidateRepository.findById(sessionUser.getId()).orElseThrow(() -> new RuntimeException("Candidate not found"));

        List<TheoryTest> simulationTests = theoryTestRepository.findByCandidateAndTestType(candidate, TheoryTestType.SIMULATION);
        List<TheoryTest> finalExams = theoryTestRepository.findByCandidateAndTestType(candidate, TheoryTestType.FINAL_EXAM);

        boolean finalExamPassed = finalExams.stream().anyMatch(test -> Boolean.TRUE.equals(test.getPassed()));

        int bestFinalExamScore = finalExams.stream()
                .filter(test -> test.getScore() != null)
                .mapToInt(TheoryTest::getScore)
                .max()
                .orElse(0);

        return CandidateTheoryReportDto.builder()
                .candidateId(candidate.getId())
                .candidateName(candidate.getFirstName() + " " + candidate.getLastName())
                .theoryClassesCount(candidate.getTheoryClassesCount())
                .simulationTestsCompleted(simulationTests.size())
                .averageSimulationScore(candidate.getAverageSimulationScore() != null ? candidate.getAverageSimulationScore() : 0.0)
                .finalExamAttempts(finalExams.size())
                .finalExamPassed(finalExamPassed)
                .bestFinalExamScore(bestFinalExamScore)
                .build();
    }

}