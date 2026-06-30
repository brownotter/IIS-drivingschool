package com.autoskola.demo.service.impl;

import com.autoskola.demo.dto.*;
import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.autoskola.demo.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

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
    private final DocsVersionRepository docsVersionRepository;
    private final ArchiveRepository archiveRepository;

    private final ObjectMapper objectMapper;

    @Override
    public List<DocumentsDto> getAllDocumentsByCandidate(Long candidateId) {
        return documentsRepository.findByCandidateId(candidateId)
                .stream()
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentsDto createMedicalExam(Long candidateId, Long employeeId, MedicalExamDto dto) {
        Candidate candidate = getCandidateOrThrow(candidateId);
        Employee employee = getEmployeeOrThrow(employeeId);

        long medicalExamCount = medicalExamRepository.findByCandidateId(candidateId)
                .stream()
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .count();
        if (medicalExamCount >= 1) {
            throw new RuntimeException("Candidate already has a medical exam.");
        }

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

        long certificateCount = certificateRepository.findByCandidateId(candidateId)
                .stream()
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .count();
        if (certificateCount >= 3) {
            throw new RuntimeException("Candidate already has 3 certificates.");
        }

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

        long examResultCount = examResultRepository.findByCandidateId(candidateId)
                .stream()
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .count();
        if (examResultCount >= 2) {
            throw new RuntimeException("Candidate already has 2 exam results.");
        }

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

        long examResultCount = examResultRepository.findByCandidateId(candidateId)
                .stream()
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .count();
        if (examResultCount >= 2) {
            throw new RuntimeException("Candidate already has 2 exam results.");
        }

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
                .filter(doc -> doc.getDocsStatus() != DocumentStatus.ARCHIVED)
                .sorted(Comparator.comparing(Documents::getDocsCreateDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
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
            dto.setCandidateName(exam.getCandidate().getFirstName() + " " + exam.getCandidate().getLastName());
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
            dto.setCandidateName(cert.getCandidate().getFirstName() + " " + cert.getCandidate().getLastName());
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
            dto.setCandidateName(contract.getCandidate().getFirstName() + " " + contract.getCandidate().getLastName());
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
            dto.setCandidateName(result.getCandidate().getFirstName() + " " + result.getCandidate().getLastName());
            return dto;
        }

        throw new RuntimeException("Unknown document type for id: " + documentId);
    }

    @Override
    public DocumentsDto updateMedicalExam(Long documentId, MedicalExamDto dto, Long employeeId) {
        MedicalExam exam = medicalExamRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Medical exam not found with id: " + documentId));

        Employee employee = getEmployeeOrThrow(employeeId);

        String snapshot = null;
        try {
            MedicalExamDetailsDto snapshotDto = new MedicalExamDetailsDto();
            snapshotDto.setDocumentsId(exam.getDocumentsId());
            snapshotDto.setDocsTitle(exam.getDocsTitle());
            snapshotDto.setDocsCreateDate(exam.getDocsCreateDate());
            snapshotDto.setDocsExpireDate(exam.getDocsExpireDate());
            snapshotDto.setDocsStatus(exam.getDocsStatus());
            snapshotDto.setCurrentVersion(exam.getCurrentVersion());
            snapshotDto.setDocsModfDate(exam.getDocsModfDate());
            snapshotDto.setInstitution(exam.getInstitution());
            snapshotDto.setDoctorName(exam.getDoctorName());
            snapshotDto.setMedResult(exam.getMedResult());
            snapshotDto.setMedExamDate(exam.getMedExamDate());
            snapshot = objectMapper.writeValueAsString(snapshotDto);
        } catch (Exception e) {
            e.printStackTrace();
        }

        exam.setDocsTitle(dto.getDocsTitle());
        exam.setDocsExpireDate(dto.getDocsExpireDate());
        exam.setDocsStatus(dto.getDocsStatus());
        exam.setDocsModfDate(LocalDate.now());
        exam.setCurrentVersion(exam.getCurrentVersion() + 1);
        exam.setInstitution(dto.getInstitution());
        exam.setDoctorName(dto.getDoctorName());
        exam.setMedResult(dto.getMedResult());
        exam.setMedExamDate(dto.getMedExamDate());

        medicalExamRepository.save(exam);

        int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(exam).size() + 1;

        DocsVersion version = DocsVersion.builder()
                .document(exam)
                .versionNum(nextVersionNum)
                .changeTime(LocalDateTime.now())
                .changedBy(employee)
                .changeDescription(dto.getChangeDescription() != null && !dto.getChangeDescription().isBlank()
                        ? dto.getChangeDescription()
                        : "Document updated")
                .snapshotData(snapshot)
                .build();

        docsVersionRepository.save(version);

        return mapToDto(exam);
    }

    @Override
    public DocumentsDto updateCertificate(Long documentId, CertificateDto dto, Long employeeId) {
        Certificate cert = certificateRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + documentId));

        Employee employee = getEmployeeOrThrow(employeeId);

        String snapshot = null;
        try {
            CertificateDetailsDto snapshotDto = new CertificateDetailsDto();
            snapshotDto.setDocumentsId(cert.getDocumentsId());
            snapshotDto.setDocsTitle(cert.getDocsTitle());
            snapshotDto.setDocsCreateDate(cert.getDocsCreateDate());
            snapshotDto.setDocsExpireDate(cert.getDocsExpireDate());
            snapshotDto.setDocsStatus(cert.getDocsStatus());
            snapshotDto.setCurrentVersion(cert.getCurrentVersion());
            snapshotDto.setDocsModfDate(cert.getDocsModfDate());
            snapshotDto.setCerfNumb(cert.getCerfNumb());
            snapshotDto.setCerfDate(cert.getCerfDate());
            snapshotDto.setValidDate(cert.getValidDate());
            snapshot = objectMapper.writeValueAsString(snapshotDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        cert.setDocsTitle(dto.getDocsTitle());
        cert.setDocsExpireDate(dto.getDocsExpireDate());
        cert.setDocsStatus(dto.getDocsStatus());
        cert.setDocsModfDate(LocalDate.now());
        cert.setCurrentVersion(cert.getCurrentVersion() + 1);
        cert.setCerfNumb(dto.getCerfNumb());
        cert.setCerfDate(dto.getCerfDate());
        cert.setValidDate(dto.getValidDate());

        certificateRepository.save(cert);

        int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(cert).size() + 1;

        DocsVersion version = DocsVersion.builder()
                .document(cert)
                .versionNum(nextVersionNum)
                .changeTime(LocalDateTime.now())
                .changedBy(employee)
                .changeDescription(dto.getChangeDescription() != null && !dto.getChangeDescription().isBlank()
                        ? dto.getChangeDescription()
                        : "Document updated")
                .snapshotData(snapshot)
                .build();

        docsVersionRepository.save(version);

        return mapToDto(cert);
    }

    @Override
    public DocumentsDto updateContract(Long documentId, ContractDto dto,Long employeeId) {
        Contract contract = contractRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Contract not found with id: " + documentId));

        Employee employee = getEmployeeOrThrow(employeeId);

        String snapshot = null;
        try {
            ContractDetailsDto snapshotDto = new ContractDetailsDto();
            snapshotDto.setDocumentsId(contract.getDocumentsId());
            snapshotDto.setDocsTitle(contract.getDocsTitle());
            snapshotDto.setDocsCreateDate(contract.getDocsCreateDate());
            snapshotDto.setDocsExpireDate(contract.getDocsExpireDate());
            snapshotDto.setDocsStatus(contract.getDocsStatus());
            snapshotDto.setCurrentVersion(contract.getCurrentVersion());
            snapshotDto.setDocsModfDate(contract.getDocsModfDate());
            snapshotDto.setContNumb(contract.getContNumb());
            snapshotDto.setContStartDate(contract.getContStartDate());
            snapshotDto.setAmmountCont(contract.getAmmountCont());
            snapshot = objectMapper.writeValueAsString(snapshotDto);
        } catch (Exception e) {
            e.printStackTrace();
        }

        contract.setDocsTitle(dto.getDocsTitle());
        contract.setDocsExpireDate(dto.getDocsExpireDate());
        contract.setDocsStatus(dto.getDocsStatus());
        contract.setDocsModfDate(LocalDate.now());
        contract.setCurrentVersion(contract.getCurrentVersion() + 1);
        contract.setContNumb(dto.getContNumb());
        contract.setContStartDate(dto.getContStartDate());
        contract.setAmmountCont(dto.getAmmountCont());

        contractRepository.save(contract);

        int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(contract).size() + 1;

        DocsVersion version = DocsVersion.builder()
                .document(contract)
                .versionNum(nextVersionNum)
                .changeTime(LocalDateTime.now())
                .changedBy(employee)
                .changeDescription(dto.getChangeDescription() != null && !dto.getChangeDescription().isBlank()
                        ? dto.getChangeDescription()
                        : "Document updated")
                .snapshotData(snapshot)
                .build();

        docsVersionRepository.save(version);

        return mapToDto(contract);
    }

    @Override
    public DocumentsDto updateExamResult(Long documentId, ExamResultDto dto,Long employeeId) {
        ExamResult result = examResultRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Exam result not found with id: " + documentId));

        Employee employee = getEmployeeOrThrow(employeeId);

        String snapshot = null;
        try {
            ExamResultDetailsDto snapshotDto = new ExamResultDetailsDto();
            snapshotDto.setDocumentsId(result.getDocumentsId());
            snapshotDto.setDocsTitle(result.getDocsTitle());
            snapshotDto.setDocsCreateDate(result.getDocsCreateDate());
            snapshotDto.setDocsExpireDate(result.getDocsExpireDate());
            snapshotDto.setDocsStatus(result.getDocsStatus());
            snapshotDto.setCurrentVersion(result.getCurrentVersion());
            snapshotDto.setDocsModfDate(result.getDocsModfDate());
            snapshotDto.setIssueDate(result.getIssueDate());
            snapshotDto.setExamType(result.getExamType());
            snapshotDto.setExamRefNum(result.getExamRefNum());
            snapshotDto.setExamScore(result.getExamScore());
            snapshot = objectMapper.writeValueAsString(snapshotDto);
        } catch (Exception e) {
            e.printStackTrace();
        }

        result.setDocsTitle(dto.getDocsTitle());
        result.setDocsExpireDate(dto.getDocsExpireDate());
        result.setDocsStatus(dto.getDocsStatus());
        result.setDocsModfDate(LocalDate.now());
        result.setCurrentVersion(result.getCurrentVersion() + 1);
        result.setIssueDate(dto.getIssueDate());
        result.setExamType(dto.getExamType());
        result.setExamRefNum(dto.getExamRefNum());
        result.setExamScore(dto.getExamScore());

        examResultRepository.save(result);

        int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(result).size() + 1;

        DocsVersion version = DocsVersion.builder()
                .document(result)
                .versionNum(nextVersionNum)
                .changeTime(LocalDateTime.now())
                .changedBy(employee)
                .changeDescription(dto.getChangeDescription() != null && !dto.getChangeDescription().isBlank()
                        ? dto.getChangeDescription()
                        : "Document updated")
                .snapshotData(snapshot)
                .build();

        docsVersionRepository.save(version);

        return mapToDto(result);
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
        dto.setCandidateName(doc.getCandidate().getFirstName() + " " + doc.getCandidate().getLastName());
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
                .sorted(Comparator.comparing(Documents::getDocsExpireDate,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(doc -> {
                    DocsAlertDto dto = new DocsAlertDto();
                    dto.setDocumentsId(doc.getDocumentsId());
                    dto.setDocsTitle(doc.getDocsTitle());
                    dto.setDocumentType(doc.getClass().getSimpleName().toUpperCase());
                    dto.setDocsCreateDate(doc.getDocsCreateDate());
                    dto.setDocsExpireDate(doc.getDocsExpireDate());
                    dto.setDocsStatus(doc.getDocsStatus());
                    dto.setCandidateName(doc.getCandidate().getFirstName() + " " + doc.getCandidate().getLastName());

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
                .sorted(Comparator.comparing(Documents::getDocsExpireDate,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(doc -> {
                    DocsAlertDto dto = new DocsAlertDto();
                    dto.setDocumentsId(doc.getDocumentsId());
                    dto.setDocsTitle(doc.getDocsTitle());
                    dto.setDocumentType(doc.getClass().getSimpleName().toUpperCase());
                    dto.setDocsCreateDate(doc.getDocsCreateDate());
                    dto.setDocsExpireDate(doc.getDocsExpireDate());
                    dto.setDocsStatus(doc.getDocsStatus());
                    dto.setCandidateName(doc.getCandidate().getFirstName() + " " + doc.getCandidate().getLastName());

                    docsValidityRepository.findByDocument(doc).ifPresent(v -> {
                        dto.setDaysUntilExpiry(v.getDaysUntilExpiry());
                        dto.setIsRead(v.getIsRead());
                    });

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DocsVersionDto> getDocumentVersions(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        return docsVersionRepository.findByDocumentOrderByChangeTimeDesc(doc)
                .stream()
                .map(v -> {
                    DocsVersionDto dto = new DocsVersionDto();
                    dto.setVersionId(v.getVersionId());
                    dto.setVersionNum(v.getVersionNum());
                    dto.setChangeTime(v.getChangeTime());
                    dto.setChangedBy(v.getChangedBy().getFirstName() + " " + v.getChangedBy().getLastName());
                    dto.setChangeDescription(v.getChangeDescription());
                    dto.setDocumentId(documentId);
                    dto.setSnapshotData(v.getSnapshotData());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public DocumentsDto restoreVersion(Long documentId, Long versionId, Long employeeId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        DocsVersion version = docsVersionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found."));

        Employee employee = getEmployeeOrThrow(employeeId);

        try {
            if (doc instanceof MedicalExam exam) {
                MedicalExamDetailsDto snapshot = objectMapper.readValue(
                        version.getSnapshotData(), MedicalExamDetailsDto.class
                );

                String currentSnapshot = null;
                try {
                    MedicalExamDetailsDto currentSnapshotDto = new MedicalExamDetailsDto();
                    currentSnapshotDto.setDocumentsId(exam.getDocumentsId());
                    currentSnapshotDto.setDocsTitle(exam.getDocsTitle());
                    currentSnapshotDto.setDocsCreateDate(exam.getDocsCreateDate());
                    currentSnapshotDto.setDocsExpireDate(exam.getDocsExpireDate());
                    currentSnapshotDto.setDocsStatus(exam.getDocsStatus());
                    currentSnapshotDto.setCurrentVersion(exam.getCurrentVersion());
                    currentSnapshotDto.setDocsModfDate(exam.getDocsModfDate());
                    currentSnapshotDto.setInstitution(exam.getInstitution());
                    currentSnapshotDto.setDoctorName(exam.getDoctorName());
                    currentSnapshotDto.setMedResult(exam.getMedResult());
                    currentSnapshotDto.setMedExamDate(exam.getMedExamDate());
                    currentSnapshot = objectMapper.writeValueAsString(currentSnapshotDto);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                exam.setDocsTitle(snapshot.getDocsTitle());
                exam.setDocsExpireDate(snapshot.getDocsExpireDate());
                exam.setDocsStatus(snapshot.getDocsStatus());
                exam.setDocsModfDate(LocalDate.now());
                exam.setInstitution(snapshot.getInstitution());
                exam.setDoctorName(snapshot.getDoctorName());
                exam.setMedResult(snapshot.getMedResult());
                exam.setMedExamDate(snapshot.getMedExamDate());
                medicalExamRepository.save(exam);

                int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(exam).size() + 1;

                DocsVersion newVersion = DocsVersion.builder()
                        .document(exam)
                        .versionNum(nextVersionNum)
                        .changeTime(LocalDateTime.now())
                        .changedBy(employee)
                        .changeDescription("Restored to V" + version.getVersionNum())
                        .snapshotData(currentSnapshot)
                        .build();
                docsVersionRepository.save(newVersion);

                return mapToDto(exam);

            } else if (doc instanceof Contract contract) {
                ContractDetailsDto snapshot = objectMapper.readValue(
                        version.getSnapshotData(), ContractDetailsDto.class
                );

                String currentSnapshot = null;
                try {
                    ContractDetailsDto currentSnapshotDto = new ContractDetailsDto();
                    currentSnapshotDto.setDocumentsId(contract.getDocumentsId());
                    currentSnapshotDto.setDocsTitle(contract.getDocsTitle());
                    currentSnapshotDto.setDocsCreateDate(contract.getDocsCreateDate());
                    currentSnapshotDto.setDocsExpireDate(contract.getDocsExpireDate());
                    currentSnapshotDto.setCurrentVersion(contract.getCurrentVersion());
                    currentSnapshotDto.setDocsModfDate(contract.getDocsModfDate());
                    currentSnapshotDto.setContNumb(contract.getContNumb());
                    currentSnapshotDto.setContStartDate(contract.getContStartDate());
                    currentSnapshotDto.setAmmountCont(contract.getAmmountCont());
                    currentSnapshot = objectMapper.writeValueAsString(currentSnapshotDto);
                } catch (Exception e) {
                    e.printStackTrace();
                }


                contract.setDocsTitle(snapshot.getDocsTitle());
                contract.setDocsExpireDate(snapshot.getDocsExpireDate());
                contract.setDocsStatus(snapshot.getDocsStatus());
                contract.setDocsModfDate(LocalDate.now());
                contract.setContNumb(snapshot.getContNumb());
                contract.setContStartDate(snapshot.getContStartDate());
                contract.setAmmountCont(snapshot.getAmmountCont());
                contractRepository.save(contract);

                int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(contract).size() + 1;

                DocsVersion newVersion = DocsVersion.builder()
                        .document(contract)
                        .versionNum(nextVersionNum)
                        .changeTime(LocalDateTime.now())
                        .changedBy(employee)
                        .changeDescription("Restored to V" + version.getVersionNum())
                        .snapshotData(currentSnapshot)
                        .build();
                docsVersionRepository.save(newVersion);

                return mapToDto(contract);

            } else if (doc instanceof Certificate cert) {
                CertificateDetailsDto snapshot = objectMapper.readValue(
                        version.getSnapshotData(), CertificateDetailsDto.class
                );

                String currentSnapshot = null;
                try {
                    CertificateDetailsDto currentSnapshotDto = new CertificateDetailsDto();
                    currentSnapshotDto.setDocumentsId(cert.getDocumentsId());
                    currentSnapshotDto.setDocsTitle(cert.getDocsTitle());
                    currentSnapshotDto.setDocsCreateDate(cert.getDocsCreateDate());
                    currentSnapshotDto.setDocsExpireDate(cert.getDocsExpireDate());
                    currentSnapshotDto.setDocsStatus(cert.getDocsStatus());
                    currentSnapshotDto.setCurrentVersion(cert.getCurrentVersion());
                    currentSnapshotDto.setDocsModfDate(cert.getDocsModfDate());
                    currentSnapshotDto.setCerfNumb(cert.getCerfNumb());
                    currentSnapshotDto.setCerfDate(cert.getCerfDate());
                    currentSnapshotDto.setDocsExpireDate(cert.getDocsExpireDate());
                    currentSnapshot = objectMapper.writeValueAsString(currentSnapshotDto);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                cert.setDocsTitle(snapshot.getDocsTitle());
                cert.setDocsExpireDate(snapshot.getDocsExpireDate());
                cert.setDocsStatus(snapshot.getDocsStatus());
                cert.setDocsModfDate(LocalDate.now());
                cert.setCerfNumb(snapshot.getCerfNumb());
                cert.setCerfDate(snapshot.getCerfDate());
                cert.setValidDate(snapshot.getValidDate());
                certificateRepository.save(cert);

                int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(cert).size() + 1;

                DocsVersion newVersion = DocsVersion.builder()
                        .document(cert)
                        .versionNum(nextVersionNum)
                        .changeTime(LocalDateTime.now())
                        .changedBy(employee)
                        .changeDescription("Restored to V" + version.getVersionNum())
                        .snapshotData(currentSnapshot)
                        .build();
                docsVersionRepository.save(newVersion);

                return mapToDto(cert);

            } else if (doc instanceof ExamResult result) {
                ExamResultDetailsDto snapshot = objectMapper.readValue(
                        version.getSnapshotData(), ExamResultDetailsDto.class
                );

                String currentSnapshot = null;
                try {
                    ExamResultDetailsDto currentSnapshotDto = new ExamResultDetailsDto();
                    currentSnapshotDto.setDocumentsId(result.getDocumentsId());
                    currentSnapshotDto.setDocsTitle(result.getDocsTitle());
                    currentSnapshotDto.setDocsCreateDate(result.getDocsCreateDate());
                    currentSnapshotDto.setDocsExpireDate(result.getDocsExpireDate());
                    currentSnapshotDto.setDocsStatus(result.getDocsStatus());
                    currentSnapshotDto.setCurrentVersion(result.getCurrentVersion());
                    currentSnapshotDto.setDocsModfDate(result.getDocsModfDate());
                    currentSnapshotDto.setExamType(result.getExamType());
                    currentSnapshotDto.setExamRefNum(result.getExamRefNum());
                    currentSnapshotDto.setExamScore(result.getExamScore());
                    currentSnapshot = objectMapper.writeValueAsString(currentSnapshotDto);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                result.setDocsTitle(snapshot.getDocsTitle());
                result.setDocsExpireDate(snapshot.getDocsExpireDate());
                result.setDocsStatus(snapshot.getDocsStatus());
                result.setDocsModfDate(LocalDate.now());
                result.setIssueDate(snapshot.getIssueDate());
                result.setExamType(snapshot.getExamType());
                result.setExamRefNum(snapshot.getExamRefNum());
                result.setExamScore(snapshot.getExamScore());
                examResultRepository.save(result);

                int nextVersionNum = docsVersionRepository.findByDocumentOrderByChangeTimeDesc(result).size() + 1;

                DocsVersion newVersion = DocsVersion.builder()
                        .document(result)
                        .versionNum(nextVersionNum)
                        .changeTime(LocalDateTime.now())
                        .changedBy(employee)
                        .changeDescription("Restored to V" + version.getVersionNum())
                        .snapshotData(currentSnapshot)
                        .build();
                docsVersionRepository.save(newVersion);

                return mapToDto(result);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to restore version: " + e.getMessage());
        }

        throw new RuntimeException("Unknown document type.");
    }


    @Override
    public ArchiveDto archiveDocument(Long documentId, String comment) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        doc.setDocsStatus(DocumentStatus.ARCHIVED);
        documentsRepository.save(doc);

        Archive archive = Archive.builder()
                .document(doc)
                .archiveDate(LocalDate.now())
                .archComment(comment)
                .build();

        archiveRepository.save(archive);

        return mapToArchiveDto(archive);
    }

    @Override
    public List<ArchiveDto> getAllArchivedDocuments() {
        return archiveRepository.findAllByOrderByArchiveDateDesc()
                .stream()
                .map(this::mapToArchiveDto)
                .collect(Collectors.toList());
    }

    @Override
    public ArchiveDto unarchiveDocument(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        Archive archive = archiveRepository.findByDocument(doc)
                .orElseThrow(() -> new RuntimeException("Archive record not found."));

        doc.setDocsStatus(DocumentStatus.ACTIVE);
        documentsRepository.save(doc);

        archiveRepository.delete(archive);

        return mapToArchiveDto(archive);
    }

    private ArchiveDto mapToArchiveDto(Archive archive) {
        ArchiveDto dto = new ArchiveDto();
        dto.setArchiveId(archive.getArchiveId());
        dto.setArchiveDate(archive.getArchiveDate());
        dto.setArchComment(archive.getArchComment());
        dto.setDocumentId(archive.getDocument().getDocumentsId());
        dto.setDocumentTitle(archive.getDocument().getDocsTitle());
        dto.setDocumentType(archive.getDocument().getClass().getSimpleName().toUpperCase());
        dto.setCandidateName(
                archive.getDocument().getCandidate().getFirstName() + " " +
                        archive.getDocument().getCandidate().getLastName()
        );
        return dto;
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