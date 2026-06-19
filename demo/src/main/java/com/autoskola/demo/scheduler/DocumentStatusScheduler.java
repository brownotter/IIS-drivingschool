package com.autoskola.demo.scheduler;

import com.autoskola.demo.model.*;
import com.autoskola.demo.repository.*;
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
    private final ArchiveRepository archiveRepository;

    //test provera
    @Scheduled(fixedRate = 10000)
    //provera se pokrece svaki dan u ponoc
    //@Scheduled(cron = "0 0 0 * * *")
    public void updateDocumentStatuses() {

        LocalDate today = LocalDate.now();
        LocalDate soonThreshold = today.plusDays(30);
        LocalDate autoArchiveThreshold = today.minusDays(15);

        List<Documents> documents = documentsRepository.findAll();

        for (Documents doc : documents) {

            if (doc.getDocsExpireDate() == null) continue;
            if (doc.getDocsStatus() == DocumentStatus.ARCHIVED) continue;

            LocalDate expireDate = doc.getDocsExpireDate();
            int daysUntilExpiry = (int) ChronoUnit.DAYS.between(today, expireDate);

            // Automatsko arhiviranje ako je isteklo pre vise od 15 dana
            if (expireDate.isBefore(autoArchiveThreshold)) {
                doc.setDocsStatus(DocumentStatus.ARCHIVED);
                documentsRepository.save(doc);

                // Kreiraj archive zapis ako vec ne postoji
                if (!archiveRepository.findByDocument(doc).isPresent()) {
                    Archive archive = Archive.builder()
                            .document(doc)
                            .archiveDate(today)
                            .archComment("Automatically archived — expired more than 15 days ago")
                            .build();
                    archiveRepository.save(archive);
                }
                continue;
            }

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