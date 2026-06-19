package com.autoskola.demo.repository;

import com.autoskola.demo.model.Archive;
import com.autoskola.demo.model.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArchiveRepository extends JpaRepository<Archive, Long> {
    Optional<Archive> findByDocument(Documents document);
    List<Archive> findAllByOrderByArchiveDateDesc();
}