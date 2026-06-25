package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.AdditionalLessonRequestRepository;
import com.autoskola.demo.repository.CandidateRepository;
import com.autoskola.demo.repository.PaymentRepository;
import com.autoskola.demo.service.CandidateService;

import com.autoskola.demo.service.NotificationService;
import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final PaymentRepository paymentRepository;
    private final AdditionalLessonRequestRepository additionalLessonRequestRepository;
    private final NotificationService notificationService;

    @Override
    public CandidateProfileDto getProfile(
            HttpSession session
    ) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository.findById(
                        sessionUser.getId()
                ).orElseThrow();

        return CandidateProfileDto.builder()
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .username(candidate.getUsername())
                .email(candidate.getEmail())
                .contact(candidate.getContact())
                .status(candidate.getStatus())
                .category(candidate.getCategoryPackage().getCategory()) //dodala ovo
                .theoryClassesCount(candidate.getTheoryClassesCount())
                .theoryAttemptsCount(candidate.getTheoryAttemptsCount())
                .practiceClassesCount(candidate.getPracticeClassesCount())
                .practiceAttemptsCount(candidate.getPracticeAttemptsCount())
                .build();
    }

    @Override
    public String updateProfile(
            UpdateCandidateDto dto,
            HttpSession session
    ) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository.findById(
                        sessionUser.getId()
                ).orElseThrow();

        candidate.setFirstName(dto.getFirstName());
        candidate.setLastName(dto.getLastName());
        candidate.setUsername(dto.getUsername());
        candidate.setEmail(dto.getEmail());
        candidate.setContact(dto.getContact());

        candidateRepository.save(candidate);

        return "Profile updated!";
    }

    @Override
    public List<CandidateListDto> getAllCandidates(
            String category,
            String status
    ) {

        List<Candidate> candidates;

        if(
                category != null &&
                        !category.isEmpty() &&
                        status != null &&
                        !status.isEmpty()
        ) {

            candidates =
                    candidateRepository
                            .findByCategoryPackage_CategoryAndStatus(
                                    Category.valueOf(category),
                                    CandidateStatus.valueOf(status)
                            );

        } else if(category != null && !category.isEmpty()) {

            candidates =
                    candidateRepository
                            .findByCategoryPackage_Category(
                                    Category.valueOf(category)
                            );

        } else if(status != null && !status.isEmpty()) {

            candidates =
                    candidateRepository
                            .findByStatus(
                                    CandidateStatus.valueOf(status)
                            );

        } else {

            candidates = candidateRepository.findAll();
        }

        return candidates.stream()
                .map(candidate -> new CandidateListDto(
                        candidate.getId(),
                        candidate.getFirstName(),
                        candidate.getLastName(),
                        //candidate.getTargetCategory(),
                        candidate.getCategoryPackage().getCategory(),
                        candidate.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CandidateDetailsDto
    getCandidateById(Long id) {

        Candidate candidate =
                candidateRepository
                        .findById(id)
                        .orElseThrow();
        List<Payment> payments =
                paymentRepository.findByCandidateId(id);

        double totalPaid =
                payments.stream()
                        .mapToDouble(Payment::getAmount)
                        .sum();

        double categoryPrice =
                candidate
                        .getCategoryPackage()
                        .getPrice();

        double remainingAmount =
                categoryPrice - totalPaid;

        return CandidateDetailsDto.builder()

                .id(candidate.getId())

                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .username(candidate.getUsername())
                .email(candidate.getEmail())
                .contact(candidate.getContact())

                .status(candidate.getStatus())

                .theoryClassesCount(
                        candidate.getTheoryClassesCount()
                )

                .theoryAttemptsCount(
                        candidate.getTheoryAttemptsCount()
                )

                .theoryScore(
                        candidate.getTheoryScore()
                )

                .practiceClassesCount(
                        candidate.getPracticeClassesCount()
                )

                .practiceAttemptsCount(
                        candidate.getPracticeAttemptsCount()
                )

                .drivingScore(
                        candidate.getDrivingScore()
                )

                .category(
                        //candidate.getTargetCategory()
                        candidate.getCategoryPackage().getCategory()
                )

                .categoryPrice(categoryPrice)
                .totalPaid(totalPaid)
                .remainingAmount(remainingAmount)

                .build();
    }

    @Override
    public String adminUpdateCandidate(

            Long id,

            UpdateCandidateDto dto
    ) {

        Candidate candidate =
                candidateRepository
                        .findById(id)
                        .orElseThrow();

        candidate.setFirstName(
                dto.getFirstName()
        );

        candidate.setLastName(
                dto.getLastName()
        );

        candidate.setUsername(
                dto.getUsername()
        );

        candidate.setEmail(
                dto.getEmail()
        );

        candidate.setContact(
                dto.getContact()
        );

        candidateRepository.save(candidate);

        return "Candidate updated successfully!";
    }

    @Override
    public String addPayment(

            Long candidateId,

            AddPaymentDto dto
    ) {

        Candidate candidate =

                candidateRepository
                        .findById(candidateId)
                        .orElseThrow();

        List<Payment> payments =
                paymentRepository.findByCandidateId(candidateId);

        double totalPaid =
                payments.stream()
                        .mapToDouble(Payment::getAmount)
                        .sum();

        double remainingAmount =
                candidate
                        .getCategoryPackage()
                        .getPrice()
                        - totalPaid;

        if(dto.getAmount() <= 0) {
            throw new RuntimeException(
                    "Invalid payment amount."
            );
        }

        if(dto.getAmount() > remainingAmount) {
            throw new RuntimeException(
                    "Payment exceeds remaining amount."
            );
        }

        Payment payment = Payment.builder()

                .candidate(candidate)

                .amount(dto.getAmount())

                .paymentDate(

                        dto.getPaymentDate() != null
                                ? dto.getPaymentDate()
                                : LocalDate.now()
                )

                .method(dto.getMethod())

                .build();

        paymentRepository.save(payment);

        return "Payment added successfully!";
    }

    @Override
    public List<CandidateCardDto> getCandidateCardsByInstructor(Long instructorId) {
        return candidateRepository.findByInstructorId(instructorId).stream()
                .map(candidate -> CandidateCardDto.builder()
                        .id(candidate.getId())
                        .firstName(candidate.getFirstName())
                        .lastName(candidate.getLastName())
                        .targetCategory(candidate.getCategoryPackage() != null ? candidate.getCategoryPackage().getCategory().toString() : null)
                        .practiceClassesCount(candidate.getPracticeClassesCount())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public CandidateFinancialsDto getMyFinancials(
            HttpSession session
    ) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository
                        .findById(sessionUser.getId())
                        .orElseThrow();

        List<Payment> payments =
                paymentRepository
                        .findByCandidateId(candidate.getId());

        double totalPaid =
                payments.stream()
                        .mapToDouble(Payment::getAmount)
                        .sum();

        double totalPrice =
                candidate
                        .getCategoryPackage()
                        .getPrice();

        double remainingAmount =
                totalPrice - totalPaid;

        boolean fullyPaid =
                remainingAmount <= 0;

        List<PaymentHistoryDto> paymentDtos =
                payments.stream()
                        .map(payment ->
                                PaymentHistoryDto.builder()
                                        .amount(payment.getAmount())
                                        .paymentDate(payment.getPaymentDate())
                                        .method(payment.getMethod())
                                        .build()
                        )
                        .toList();

        LocalDate nextPaymentDate = null;

        if (!payments.isEmpty() && !fullyPaid) {

            Payment lastPayment =
                    payments.stream()
                            .max(
                                    Comparator.comparing(
                                            Payment::getPaymentDate
                                    )
                            )
                            .orElseThrow();

            nextPaymentDate =
                    lastPayment
                            .getPaymentDate()
                            .plusMonths(1);
        }

        double nextPaymentAmount = 0;

        if (!fullyPaid) {

            nextPaymentAmount =
                    remainingAmount < 10000
                            ? remainingAmount
                            : 10000;
        }

        return CandidateFinancialsDto.builder()
                .category(
                        candidate
                                .getCategoryPackage()
                                .getCategory()
                )
                .totalPrice(totalPrice)
                .totalPaid(totalPaid)
                .remainingAmount(remainingAmount)
                .payments(paymentDtos)
                .nextPaymentDate(nextPaymentDate)
                .nextPaymentAmount(nextPaymentAmount)
                .fullyPaid(fullyPaid)
                .build();
    }

    @Override
    public RecommendationDto getMyRecommendation(HttpSession session) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository
                        .findById(sessionUser.getId())
                        .orElseThrow();

        boolean alreadyHandled =
                additionalLessonRequestRepository
                        .findByCandidateIdAndStatus(
                                candidate.getId(),
                                RecommendationStatus.ACCEPTED
                        )
                        .isPresent()
                        ||
                        additionalLessonRequestRepository
                                .findByCandidateIdAndStatus(
                                        candidate.getId(),
                                        RecommendationStatus.DECLINED
                                )
                                .isPresent();

        if (alreadyHandled) {
            return RecommendationDto.builder()
                    .visible(false)
                    .message("No more active recommendations.")
                    .build();
        }

        if (
                candidate.getStatus() != CandidateStatus.DRIVING
                        ||
                        candidate.getPracticeClassesCount() < 35
                        ||
                        candidate.getPracticeClassesCount() > 40
        ) {
            return RecommendationDto.builder()
                    .visible(false)
                    .message("No active recommendations.")
                    .build();
        }

        String weakness =
                getMockWeakness(candidate.getId());

        return RecommendationDto.builder()
                .visible(true)
                .weakness(weakness)
                .recommendationText(
                        "We recommend an additional driving lesson focused on: "
                                + weakness
                )
                .build();
    }

    private String getMockWeakness(Long candidateId) {

        List<String> weaknesses = List.of(
                "Parallel parking",
                "Reverse driving",
                "Hill start",
                "Roundabout driving",
                "Lane changing",
                "Traffic signs",
                "Intersection priority",
                "Night driving",
                "Pedestrian crossings",
                "Speed control"
        );

        int index =
                Math.toIntExact(candidateId % weaknesses.size());

        return weaknesses.get(index);
    }

    @Override
    public String acceptRecommendation(HttpSession session) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository
                        .findById(sessionUser.getId())
                        .orElseThrow();

        String weakness = getMockWeakness(candidate.getId());

        AdditionalLessonRequest request =
                AdditionalLessonRequest.builder()
                        .candidate(candidate)
                        .weakness(weakness)
                        .createdAt(LocalDateTime.now())
                        .status(RecommendationStatus.ACCEPTED)
                        .build();

        additionalLessonRequestRepository.save(request);

        notificationService.createNotification(
                candidate,
                "Additional lesson request sent",
                "Your request for an additional lesson focused on "
                        + weakness
                        + " has been sent."
        );

        return "Additional lesson request sent.";
    }

    @Override
    public String declineRecommendation(HttpSession session) {

        User sessionUser =
                (User) session.getAttribute("user");

        Candidate candidate =
                candidateRepository
                        .findById(sessionUser.getId())
                        .orElseThrow();

        String weakness =
                getMockWeakness(candidate.getId());

        AdditionalLessonRequest request =
                AdditionalLessonRequest.builder()
                        .candidate(candidate)
                        .weakness(weakness)
                        .createdAt(LocalDateTime.now())
                        .status(RecommendationStatus.DECLINED)
                        .build();

        additionalLessonRequestRepository.save(request);

        return "Recommendation declined.";
    }
}