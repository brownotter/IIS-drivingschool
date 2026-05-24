package com.autoskola.demo.dto;

import com.autoskola.demo.model.*;
import org.springframework.data.jpa.domain.Specification;

public class DocumentSearch {

    public static Specification<Documents> hasStatus(DocumentStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("docsStatus"), status);
    }

    public static Specification<Documents> hasTitle(String title) {
        return (root, query, cb) ->
                title == null ? null : cb.like(cb.lower(root.get("docsTitle")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Documents> hasDocumentType(String documentType) {
        return (root, query, cb) -> {
            if (documentType == null) return null;

            return switch (documentType.toUpperCase()) {
                case "MEDICALEXAM" -> cb.equal(root.type(), MedicalExam.class);
                case "CONTRACT" -> cb.equal(root.type(), Contract.class);
                case "CERTIFICATE" -> cb.equal(root.type(), Certificate.class);
                case "EXAMRESULT" -> cb.equal(root.type(), ExamResult.class);
                default -> null;
            };
        };
    }
}