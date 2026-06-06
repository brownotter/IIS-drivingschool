package com.autoskola.demo.scheduler;

import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.DocumentsRepository;
import com.autoskola.demo.repository.DocsValidityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DocumentStatusScheduler {

    private final DocumentsRepository documentsRepository;
    private final DocsValidityRepository docsValidityRepository;

    //test provera
    @Scheduled(fixedRate = 10000)
    //provera se pokrece svaki dan u ponoc
    //@Scheduled(cron = "0 0 0 * * *")
    public void updateDocumentStatuses() {

        LocalDate today = LocalDate.now();
        LocalDate soonThreshold = today.plusDays(30);

        List<Documents> documents = documentsRepository.findAll();

        for (Documents doc : documents) {

            if (doc.getDocsExpireDate() == null) continue;
            if (doc.getDocsStatus() == DocumentStatus.ARCHIVED) continue;

            LocalDate expireDate = doc.getDocsExpireDate();
            int daysUntilExpiry = (int) ChronoUnit.DAYS.between(today, expireDate);

            // Azuriranje status dokumenta
            if (expireDate.isBefore(today)) {
                doc.setDocsStatus(DocumentStatus.EXPIRED);
            } else if (expireDate.isBefore(soonThreshold)) {
                doc.setDocsStatus(DocumentStatus.EXPIRING_SOON);
            } else {
                doc.setDocsStatus(DocumentStatus.ACTIVE);
            }

            documentsRepository.save(doc);

            // Azurira ili kreira DocsValidity
            DocsValidity validity = docsValidityRepository
                    .findByDocument(doc)
                    .orElse(DocsValidity.builder()
                            .document(doc)
                            .validFrom(doc.getDocsCreateDate())
                            .build());

            validity.setValidUntil(expireDate);
            validity.setValidityDays(
                    (int) ChronoUnit.DAYS.between(doc.getDocsCreateDate(), expireDate)
            );
            validity.setIsExpired(expireDate.isBefore(today));
            validity.setLastCheck(today);
            validity.setDaysUntilExpiry(daysUntilExpiry);
            validity.setNextCheckDate(today.plusDays(1));
            validity.setValidityStatus(doc.getDocsStatus());

            docsValidityRepository.save(validity);
        }
    }
}