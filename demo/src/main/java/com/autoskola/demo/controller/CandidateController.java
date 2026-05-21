package com.autoskola.demo.controller;
import com.autoskola.demo.dto.*;
import com.autoskola.demo.service.CandidateService;

import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate")
@RequiredArgsConstructor
/*@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")*/
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(
            HttpSession session
    ) {

        return ResponseEntity.ok(
                candidateService.getProfile(session)
        );
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateCandidateDto dto,
            HttpSession session
    ) {

        return ResponseEntity.ok(
                candidateService.updateProfile(dto, session)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<CandidateListDto>> getAllCandidates(

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            String status
    ) {

        return ResponseEntity.ok(
                candidateService.getAllCandidates(
                        category,
                        status
                )
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<CandidateDetailsDto>
    getCandidate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                candidateService.getCandidateById(id)
        );
    }

    @PutMapping("/admin/update/{id}")
    public ResponseEntity<String>
    adminUpdateCandidate(

            @PathVariable Long id,

            @RequestBody
            UpdateCandidateDto dto
    ) {

        return ResponseEntity.ok(

                candidateService.adminUpdateCandidate(id, dto)
        );
    }
    @PostMapping("/{id}/payment")
    public ResponseEntity<String> addPayment(

            @PathVariable Long id,

            @RequestBody AddPaymentDto dto
    ) {

        try {

            String response =
                    candidateService.addPayment(id, dto);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}