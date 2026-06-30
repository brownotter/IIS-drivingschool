package com.autoskola.demo.service.impl;

import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final DocumentsRepository documentsRepository;
    private final CandidateRepository candidateRepository;
    private final MedicalExamRepository medicalExamRepository;
    private final ExamResultRepository examResultRepository;
    private final ContractRepository contractRepository;
    private final CertificateRepository certificateRepository;


    public byte[] generatePdf(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Auto skola")
                    .setBold().setFontSize(20));
            document.add(new LineSeparator(new SolidLine()));
            document.add(new Paragraph(" "));

            // Zajednička polja
            document.add(new Paragraph("Document: " + doc.getDocsTitle())
                    .setBold().setFontSize(14));
            document.add(new Paragraph("Candidate: " +
                    doc.getCandidate().getFirstName() + " " +
                    doc.getCandidate().getLastName()));
            document.add(new Paragraph("Created: " + doc.getDocsCreateDate()));
            document.add(new Paragraph("Expiry date: " +
                    (doc.getDocsExpireDate() != null ? doc.getDocsExpireDate() : "-")));
            document.add(new Paragraph("Status: " + doc.getDocsStatus()));
            document.add(new Paragraph("Version: V" + doc.getCurrentVersion()));
            document.add(new Paragraph(" "));

            if (doc instanceof MedicalExam exam) {
                document.add(new Paragraph("MEDICAL EXAM").setBold().setFontSize(13));
                document.add(new Paragraph("Institution: " + exam.getInstitution()));
                document.add(new Paragraph("Doctor: " + exam.getDoctorName()));
                document.add(new Paragraph("Exam date: " + exam.getMedExamDate()));
                document.add(new Paragraph("Result: " + exam.getMedResult()));

            } else if (doc instanceof Contract contract) {
                document.add(new Paragraph("CONTRACT").setBold().setFontSize(13));
                document.add(new Paragraph("Contract number: " + contract.getContNumb()));
                document.add(new Paragraph("Start date: " + contract.getContStartDate()));
                document.add(new Paragraph("Amount: " + contract.getAmmountCont()));

            } else if (doc instanceof Certificate cert) {
                document.add(new Paragraph("CERTIFICATE").setBold().setFontSize(13));
                document.add(new Paragraph("Certificate number: " + cert.getCerfNumb()));
                document.add(new Paragraph("Certificate date: " + cert.getCerfDate()));
                document.add(new Paragraph("Valid until: " + cert.getValidDate()));

            } else if (doc instanceof ExamResult result) {
                document.add(new Paragraph("EXAM RESULT").setBold().setFontSize(13));
                document.add(new Paragraph("Exam type: " + result.getExamType()));
                document.add(new Paragraph("Reference number: " + result.getExamRefNum()));
                document.add(new Paragraph("Score: " + result.getExamScore()));
                document.add(new Paragraph("Issue date: " + result.getIssueDate()));
            }

            document.add(new Paragraph(" "));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }
    }

    public byte[] generateDocumentationReport(Long candidateId) {
        Candidate candidate = (Candidate) candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found."));

        List<MedicalExam> medicalExams = medicalExamRepository.findByCandidateId(candidateId)
                .stream()
                .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                .collect(Collectors.toList());

        List<Contract> contracts = contractRepository.findByCandidateId(candidateId)
                .stream()
                .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                .collect(Collectors.toList());

        List<ExamResult> examResults = examResultRepository.findByCandidateId(candidateId)
                .stream()
                .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                .collect(Collectors.toList());

        List<Certificate> certificates = certificateRepository.findByCandidateId(candidateId)
                .stream()
                .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                .collect(Collectors.toList());

        // Racunanje
        double medicalScore = Math.min(medicalExams.size(), 1) * 25.0;
        double contractScore = Math.min(contracts.size(), 1) * 25.0;
        double examScore = Math.min(examResults.size(), 2) / 2.0 * 25.0;
        double certScore = Math.min(certificates.size(), 3) / 3.0 * 25.0;
        double total = medicalScore + contractScore + examScore + certScore;

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Auto skola")
                    .setBold().setFontSize(20));
            document.add(new Paragraph("Documentation Status Report")
                    .setFontSize(14).setItalic());
            document.add(new LineSeparator(new SolidLine()));
            document.add(new Paragraph(" "));

            // Kandidat info
            document.add(new Paragraph("Candidate: " +
                    candidate.getFirstName() + " " + candidate.getLastName())
                    .setBold().setFontSize(13));
            document.add(new Paragraph("Category: " +
                    candidate.getCategoryPackage().getCategory()));
            document.add(new Paragraph("Registration date: " +
                    candidate.getRegistrationDate()));
            document.add(new Paragraph(" "));
            document.add(new LineSeparator(new SolidLine()));
            document.add(new Paragraph(" "));

            // Kompletnost
            document.add(new Paragraph("Documentation Completeness: " +
                    String.format("%.1f", total) + "%")
                    .setBold().setFontSize(14));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Medical Exam (" +
                    medicalExams.size() + "/1) — " +
                    (int) medicalScore + "%").setBold());
            if (medicalExams.isEmpty()) {
                document.add(new Paragraph("No medical exam").setFontColor(
                        com.itextpdf.kernel.colors.ColorConstants.RED));
            } else {
                medicalExams.forEach(e -> document.add(
                        new Paragraph(e.getDocsTitle())));
            }
            document.add(new Paragraph(" "));

            // Contract
            document.add(new Paragraph("Contract (" +
                    contracts.size() + "/1) — " +
                    (int) contractScore + "%").setBold());
            if (contracts.isEmpty()) {
                document.add(new Paragraph("No contract").setFontColor(
                        com.itextpdf.kernel.colors.ColorConstants.RED));
            } else {
                contracts.forEach(c -> document.add(
                        new Paragraph(c.getDocsTitle())));
            }
            document.add(new Paragraph(" "));

            // Exam results
            document.add(new Paragraph("Exam Results (" +
                    examResults.size() + "/2) — " +
                    (int) examScore + "%").setBold());
            if (examResults.isEmpty()) {
                document.add(new Paragraph("No exam results").setFontColor(
                        com.itextpdf.kernel.colors.ColorConstants.RED));
            } else {
                examResults.forEach(e -> document.add(
                        new Paragraph(e.getDocsTitle())));
            }
            document.add(new Paragraph(" "));

            // Certificates
            document.add(new Paragraph("Certificates (" +
                    certificates.size() + "/3) — " +
                    (int) certScore + "%").setBold());
            if (certificates.isEmpty()) {
                document.add(new Paragraph("No certificates").setFontColor(
                        com.itextpdf.kernel.colors.ColorConstants.RED));
            } else {
                certificates.forEach(c -> document.add(
                        new Paragraph(c.getDocsTitle())));
            }

            document.add(new Paragraph(" "));
            document.add(new LineSeparator(new SolidLine()));
            document.add(new Paragraph("Generated: " + LocalDate.now() +
                    " by Auto škola system")
                    .setItalic().setFontSize(10));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report: " + e.getMessage());
        }
    }

    public byte[] generateAllCandidatesReport() {
        List<Candidate> candidates = (List<Candidate>) candidateRepository.findAll();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            document.add(new Paragraph("Auto škola")
                    .setBold().setFontSize(20));
            document.add(new Paragraph("Documentation status report for all candidates")
                    .setFontSize(14).setItalic());
            document.add(new LineSeparator(new SolidLine()));
            document.add(new Paragraph(" "));

            for (Candidate candidate : candidates) {
                Long candidateId = candidate.getId();

                List<MedicalExam> medicalExams = medicalExamRepository.findByCandidateId(candidateId)
                        .stream()
                        .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                        .collect(Collectors.toList());

                List<Contract> contracts = contractRepository.findByCandidateId(candidateId)
                        .stream()
                        .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                        .collect(Collectors.toList());

                List<ExamResult> examResults = examResultRepository.findByCandidateId(candidateId)
                        .stream()
                        .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                        .collect(Collectors.toList());

                List<Certificate> certificates = certificateRepository.findByCandidateId(candidateId)
                        .stream()
                        .filter(d -> d.getDocsStatus() != DocumentStatus.ARCHIVED)
                        .collect(Collectors.toList());

                double medicalScore = Math.min(medicalExams.size(), 1) * 25.0;
                double contractScore = Math.min(contracts.size(), 1) * 25.0;
                double examScore = Math.min(examResults.size(), 2) / 2.0 * 25.0;
                double certScore = Math.min(certificates.size(), 3) / 3.0 * 25.0;
                double total = medicalScore + contractScore + examScore + certScore;

                // Kandidat
                document.add(new Paragraph(candidate.getFirstName() + " " +
                        candidate.getLastName() + " — " +
                        String.format("%.1f", total) + "%")
                        .setBold().setFontSize(13));
                document.add(new Paragraph("Category: " +
                        candidate.getCategoryPackage().getCategory()));

                // Medical exam
                document.add(new Paragraph("  Medical exam (" +
                        medicalExams.size() + "/1): " +
                        (medicalExams.isEmpty() ? "Missing" : "Complete")));

                // Contract
                document.add(new Paragraph("  Contract (" +
                        contracts.size() + "/1): " +
                        (contracts.isEmpty() ? "Missing" : "Complete")));

                // Exam results
                document.add(new Paragraph("  Exam results (" +
                        examResults.size() + "/2): " +
                        (examResults.isEmpty() ? "Missing" :
                                examResults.size() < 2 ? "Incomplete" : "Complete")));

                // Certificates
                document.add(new Paragraph("  Certificates (" +
                        certificates.size() + "/3): " +
                        (certificates.isEmpty() ? "Missing" :
                                certificates.size() < 3 ? "Incomplete" : "Complete")));

                document.add(new LineSeparator(new SolidLine()));
                document.add(new Paragraph(" "));
            }

            document.add(new Paragraph("Generated: " + LocalDate.now() +
                    " by Auto škola system")
                    .setItalic().setFontSize(10));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report: " + e.getMessage());
        }
    }

}