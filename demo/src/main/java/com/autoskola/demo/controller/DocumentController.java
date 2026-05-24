package com.autoskola.demo.controller;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.DocumentStatus;
import com.autoskola.demo.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<DocumentsDto>> getAllByCandidate(
            @PathVariable Long candidateId
    ) {
        return ResponseEntity.ok(documentService.getAllDocumentsByCandidate(candidateId));
    }

    @PostMapping("/candidate/{candidateId}/employee/{employeeId}/medical-exam")
    public ResponseEntity<DocumentsDto> createMedicalExam(
            @PathVariable Long candidateId,
            @PathVariable Long employeeId,
            @Valid @RequestBody MedicalExamDto dto
    ) {
        return ResponseEntity.ok(documentService.createMedicalExam(candidateId, employeeId, dto));
    }

    @PostMapping("/candidate/{candidateId}/employee/{employeeId}/certificate")
    public ResponseEntity<DocumentsDto> createCertificate(
            @PathVariable Long candidateId,
            @PathVariable Long employeeId,
            @Valid @RequestBody CertificateDto dto
    ) {
        return ResponseEntity.ok(documentService.createCertificate(candidateId, employeeId, dto));
    }

    @PostMapping("/candidate/{candidateId}/employee/{employeeId}/contract")
    public ResponseEntity<DocumentsDto> createContract(
            @PathVariable Long candidateId,
            @PathVariable Long employeeId,
            @Valid @RequestBody ContractDto dto
    ) {
        return ResponseEntity.ok(documentService.createContract(candidateId, employeeId, dto));
    }

    @PostMapping("/candidate/{candidateId}/employee/{employeeId}/exam-result")
    public ResponseEntity<DocumentsDto> createExamResult(
            @PathVariable Long candidateId,
            @PathVariable Long employeeId,
            @Valid @RequestBody ExamResultDto dto
    ) {
        return ResponseEntity.ok(documentService.createExamResult(candidateId, employeeId, dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<DocumentsDto>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.deleteDocument(documentId));
    }

    // Detalji dokumenta
    @GetMapping("/{documentId}")
    public ResponseEntity<Object> getDocumentDetails(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.getDocumentDetails(documentId));
    }

    @PutMapping("/{documentId}/medical-exam")
    public ResponseEntity<DocumentsDto> updateMedicalExam(
            @PathVariable Long documentId,
            @Valid @RequestBody MedicalExamDto dto
    ) {
        return ResponseEntity.ok(documentService.updateMedicalExam(documentId, dto));
    }

    @PutMapping("/{documentId}/certificate")
    public ResponseEntity<DocumentsDto> updateCertificate(
            @PathVariable Long documentId,
            @Valid @RequestBody CertificateDto dto
    ) {
        return ResponseEntity.ok(documentService.updateCertificate(documentId, dto));
    }

    @PutMapping("/{documentId}/contract")
    public ResponseEntity<DocumentsDto> updateContract(
            @PathVariable Long documentId,
            @Valid @RequestBody ContractDto dto
    ) {
        return ResponseEntity.ok(documentService.updateContract(documentId, dto));
    }

    @PutMapping("/{documentId}/exam-result")
    public ResponseEntity<DocumentsDto> updateExamResult(
            @PathVariable Long documentId,
            @Valid @RequestBody ExamResultDto dto
    ) {
        return ResponseEntity.ok(documentService.updateExamResult(documentId, dto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentsDto>> searchDocuments(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) String documentType
    ) {
        return ResponseEntity.ok(documentService.searchDocuments(title, status, documentType));
    }
}
