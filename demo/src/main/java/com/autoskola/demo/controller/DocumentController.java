package com.autoskola.demo.controller;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.DocumentStatus;
import com.autoskola.demo.model.User;
import com.autoskola.demo.service.DocumentService;
import com.autoskola.demo.service.impl.PdfGeneratorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final PdfGeneratorService pdfGeneratorService;

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

    @GetMapping("/{documentId}")
    public ResponseEntity<Object> getDocumentDetails(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.getDocumentDetails(documentId));
    }

    @PutMapping("/{documentId}/medical-exam")
    public ResponseEntity<DocumentsDto> updateMedicalExam(
            @PathVariable Long documentId,
            @Valid @RequestBody MedicalExamDto dto,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        return ResponseEntity.ok(documentService.updateMedicalExam(documentId, dto, user.getId()));
    }

    @PutMapping("/{documentId}/certificate")
    public ResponseEntity<DocumentsDto> updateCertificate(
            @PathVariable Long documentId,
            @Valid @RequestBody CertificateDto dto,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        return ResponseEntity.ok(documentService.updateCertificate(documentId, dto, user.getId()));
    }

    @PutMapping("/{documentId}/contract")
    public ResponseEntity<DocumentsDto> updateContract(
            @PathVariable Long documentId,
            @Valid @RequestBody ContractDto dto,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        return ResponseEntity.ok(documentService.updateContract(documentId, dto, user.getId()));
    }

    @PutMapping("/{documentId}/exam-result")
    public ResponseEntity<DocumentsDto> updateExamResult(
            @PathVariable Long documentId,
            @Valid @RequestBody ExamResultDto dto,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        return ResponseEntity.ok(documentService.updateExamResult(documentId, dto, user.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentsDto>> searchDocuments(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) String documentType
    ) {
        return ResponseEntity.ok(documentService.searchDocuments(title, status, documentType));
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<DocsAlertDto>> getExpiringDocuments() {
        return ResponseEntity.ok(documentService.getExpiringDocumentsAlert());
    }

    @GetMapping("/expired")
    public ResponseEntity<List<DocsAlertDto>> getExpiredDocuments() {
        return ResponseEntity.ok(documentService.getExpiredDocumentsAlert());
    }

    @GetMapping("/{documentId}/validity")
    public ResponseEntity<DocsValidityDto> getDocumentValidity(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.getDocumentValidity(documentId));
    }

    @PutMapping("/{documentId}/validity/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long documentId) {
        return ResponseEntity.ok(documentService.markValidityAsRead(documentId));
    }

    @PutMapping("/{documentId}/validity/unread")
    public ResponseEntity<String> markAsUnread(@PathVariable Long documentId) {
        return ResponseEntity.ok(documentService.markValidityAsUnread(documentId));
    }

    @GetMapping("/{documentId}/versions")
    public ResponseEntity<List<DocsVersionDto>> getDocumentVersions(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.getDocumentVersions(documentId));
    }

    @PutMapping("/{documentId}/versions/{versionId}/restore")
    public ResponseEntity<DocumentsDto> restoreVersion(
            @PathVariable Long documentId,
            @PathVariable Long versionId,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        return ResponseEntity.ok(documentService.restoreVersion(documentId, versionId,user.getId()));
    }

    @PutMapping("/{documentId}/archive")
    public ResponseEntity<ArchiveDto> archiveDocument(
            @PathVariable Long documentId,
            @RequestParam(required = false) String comment
    ) {
        return ResponseEntity.ok(documentService.archiveDocument(documentId, comment));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<ArchiveDto>> getAllArchivedDocuments() {
        return ResponseEntity.ok(documentService.getAllArchivedDocuments());
    }

    @PutMapping("/{documentId}/unarchive")
    public ResponseEntity<ArchiveDto> unarchiveDocument(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(documentService.unarchiveDocument(documentId));
    }

    @GetMapping("/{documentId}/pdf")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long documentId) {
        byte[] pdf = pdfGeneratorService.generatePdf(documentId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "document_" + documentId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @GetMapping("/report/candidate/{candidateId}")
    public ResponseEntity<byte[]> generateCandidateReport(
            @PathVariable Long candidateId
    ) {
        byte[] pdf = pdfGeneratorService.generateDocumentationReport(candidateId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment",
                "report_candidate_" + candidateId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @GetMapping("/report/all")
    public ResponseEntity<byte[]> generateAllCandidatesReport() {
        byte[] pdf = pdfGeneratorService.generateAllCandidatesReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "report_all_candidates.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

}
