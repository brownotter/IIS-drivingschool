package com.autoskola.demo.service.impl;

import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.DocumentsRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final DocumentsRepository documentsRepository;

    public byte[] generatePdf(Long documentId) {
        Documents doc = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            document.add(new Paragraph("Auto škola")
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

            // Specifična polja
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
}