package com.autoskola.demo.service;

import com.autoskola.demo.dto.*;

import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface CandidateService {

    CandidateProfileDto getProfile(HttpSession session);
    CandidateDetailsDto getCandidateById(Long id);
    CandidateFinancialsDto getMyFinancials(HttpSession session);

    String updateProfile(
            UpdateCandidateDto dto,
            HttpSession session
    );

    List<CandidateListDto> getAllCandidates(
            String category,
            String status
    );

    String adminUpdateCandidate(
            Long id,
            UpdateCandidateDto dto
    );

    String addPayment(Long candidateId, AddPaymentDto dto);
}