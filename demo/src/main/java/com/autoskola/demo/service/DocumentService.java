package com.autoskola.demo.service;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.DocumentStatus;

import java.util.List;

public interface DocumentService {
    List<DocumentsDto> getAllDocumentsByCandidate(Long candidateId);

    DocumentsDto createMedicalExam(Long candidateId, Long employeeId, MedicalExamDto dto);
    DocumentsDto createCertificate(Long candidateId, Long employeeId, CertificateDto dto);
    DocumentsDto createContract(Long candidateId, Long employeeId, ContractDto dto);
    DocumentsDto createExamResult(Long candidateId, Long employeeId, ExamResultDto dto);

    String deleteDocument(Long documentId);
    List<DocumentsDto> getAllDocuments();

    Object getDocumentDetails(Long documentId);

    DocumentsDto updateMedicalExam(Long documentId, MedicalExamDto dto);
    DocumentsDto updateCertificate(Long documentId, CertificateDto dto);
    DocumentsDto updateContract(Long documentId, ContractDto dto);
    DocumentsDto updateExamResult(Long documentId, ExamResultDto dto);

    List<DocumentsDto> searchDocuments(String title, DocumentStatus status, String documentType);

    List<DocumentsDto> getExpiringDocuments();
    List<DocumentsDto> getExpiredDocuments();
}