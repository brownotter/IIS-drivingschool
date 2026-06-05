package com.autoskola.demo.service;

import com.autoskola.demo.model.DocumentStatus;
import com.autoskola.demo.model.Documents;
import com.autoskola.demo.repository.DocumentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DocumentStatusScheduler {

    private final DocumentsRepository documentsRepository;

    //test provera
    //@Scheduled(fixedRate = 10000)
    // Provera se pokrece svaki dan u ponoc
    @Scheduled(cron = "0 0 0 * * *")
    public void updateDocumentStatuses() {

        LocalDate today = LocalDate.now();
        LocalDate soonThreshold = today.plusDays(30);

        List<Documents> documents = documentsRepository.findAll();

        for (Documents doc : documents) {

            if (doc.getDocsExpireDate() == null) continue;
            if (doc.getDocsStatus() == DocumentStatus.ARCHIVED) continue;

            if (doc.getDocsExpireDate().isBefore(today)) {
                doc.setDocsStatus(DocumentStatus.EXPIRED);

            } else if (doc.getDocsExpireDate().isBefore(soonThreshold)) {
                doc.setDocsStatus(DocumentStatus.EXPIRING_SOON);

            } else {
                doc.setDocsStatus(DocumentStatus.ACTIVE);
            }
        }

        documentsRepository.saveAll(documents);
    }
}
