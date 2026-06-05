package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentsRepository documentsRepository;
    private final MedicalExamRepository medicalExamRepository;
    private final CertificateRepository certificateRepository;
    private final ContractRepository contractRepository;
    private final ExamResultRepository examResultRepository;
    private final CandidateRepository candidateRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public List<DocumentsDto> getAllDocumentsByCandidate(Long candidateId) {
        return documentsRepository.findByCandidateId(candidateId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentsDto createMedicalExam(Long candidateId, Long employeeId, MedicalExamDto dto) {
        Candidate candidate = getCandidateOrThrow(candidateId);
        Employee employee = getEmployeeOrThrow(employeeId);

        MedicalExam exam = MedicalExam.builder()
                .docsTitle(dto.getDocsTitle())
                .docsCreateDate(LocalDate.now())
                .docsExpireDate(dto.getDocsExpireDate())
                .docsStatus(dto.getDocsStatus())
                .currentVersion(1)
                .docsModfDate(LocalDate.now())
                .candidate(candidate)
                .employee(employee)
                .institution(dto.getInstitution())
                .doctorName(dto.getDoctorName())
                .medResult(dto.getMedResult())
                .medExamDate(dto.getMedExamDate())
                .build();

        return mapToDto(medicalExamRepository.save(exam));
    }

    @Override
    public DocumentsDto createCertificate(Long candidateId, Long employeeId, CertificateDto dto) {
        Candidate candidate = getCandidateOrThrow(candidateId);
        Employee employee = getEmployeeOrThrow(employeeId);

        Certificate cert = Certificate.builder()
                .docsTitle(dto.getDocsTitle())
                .docsCreateDate(LocalDate.now())
                .docsStatus(dto.getDocsStatus())
                .currentVersion(1)
                .docsModfDate(LocalDate.now())
                .candidate(candidate)
                .employee(employee)
                .cerfNumb(dto.getCerfNumb())
                .cerfDate(dto.getCerfDate())
                .validDate(dto.getValidDate())
                .build();

        return mapToDto(certificateRepository.save(cert));
    }

    @Override
    public DocumentsDto createContract(Long candidateId, Long employeeId, ContractDto dto) {
        Candidate candidate = getCandidateOrThrow(candidateId);
        Employee employee = getEmployeeOrThrow(employeeId);

        Contract contract = Contract.builder()
                .docsTitle(dto.getDocsTitle())
                .docsCreateDate(LocalDate.now())
                .docsStatus(dto.getDocsStatus())
                .currentVersion(1)
                .docsModfDate(LocalDate.now())
                .candidate(candidate)
                .employee(employee)
                .contNumb(dto.getContNumb())
                .contStartDate(dto.getContStartDate())
                .ammountCont(dto.getAmmountCont())
                .build();

        return mapToDto(contractRepository.save(contract));
    }

    @Override
    public DocumentsDto createExamResult(Long candidateId, Long employeeId, ExamResultDto dto) {
        Candidate candidate = getCandidateOrThrow(candidateId);
        Employee employee = getEmployeeOrThrow(employeeId);

        ExamResult result = ExamResult.builder()
                .docsTitle(dto.getDocsTitle())
                .docsCreateDate(LocalDate.now())
                .docsStatus(dto.getDocsStatus())
                .currentVersion(1)
                .docsModfDate(LocalDate.now())
                .candidate(candidate)
                .employee(employee)
                .issueDate(dto.getIssueDate())
                .examType(dto.getExamType())
                .examRefNum(dto.getExamRefNum())
                .examScore(dto.getExamScore())
                .build();

        return mapToDto(examResultRepository.save(result));
    }

    @Override
    public String deleteDocument(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
        documentsRepository.delete(doc);
        return "Document deleted successfully.";
    }
    @Override
    public List<DocumentsDto> getAllDocuments() {
        return documentsRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Object getDocumentDetails(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        if (doc instanceof MedicalExam exam) {
            MedicalExamDetailsDto dto = new MedicalExamDetailsDto();
            dto.setDocumentsId(exam.getDocumentsId());
            dto.setDocsTitle(exam.getDocsTitle());
            dto.setDocsCreateDate(exam.getDocsCreateDate());
            dto.setDocsExpireDate(exam.getDocsExpireDate());
            dto.setDocsStatus(exam.getDocsStatus());
            dto.setCurrentVersion(exam.getCurrentVersion());
            dto.setDocsModfDate(exam.getDocsModfDate());
            dto.setInstitution(exam.getInstitution());
            dto.setDoctorName(exam.getDoctorName());
            dto.setMedResult(exam.getMedResult());
            dto.setMedExamDate(exam.getMedExamDate());
            return dto;

        } else if (doc instanceof Certificate cert) {
            CertificateDetailsDto dto = new CertificateDetailsDto();
            dto.setDocumentsId(cert.getDocumentsId());
            dto.setDocsTitle(cert.getDocsTitle());
            dto.setDocsCreateDate(cert.getDocsCreateDate());
            dto.setDocsExpireDate(cert.getDocsExpireDate());
            dto.setDocsStatus(cert.getDocsStatus());
            dto.setCurrentVersion(cert.getCurrentVersion());
            dto.setDocsModfDate(cert.getDocsModfDate());
            dto.setCerfNumb(cert.getCerfNumb());
            dto.setCerfDate(cert.getCerfDate());
            dto.setValidDate(cert.getValidDate());
            return dto;

        } else if (doc instanceof Contract contract) {
            ContractDetailsDto dto = new ContractDetailsDto();
            dto.setDocumentsId(contract.getDocumentsId());
            dto.setDocsTitle(contract.getDocsTitle());
            dto.setDocsCreateDate(contract.getDocsCreateDate());
            dto.setDocsExpireDate(contract.getDocsExpireDate());
            dto.setDocsStatus(contract.getDocsStatus());
            dto.setCurrentVersion(contract.getCurrentVersion());
            dto.setDocsModfDate(contract.getDocsModfDate());
            dto.setContNumb(contract.getContNumb());
            dto.setContStartDate(contract.getContStartDate());
            dto.setAmmountCont(contract.getAmmountCont());
            return dto;

        } else if (doc instanceof ExamResult result) {
            ExamResultDetailsDto dto = new ExamResultDetailsDto();
            dto.setDocumentsId(result.getDocumentsId());
            dto.setDocsTitle(result.getDocsTitle());
            dto.setDocsCreateDate(result.getDocsCreateDate());
            dto.setDocsExpireDate(result.getDocsExpireDate());
            dto.setDocsStatus(result.getDocsStatus());
            dto.setCurrentVersion(result.getCurrentVersion());
            dto.setDocsModfDate(result.getDocsModfDate());
            dto.setIssueDate(result.getIssueDate());
            dto.setExamType(result.getExamType());
            dto.setExamRefNum(result.getExamRefNum());
            dto.setExamScore(result.getExamScore());
            return dto;
        }

        throw new RuntimeException("Unknown document type for id: " + documentId);
    }

    @Override
    public DocumentsDto updateMedicalExam(Long documentId, MedicalExamDto dto) {
        MedicalExam exam = medicalExamRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Medical exam not found with id: " + documentId));

        exam.setDocsTitle(dto.getDocsTitle());
        exam.setDocsExpireDate(dto.getDocsExpireDate());
        exam.setDocsStatus(dto.getDocsStatus());
        exam.setDocsModfDate(LocalDate.now());
        exam.setCurrentVersion(exam.getCurrentVersion() + 1);
        exam.setInstitution(dto.getInstitution());
        exam.setDoctorName(dto.getDoctorName());
        exam.setMedResult(dto.getMedResult());
        exam.setMedExamDate(dto.getMedExamDate());

        return mapToDto(medicalExamRepository.save(exam));
    }

    @Override
    public DocumentsDto updateCertificate(Long documentId, CertificateDto dto) {
        Certificate cert = certificateRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + documentId));

        cert.setDocsTitle(dto.getDocsTitle());
        cert.setDocsExpireDate(dto.getDocsExpireDate());
        cert.setDocsStatus(dto.getDocsStatus());
        cert.setDocsModfDate(LocalDate.now());
        cert.setCurrentVersion(cert.getCurrentVersion() + 1);
        cert.setCerfNumb(dto.getCerfNumb());
        cert.setCerfDate(dto.getCerfDate());
        cert.setValidDate(dto.getValidDate());

        return mapToDto(certificateRepository.save(cert));
    }

    @Override
    public DocumentsDto updateContract(Long documentId, ContractDto dto) {
        Contract contract = contractRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Contract not found with id: " + documentId));

        contract.setDocsTitle(dto.getDocsTitle());
        contract.setDocsExpireDate(dto.getDocsExpireDate());
        contract.setDocsStatus(dto.getDocsStatus());
        contract.setDocsModfDate(LocalDate.now());
        contract.setCurrentVersion(contract.getCurrentVersion() + 1);
        contract.setContNumb(dto.getContNumb());
        contract.setContStartDate(dto.getContStartDate());
        contract.setAmmountCont(dto.getAmmountCont());

        return mapToDto(contractRepository.save(contract));
    }

    @Override
    public DocumentsDto updateExamResult(Long documentId, ExamResultDto dto) {
        ExamResult result = examResultRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Exam result not found with id: " + documentId));

        result.setDocsTitle(dto.getDocsTitle());
        result.setDocsExpireDate(dto.getDocsExpireDate());
        result.setDocsStatus(dto.getDocsStatus());
        result.setDocsModfDate(LocalDate.now());
        result.setCurrentVersion(result.getCurrentVersion() + 1);
        result.setIssueDate(dto.getIssueDate());
        result.setExamType(dto.getExamType());
        result.setExamRefNum(dto.getExamRefNum());
        result.setExamScore(dto.getExamScore());

        return mapToDto(examResultRepository.save(result));
    }

    private DocumentsDto mapToDto(Documents doc) {
        DocumentsDto dto = new DocumentsDto();
        dto.setDocumentsId(doc.getDocumentsId());
        dto.setDocsTitle(doc.getDocsTitle());
        dto.setDocsCreateDate(doc.getDocsCreateDate());
        dto.setDocsExpireDate(doc.getDocsExpireDate());
        dto.setDocsStatus(doc.getDocsStatus());
        dto.setCurrentVersion(doc.getCurrentVersion());
        dto.setDocsModfDate(doc.getDocsModfDate());
        dto.setDocumentType(doc.getClass().getSimpleName().toUpperCase());
        return dto;
    }

    @Override
    public List<DocumentsDto> searchDocuments(String title, DocumentStatus status, String documentType) {
        Specification<Documents> spec = Specification
                .where(DocumentSearch.hasStatus(status))
                .and(DocumentSearch.hasTitle(title))
                .and(DocumentSearch.hasDocumentType(documentType));

        return documentsRepository.findAll(spec)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private final DocsValidityRepository docsValidityRepository;

    @Override
    public DocsValidityDto getDocumentValidity(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        DocsValidity validity = docsValidityRepository.findByDocument(doc)
                .orElseThrow(() -> new RuntimeException("Validity not found."));

        DocsValidityDto dto = new DocsValidityDto();
        dto.setDocsValidId(validity.getDocsValidId());
        dto.setValidFrom(validity.getValidFrom());
        dto.setValidUntil(validity.getValidUntil());
        dto.setValidityDays(validity.getValidityDays());
        dto.setIsExpired(validity.getIsExpired());
        dto.setLastCheck(validity.getLastCheck());
        dto.setValidityStatus(validity.getValidityStatus());
        dto.setDaysUntilExpiry(validity.getDaysUntilExpiry());
        dto.setNextCheckDate(validity.getNextCheckDate());
        dto.setIsRead(validity.getIsRead());
        dto.setDocumentId(doc.getDocumentsId());
        dto.setDocumentTitle(doc.getDocsTitle());
        return dto;
    }

    @Override
    public String markValidityAsRead(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        DocsValidity validity = docsValidityRepository.findByDocument(doc)
                .orElseThrow(() -> new RuntimeException("Validity not found."));

        validity.setIsRead(true);
        docsValidityRepository.save(validity);
        return "Marked as read.";
    }

    @Override
    public String markValidityAsUnread(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        DocsValidity validity = docsValidityRepository.findByDocument(doc)
                .orElseThrow(() -> new RuntimeException("Validity not found."));

        validity.setIsRead(false);
        docsValidityRepository.save(validity);
        return "Marked as unread.";
    }

    @Override
    public List<DocsAlertDto> getExpiringDocumentsAlert() {
        return documentsRepository.findAll()
                .stream()
                .filter(doc -> doc.getDocsStatus() == DocumentStatus.EXPIRING_SOON)
                .map(doc -> {
                    DocsAlertDto dto = new DocsAlertDto();
                    dto.setDocumentsId(doc.getDocumentsId());
                    dto.setDocsTitle(doc.getDocsTitle());
                    dto.setDocumentType(doc.getClass().getSimpleName().toUpperCase());
                    dto.setDocsCreateDate(doc.getDocsCreateDate());
                    dto.setDocsExpireDate(doc.getDocsExpireDate());
                    dto.setDocsStatus(doc.getDocsStatus());

                    docsValidityRepository.findByDocument(doc).ifPresent(v -> {
                        dto.setDaysUntilExpiry(v.getDaysUntilExpiry());
                        dto.setIsRead(v.getIsRead());
                    });

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DocsAlertDto> getExpiredDocumentsAlert() {
        return documentsRepository.findAll()
                .stream()
                .filter(doc -> doc.getDocsStatus() == DocumentStatus.EXPIRED)
                .map(doc -> {
                    DocsAlertDto dto = new DocsAlertDto();
                    dto.setDocumentsId(doc.getDocumentsId());
                    dto.setDocsTitle(doc.getDocsTitle());
                    dto.setDocumentType(doc.getClass().getSimpleName().toUpperCase());
                    dto.setDocsCreateDate(doc.getDocsCreateDate());
                    dto.setDocsExpireDate(doc.getDocsExpireDate());
                    dto.setDocsStatus(doc.getDocsStatus());

                    docsValidityRepository.findByDocument(doc).ifPresent(v -> {
                        dto.setDaysUntilExpiry(v.getDaysUntilExpiry());
                        dto.setIsRead(v.getIsRead());
                    });

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private Candidate getCandidateOrThrow(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
    }

    private Employee getEmployeeOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }
}