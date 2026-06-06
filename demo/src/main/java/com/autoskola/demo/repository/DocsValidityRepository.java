package com.autoskola.demo.repository;

import com.autoskola.demo.model.DocsValidity;
import com.autoskola.demo.model.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DocsValidityRepository extends JpaRepository<DocsValidity, Long> {
    Optional<DocsValidity> findByDocument(Documents document);
}